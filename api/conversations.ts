// POST /api/conversations: create a conversation for the signed-in user.
// The insert runs with the caller's own JWT, so RLS is enforced on top of the
// checks here. No service-role key is used.
import { createClient } from '@supabase/supabase-js'
// Import with .js: Vercel compiles options.ts to options.js and Node resolves the
// specifier as written at runtime (a .ts specifier crashes the deployed function).
import { isLevel, isScenarioId } from '../src/lib/options.js'

const MAX_BODY_BYTES = 1024
const ALLOWED_KEYS = new Set(['scenario', 'level'])

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export async function POST(request: Request): Promise<Response> {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set')
    return json(500, { error: 'Server is not configured.' })
  }

  // 1. Authenticate.
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

  // 2. Validate input.
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return json(415, { error: 'Content-Type must be application/json.' })
  }
  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return json(413, { error: 'Request body too large.' })

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return json(400, { error: 'Body must be valid JSON.' })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json(400, { error: 'Body must be a JSON object.' })
  }
  const unknownKeys = Object.keys(body).filter((key) => !ALLOWED_KEYS.has(key))
  if (unknownKeys.length > 0) {
    return json(400, { error: `Unexpected field(s): ${unknownKeys.join(', ')}.` })
  }
  const { scenario, level } = body as Record<string, unknown>
  if (!isScenarioId(scenario)) return json(400, { error: 'Unknown scenario.' })
  if (!isLevel(level)) return json(400, { error: 'Unknown level.' })

  // 3. Insert as the user.
  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, scenario, level, language: 'he' })
    .select('id')
    .single()

  if (error) {
    console.error('Failed to create conversation', error)
    return json(500, { error: 'Could not create the conversation.' })
  }
  return json(201, { id: data.id })
}

// Any other method on this path.
function methodNotAllowed() {
  return json(405, { error: 'Method not allowed.' }, { Allow: 'POST' })
}
export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE }
