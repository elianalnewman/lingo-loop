import type { Scenario } from '../lib/options.ts'
import ScenarioIcon from './ScenarioIcon.tsx'

type Props = {
  scenario: Scenario
  checked: boolean
  onSelect: () => void
}

/** One option in the dashboard's scenario radio group. */
function ScenarioCard({ scenario, checked, onSelect }: Props) {
  return (
    <label
      className={`group relative flex cursor-pointer flex-col gap-4 rounded-[var(--radius-card)] border bg-white p-5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
        checked
          ? 'border-brand-500 shadow-md ring-1 ring-brand-500'
          : 'border-slate-200 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <input
        type="radio"
        name="scenario"
        value={scenario.id}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <div className="flex items-start justify-between gap-3">
        <ScenarioIcon id={scenario.id} />
        <span
          aria-hidden="true"
          className={`grid size-5 place-items-center rounded-full border transition ${
            checked ? 'border-brand-600 bg-brand-600' : 'border-slate-300 bg-white'
          }`}
        >
          {checked && <span className="size-2 rounded-full bg-white" />}
        </span>
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold">{scenario.title}</h3>
        <p lang="he" dir="rtl" className="text-right text-sm font-medium text-brand-700">
          {scenario.hebrewTitle}
        </p>
      </div>
      <p className="text-sm text-slate-500">{scenario.description}</p>
      <p className="mt-auto text-xs font-medium text-slate-400">With {scenario.character}</p>
    </label>
  )
}

export default ScenarioCard
