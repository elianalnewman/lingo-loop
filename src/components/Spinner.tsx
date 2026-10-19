type Props = { label?: string; className?: string }

function Spinner({ label = 'Loading', className = '' }: Props) {
  return (
    <span role="status" className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-rule border-t-cobalt"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function FullPageSpinner() {
  return (
    <div className="grid min-h-svh place-items-center">
      <Spinner />
    </div>
  )
}

export default Spinner
