import { Outlet } from 'react-router'
import Logo from './Logo.tsx'
import ScenarioArt from './ScenarioArt.tsx'

/** Split frame shared by the login and sign-up pages: scene art beside the form on wide screens. */
function AuthLayout() {
  return (
    <div className="grid min-h-svh bg-paper lg:grid-cols-2">
      <aside className="relative hidden border-e border-ink lg:block">
        <ScenarioArt id="cafe" className="absolute inset-0 size-full" />
        <figure className="absolute inset-x-10 bottom-10 border border-ink bg-paper p-6">
          <p lang="he" dir="rtl" className="text-3xl font-medium">
            מה תרצו להזמין?
          </p>
          <figcaption className="mt-3 font-display text-lg leading-snug italic">
            “What would you like to order?” The first line of your first conversation.
          </figcaption>
        </figure>
      </aside>
      <div className="flex flex-col px-4 sm:px-8">
        <div className="py-5">
          <Logo />
        </div>
        <ScenarioArt id="cafe" className="h-24 w-full border border-ink lg:hidden" />
        <div className="flex flex-1 items-start justify-center pt-10 pb-16 sm:items-center sm:pt-0">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
