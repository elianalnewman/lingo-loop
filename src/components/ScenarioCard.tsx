import type { Scenario } from '../lib/options.ts'
import ScenarioArt from './ScenarioArt.tsx'
import { SCENE_STYLE, splitCharacter } from './scenes.ts'

type Props = {
  scenario: Scenario
  checked: boolean
  onSelect: () => void
}

/** Folio number in the corner; becomes an ink stamp once the scene is chosen. */
function Marker({ folio, checked }: { folio: string; checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute end-3 top-3 z-10 inline-flex items-center gap-1.5 px-2 py-1 text-[0.6875rem] font-medium tracking-[0.18em] uppercase ${
        checked ? '-rotate-2 bg-ink text-paper' : 'bg-paper text-ink'
      }`}
    >
      {checked ? (
        <>
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="m2 6.5 2.5 2.5L10 3" />
          </svg>
          Selected
        </>
      ) : (
        `No. ${folio}`
      )}
    </span>
  )
}

/** One option in the dashboard's scenario radio group, art-directed per scene. */
function ScenarioCard({ scenario, checked, onSelect }: Props) {
  const style = SCENE_STYLE[scenario.id]
  const { name, role } = splitCharacter(scenario)
  const onPaper = style.layout === 'cover'
  const muted = onPaper ? 'text-ink-soft' : style.onGround

  const title = <h3 className="text-display-sm font-normal tracking-tight">{scenario.title}</h3>
  const hebrew = (size: string) => (
    <p lang="he" dir="rtl" className={`font-medium ${size}`}>
      {scenario.hebrewTitle}
    </p>
  )
  const details = (
    <>
      <p className={`text-[0.9375rem] leading-relaxed ${muted}`}>{scenario.description}</p>
      <p className={`mt-auto border-t pt-3 text-sm ${onPaper ? 'border-rule' : 'border-current/25'} ${muted}`}>
        Your host: <span className="font-medium">{name}</span>, {role}
      </p>
    </>
  )

  let body
  switch (style.layout) {
    case 'cover':
      body = (
        <>
          <ScenarioArt id={scenario.id} className="aspect-16/8 w-full" />
          <div className="flex flex-1 flex-col gap-3 p-5 @md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              {title}
              {hebrew('text-2xl text-terracotta-deep')}
            </div>
            {details}
          </div>
        </>
      )
      break
    case 'framed':
      body = (
        <div className="flex flex-1 flex-col gap-3 p-5 @md:p-6">
          <ScenarioArt id={scenario.id} className="aspect-4/3 w-full border border-ink" />
          {hebrew('mt-2 text-3xl')}
          {title}
          {details}
        </div>
      )
      break
    case 'type':
      body = (
        <div className="flex flex-1 flex-col gap-3 p-5 @md:p-6">
          <div className="flex items-end justify-between gap-4 pt-8">
            <ScenarioArt id={scenario.id} className="size-24 shrink-0 rounded-full border border-ink @md:size-28" />
            {hebrew('text-end text-4xl leading-[1.05] text-balance @md:text-5xl')}
          </div>
          <div className="mt-2">{title}</div>
          {details}
        </div>
      )
      break
    case 'split':
      body = (
        <div className="flex flex-1 flex-col @md:flex-row">
          <ScenarioArt
            id={scenario.id}
            className="aspect-video w-full border-b border-paper/30 @md:aspect-auto @md:w-[45%] @md:border-e @md:border-b-0"
          />
          <div className="flex flex-1 flex-col gap-3 p-5 @md:p-6 @md:pt-12">
            {hebrew('text-3xl')}
            {title}
            {details}
          </div>
        </div>
      )
      break
  }

  return (
    <label
      className={`@container relative flex h-full cursor-pointer flex-col overflow-hidden rounded-card border has-focus-visible:outline-2 has-focus-visible:outline-offset-8 has-focus-visible:outline-cobalt ${
        onPaper ? 'bg-paper' : style.ground
      } ${style.onGround} ${
        checked
          ? 'border-ink ring-2 ring-ink ring-offset-4 ring-offset-paper'
          : `${onPaper ? 'border-rule' : 'border-transparent'} hover:border-ink`
      }`}
    >
      <input
        type="radio"
        name="scenario"
        value={scenario.id}
        checked={checked}
        onChange={onSelect}
        className="sr-only"
      />
      <Marker folio={style.folio} checked={checked} />
      {body}
    </label>
  )
}

export default ScenarioCard
