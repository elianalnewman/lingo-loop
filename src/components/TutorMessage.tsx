import { useId, useMemo, useState } from 'react'
import { tokenize, wordKey, type WordTranslation } from '../lib/chat.ts'
import { correctionNote, eyebrowType, tutorBubble } from './ui.ts'

type Props = {
  content: string
  translation: string | null
  words: readonly WordTranslation[] | null
  correction?: string | null
  /** The character's name, shown above the bubble and on the correction note. */
  speaker?: string
}

/**
 * A tutor reply in Hebrew. Hovering (or focusing/tapping) a word shows its
 * English gloss; the full translation stays hidden until the learner asks.
 * A correction of the learner's previous message sits above it as a margin note.
 */
function TutorMessage({ content, translation, words, correction, speaker }: Props) {
  const [showTranslation, setShowTranslation] = useState(false)
  const translationId = useId()
  const tokens = useMemo(() => {
    const glosses = new Map((words ?? []).map((w) => [wordKey(w.word), w.translation]))
    return tokenize(content).map((token) => ({
      ...token,
      gloss: token.key ? glosses.get(token.key) : undefined,
    }))
  }, [content, words])

  return (
    <>
      {correction && (
        <aside
          aria-label="Correction"
          className={`mb-2 ${correctionNote}`}
        >
          <p className={eyebrowType}>A note from {speaker ?? 'your tutor'}</p>
          <p className="mt-1">{correction}</p>
        </aside>
      )}
      {speaker && <p className={`${eyebrowType} text-ink-soft`}>{speaker}</p>}
      <div className={tutorBubble}>
        <p lang="he" dir="rtl" className="text-xl leading-relaxed whitespace-pre-wrap">
          {tokens.map((token, i) =>
            token.gloss ? (
              <span
                key={i}
                tabIndex={0}
                className="group relative cursor-help rounded-sm decoration-cobalt decoration-dotted decoration-1 underline-offset-[6px] outline-none hover:bg-peach/60 hover:underline focus-visible:bg-peach/60 focus-visible:underline"
              >
                {token.text}
                <span
                  role="tooltip"
                  lang="en"
                  dir="ltr"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-max max-w-56 -translate-x-1/2 rounded-sm bg-ink px-2.5 py-1 text-center font-sans text-sm font-normal text-paper group-hover:block group-focus:block after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-ink"
                >
                  {token.gloss}
                </span>
              </span>
            ) : (
              token.text
            ),
          )}
        </p>
        {translation && (
          <>
            {showTranslation && (
              <p
                id={translationId}
                className="mt-3 border-t border-rule pt-2 font-display text-[0.9375rem] leading-relaxed text-ink-soft italic"
              >
                {translation}
              </p>
            )}
            <button
              type="button"
              aria-expanded={showTranslation}
              aria-controls={showTranslation ? translationId : undefined}
              onClick={() => setShowTranslation((shown) => !shown)}
              className={`mt-2 -mb-1 inline-flex min-h-8 items-center gap-1.5 rounded-sm text-cobalt hover:text-cobalt-deep ${eyebrowType}`}
            >
              {showTranslation ? 'Hide translation' : 'Show translation'}
              <svg
                aria-hidden="true"
                viewBox="0 0 10 10"
                className={`size-2.5 transition-transform ${showTranslation ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m2 3.5 3 3 3-3" />
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default TutorMessage
