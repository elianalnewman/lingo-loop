import type { Scenario, ScenarioId } from '../lib/options.ts'

/** How each scene is art-directed: its ground color, readable text on that ground, and card layout. */
export const SCENE_STYLE: Record<
  ScenarioId,
  { folio: string; ground: string; onGround: string; layout: 'cover' | 'framed' | 'type' | 'split' }
> = {
  cafe: { folio: '01', ground: 'bg-terracotta', onGround: 'text-ink', layout: 'cover' },
  market: { folio: '02', ground: 'bg-sage', onGround: 'text-ink', layout: 'framed' },
  making_plans: { folio: '03', ground: 'bg-peach', onGround: 'text-ink', layout: 'type' },
  meeting_someone: { folio: '04', ground: 'bg-cobalt', onGround: 'text-paper', layout: 'split' },
}

/** "Noa, the barista" → { name: "Noa", role: "the barista" }. */
export function splitCharacter(scenario: Scenario) {
  const [name, ...rest] = scenario.character.split(',')
  return { name: name.trim(), role: rest.join(',').trim() }
}
