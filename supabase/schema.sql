-- =====================================================================
-- FILE: supabase/schema.sql
-- Paste into Supabase → SQL Editor → New query → Run (after writing it).
-- This file is NOT used by the React app; it's a record of your database setup.
-- =====================================================================
--
-- LESSON 1 — Creating a table
--   create table notes (
--     id uuid primary key default gen_random_uuid(),   -- unique id, auto-generated
--     body text not null,                               -- text, required
--     owner_id uuid not null references auth.users(id), -- must be a real user
--     created_at timestamptz default now()              -- auto timestamp
--   );
--
-- LESSON 2 — Row Level Security (RLS)
--   The anon key is public, so ANYONE could talk to your database.
--   RLS = rules that decide which rows each logged-in user may read/write.
--   Once enabled, everything is blocked until you add policies.
--
--   alter table notes enable row level security;
--
--   create policy "Users can read notes"
--     on notes for select
--     to authenticated            -- only logged-in users
--     using (true);               -- every row is readable
--
--   create policy "Users can add their own notes"
--     on notes for insert
--     to authenticated
--     with check (auth.uid() = owner_id);   -- can't pretend to be someone else
--
--   auth.uid() = the id of the user making the request.
--
-- LESSON 3 — Realtime
--   alter publication supabase_realtime add table notes;
--   Without this, inserts still work but nobody gets notified live.
--
-- ---------------------------------------------------------------------
-- YOUR VERSION: same three steps for a table called `messages` with columns
--   id, content (text not null), user_id (uuid not null → auth.users),
--   user_email (text), created_at
-- ---------------------------------------------------------------------

-- 1. create table messages


-- 2. enable RLS + SELECT policy + INSERT policy (with check auth.uid() = user_id)


-- 3. add messages to the supabase_realtime publication

