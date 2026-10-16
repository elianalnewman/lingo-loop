import type { ScenarioId } from '../lib/options.ts'

// Simple 24px line icons, drawn to match each scenario.
const PATHS: Record<ScenarioId, string> = {
  cafe: 'M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm12 1h1.5a2.5 2.5 0 0 1 0 5H16M7 3v3m4-3v3',
  market: 'M3 9h18l-1.5 10.5a1 1 0 0 1-1 .5h-13a1 1 0 0 1-1-.5L3 9Zm4 0 3-6m7 6-3-6M9 13v4m6-4v4',
  making_plans: 'M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4m-6 7 2 2 4-4',
  meeting_someone: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0 0-6m2 15a6 6 0 0 0-3-5.2',
}

const TONES: Record<ScenarioId, string> = {
  cafe: 'bg-amber-50 text-amber-700',
  market: 'bg-accent-50 text-accent-700',
  making_plans: 'bg-brand-50 text-brand-700',
  meeting_someone: 'bg-rose-50 text-rose-700',
}

function ScenarioIcon({ id, size = 'md' }: { id: ScenarioId; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'size-9 rounded-lg' : 'size-11 rounded-xl'
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center ${box} ${TONES[id]}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === 'sm' ? 'size-5' : 'size-6'}
      >
        <path d={PATHS[id]} />
      </svg>
    </span>
  )
}

export default ScenarioIcon
