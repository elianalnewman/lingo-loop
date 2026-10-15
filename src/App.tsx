import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import './App.css';
import AuthForm from './AuthForm.tsx';
import Onboarding from './Onboarding.tsx';
import { HEBREW_LEVELS } from './hebrewLevels.ts';
import type { HebrewLevel } from './hebrewLevels.ts';
import { supabase } from './lib/supabase.ts';

// level null = no profile row yet, so the user still needs onboarding.
type Profile = { userId: string; level: HebrewLevel | null; error: string | null };

function App() {
  // undefined = still loading the stored session; null = signed out.
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    supabase
      .from('profiles')
      .select('hebrew_level')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        setProfile({
          userId,
          level: (data?.hebrew_level as HebrewLevel | undefined) ?? null,
          error: error?.message ?? null,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (session === undefined) return null;

  if (!session) {
    return (
      <section id="center">
        <AuthForm />
      </section>
    );
  }

  const signOut = (
    <button
      type="button"
      className="link-button"
      onClick={() => supabase.auth.signOut()}
    >
      Sign out
    </button>
  );

  // A profile loaded for a previous user counts as still loading.
  if (profile?.userId !== session.user.id) return null;

  if (profile.error) {
    return (
      <section id="center">
        <p className="auth-error" role="alert">{profile.error}</p>
        {signOut}
      </section>
    );
  }

  const { level } = profile;

  return (
    <section id="center">
      {level === null ? (
        <Onboarding
          userId={session.user.id}
          onComplete={(level) => setProfile({ ...profile, level })}
        />
      ) : (
        <>
          <p>{session.user.email}</p>
          <p>
            Hebrew level: {HEBREW_LEVELS.find((option) => option.value === level)?.label}
          </p>
        </>
      )}
      {signOut}
    </section>
  );
}

export default App;
