import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/context.ts'
import ConversationList from '../components/ConversationList.tsx'
import LevelSelector from '../components/LevelSelector.tsx'
import ScenarioCard from '../components/ScenarioCard.tsx'
import Spinner from '../components/Spinner.tsx'
import { alertError, buttonPrimary, eyebrow } from '../components/ui.ts'
import { createConversation } from '../lib/api.ts'
import { SCENARIOS } from '../lib/options.ts'
import type { Level, ScenarioId } from '../lib/options.ts'

// Asymmetric magazine spread on wide screens: 7/5, then 5/7.
const SPANS: Record<ScenarioId, string> = {
  cafe: 'lg:col-span-7',
  market: 'lg:col-span-5',
  making_plans: 'lg:col-span-5',
  meeting_someone: 'lg:col-span-7',
}

const TODAY = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

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
    <div className="space-y-10 sm:space-y-14">
      <header className="border-b border-ink pb-6 sm:pb-8">
        <p className={`flex flex-wrap justify-between gap-2 ${eyebrow}`}>
          <span>Today’s destinations</span>
          <span>{TODAY}</span>
        </p>
        <h1 className="mt-4 text-display-md font-normal tracking-tight text-balance">
          <span lang="he" dir="rtl">
            שלום
          </span>
          {profile?.displayName && `, ${profile.displayName}`}.{' '}
          <em className="text-terracotta-deep">Where to today?</em>
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-16">
        <form onSubmit={handleSubmit} className="space-y-12">
          <fieldset>
            <legend className={`mb-4 ${eyebrow}`}>
              <span className="text-ink">01</span> · Choose a destination
            </legend>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
              {SCENARIOS.map((item) => (
                <div key={item.id} className={SPANS[item.id]}>
                  <ScenarioCard
                    scenario={item}
                    checked={scenario === item.id}
                    onSelect={() => setScenario(item.id)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <LevelSelector legend="02 · Choose your level" value={level} onChange={setLevel} />

          {error && (
            <p role="alert" className={alertError}>
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 border-t border-ink pt-6">
            <button type="submit" className={`${buttonPrimary} px-7`} disabled={!scenario || !level || creating}>
              {creating && (
                <Spinner
                  label="Creating conversation"
                  className="[&>span:first-child]:size-4 [&>span:first-child]:border-paper/40 [&>span:first-child]:border-t-paper"
                />
              )}
              {creating ? 'Starting…' : 'Start conversation'}
            </button>
            {!scenario && <p className="text-sm text-ink-soft">Select a destination to continue.</p>}
          </div>
        </form>

        <aside aria-labelledby="history-heading" className="h-fit lg:sticky lg:top-24 lg:border-s lg:border-rule lg:ps-8">
          <h2 id="history-heading" className={`mb-4 font-sans ${eyebrow}`}>
            Recent journeys
          </h2>
          <ConversationList />
        </aside>
      </div>
    </div>
  )
}

export default DashboardPage
