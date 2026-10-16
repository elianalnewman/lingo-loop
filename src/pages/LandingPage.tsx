import { Link } from 'react-router'
import { useAuth } from '../auth/context.ts'
import Logo from '../components/Logo.tsx'
import ScenarioIcon from '../components/ScenarioIcon.tsx'
import { buttonGhost, buttonPrimary, buttonSecondary, card } from '../components/ui.ts'
import { LEVELS, SCENARIOS } from '../lib/options.ts'

const STEPS = [
  {
    title: 'Pick a scene',
    body: 'Choose an everyday situation, from ordering coffee to meeting someone new.',
  },
  {
    title: 'Set your level',
    body: `From ${LEVELS[0].value} to ${LEVELS[LEVELS.length - 1].value}, the conversation adapts to what you already know.`,
  },
  {
    title: 'Talk it through',
    body: 'Chat with a character, get gentle corrections, and keep the words you learn.',
  },
]

const YEAR = new Date().getFullYear()

function LandingPage() {
  const { session } = useAuth()
  const signedIn = Boolean(session)

  return (
    <div className="min-h-svh bg-white">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          {signedIn ? (
            <Link to="/dashboard" className={buttonPrimary}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className={buttonGhost}>
                Log in
              </Link>
              <Link to="/signup" className={buttonPrimary}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-0 h-[32rem] bg-gradient-to-b from-brand-50 to-white"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-2 lg:pt-20">
            <div className="space-y-6">
              <p className="inline-flex rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                Conversational Hebrew, A1 to B2
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Practice Hebrew the way you'll actually use it.
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                LingoLoop puts you in real situations with friendly characters, so you build the
                confidence to order, ask, plan and chat in Hebrew.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={signedIn ? '/dashboard' : '/signup'} className={buttonPrimary}>
                  {signedIn ? 'Continue practicing' : 'Start practicing free'}
                </Link>
                {!signedIn && (
                  <Link to="/login" className={buttonSecondary}>
                    I have an account
                  </Link>
                )}
              </div>
            </div>

            {/* Sample exchange preview */}
            <div className={`mx-auto w-full max-w-md p-5 sm:p-6 ${card}`} aria-label="Example conversation">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                <ScenarioIcon id="cafe" size="sm" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">At a Café</p>
                  <p className="text-xs text-slate-500">With Noa, the barista · A2</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5">
                  <p lang="he" dir="rtl" className="text-slate-900">
                    שלום! מה תרצו להזמין?
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Hi! What would you like to order?</p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-white">
                  <p lang="he" dir="rtl">
                    אני רוצה קפה הפוך, בבקשה.
                  </p>
                </div>
                <div className="ml-auto max-w-[85%] rounded-xl border border-accent-100 bg-accent-50 px-3 py-2 text-xs text-accent-700">
                  Nice! <span lang="he" dir="rtl">קפה הפוך</span> is Israel's classic latte.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="how-heading" className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="how-heading" className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className={`p-6 ${card}`}>
                  <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="scenes-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="scenes-heading" className="text-2xl font-semibold tracking-tight">
            Scenes to practice
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SCENARIOS.map((scenario) => (
              <li key={scenario.id} className={`flex flex-col gap-3 p-5 ${card}`}>
                <ScenarioIcon id={scenario.id} />
                <h3 className="font-semibold">{scenario.title}</h3>
                <p lang="he" dir="rtl" className="text-right text-sm font-medium text-brand-700">
                  {scenario.hebrewTitle}
                </p>
                <p className="text-sm text-slate-500">{scenario.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-gradient-to-br from-brand-700 to-brand-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-semibold">Ready for your first conversation?</p>
              <p className="mt-1 text-brand-100">It takes less than a minute to get started.</p>
            </div>
            <Link
              to={signedIn ? '/dashboard' : '/signup'}
              className="inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {signedIn ? 'Go to dashboard' : 'Create a free account'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400 sm:px-6">
          © {YEAR} LingoLoop
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
