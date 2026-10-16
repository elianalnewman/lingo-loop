// Shared class strings so buttons and inputs look the same everywhere.

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

export const buttonPrimary = `inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none ${focus}`

export const buttonSecondary = `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 ${focus}`

export const buttonGhost = `inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 ${focus}`

export const input = `block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100 focus:outline-none`

export const card = 'rounded-[var(--radius-card)] border border-slate-200 bg-white shadow-sm'

export const alertError = 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
