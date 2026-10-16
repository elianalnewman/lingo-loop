// Runs the pgTAP RLS tests against the linked Supabase project through the
// Management API (no Docker). The test file rolls itself back.
// Usage: npm run test:db [-- path/to/test.sql]
import { execFileSync } from 'node:child_process'

const file = process.argv[2] ?? 'supabase/tests/database/rls.test.sql'

let output
try {
  output = execFileSync('npx', ['supabase', 'db', 'query', '--linked', '-f', file], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })
} catch (error) {
  console.error(error.stdout ?? error.message)
  process.exit(1)
}

const result = JSON.parse(output.slice(output.indexOf('{')))
if (!Array.isArray(result.rows)) {
  console.error(output)
  process.exit(1)
}

const lines = result.rows.map((row) => String(row.line))
for (const line of lines) console.log(line)

const failed = lines.filter((line) => line.startsWith('not ok')).length
const passed = lines.filter((line) => line.startsWith('ok')).length
const planProblem = lines.some((line) => line.startsWith('# Looks like'))
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 || planProblem || passed === 0 ? 1 : 0)
