
-- ═══ Fix RLS Policies: Recreate as PERMISSIVE (default) ═══
-- The existing policies were RESTRICTIVE, which blocks ALL access when there are no permissive policies

-- COUPONS
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone authenticated can read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone reads coupons" ON public.coupons FOR SELECT USING (true);

-- NEWS_ITEMS
DROP POLICY IF EXISTS "Admins can manage news" ON public.news_items;
DROP POLICY IF EXISTS "Anyone can read active news" ON public.news_items;
CREATE POLICY "Admins manage news" ON public.news_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone reads news" ON public.news_items FOR SELECT USING (true);

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone reads settings" ON public.site_settings FOR SELECT USING (true);

-- TRIGGERS
DROP POLICY IF EXISTS "Admins can manage triggers" ON public.triggers;
DROP POLICY IF EXISTS "Anyone authenticated can read triggers" ON public.triggers;
CREATE POLICY "Admins manage triggers" ON public.triggers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone reads triggers" ON public.triggers FOR SELECT TO authenticated USING (true);

-- TICKETS
DROP POLICY IF EXISTS "Admins can update tickets" ON public.tickets;
DROP POLICY IF EXISTS "Authenticated users can create tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update own open tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "View tickets" ON public.tickets FOR SELECT TO authenticated USING ((user_id = auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Create tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update tickets" ON public.tickets FOR UPDATE TO authenticated USING ((user_id = auth.uid() AND status = 'open') OR public.has_role(auth.uid(), 'admin'::app_role));

-- TICKET_MESSAGES
DROP POLICY IF EXISTS "Users can send messages to own tickets" ON public.ticket_messages;
DROP POLICY IF EXISTS "Users can view messages of own tickets" ON public.ticket_messages;
CREATE POLICY "View messages" ON public.ticket_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_messages.ticket_id AND (tickets.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))));
CREATE POLICY "Send messages" ON public.ticket_messages FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.tickets WHERE tickets.id = ticket_messages.ticket_id AND (tickets.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))));

-- USER_ROLES
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- WEBHOOK_SETTINGS
DROP POLICY IF EXISTS "Admins can manage webhook settings" ON public.webhook_settings;
CREATE POLICY "Admins manage webhooks" ON public.webhook_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ═══ New columns ═══
ALTER TABLE public.webhook_settings ADD COLUMN IF NOT EXISTS discord_ping_id text DEFAULT '';
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS last_user_message_at timestamptz DEFAULT now();

-- Auto-update last_user_message_at when user sends a message
CREATE OR REPLACE FUNCTION public.update_last_user_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sender = 'user' THEN
    UPDATE public.tickets SET last_user_message_at = now() WHERE id = NEW.ticket_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_user_message
  AFTER INSERT ON public.ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_user_message();

-- ═══ Realtime ═══
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'tickets') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'ticket_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
  END IF;
END $$;

-- ═══ Auto-close stale tickets via pg_cron ═══
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

SELECT cron.schedule(
  'auto-close-stale-tickets',
  '*/30 * * * *',
  $$UPDATE public.tickets SET status = 'closed' WHERE status = 'open' AND last_user_message_at < now() - interval '6 hours'$$
);
