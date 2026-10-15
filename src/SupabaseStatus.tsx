import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase.ts'

type Status =
  | { state: 'checking' }
  | { state: 'connected' }
  | { state: 'error'; message: string }

// Temporary end-to-end check: makes one real request to Supabase's API.
// The table doesn't need to exist; a "table not found" reply still proves
// the URL and key work, while a bad key (401/403) or network failure doesn't.
async function checkConnection(): Promise<Status> {
  const { error, status } = await supabase
    .from('_connection_check')
    .select('*')
    .limit(1)
  if (!error || (status >= 200 && status < 500 && status !== 401 && status !== 403)) {
    return { state: 'connected' }
  }
  return { state: 'error', message: `${status || 'network'}: ${error.message}` }
}

function SupabaseStatus() {
  const [status, setStatus] = useState<Status>({ state: 'checking' })

  useEffect(() => {
    checkConnection().then(setStatus)
  }, [])

  if (status.state === 'checking') return <p>Supabase: checking…</p>
  if (status.state === 'connected') return <p>Supabase: connected ✅</p>
  return <p>Supabase: error ❌ ({status.message})</p>
}

export default SupabaseStatus
