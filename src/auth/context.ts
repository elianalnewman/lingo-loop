import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Level } from '../lib/options.ts'

export type Profile = { userId: string; displayName: string | null; level: Level }

export type AuthState = {
  // undefined = still loading the stored session; null = signed out.
  session: Session | null | undefined
  // undefined = loading; null = signed in but no profile yet (needs onboarding).
  profile: Profile | null | undefined
  profileError: string | null
  setProfile: (profile: Profile) => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>')
  return value
}
