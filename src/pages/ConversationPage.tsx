import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import ScenarioIcon from '../components/ScenarioIcon.tsx'
import Spinner, { FullPageSpinner } from '../components/Spinner.tsx'
import TutorMessage from '../components/TutorMessage.tsx'
import { alertError, buttonPrimary, buttonSecondary, card, input } from '../components/ui.ts'
import { sendChatMessage } from '../lib/api.ts'
import { MAX_MESSAGE_CHARS, validateMessage, type ChatMessage } from '../lib/chat.ts'
import { getLevel, getScenario } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'

type Conversation = { id: string; scenario: string; level: string; created_at: string }

type State =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; conversation: Conversation; messages: ChatMessage[] }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const assistantBubble = 'max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-slate-900'
const userBubble = 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-white'

function ConversationPage() {
  const { id = '' } = useParams()
  const validId = UUID.test(id)
  const [loaded, setLoaded] = useState<{ id: string; state: State } | null>(null)
  const [draft, setDraft] = useState('')
  // The learner's message while its reply is on the way.
  const [pending, setPending] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!validId) return
    let cancelled = false
    // RLS returns nothing for another user's conversation, so it reads as "not found".
    Promise.all([
      supabase.from('conversations').select('id, scenario, level, created_at').eq('id', id).maybeSingle(),
      supabase
        .from('messages')
        .select('id, role, content, translation, correction, word_translations, created_at')
        .eq('conversation_id', id)
        .order('created_at'),
    ]).then(([conversation, messages]) => {
      if (cancelled) return
      const error = conversation.error ?? messages.error
      const state: State = error
        ? { status: 'error', message: error.message }
        : !conversation.data
          ? { status: 'not_found' }
          : { status: 'ready', conversation: conversation.data, messages: (messages.data ?? []) as ChatMessage[] }
      setLoaded({ id, state })
    })
    return () => {
      cancelled = true
    }
  }, [id, validId])

  const state: State = !validId
    ? { status: 'not_found' }
    : loaded?.id === id
      ? loaded.state
      : { status: 'loading' }

  const messageCount = state.status === 'ready' ? state.messages.length : 0
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messageCount, pending])

  if (state.status === 'loading') return <FullPageSpinner />

  if (state.status === 'not_found' || state.status === 'error') {
    return (
      <div className={`mx-auto max-w-md p-8 text-center ${card}`}>
        <h1 className="text-xl font-semibold">
          {state.status === 'not_found' ? 'Conversation not found' : 'Something went wrong'}
        </h1>
        {state.status === 'error' ? (
          <p role="alert" className={`mt-4 text-left ${alertError}`}>
            {state.message}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            It may have been deleted, or it belongs to a different account.
          </p>
        )}
        <Link to="/dashboard" className={`mt-6 ${buttonSecondary}`}>
          Back to dashboard
        </Link>
      </div>
    )
  }

  const { conversation, messages } = state
  const scenario = getScenario(conversation.scenario)
  const level = getLevel(conversation.level)
  const sending = pending !== null
  const remaining = MAX_MESSAGE_CHARS - draft.trim().length

  async function send() {
    if (sending) return
    const result = validateMessage(draft)
    if ('error' in result) {
      setSendError(result.error)
      return
    }
    setSendError(null)
    setPending(result.content)
    setDraft('')
    try {
      const { userMessage, assistantMessage } = await sendChatMessage(conversation.id, result.content)
      setLoaded((current) =>
        current?.id === conversation.id && current.state.status === 'ready'
          ? {
              ...current,
              state: { ...current.state, messages: [...current.state.messages, userMessage, assistantMessage] },
            }
          : current,
      )
    } catch (error) {
      // Nothing was saved, so give the learner their text back to retry.
      setDraft(result.content)
      setSendError(error instanceof Error ? error.message : 'Could not send your message.')
    } finally {
      setPending(null)
      composerRef.current?.focus()
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    void send()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift+Enter adds a line. Skip while an IME is composing.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send()
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/dashboard" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Dashboard
      </Link>

      <section aria-labelledby="conversation-title" className={`mt-4 flex min-h-[32rem] flex-col overflow-hidden ${card}`}>
        <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          {scenario && <ScenarioIcon id={scenario.id} size="sm" />}
          <div className="min-w-0 flex-1">
            <h1 id="conversation-title" className="truncate font-semibold">
              {scenario?.title ?? conversation.scenario}
            </h1>
            <p className="text-xs text-slate-500">
              {scenario?.character}
              {level && ` · ${level.value} ${level.label}`}
            </p>
          </div>
        </header>

        <ol aria-label="Messages" aria-live="polite" className="flex-1 space-y-4 px-5 py-6">
          {/* The scenario's scripted greeting always opens the conversation (the tutor sees it too). */}
          {scenario && (
            <li className={assistantBubble}>
              <TutorMessage
                content={scenario.greeting}
                translation={scenario.greetingTranslation}
                words={scenario.greetingWords}
              />
            </li>
          )}
          {messages.map((message) => (
            <li key={message.id} className={message.role === 'user' ? userBubble : assistantBubble}>
              {message.role === 'assistant' ? (
                <TutorMessage
                  content={message.content}
                  translation={message.translation}
                  words={message.word_translations}
                  correction={message.correction}
                />
              ) : (
                <p lang="he" dir="auto" className="text-lg whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
            </li>
          ))}
          {pending !== null && (
            <>
              <li className={`${userBubble} opacity-70`}>
                <p lang="he" dir="auto" className="text-lg whitespace-pre-wrap">
                  {pending}
                </p>
              </li>
              <li className={`${assistantBubble} flex items-center gap-2 text-sm text-slate-500`}>
                <Spinner label="Waiting for the tutor's reply" className="[&>span:first-child]:size-4" />
                {scenario ? `${scenario.character.split(',')[0]} is typing…` : 'Typing…'}
              </li>
            </>
          )}
        </ol>
        <div ref={endRef} />

        <form className="border-t border-slate-100 p-4" onSubmit={handleSubmit} noValidate>
          {sendError && (
            <p role="alert" className={`mb-3 ${alertError}`}>
              {sendError}
            </p>
          )}
          <label htmlFor="composer" className="sr-only">
            Your reply in Hebrew
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="composer"
              ref={composerRef}
              lang="he"
              dir="rtl"
              rows={1}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (sendError) setSendError(null)
              }}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="כתבו כאן…"
              aria-describedby="composer-note"
              aria-invalid={remaining < 0 || undefined}
              className={`min-h-11 resize-none ${input} disabled:bg-slate-50 disabled:text-slate-400`}
            />
            <button type="submit" disabled={sending || !draft.trim() || remaining < 0} className={buttonPrimary}>
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p id="composer-note" className="mt-2 flex justify-between gap-4 text-xs text-slate-500">
            <span>Enter to send · Shift+Enter for a new line</span>
            <span className={remaining < 0 ? 'font-semibold text-red-700' : remaining <= 50 ? 'text-amber-700' : ''}>
              {remaining < 0 ? `${-remaining} characters over the limit` : `${remaining} characters left`}
            </span>
          </p>
        </form>
      </section>
    </div>
  )
}

export default ConversationPage
