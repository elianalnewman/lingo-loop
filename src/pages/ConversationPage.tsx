import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ScenarioIcon from '../components/ScenarioIcon.tsx'
import { FullPageSpinner } from '../components/Spinner.tsx'
import { alertError, buttonSecondary, card } from '../components/ui.ts'
import { getLevel, getScenario } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'

type Conversation = { id: string; scenario: string; level: string; created_at: string }
type Message = { id: string; role: 'user' | 'assistant'; content: string; translation: string | null }

type State =
  | { status: 'loading' }
  | { status: 'not_found' }
  | { status: 'error'; message: string }
  | { status: 'ready'; conversation: Conversation; messages: Message[] }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function ConversationPage() {
  const { id = '' } = useParams()
  const validId = UUID.test(id)
  const [loaded, setLoaded] = useState<{ id: string; state: State } | null>(null)

  useEffect(() => {
    if (!validId) return
    let cancelled = false
    // RLS returns nothing for another user's conversation, so it reads as "not found".
    Promise.all([
      supabase.from('conversations').select('id, scenario, level, created_at').eq('id', id).maybeSingle(),
      supabase
        .from('messages')
        .select('id, role, content, translation')
        .eq('conversation_id', id)
        .order('created_at'),
    ]).then(([conversation, messages]) => {
      if (cancelled) return
      const error = conversation.error ?? messages.error
      const state: State = error
        ? { status: 'error', message: error.message }
        : !conversation.data
          ? { status: 'not_found' }
          : { status: 'ready', conversation: conversation.data, messages: (messages.data ?? []) as Message[] }
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

        <ol aria-label="Messages" className="flex-1 space-y-4 px-5 py-6">
          {/* Until the AI tutor exists, open with the scenario's scripted greeting. */}
          {scenario && messages.length === 0 && (
            <li className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
              <p lang="he" dir="rtl" className="text-lg text-slate-900">
                {scenario.greeting}
              </p>
              <p className="mt-1 text-sm text-slate-500">{scenario.greetingTranslation}</p>
            </li>
          )}
          {messages.map((message) => (
            <li
              key={message.id}
              className={
                message.role === 'user'
                  ? 'ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-white'
                  : 'max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-slate-900'
              }
            >
              <p lang="he" dir="auto" className="text-lg">
                {message.content}
              </p>
              {message.translation && <p className="mt-1 text-sm opacity-75">{message.translation}</p>}
            </li>
          ))}
        </ol>

        <form className="border-t border-slate-100 p-4" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="composer" className="sr-only">
            Your reply in Hebrew
          </label>
          <div className="flex gap-2">
            <input
              id="composer"
              lang="he"
              dir="rtl"
              disabled
              placeholder="כתבו כאן…"
              aria-describedby="composer-note"
              className="min-w-0 flex-1 cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-400"
            />
            <button
              type="submit"
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500"
            >
              Send
            </button>
          </div>
          <p id="composer-note" className="mt-2 text-xs text-slate-500">
            AI tutor coming soon. Replies and corrections will appear here.
          </p>
        </form>
      </section>
    </div>
  )
}

export default ConversationPage
