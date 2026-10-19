// Chat types and limits shared by the SPA and api/chat.ts.

/** Longest learner message accepted, in characters. */
export const MAX_MESSAGE_CHARS = 500

/** English meaning of one Hebrew word, in the context of its sentence. */
export type WordTranslation = { word: string; translation: string }

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  translation: string | null
  /** On assistant rows: feedback on the learner message just before it. */
  correction: string | null
  /** On assistant rows: a gloss for each word of content. Null on older rows. */
  word_translations: WordTranslation[] | null
  created_at: string
}

/** Lookup key for a word: no surrounding punctuation or niqqud. */
export function wordKey(word: string): string {
  return word
    .normalize('NFC')
    .replace(/\p{M}/gu, '')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
}

export type TextToken = { text: string; key: string | null }

/** Splits text into word tokens (with a lookup key) and the spaces/punctuation between them. */
export function tokenize(text: string): TextToken[] {
  const tokens: TextToken[] = []
  for (const chunk of text.split(/(\s+)/)) {
    if (!chunk) continue
    const match = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/su.exec(chunk)
    const [, lead = '', core = '', trail = ''] = match ?? []
    if (!core) {
      tokens.push({ text: chunk, key: null })
      continue
    }
    if (lead) tokens.push({ text: lead, key: null })
    tokens.push({ text: core, key: wordKey(core) })
    if (trail) tokens.push({ text: trail, key: null })
  }
  return tokens
}

/** Trims a draft and returns it, or an error message if it can't be sent. */
export function validateMessage(value: unknown): { content: string } | { error: string } {
  if (typeof value !== 'string') return { error: 'Message must be text.' }
  const content = value.trim()
  if (content.length === 0) return { error: 'Write a message first.' }
  if (content.length > MAX_MESSAGE_CHARS) {
    return { error: `Messages can be at most ${MAX_MESSAGE_CHARS} characters.` }
  }
  return { content }
}
