import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { timeAgo } from '../lib/format.ts'
import { SCENARIOS, getScenario, isScenarioId } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'
import ScenarioArt from './ScenarioArt.tsx'
import { alertError, eyebrow, input } from './ui.ts'

type Row = { id: string; scenario: string; level: string; updated_at: string }

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; rows: Row[] }

/** The signed-in user's conversations; RLS limits the query to their rows. */
function ConversationList() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [filter, setFilter] = useState('all')

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
      <ul aria-busy="true" aria-label="Loading conversations" className="divide-y divide-rule border-y border-rule">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex animate-pulse items-center gap-3 py-3">
            <span className="size-10 bg-paper-deep" />
            <span className="flex-1 space-y-2">
              <span className="block h-3 w-2/3 bg-paper-deep" />
              <span className="block h-2.5 w-1/3 bg-paper-deep" />
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
      <div className="border-y border-rule py-8">
        <p className="font-display text-xl italic">Nothing here yet.</p>
        <p className="mt-2 max-w-64 text-sm text-ink-soft">
          Pick a destination and a level, and your first conversation will be logged here.
        </p>
      </div>
    )
  }

  const rows = filter === 'all' ? state.rows : state.rows.filter((row) => row.scenario === filter)
  const filterTitle = getScenario(filter)?.title

  return (
    <details className="group/journeys border-y border-rule">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt [&::-webkit-details-marker]:hidden">
        <span className="font-display text-base">
          {state.rows.length} {state.rows.length === 1 ? 'conversation' : 'conversations'}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4 shrink-0 text-ink-soft transition-transform group-open/journeys:rotate-180"
        >
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>

      <div className="pb-3">
        <label htmlFor="journey-filter" className={`mb-1.5 block ${eyebrow}`}>
          Destination
        </label>
        <select
          id="journey-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className={`${input} text-sm`}
        >
          <option value="all">All destinations</option>
          {SCENARIOS.map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.title} ({state.rows.filter((row) => row.scenario === scenario.id).length})
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <p className="border-t border-rule py-6 text-sm text-ink-soft">No {filterTitle} conversations yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {rows.map((row) => {
            const scenario = getScenario(row.scenario)
            return (
              <li key={row.id}>
                <Link
                  to={`/conversations/${row.id}`}
                  className="group flex min-h-11 items-center gap-3 py-3 focus-visible:outline-offset-2"
                >
                  {isScenarioId(row.scenario) ? (
                    <ScenarioArt id={row.scenario} className="size-10 shrink-0" />
                  ) : (
                    <span aria-hidden="true" className="size-10 shrink-0 bg-paper-deep" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="truncate font-display text-base group-hover:underline group-hover:underline-offset-4">
                        {scenario?.title ?? row.scenario}
                      </span>
                      <span aria-hidden="true" className="min-w-4 flex-1 border-b border-dotted border-ink-soft/60" />
                      <span className="text-xs font-medium tracking-[0.12em] text-ink">{row.level}</span>
                    </span>
                    <span className="block text-xs text-ink-soft">
                      <time dateTime={row.updated_at}>{timeAgo(row.updated_at)}</time>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </details>
  )
}

export default ConversationList
