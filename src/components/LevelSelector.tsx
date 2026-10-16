import { LEVELS } from '../lib/options.ts'
import type { Level } from '../lib/options.ts'

type Props = {
  value: Level | null
  onChange: (level: Level) => void
  legend: string
  name?: string
}

/** Radio group styled as a row of selectable tiles. */
function LevelSelector({ value, onChange, legend, name = 'level' }: Props) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-slate-900">{legend}</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LEVELS.map((level) => {
          const checked = value === level.value
          return (
            <label
              key={level.value}
              className={`relative flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600 ${
                checked
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={level.value}
                checked={checked}
                onChange={() => onChange(level.value)}
                className="sr-only"
              />
              <span className={`text-base font-semibold ${checked ? 'text-brand-700' : 'text-slate-900'}`}>
                {level.value}
              </span>
              <span className="text-xs font-medium text-slate-600">{level.label}</span>
              <span className="text-xs text-slate-500">{level.description}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default LevelSelector
