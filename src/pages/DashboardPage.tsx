import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context.ts'
import ConversationList from '../components/ConversationList.tsx'
import LevelSelector from '../components/LevelSelector.tsx'
import ScenarioCard from '../components/ScenarioCard.tsx'
import Spinner from '../components/Spinner.tsx'
import { alertError, buttonPrimary, card } from '../components/ui.ts'
import { createConversation } from '../lib/api.ts'
import { SCENARIOS } from '../lib/options.ts'
import type { Level, ScenarioId } from '../lib/options.ts'

function DashboardPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [scenario, setScenario] = useState<ScenarioId | null>(null)
  const [level, setLevel] = useState<Level | null>(profile?.level ?? null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!scenario || !level) return
    setCreating(true)
    setError(null)
    try {
      const id = await createConversation(scenario, level)
      navigate(`/conversations/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setCreating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <span lang="he" dir="rtl" className="text-brand-600">
            שלום
          </span>
          {profile?.displayName && `, ${profile.displayName}`}
        </h1>
        <p className="mt-1 text-slate-500">Choose a scene and a level to start a new conversation.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-slate-900">Scenario</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              {SCENARIOS.map((item) => (
                <ScenarioCard
                  key={item.id}
                  scenario={item}
                  checked={scenario === item.id}
                  onSelect={() => setScenario(item.id)}
                />
              ))}
            </div>
          </fieldset>

          <LevelSelector legend="Difficulty" value={level} onChange={setLevel} />

          {error && (
            <p role="alert" className={alertError}>
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={buttonPrimary} disabled={!scenario || !level || creating}>
              {creating && <Spinner label="Creating conversation" className="[&>span:first-child]:size-4 [&>span:first-child]:border-white/40 [&>span:first-child]:border-t-white" />}
              {creating ? 'Starting…' : 'Start conversation'}
            </button>
            {!scenario && <p className="text-sm text-slate-500">Select a scenario to continue.</p>}
          </div>
        </form>

        <aside aria-labelledby="history-heading" className={`h-fit p-5 lg:sticky lg:top-24 ${card}`}>
          <h2 id="history-heading" className="mb-4 text-base font-semibold">
            Your conversations
          </h2>
          <ConversationList />
        </aside>
      </div>
    </div>
  )
}

export default DashboardPage
