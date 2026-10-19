import { useId, useMemo, useState } from 'react'
import { tokenize, wordKey, type WordTranslation } from '../lib/chat.ts'

type Props = {
  content: string
  translation: string | null
  words: readonly WordTranslation[] | null
  correction?: string | null
}

/**
 * A tutor reply in Hebrew. Hovering (or focusing/tapping) a word shows its
 * English gloss; the full translation stays hidden until the learner asks.
 */
function TutorMessage({ content, translation, words, correction }: Props) {
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
        <p className="mb-2 rounded-lg border border-accent-100 bg-accent-50 px-3 py-2 text-sm text-accent-700">
          <span className="font-semibold">Tip: </span>
          {correction}
        </p>
      )}
      <p lang="he" dir="rtl" className="text-lg whitespace-pre-wrap">
        {tokens.map((token, i) =>
          token.gloss ? (
            <span
              key={i}
              tabIndex={0}
              className="group relative cursor-help rounded decoration-brand-400 decoration-dotted underline-offset-4 outline-none hover:bg-brand-100 hover:underline focus-visible:bg-brand-100 focus-visible:underline"
            >
              {token.text}
              <span
                role="tooltip"
                lang="en"
                dir="ltr"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-max max-w-56 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1 text-center text-sm font-normal text-white shadow-md group-hover:block group-focus:block"
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
            <p id={translationId} className="mt-1 text-sm text-slate-600">
              {translation}
            </p>
          )}
          <button
            type="button"
            aria-expanded={showTranslation}
            aria-controls={showTranslation ? translationId : undefined}
            onClick={() => setShowTranslation((shown) => !shown)}
            className="mt-2 rounded text-xs font-medium text-brand-600 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {showTranslation ? 'Hide Translation' : 'Show Complete Translation'}
          </button>
        </>
      )}
    </>
  )
}

export default TutorMessage
