-- Enable realtime for messages, conversations and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Add UPDATE policy for conversations so last_message_at can be updated
CREATE POLICY "Participants can update conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (auth.uid() = participant_1 OR auth.uid() = participant_2)
WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);