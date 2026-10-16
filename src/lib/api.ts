import type { Level, ScenarioId } from './options.ts'
import { supabase } from './supabase.ts'

/** Calls POST /api/conversations as the signed-in user; returns the new id. */
export async function createConversation(scenario: ScenarioId, level: Level): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Your session has expired. Please log in again.')

  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ scenario, level }),
  })

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : `Request failed (${response.status})`
    throw new Error(message)
  }
  if (!body || typeof body !== 'object' || !('id' in body) || typeof body.id !== 'string') {
    throw new Error('Unexpected response from the server.')
  }
  return body.id
}
