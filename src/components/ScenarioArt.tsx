import type { JSX } from 'react'
import type { ScenarioId } from '../lib/options.ts'

// Flat, print-like compositions drawn for each scene (original artwork, no external assets).
// Drawn on a 400×300 canvas and cropped with "slice", so one drawing fills any frame.

const TILES = Array.from({ length: 20 }, (_, i) => ({ x: (i % 10) * 40, y: 232 + Math.floor(i / 10) * 40 }))

function Cafe() {
  return (
    <>
      <rect width="400" height="300" className="fill-terracotta" />
      <circle cx="334" cy="64" r="30" className="fill-peach" />
      <path d="M120 232V128a80 80 0 0 1 160 0v104Z" className="fill-paper" />
      <path d="M136 232V130a64 64 0 0 1 128 0v102" fill="none" strokeWidth="1.5" className="stroke-ink" />
      {TILES.map(({ x, y }) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="40" height="40" strokeWidth="1.5" className="fill-cobalt stroke-paper" />
          <path d={`M${x + 20} ${y + 6}l14 14-14 14-14-14Z`} fill="none" strokeWidth="1.5" className="stroke-paper" />
          <circle cx={x + 20} cy={y + 20} r="3" className="fill-terracotta" />
        </g>
      ))}
      <path d="M179.1 192h41.8l-2.8 38h-36.2Z" className="fill-terracotta-deep" />
      <path d="M177.3 168h45.4l-1.8 24h-41.8Z" className="fill-peach" />
      <path d="M184 158l4 66" strokeWidth="2" strokeLinecap="round" className="stroke-cobalt" opacity=".5" />
      <path d="M176 150h48l-6 82h-36Z" fill="none" strokeWidth="2.5" strokeLinejoin="round" className="stroke-ink" />
      <rect x="236" y="214" width="18" height="18" strokeWidth="1.5" className="fill-paper stroke-ink" />
      <path
        d="M192 140c-10-12 10-20 0-34m16 30c-10-12 10-20 0-34"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-ink"
      />
    </>
  )
}

const STRIPES = Array.from({ length: 8 }, (_, i) => ({ x: i * 50, fill: i % 2 ? 'fill-paper' : 'fill-terracotta' }))

function Market() {
  return (
    <>
      <rect width="400" height="300" className="fill-sage" />
      {STRIPES.map(({ x, fill }) => (
        <g key={x} className={fill}>
          <rect x={x} y="0" width="50" height="70" />
          <path d={`M${x} 70a25 25 0 0 0 50 0Z`} />
        </g>
      ))}
      <path d="M330 82v28" strokeWidth="1.5" className="stroke-ink" />
      <rect x="300" y="110" width="60" height="36" rx="2" strokeWidth="1.5" className="fill-paper stroke-ink" />
      <text x="330" y="134" textAnchor="middle" fontSize="18" fontFamily="DM Sans, sans-serif" className="fill-ink">
        ₪ 8
      </text>
      <circle cx="120" cy="170" r="24" className="fill-terracotta" />
      <circle cx="95" cy="196" r="24" className="fill-terracotta" />
      <circle cx="145" cy="196" r="24" className="fill-terracotta" />
      <circle cx="278" cy="174" r="20" className="fill-cobalt" />
      <circle cx="256" cy="198" r="20" className="fill-cobalt" />
      <circle cx="300" cy="198" r="20" className="fill-cobalt" />
      <path
        d="M120 146v-7m-25 33v-7m50 7v-7M278 154v-6m-22 30v-6m44 6v-6"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-ink"
      />
      <rect x="60" y="210" width="280" height="90" strokeWidth="2" className="fill-peach stroke-ink" />
      <path d="M60 240h280M60 270h280M200 210v90" strokeWidth="1.5" className="stroke-ink" />
    </>
  )
}

const WAVES = [
  [40, 222],
  [260, 236],
  [110, 258],
  [300, 276],
  [30, 286],
] as const

function MakingPlans() {
  return (
    <>
      <rect width="400" height="300" className="fill-peach" />
      <circle cx="230" cy="196" r="78" className="fill-terracotta" />
      <rect y="196" width="400" height="104" className="fill-cobalt" />
      {WAVES.map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y}q15-8 30 0t30 0`}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-paper"
          opacity=".7"
        />
      ))}
      <path d="M90 196V96a35 35 0 0 1 70 0v100Z" strokeWidth="2" className="fill-paper-deep stroke-ink" />
      <path d="M90 96h70" strokeWidth="2" className="stroke-ink" />
      <path d="M115 196v-46a10 10 0 0 1 20 0v46" strokeWidth="2" className="fill-cobalt stroke-ink" />
      <circle cx="125" cy="122" r="9" strokeWidth="1.5" className="fill-paper stroke-ink" />
      <path d="M125 122v-5m0 5h4" strokeWidth="1.5" strokeLinecap="round" className="stroke-ink" />
      <path d="M100 52q6-6 12 0q6-6 12 0m14-14q5-5 10 0q5-5 10 0" fill="none" strokeWidth="1.5" className="stroke-ink" />
      <g transform="translate(-58 -20) rotate(-8 308 106)">
        <rect x="248" y="78" width="120" height="56" rx="3" strokeWidth="1.5" className="fill-paper stroke-ink" />
        <path d="M290 82v48" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-ink" />
        <text x="269" y="111" textAnchor="middle" fontSize="12" fontFamily="DM Sans, sans-serif" className="fill-ink">
          No.7
        </text>
        <text x="330" y="104" textAnchor="middle" fontSize="17" fontFamily="Heebo, sans-serif" className="fill-ink">
          שבת
        </text>
        <text x="330" y="124" textAnchor="middle" fontSize="13" fontFamily="DM Sans, sans-serif" className="fill-ink">
          20:00
        </text>
      </g>
    </>
  )
}

function MeetingSomeone() {
  return (
    <>
      <rect width="400" height="300" className="fill-cobalt" />
      <circle cx="200" cy="160" r="122" fill="none" strokeWidth="1" className="stroke-paper" opacity=".35" />
      <circle cx="150" cy="128" r="30" className="fill-peach" />
      <path d="M95 300v-70a55 55 0 0 1 110 0v70Z" className="fill-peach" />
      <g strokeWidth="6" className="fill-terracotta stroke-cobalt">
        <circle cx="252" cy="118" r="32" />
        <path d="M192 306v-80a60 60 0 0 1 120 0v80Z" />
      </g>
      <path d="M170 40h68a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4h-40l-14 12 2-12h-16a4 4 0 0 1-4-4V44a4 4 0 0 1 4-4Z" className="fill-paper" />
      <text x="204" y="68" textAnchor="middle" fontSize="20" fontWeight="500" fontFamily="Heebo, sans-serif" className="fill-cobalt">
        שלום
      </text>
    </>
  )
}

const ART: Record<ScenarioId, () => JSX.Element> = {
  cafe: Cafe,
  market: Market,
  making_plans: MakingPlans,
  meeting_someone: MeetingSomeone,
}

function ScenarioArt({ id, className = '' }: { id: ScenarioId; className?: string }) {
  const Art = ART[id]
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`block ${className}`}
    >
      <Art />
    </svg>
  )
}

export default ScenarioArt
