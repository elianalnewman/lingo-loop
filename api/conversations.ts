// POST /api/conversations: create a conversation for the signed-in user.
// The insert runs with the caller's own JWT, so RLS is enforced on top of the
// checks here. No service-role key is used.
// Import with .js: Vercel compiles .ts to .js and Node resolves the specifier
// as written at runtime (a .ts specifier crashes the deployed function).
import { isLevel, isScenarioId } from '../src/lib/options.js'
import { authenticate, json, methodNotAllowed, readJsonObject } from './_shared.js'

const MAX_BODY_BYTES = 1024
const ALLOWED_KEYS = new Set(['scenario', 'level'])

export async function POST(request: Request): Promise<Response> {
  // 1. Authenticate.
  const auth = await authenticate(request)
  if (auth instanceof Response) return auth
  const { supabase, userId } = auth

  // 2. Validate input.
  const body = await readJsonObject(request, MAX_BODY_BYTES, ALLOWED_KEYS)
  if (body instanceof Response) return body
  const { scenario, level } = body
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
export { methodNotAllowed as GET, methodNotAllowed as PUT, methodNotAllowed as PATCH, methodNotAllowed as DELETE }
