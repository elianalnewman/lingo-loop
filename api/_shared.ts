// Helpers shared by the api/ handlers. Vercel does not deploy files whose name
// starts with an underscore as functions.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export function methodNotAllowed() {
  return json(405, { error: 'Method not allowed.' }, { Allow: 'POST' })
}

/**
 * Verifies the bearer token and returns a Supabase client that acts as the
 * user, so RLS applies to everything it does. Returns a Response on failure.
 */
export async function authenticate(
  request: Request,
): Promise<{ supabase: SupabaseClient; userId: string } | Response> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set')
    return json(500, { error: 'Server is not configured.' })
  }

  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1]
  if (!token) return json(401, { error: 'Missing bearer token.' })

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
  const userId = claimsData?.claims.sub
  if (claimsError || !userId || claimsData.claims.role !== 'authenticated') {
    return json(401, { error: 'Invalid or expired session.' })
  }
  return { supabase, userId }
}

/** Reads a small JSON object body that may only contain `allowedKeys`. */
export async function readJsonObject(
  request: Request,
  maxBytes: number,
  allowedKeys: ReadonlySet<string>,
): Promise<Record<string, unknown> | Response> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return json(415, { error: 'Content-Type must be application/json.' })
  }
  const raw = await request.text()
  if (new TextEncoder().encode(raw).length > maxBytes) {
    return json(413, { error: 'Request body too large.' })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'Body must be valid JSON.' })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json(400, { error: 'Body must be a JSON object.' })
  }
  const unknownKeys = Object.keys(body).filter((key) => !allowedKeys.has(key))
  if (unknownKeys.length > 0) {
    return json(400, { error: `Unexpected field(s): ${unknownKeys.join(', ')}.` })
  }
  return body as Record<string, unknown>
}
