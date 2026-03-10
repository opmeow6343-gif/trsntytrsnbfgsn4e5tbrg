-- Ensure ticket message cleanup works when tickets are auto-deleted
ALTER TABLE public.ticket_messages
DROP CONSTRAINT IF EXISTS ticket_messages_ticket_id_fkey;

ALTER TABLE public.ticket_messages
ADD CONSTRAINT ticket_messages_ticket_id_fkey
FOREIGN KEY (ticket_id)
REFERENCES public.tickets(id)
ON DELETE CASCADE;

-- Ensure last_user_message_at is always updated on real user messages
DROP TRIGGER IF EXISTS trg_update_last_user_message ON public.ticket_messages;
CREATE TRIGGER trg_update_last_user_message
AFTER INSERT ON public.ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_last_user_message();

-- Reliable server-side auto trigger responses (works for every user/browser)
CREATE OR REPLACE FUNCTION public.handle_ticket_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_trigger record;
  trigger_id text;
BEGIN
  IF NEW.sender <> 'user' OR COALESCE(NEW.is_triggered, false) = true THEN
    RETURN NEW;
  END IF;

  IF NEW.text IS NULL OR btrim(NEW.text) = '' OR NEW.text = '(image)' THEN
    RETURN NEW;
  END IF;

  SELECT id, response_text, response_image
  INTO matched_trigger
  FROM public.triggers
  WHERE enabled = true
    AND lower(NEW.text) LIKE '%' || lower(keyword) || '%'
  ORDER BY length(keyword) DESC
  LIMIT 1;

  IF matched_trigger.id IS NULL THEN
    RETURN NEW;
  END IF;

  trigger_id := 'trg' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 9);

  INSERT INTO public.ticket_messages (id, ticket_id, sender, text, image_url, is_triggered)
  VALUES (
    trigger_id,
    NEW.ticket_id,
    'admin',
    matched_trigger.response_text,
    matched_trigger.response_image,
    true
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_handle_ticket_trigger ON public.ticket_messages;
CREATE TRIGGER trg_handle_ticket_trigger
AFTER INSERT ON public.ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_ticket_trigger();

-- Replace old auto-close with requested 1-hour auto-delete
SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'auto-close-stale-tickets';

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'auto-delete-stale-tickets';

SELECT cron.schedule(
  'auto-delete-stale-tickets',
  '*/10 * * * *',
  $$
    DELETE FROM public.tickets
    WHERE status = 'open'
      AND COALESCE(last_user_message_at, created_at) < now() - interval '1 hour';
  $$
);