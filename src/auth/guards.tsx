import { Navigate, Outlet, useLocation } from 'react-router'
import { FullPageSpinner } from '../components/Spinner.tsx'
import { alertError } from '../components/ui.ts'
import { useAuth } from './context.ts'

/** Signed-in users only; others go to /login and come back afterwards. */
export function RequireAuth() {
  const { session } = useAuth()
  const location = useLocation()
  if (session === undefined) return <FullPageSpinner />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

/** Signed-in users who finished onboarding; others go to /onboarding. */
export function RequireProfile() {
  const { profile, profileError } = useAuth()
  if (profileError) {
    return (
      <p role="alert" className={`mx-auto mt-12 max-w-md ${alertError}`}>
        Could not load your profile: {profileError}
      </p>
    )
  }
  if (profile === undefined) return <FullPageSpinner />
  if (profile === null) return <Navigate to="/onboarding" replace />
  return <Outlet />
}

/** Login and sign-up pages: signed-in users skip straight to the app. */
export function GuestOnly() {
  const { session } = useAuth()
  const location = useLocation()
  if (session === undefined) return <FullPageSpinner />
  if (session) {
    const from = (location.state as { from?: string } | null)?.from
    return <Navigate to={from ?? '/dashboard'} replace />
  }
  return <Outlet />
}
