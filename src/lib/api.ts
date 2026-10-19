import type { ChatMessage } from './chat.ts'
import type { Level, ScenarioId } from './options.ts'
import { supabase } from './supabase.ts'

/** POSTs JSON to an api/ route as the signed-in user and returns the parsed body. */
async function postJson(path: string, payload: unknown): Promise<Record<string, unknown>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error('Your session has expired. Please log in again.')

  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }

  const body: unknown = await response.json().catch(() => null)
  // Vite alone (npm run dev) doesn't serve api/, so every route 404s with no JSON body.
  if (import.meta.env.DEV && response.status === 404 && body === null) {
    throw new Error('API routes are not running. Start the app with `npx vercel dev` instead of `npm run dev`.')
  }
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : `Request failed (${response.status})`
    throw new Error(message)
  }
  if (!body || typeof body !== 'object') throw new Error('Unexpected response from the server.')
  return body as Record<string, unknown>
}

/** Calls POST /api/conversations as the signed-in user; returns the new id. */
export async function createConversation(scenario: ScenarioId, level: Level): Promise<string> {
  const body = await postJson('/api/conversations', { scenario, level })
  if (typeof body.id !== 'string') throw new Error('Unexpected response from the server.')
  return body.id
}

/** Calls POST /api/chat; returns the stored learner message and the tutor's reply. */
export async function sendChatMessage(
  conversationId: string,
  content: string,
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  const body = await postJson('/api/chat', { conversationId, content })
  const isMessage = (m: unknown): m is ChatMessage =>
    !!m && typeof m === 'object' && 'id' in m && 'content' in m && typeof m.content === 'string'
  if (!isMessage(body.userMessage) || !isMessage(body.assistantMessage)) {
    throw new Error('Unexpected response from the server.')
  }
  return { userMessage: body.userMessage, assistantMessage: body.assistantMessage }
}
