import { useState } from 'react'
import { Outlet } from 'react-router'
import { useAuth } from '../auth/context.ts'
import { supabase } from '../lib/supabase.ts'
import Logo from './Logo.tsx'
import { buttonGhost } from './ui.ts'

/** Header + page frame for every signed-in page. */
function AppShell() {
  const { session, profile } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function signOut() {
    setSigningOut(true)
    // The auth listener clears the session and RequireAuth redirects to /login.
    await supabase.auth.signOut()
    setSigningOut(false)
  }

  const name = profile?.displayName || session?.user.email

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-2">
            {name && (
              <span className="hidden max-w-48 truncate text-sm text-slate-500 sm:inline">{name}</span>
            )}
            <button type="button" className={buttonGhost} onClick={signOut} disabled={signingOut}>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
