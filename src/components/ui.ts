// Shared class strings so buttons, inputs and editorial details look the same everywhere.

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cobalt'

export const buttonPrimary = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-cobalt px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-soft ${focus}`

export const buttonSecondary = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-ink px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper ${focus}`

export const buttonGhost = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-ink underline-offset-4 decoration-1 transition-colors hover:underline ${focus}`

export const input = `block w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-ink placeholder:text-ink-soft/70 focus:border-cobalt focus:outline-2 focus:outline-offset-0 focus:outline-cobalt`

export const alertError =
  'border-s-2 border-terracotta-deep bg-peach/40 px-4 py-3 text-sm text-ink'

/** Small tracked capitals that sit above headings, like a magazine section label. */
export const eyebrowType = 'text-[0.6875rem] font-medium tracking-[0.18em] uppercase'
export const eyebrow = `${eyebrowType} text-ink-soft`

export const linkInline = `rounded-sm font-medium text-cobalt underline decoration-1 underline-offset-4 hover:text-cobalt-deep ${focus}`

// Chat bubbles: the tutor sits on the inline-start side on sunk paper, the learner on the end side in cobalt.
export const tutorBubble =
  'max-w-[88%] rounded-bubble rounded-ss-sm border border-rule bg-paper-deep px-4 py-3 text-ink sm:max-w-[75%] sm:px-5'

export const userBubble =
  'max-w-[88%] rounded-bubble rounded-se-sm bg-cobalt px-4 py-3 text-paper sm:max-w-[75%] sm:px-5'

/** A margin note: feedback on the learner's last message. */
export const correctionNote =
  'max-w-[88%] border-s-2 border-terracotta bg-sage-wash px-4 py-3 text-sm leading-relaxed text-ink sm:max-w-[75%]'
