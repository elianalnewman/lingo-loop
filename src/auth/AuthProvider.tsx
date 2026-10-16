import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase.ts'
import type { Level } from '../lib/options.ts'
import { AuthContext } from './context.ts'
import type { Profile } from './context.ts'

// Profile state is tagged with the user it was loaded for, so a stale profile
// from a previous session is never shown to the next user.
type LoadedProfile = { userId: string; profile: Profile | null; error: string | null }

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [loaded, setLoaded] = useState<LoadedProfile | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    supabase
      .from('profiles')
      .select('display_name, level')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        setLoaded({
          userId,
          profile: data
            ? { userId, displayName: data.display_name, level: data.level as Level }
            : null,
          error: error?.message ?? null,
        })
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  const value = useMemo(() => {
    const current = loaded && loaded.userId === userId ? loaded : undefined
    return {
      session,
      profile: current?.profile,
      profileError: current?.error ?? null,
      setProfile: (profile: Profile) =>
        setLoaded({ userId: profile.userId, profile, error: null }),
    }
  }, [session, loaded, userId])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
