import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { supabase } from '../lib/supabase.ts'
import { alertError, buttonPrimary, eyebrow, input, linkInline } from './ui.ts'

type Mode = 'login' | 'signup'

const COPY = {
  login: {
    title: 'Welcome back',
    subtitle: 'Log in to continue your Hebrew practice.',
    submit: 'Log in',
    switchPrompt: "Don't have an account?",
    switchLabel: 'Sign up',
    switchTo: '/signup',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Start practicing real conversations in minutes.',
    submit: 'Create account',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Log in',
    switchTo: '/login',
  },
} as const

function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const copy = COPY[mode]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const trimmedEmail = email.trim()
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      })
      if (error) {
        setError(error.message)
      } else if (!data.session) {
        // Email confirmation is on: the user exists but can't sign in until
        // they click the link Supabase emails them.
        setMessage('Check your email for a confirmation link to finish signing up.')
      }
    }

    // On success the auth listener updates the session and GuestOnly redirects.
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
      <div className="space-y-3 border-b border-ink pb-6">
        <p className={eyebrow}>{mode === 'login' ? 'Log in' : 'Sign up'}</p>
        <h1 className="text-display-sm font-normal tracking-tight">{copy.title}</h1>
        <p className="text-ink-soft">{copy.subtitle}</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'signup' ? 8 : undefined}
          maxLength={72}
          aria-describedby={mode === 'signup' ? 'password-hint' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />
        {mode === 'signup' && (
          <p id="password-hint" className="text-xs text-ink-soft">
            At least 8 characters.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className={alertError}>
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="border-s-2 border-cobalt bg-sage-wash px-4 py-3 text-sm text-ink">
          {message}
        </p>
      )}

      <button type="submit" className={`${buttonPrimary} w-full`} disabled={loading}>
        {loading ? 'Please wait…' : copy.submit}
      </button>

      <p className="text-sm text-ink-soft">
        {copy.switchPrompt}{' '}
        <Link to={copy.switchTo} className={linkInline}>
          {copy.switchLabel}
        </Link>
      </p>
    </form>
  )
}

export default AuthForm
