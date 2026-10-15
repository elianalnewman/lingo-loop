// Values must match the check constraint on profiles.hebrew_level.
export const HEBREW_LEVELS = [
  { value: 'complete_beginner', label: 'Complete beginner' },
  { value: 'knows_aleph_bet', label: 'I know the aleph bet' },
  { value: 'basic_words_and_sentences', label: 'I know basic words and how to form a sentence' },
  { value: 'basic_conversations', label: 'I can hold basic conversations' },
  { value: 'fluent', label: 'Fluent' },
] as const

export type HebrewLevel = (typeof HEBREW_LEVELS)[number]['value']
