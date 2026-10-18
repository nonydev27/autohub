-- AutoHub database schema
-- Write the SQL below each comment, then paste the whole file into
-- Supabase → SQL Editor → New query → Run.

-- 1. CREATE TABLE messages with these columns:
--    id          uuid, primary key, default gen_random_uuid()
--    content     text, not null
--    user_id     uuid, references auth.users(id), not null
--    user_email  text  (lets you show who sent a message without a profiles table)
--    created_at  timestamptz, default now()


-- 2. Turn on Row Level Security for the messages table
--    (ALTER TABLE ... ENABLE ROW LEVEL SECURITY)


-- 3. Policy: logged-in users can READ all messages
--    (CREATE POLICY ... FOR SELECT TO authenticated USING (true))


-- 4. Policy: logged-in users can INSERT only messages where user_id is themselves
--    (FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id))


-- 5. Add the table to realtime so the chat updates live
--    (ALTER PUBLICATION supabase_realtime ADD TABLE messages)
