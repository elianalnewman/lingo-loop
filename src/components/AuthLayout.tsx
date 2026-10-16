import { Outlet } from 'react-router'
import Logo from './Logo.tsx'
import { card } from './ui.ts'

/** Centered card frame shared by the login and sign-up pages. */
function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50 px-4">
      <div className="mx-auto w-full max-w-6xl py-6">
        <Logo />
      </div>
      <div className="flex flex-1 items-start justify-center pt-6 pb-16 sm:items-center sm:pt-0">
        <div className={`w-full max-w-md p-6 sm:p-8 ${card}`}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
