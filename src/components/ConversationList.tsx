import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { timeAgo } from '../lib/format.ts'
import { getScenario, isScenarioId } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'
import ScenarioIcon from './ScenarioIcon.tsx'
import { alertError } from './ui.ts'

type Row = { id: string; scenario: string; level: string; updated_at: string }

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; rows: Row[] }

/** The signed-in user's conversations; RLS limits the query to their rows. */
function ConversationList() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    supabase
      .from('conversations')
      .select('id, scenario, level, updated_at')
      .order('updated_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (cancelled) return
        setState(error ? { status: 'error', message: error.message } : { status: 'ready', rows: data })
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <ul aria-busy="true" aria-label="Loading conversations" className="space-y-2">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex animate-pulse items-center gap-3 rounded-xl p-3">
            <span className="size-9 rounded-lg bg-slate-200" />
            <span className="flex-1 space-y-2">
              <span className="block h-3 w-2/3 rounded bg-slate-200" />
              <span className="block h-2.5 w-1/3 rounded bg-slate-100" />
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (state.status === 'error') {
    return (
      <p role="alert" className={alertError}>
        Could not load your conversations: {state.message}
      </p>
    )
  }

  if (state.rows.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center">
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M4 5h16v11H8l-4 4V5Zm4 5h8m-8 3h5" />
          </svg>
        </span>
        <p className="mt-4 font-semibold text-slate-900">No conversations yet</p>
        <p className="mt-1 max-w-56 text-sm text-slate-500">
          Pick a scene and level, then start your first conversation.
        </p>
      </div>
    )
  }

  return (
    <ul className="-mx-2 space-y-1">
      {state.rows.map((row) => {
        const scenario = getScenario(row.scenario)
        return (
          <li key={row.id}>
            <Link
              to={`/conversations/${row.id}`}
              className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              {isScenarioId(row.scenario) && <ScenarioIcon id={row.scenario} size="sm" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {scenario?.title ?? row.scenario}
                </span>
                <span className="block text-xs text-slate-500">
                  <time dateTime={row.updated_at}>{timeAgo(row.updated_at)}</time>
                </span>
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {row.level}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default ConversationList
