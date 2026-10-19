import { LEVELS } from '../lib/options.ts'
import type { Level } from '../lib/options.ts'
import { eyebrow } from './ui.ts'

type Props = {
  value: Level | null
  onChange: (level: Level) => void
  legend: string
  name?: string
}

/** Radio group set as a ruled row of cells, like the columns of a timetable. */
function LevelSelector({ value, onChange, legend, name = 'level' }: Props) {
  return (
    <fieldset>
      <legend className={`mb-3 ${eyebrow}`}>{legend}</legend>
      <div className="grid grid-cols-2 border-s border-t border-ink sm:grid-cols-4">
        {LEVELS.map((level) => {
          const checked = value === level.value
          return (
            <label
              key={level.value}
              className={`relative flex min-h-28 cursor-pointer flex-col gap-1 border-e border-b border-ink p-4 transition-colors has-focus-visible:z-10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cobalt ${
                checked ? 'bg-cobalt text-paper' : 'bg-paper text-ink hover:bg-paper-deep'
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
              <span className="font-display text-3xl leading-none">{level.value}</span>
              <span className="mt-1 text-sm font-medium">{level.label}</span>
              <span className={`text-xs leading-snug ${checked ? 'text-paper' : 'text-ink-soft'}`}>
                {level.description}
              </span>
              {checked && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className="absolute end-3 top-3 size-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="m2 6.5 2.5 2.5L10 3" />
                </svg>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default LevelSelector
