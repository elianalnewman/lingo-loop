import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './lib/supabase.ts'
import { HEBREW_LEVELS } from './hebrewLevels.ts'
import type { HebrewLevel } from './hebrewLevels.ts'

type Props = {
  userId: string
  onComplete: (level: HebrewLevel) => void
}

function Onboarding({ userId, onComplete }: Props) {
  const [level, setLevel] = useState<HebrewLevel | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!level) return
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, hebrew_level: level, updated_at: new Date().toISOString() })

    setSaving(false)
    if (error) setError(error.message)
    else onComplete(level)
  }

  return (
    <form className="onboarding" onSubmit={handleSubmit}>
      <h1>Welcome!</h1>
      <fieldset>
        <legend>What's your level in Hebrew?</legend>
        {HEBREW_LEVELS.map((option) => (
          <label key={option.value} className="level-option">
            <input
              type="radio"
              name="hebrew-level"
              value={option.value}
              checked={level === option.value}
              onChange={() => setLevel(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <button type="submit" className="counter" disabled={!level || saving}>
        {saving ? 'Saving…' : 'Continue'}
      </button>
    </form>
  )
}

export default Onboarding
