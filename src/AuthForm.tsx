import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './lib/supabase.ts'

type Mode = 'login' | 'signup'

function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      })
      if (error) {
        setError(error.message)
      } else if (!data.session) {
        // Email confirmation is on: the user exists but can't sign in until
        // they click the link Supabase emails them.
        setMessage('Check your email for a confirmation link to finish signing up.')
      }
    }

    // On success, App's onAuthStateChange listener swaps this form out.
    setLoading(false)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>

      <label>
        Email
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="auth-error" role="alert">{error}</p>}
      {message && <p className="auth-message">{message}</p>}

      <button type="submit" className="counter" disabled={loading}>
        {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
      </button>

      <p>
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className="link-button"
          onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </form>
  )
}

export default AuthForm
