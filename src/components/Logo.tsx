import { Link } from 'react-router'

function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-sm font-bold text-white"
      >
        <span lang="he">ל</span>
      </span>
      LingoLoop
    </Link>
  )
}

export default Logo
