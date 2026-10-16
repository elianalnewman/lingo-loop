-- Conversations, messages and vocabulary, all owner-scoped by RLS.

-- Functions that should never be reachable through the Data API.
create schema if not exists private;

-- conversations -------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  scenario text not null check (
    scenario in ('cafe', 'market', 'making_plans', 'meeting_someone')
  ),
  language text not null default 'he' check (language in ('he')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index conversations_user_id_updated_at_idx
  on public.conversations (user_id, updated_at desc);

alter table public.conversations enable row level security;

create policy "Users can read their own conversations"
  on public.conversations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own conversations"
  on public.conversations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own conversations"
  on public.conversations for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.conversations from anon, authenticated;
grant select, insert, delete on table public.conversations to authenticated;
grant all on table public.conversations to service_role;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function private.set_updated_at();

-- messages ------------------------------------------------------------------

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 4000),
  translation text check (char_length(translation) <= 4000),
  correction text check (char_length(correction) <= 4000),
  created_at timestamptz not null default now()
);

create index messages_conversation_id_created_at_idx
  on public.messages (conversation_id, created_at);

alter table public.messages enable row level security;

create policy "Users can read messages in their own conversations"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = (select auth.uid())
    )
  );

-- Clients may only add their own plain user turns. Assistant messages,
-- translations and corrections are written server-side with service_role.
create policy "Users can add user messages to their own conversations"
  on public.messages for insert
  to authenticated
  with check (
    role = 'user'
    and translation is null
    and correction is null
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = (select auth.uid())
    )
  );

revoke all on table public.messages from anon, authenticated;
grant select, insert on table public.messages to authenticated;
grant all on table public.messages to service_role;

-- A new message moves its conversation to the top of the history. Runs as
-- the owner because clients have no update policy on conversations.
create function private.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

revoke all on function private.touch_conversation() from public;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function private.touch_conversation();

-- vocabulary ----------------------------------------------------------------

create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word text not null check (char_length(btrim(word)) between 1 and 100),
  translation text not null check (char_length(btrim(translation)) between 1 and 200),
  example text check (char_length(example) <= 500),
  created_at timestamptz not null default now()
);

create index vocabulary_user_id_created_at_idx
  on public.vocabulary (user_id, created_at desc);

alter table public.vocabulary enable row level security;

create policy "Users can read their own vocabulary"
  on public.vocabulary for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own vocabulary"
  on public.vocabulary for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own vocabulary"
  on public.vocabulary for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own vocabulary"
  on public.vocabulary for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.vocabulary from anon, authenticated;
grant select, insert, update, delete on table public.vocabulary to authenticated;
grant all on table public.vocabulary to service_role;
