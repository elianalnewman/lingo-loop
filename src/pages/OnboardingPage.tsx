import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/context.ts'
import LevelSelector from '../components/LevelSelector.tsx'
import { alertError, buttonPrimary, eyebrow, input } from '../components/ui.ts'
import type { Level } from '../lib/options.ts'
import { supabase } from '../lib/supabase.ts'

function OnboardingPage() {
  const { session, profile, setProfile } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [level, setLevel] = useState<Level | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Already onboarded: nothing to do here.
  if (profile) return <Navigate to="/dashboard" replace />
  if (!session) return null

  const userId = session.user.id
  const trimmedName = displayName.trim()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!level || trimmedName.length < 1 || trimmedName.length > 60) return
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: userId, display_name: trimmedName, level })

    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setProfile({ userId, displayName: trimmedName, level })
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="mx-auto max-w-2xl border-t border-ink pt-8">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <p className={eyebrow}>
            Welcome to LingoLoop ·{' '}
            <span lang="he" dir="rtl">
              ברוכים הבאים
            </span>
          </p>
          <h1 className="text-display-md font-normal tracking-tight">Let’s set up your practice.</h1>
          <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
            Your tutor adapts to your level. You can pick a different level for any conversation later.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="display-name" className="text-sm font-medium text-ink">
            What should we call you?
          </label>
          <input
            id="display-name"
            type="text"
            autoComplete="nickname"
            required
            maxLength={60}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`${input} max-w-sm`}
          />
        </div>

        <LevelSelector legend="What's your Hebrew level?" value={level} onChange={setLevel} />

        {error && (
          <p role="alert" className={alertError}>
            {error}
          </p>
        )}

        <button type="submit" className={buttonPrimary} disabled={!level || !trimmedName || saving}>
          {saving ? 'Saving…' : 'Continue to dashboard'}
        </button>
      </form>
    </div>
  )
}

export default OnboardingPage
