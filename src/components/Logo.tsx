import { Link } from 'react-router'

function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex min-h-11 items-center gap-2.5 rounded-sm text-ink">
      <span aria-hidden="true" className="grid size-8 place-items-center rounded-sm bg-cobalt text-paper">
        <span lang="he" className="text-lg leading-none font-medium">
          ל
        </span>
      </span>
      <span className="font-display text-xl tracking-tight">LingoLoop</span>
    </Link>
  )
}

export default Logo
