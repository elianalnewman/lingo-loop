import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import ScenarioArt from '../components/ScenarioArt.tsx'
import { SCENE_STYLE, splitCharacter } from '../components/scenes.ts'
import { FullPageSpinner } from '../components/Spinner.tsx'
import TutorMessage from '../components/TutorMessage.tsx'
import {
  alertError,
  buttonPrimary,
  buttonSecondary,
  eyebrow,
  eyebrowType,
  input,
  tutorBubble,
  userBubble,
} from '../components/ui.ts'
import { sendChatMessage } from '../lib/api.ts'
import { MAX_MESSAGE_CHARS, validateMessage, type ChatMessage } from '../lib/chat.ts'
import { getGreeting, getLevel, getScenario } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'

type Conversation = { id: string; scenario: string; level: string; created_at: string }

type State =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; conversation: Conversation; messages: ChatMessage[] }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const backLink =
  'inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-ink underline-offset-4 hover:underline'

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
      <div className="mx-auto max-w-xl border-t border-ink pt-8">
        <p className={eyebrow}>{state.status === 'not_found' ? 'Page missing' : 'Interrupted'}</p>
        <h1 className="mt-3 text-display-md font-normal tracking-tight">
          {state.status === 'not_found' ? 'Conversation not found' : 'Something went wrong'}
        </h1>
        {state.status === 'error' ? (
          <p role="alert" className={`mt-6 ${alertError}`}>
            {state.message}
          </p>
        ) : (
          <p className="mt-4 text-ink-soft">It may have been deleted, or it belongs to a different account.</p>
        )}
        <Link to="/dashboard" className={`mt-8 ${buttonSecondary}`}>
          Back to dashboard
        </Link>
      </div>
    )
  }

  const { conversation, messages } = state
  const scenario = getScenario(conversation.scenario)
  const level = getLevel(conversation.level)
  const greeting = scenario ? getGreeting(scenario, level?.value ?? 'A1') : null
  const sending = pending !== null
  const style = scenario ? SCENE_STYLE[scenario.id] : null
  const host = scenario ? splitCharacter(scenario) : null
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
    <div className="mx-auto max-w-4xl">
      <Link to="/dashboard" className={backLink}>
        <span aria-hidden="true">←</span> All destinations
      </Link>

      <section
        aria-labelledby="conversation-title"
        className="mt-3 flex min-h-[70svh] flex-col rounded-card border border-ink bg-paper"
      >
        <header
          className={`flex overflow-hidden rounded-t-card border-b border-ink ${style?.ground ?? 'bg-paper-deep'} ${style?.onGround ?? 'text-ink'}`}
        >
          <div className="min-w-0 flex-1 p-5 sm:p-7">
            <p className={eyebrowType}>
              Scene {style?.folio ?? ''}
              {level && ` · ${level.value} ${level.label}`}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <h1 id="conversation-title" className="text-display-sm font-normal tracking-tight text-current">
                {scenario?.title ?? conversation.scenario}
              </h1>
              {scenario && (
                <p lang="he" dir="rtl" className="text-2xl font-medium">
                  {scenario.hebrewTitle}
                </p>
              )}
            </div>
            {host && (
              <div className="mt-5 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-ink bg-paper font-display text-xl text-ink"
                >
                  {host.name.charAt(0)}
                </span>
                <p className="text-sm leading-snug">
                  <span className="block font-medium">You’re talking with {host.name}</span>
                  <span className="block">{host.role}</span>
                </p>
              </div>
            )}
          </div>
          {scenario && (
            <ScenarioArt id={scenario.id} className="hidden w-48 shrink-0 border-s border-ink sm:block md:w-72" />
          )}
        </header>

        <ol aria-label="Messages" aria-live="polite" className="paper-grain flex-1 space-y-6 px-4 py-8 sm:px-8">
          {/* The scenario's scripted greeting for this level always opens the conversation (the tutor sees it too). */}
          {greeting && (
            <li className="flex flex-col items-start gap-1.5">
              <TutorMessage
                content={greeting.text}
                translation={greeting.translation}
                words={greeting.words}
                speaker={host?.name}
              />
            </li>
          )}
          {messages.map((message) =>
            message.role === 'assistant' ? (
              <li key={message.id} className="flex flex-col items-start gap-1.5">
                <TutorMessage
                  content={message.content}
                  translation={message.translation}
                  words={message.word_translations}
                  correction={message.correction}
                  speaker={host?.name}
                />
              </li>
            ) : (
              <li key={message.id} className="flex flex-col items-end">
                <span className="sr-only">You:</span>
                <div className={`${userBubble}`}>
                  <p lang="he" dir="auto" className="text-lg leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </li>
            ),
          )}
          {pending !== null && (
            <>
              <li className="flex flex-col items-end">
                <span className="sr-only">You:</span>
                <div className={`${userBubble} opacity-70`}>
                  <p lang="he" dir="auto" className="text-lg leading-relaxed whitespace-pre-wrap">
                    {pending}
                  </p>
                </div>
              </li>
              <li className="flex flex-col items-start gap-1.5">
                {host && <p className={eyebrow}>{host.name}</p>}
                <div className={`${tutorBubble} flex items-center gap-1.5 py-4`}>
                  <span role="status" className="sr-only">
                    {host ? `${host.name} is typing…` : 'Typing…'}
                  </span>
                  {[0, 200, 400].map((delay) => (
                    <span
                      key={delay}
                      aria-hidden="true"
                      className="size-1.5 animate-breathe rounded-full bg-ink"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </li>
            </>
          )}
        </ol>
        <div ref={endRef} className="scroll-mb-44" />

        <form
          className="sticky bottom-0 rounded-b-card border-t border-ink bg-paper p-4 sm:p-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {sendError && (
            <p role="alert" className={`mb-3 ${alertError}`}>
              {sendError}
            </p>
          )}
          <label htmlFor="composer" className={`mb-2 block ${eyebrow}`}>
            Your reply, in Hebrew
          </label>
          <div className="flex items-end gap-3">
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
              className={`min-h-12 resize-none text-lg ${input} disabled:bg-paper-deep disabled:text-ink-soft`}
            />
            <button
              type="submit"
              disabled={sending || !draft.trim() || remaining < 0}
              className={`${buttonPrimary} min-h-12 px-6`}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
          <p id="composer-note" className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span>Enter to send · Shift+Enter for a new line</span>
            <span
              className={
                remaining < 0 ? 'font-semibold text-terracotta-deep' : remaining <= 50 ? 'text-terracotta-deep' : ''
              }
            >
              {remaining < 0 ? `${-remaining} characters over the limit` : `${remaining} characters left`}
            </span>
          </p>
        </form>
      </section>
    </div>
  )
}

export default ConversationPage
