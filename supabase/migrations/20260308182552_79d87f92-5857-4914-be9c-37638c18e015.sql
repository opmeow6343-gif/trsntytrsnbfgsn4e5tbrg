
-- Allow admins to delete tickets and ticket_messages
CREATE POLICY "Admins delete tickets"
ON public.tickets FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete ticket_messages"
ON public.ticket_messages FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
