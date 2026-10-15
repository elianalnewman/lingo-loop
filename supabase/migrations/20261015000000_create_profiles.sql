-- One row per user, created when they finish onboarding.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  hebrew_level text not null check (
    hebrew_level in (
      'complete_beginner',
      'knows_aleph_bet',
      'basic_words_and_sentences',
      'basic_conversations',
      'fluent'
    )
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
