import { Link } from 'react-router'
import { useAuth } from '../auth/context.ts'
import Logo from '../components/Logo.tsx'
import ScenarioArt from '../components/ScenarioArt.tsx'
import { SCENE_STYLE, splitCharacter } from '../components/scenes.ts'
import TutorMessage from '../components/TutorMessage.tsx'
import {
  buttonGhost,
  buttonPrimary,
  buttonSecondary,
  correctionNote,
  eyebrow,
  eyebrowType,
  userBubble,
} from '../components/ui.ts'
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

// Varied heights so the destination strip reads like a row of postcards, not a grid of tiles.
const POSTCARD = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[2/3]']

const CAFE = SCENARIOS[0]

const YEAR = new Date().getFullYear()

function LandingPage() {
  const { session } = useAuth()
  const signedIn = Boolean(session)

  return (
    <div className="min-h-svh bg-paper">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Logo />
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-3">
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
        <section className="paper-grain relative overflow-hidden border-y border-ink">
          <p
            aria-hidden="true"
            lang="he"
            dir="rtl"
            className="pointer-events-none absolute -top-4 -right-6 text-[clamp(9rem,32vw,28rem)] leading-none font-bold text-peach/45 select-none"
          >
            שיחה
          </p>
          <div className="relative mx-auto grid max-w-6xl gap-14 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-24">
            <div className="lg:col-span-7 xl:col-span-8">
              <p className={eyebrow}>Conversational Hebrew · A1 to B2</p>
              <h1 className="mt-6 text-display-xl font-normal tracking-tight">
                Speak Hebrew <em className="block text-terracotta-deep">like you live there.</em>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft">
                LingoLoop puts you in real situations with friendly characters, so you build the confidence to order,
                ask, plan and chat in Hebrew.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={signedIn ? '/dashboard' : '/signup'} className={`${buttonPrimary} px-7`}>
                  {signedIn ? 'Continue practicing' : 'Start practicing free'}
                </Link>
                {!signedIn && (
                  <Link to="/login" className={buttonSecondary}>
                    I have an account
                  </Link>
                )}
              </div>
            </div>

            {/* Sample exchange, set like a clipping pinned beside the headline. */}
            <figure className="w-full max-w-md self-end justify-self-center lg:col-span-5 lg:mb-2 xl:col-span-4">
              <div className="border border-ink bg-paper lg:rotate-1">
                <div className="flex items-stretch border-b border-ink bg-terracotta text-ink">
                  <div className="flex-1 px-4 py-3">
                    <p className={eyebrowType}>Scene 01 · A2</p>
                    <p className="font-display text-lg">{CAFE.title}</p>
                  </div>
                  <ScenarioArt id="cafe" className="w-24 border-s border-ink" />
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <TutorMessage
                      content="שלום! מה תרצו להזמין?"
                      translation="Hi! What would you like to order?"
                      words={CAFE.greetings.A2.words}
                      speaker="Noa"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={userBubble}>
                      <p lang="he" dir="rtl" className="text-lg">
                        אני רוצה קפה הפוך, בבקשה.
                      </p>
                    </div>
                    <p className={correctionNote}>
                      Nice! <span lang="he">קפה הפוך</span> is Israel’s classic latte.
                    </p>
                  </div>
                </div>
              </div>
              <figcaption className={`mt-3 ${eyebrow}`}>Fig. 1: Hover a Hebrew word to see its meaning</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="how-heading" className="mx-auto max-w-6xl px-4 py-section sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2 id="how-heading" className="text-display-md font-normal tracking-tight lg:col-span-4">
              How it works
            </h2>
            <ol className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
              {STEPS.map((step, index) => (
                <li key={step.title} className="border-t border-ink pt-5">
                  <span aria-hidden="true" className="font-display text-6xl leading-none text-cobalt">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-xl font-normal">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="scenes-heading" className="border-t border-ink bg-paper-deep">
          <div className="mx-auto max-w-6xl px-4 py-section sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="scenes-heading" className="text-display-md font-normal tracking-tight">
                Four places to begin
              </h2>
              <p className={eyebrow}>Destinations 01–04</p>
            </div>
            <ul className="mt-12 grid items-end gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {SCENARIOS.map((scenario, index) => (
                <li key={scenario.id}>
                  <ScenarioArt id={scenario.id} className={`w-full border border-ink ${POSTCARD[index]}`} />
                  <p className={`mt-4 ${eyebrow}`}>No. {SCENE_STYLE[scenario.id].folio}</p>
                  <h3 className="mt-1 text-xl font-normal">{scenario.title}</h3>
                  <div>
                    <p lang="he" dir="rtl" className="text-left text-lg font-medium text-terracotta-deep">
                      {scenario.hebrewTitle}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{scenario.description}</p>
                  <p className="mt-2 text-sm">With {splitCharacter(scenario).name}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-cobalt text-paper">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-section sm:px-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-2xl font-display text-display-md">
              Your first conversation is <em>a minute away.</em>
            </p>
            <Link
              to={signedIn ? '/dashboard' : '/signup'}
              className="inline-flex min-h-11 shrink-0 items-center rounded-sm bg-paper px-7 py-2.5 text-sm font-medium tracking-wide text-cobalt transition-colors hover:bg-paper-deep focus-visible:outline-paper"
            >
              {signedIn ? 'Go to dashboard' : 'Create a free account'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-8 text-sm text-ink-soft sm:px-6">
          <span>© {YEAR} LingoLoop</span>
          <span>Set in Fraunces, DM Sans &amp; Heebo. Illustrations drawn for LingoLoop.</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
