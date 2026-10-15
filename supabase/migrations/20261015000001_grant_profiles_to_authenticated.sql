-- New tables aren't exposed to the Data API roles by default, so signed-in
-- users got "permission denied". RLS policies still limit them to their own row.
grant select, insert, update on table public.profiles to authenticated;
