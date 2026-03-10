-- Fix and harden auto-trigger function + deduplicate triggers
CREATE OR REPLACE FUNCTION public.handle_ticket_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  matched_trigger record;
  lower_text text;
BEGIN
  IF NEW.sender <> 'user' OR COALESCE(NEW.is_triggered, false) = true THEN
    RETURN NEW;
  END IF;

  IF NEW.text IS NULL OR btrim(NEW.text) = '' OR NEW.text = '(image)' THEN
    RETURN NEW;
  END IF;

  lower_text := lower(btrim(NEW.text));

  SELECT id, response_text, response_image
  INTO matched_trigger
  FROM public.triggers
  WHERE enabled = true
    AND btrim(keyword) <> ''
    AND lower_text LIKE '%' || lower(btrim(keyword)) || '%'
  ORDER BY length(btrim(keyword)) DESC
  LIMIT 1;

  IF matched_trigger.id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.ticket_messages (id, ticket_id, sender, text, image_url, is_triggered)
  VALUES (
    'trg' || replace(gen_random_uuid()::text, '-', ''),
    NEW.ticket_id,
    'admin',
    matched_trigger.response_text,
    matched_trigger.response_image,
    true
  );

  RETURN NEW;
END;
$function$;

-- Remove all duplicate triggers, keep exactly one per handler
DROP TRIGGER IF EXISTS on_user_message ON public.ticket_messages;
DROP TRIGGER IF EXISTS trg_update_last_user_message ON public.ticket_messages;
DROP TRIGGER IF EXISTS trg_handle_ticket_trigger ON public.ticket_messages;

CREATE TRIGGER trg_update_last_user_message
AFTER INSERT ON public.ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_last_user_message();

CREATE TRIGGER trg_handle_ticket_trigger
AFTER INSERT ON public.ticket_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_ticket_trigger();

-- Make RLS policies PERMISSIVE so they actually work
-- Drop restrictive policies and recreate as permissive for ticket_messages
DROP POLICY IF EXISTS "View messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Send messages" ON public.ticket_messages;

CREATE POLICY "View messages" ON public.ticket_messages
FOR SELECT USING (
  EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_messages.ticket_id AND (tickets.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)))
);

CREATE POLICY "Send messages" ON public.ticket_messages
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_messages.ticket_id AND (tickets.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)))
);

-- Fix ticket policies to be permissive
DROP POLICY IF EXISTS "View tickets" ON public.tickets;
DROP POLICY IF EXISTS "Create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Update tickets" ON public.tickets;

CREATE POLICY "View tickets" ON public.tickets
FOR SELECT USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Create tickets" ON public.tickets
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Update tickets" ON public.tickets
FOR UPDATE USING ((user_id = auth.uid() AND status = 'open') OR has_role(auth.uid(), 'admin'::app_role));

-- Fix other table policies to be permissive
DROP POLICY IF EXISTS "Anyone reads coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Anyone reads coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone reads triggers" ON public.triggers;
DROP POLICY IF EXISTS "Admins manage triggers" ON public.triggers;
CREATE POLICY "Anyone reads triggers" ON public.triggers FOR SELECT USING (true);
CREATE POLICY "Admins manage triggers" ON public.triggers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone reads news" ON public.news_items;
DROP POLICY IF EXISTS "Admins manage news" ON public.news_items;
CREATE POLICY "Anyone reads news" ON public.news_items FOR SELECT USING (true);
CREATE POLICY "Admins manage news" ON public.news_items FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage webhooks" ON public.webhook_settings;
CREATE POLICY "Admins manage webhooks" ON public.webhook_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Allow webhook settings to be read by the discord-webhook edge function (service role), but also by anyone for the check
CREATE POLICY "Anyone reads webhook settings" ON public.webhook_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Read own role" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Read own role" ON public.user_roles FOR SELECT USING (user_id = auth.uid());