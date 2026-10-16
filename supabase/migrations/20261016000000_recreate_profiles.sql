-- Replace the original profiles table (id + custom hebrew_level) with the
-- LingoLoop shape: user_id, display_name, language, CEFR level. Existing rows
-- are intentionally discarded; users redo onboarding.
drop table if exists public.profiles;

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(btrim(display_name)) between 1 and 60),
  language text not null default 'he' check (language in ('he')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Be explicit rather than relying on project default privileges.
revoke all on table public.profiles from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant all on table public.profiles to service_role;
