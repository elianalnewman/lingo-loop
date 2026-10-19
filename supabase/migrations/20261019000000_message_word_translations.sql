-- Per-word English glosses for tutor replies, shown when the learner hovers a
-- Hebrew word. An array of {"word": "...", "translation": "..."} objects.

alter table public.messages
  add column word_translations jsonb
    check (
      jsonb_typeof(word_translations) = 'array'
      and octet_length(word_translations::text) <= 16000
    );

-- Like translations and corrections, glosses are written server-side only.
drop policy "Users can add user messages to their own conversations" on public.messages;

create policy "Users can add user messages to their own conversations"
  on public.messages for insert
  to authenticated
  with check (
    role = 'user'
    and translation is null
    and correction is null
    and word_translations is null
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = (select auth.uid())
    )
  );
