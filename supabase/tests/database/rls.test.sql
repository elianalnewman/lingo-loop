-- RLS and constraint tests. Run with `npm run test:db` (no Docker needed).
-- Everything happens inside one transaction that is rolled back at the end,
-- so no test users or rows are left behind.
begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(31);

-- Collect each assertion's TAP line; the test roles need to be able to write it.
create temp table tap_output (n serial primary key, line text not null);
grant insert on tap_output to authenticated, anon;
grant usage on sequence tap_output_n_seq to authenticated, anon;

-- Fixtures, created as the migration owner (bypasses RLS) -------------------

insert into auth.users (id, email, aud, role) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'alice@test.local', 'authenticated', 'authenticated'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'bob@test.local', 'authenticated', 'authenticated');

insert into public.profiles (user_id, display_name, level) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Alice', 'A2');

insert into public.conversations (id, user_id, scenario, level, updated_at) values
  ('cccccccc-0000-0000-0000-00000000000a', 'aaaaaaaa-0000-0000-0000-000000000001', 'cafe', 'A2',
   now() - interval '1 day');

insert into public.messages (conversation_id, role, content) values
  ('cccccccc-0000-0000-0000-00000000000a', 'assistant', 'שלום! מה תרצה להזמין?');

insert into public.vocabulary (user_id, word, translation) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'קפה', 'coffee');

-- Alice: can use her own data -----------------------------------------------

set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}';

insert into tap_output (line) select is((select count(*)::int from public.profiles), 1, 'Alice sees her profile');
insert into tap_output (line) select is((select count(*)::int from public.conversations), 1, 'Alice sees her conversation');
insert into tap_output (line) select is((select count(*)::int from public.messages), 1, 'Alice sees messages in her conversation');
insert into tap_output (line) select is((select count(*)::int from public.vocabulary), 1, 'Alice sees her vocabulary');

insert into tap_output (line) select lives_ok(
  $$insert into public.conversations (user_id, scenario, level)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'market', 'B1')$$,
  'Alice can create her own conversation'
);

insert into tap_output (line) select lives_ok(
  $$insert into public.messages (conversation_id, role, content)
    values ('cccccccc-0000-0000-0000-00000000000a', 'user', 'קפה הפוך בבקשה')$$,
  'Alice can add a user message to her conversation'
);

insert into tap_output (line) select ok(
  (select updated_at > now() - interval '1 minute' from public.conversations
   where id = 'cccccccc-0000-0000-0000-00000000000a'),
  'Adding a message bumps the conversation updated_at'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.messages (conversation_id, role, content)
    values ('cccccccc-0000-0000-0000-00000000000a', 'assistant', 'fake tutor reply')$$,
  '42501', null, 'Alice cannot insert an assistant message'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.messages (conversation_id, role, content, correction)
    values ('cccccccc-0000-0000-0000-00000000000a', 'user', 'hi', 'fake correction')$$,
  '42501', null, 'Alice cannot write a correction herself'
);

insert into tap_output (line) select throws_ok(
  $$update public.messages set content = 'edited'$$,
  '42501', null, 'Clients cannot edit messages'
);

insert into tap_output (line) select throws_ok(
  $$update public.conversations set level = 'B2'$$,
  '42501', null, 'Clients cannot update conversations directly'
);

-- Constraint checks
insert into tap_output (line) select throws_ok(
  $$insert into public.conversations (user_id, scenario, level)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'airport', 'A1')$$,
  '23514', null, 'Unknown scenario is rejected'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.conversations (user_id, scenario, level)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'cafe', 'C2')$$,
  '23514', null, 'Unknown level is rejected'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.messages (conversation_id, role, content)
    values ('cccccccc-0000-0000-0000-00000000000a', 'user', '')$$,
  '23514', null, 'Empty message content is rejected'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.vocabulary (user_id, word, translation)
    values ('aaaaaaaa-0000-0000-0000-000000000001', '   ', 'blank')$$,
  '23514', null, 'Blank vocabulary word is rejected'
);

-- Bob: cannot see or touch Alice's data -------------------------------------

set local request.jwt.claims = '{"sub":"bbbbbbbb-0000-0000-0000-000000000002","role":"authenticated"}';

insert into tap_output (line) select is((select count(*)::int from public.profiles), 0, 'Bob cannot read Alice''s profile');
insert into tap_output (line) select is((select count(*)::int from public.conversations), 0, 'Bob cannot read Alice''s conversations');
insert into tap_output (line) select is((select count(*)::int from public.messages), 0, 'Bob cannot read Alice''s messages');
insert into tap_output (line) select is((select count(*)::int from public.vocabulary), 0, 'Bob cannot read Alice''s vocabulary');

insert into tap_output (line) select throws_ok(
  $$insert into public.conversations (user_id, scenario, level)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'cafe', 'A1')$$,
  '42501', null, 'Bob cannot create a conversation as Alice'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.messages (conversation_id, role, content)
    values ('cccccccc-0000-0000-0000-00000000000a', 'user', 'intruder')$$,
  '42501', null, 'Bob cannot post into Alice''s conversation'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.profiles (user_id, level)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'B2')$$,
  '42501', null, 'Bob cannot create a profile for Alice'
);

insert into tap_output (line) select throws_ok(
  $$insert into public.vocabulary (user_id, word, translation)
    values ('aaaaaaaa-0000-0000-0000-000000000001', 'תה', 'tea')$$,
  '42501', null, 'Bob cannot add vocabulary for Alice'
);

-- Updates/deletes on invisible rows silently affect nothing; checked below.
update public.profiles set display_name = 'Hacked';
update public.vocabulary set translation = 'hacked';
delete from public.vocabulary;
delete from public.conversations;

insert into tap_output (line) select lives_ok(
  $$insert into public.conversations (user_id, scenario, level)
    values ('bbbbbbbb-0000-0000-0000-000000000002', 'meeting_someone', 'A1')$$,
  'Bob can create his own conversation'
);

insert into tap_output (line) select is((select count(*)::int from public.conversations), 1, 'Bob sees only his own conversation');

-- Anonymous visitors get nothing --------------------------------------------

set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

insert into tap_output (line) select throws_ok('select * from public.conversations', '42501', null, 'anon cannot read conversations');
insert into tap_output (line) select throws_ok('select * from public.messages', '42501', null, 'anon cannot read messages');
insert into tap_output (line) select throws_ok('select * from public.profiles', '42501', null, 'anon cannot read profiles');

-- Back to the owner to confirm Bob's writes changed nothing ------------------

reset role;

insert into tap_output (line) select is(
  (select display_name from public.profiles where user_id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  'Alice', 'Bob''s profile update did not touch Alice''s profile'
);

insert into tap_output (line) select is(
  (select count(*)::int from public.conversations where user_id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  2, 'Bob''s delete did not remove Alice''s conversations'
);

insert into tap_output (line) select is(
  (select translation from public.vocabulary where user_id = 'aaaaaaaa-0000-0000-0000-000000000001'),
  'coffee', 'Bob''s vocabulary update/delete did not touch Alice''s rows'
);

-- `supabase db query` only returns the last result set, so report every
-- assertion line plus pgTAP's summary in one result.
insert into tap_output (line) select * from finish();
select line from tap_output order by n;
rollback;
