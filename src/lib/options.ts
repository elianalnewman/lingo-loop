// Shared by the SPA and api/. Values must match the check constraints in
// supabase/migrations/20261016000001_conversations_messages_vocabulary.sql.

export const LEVELS = [
  { value: 'A1', label: 'Beginner', description: 'Greetings, numbers and simple phrases' },
  { value: 'A2', label: 'Elementary', description: 'Everyday exchanges and routines' },
  { value: 'B1', label: 'Intermediate', description: 'Opinions, plans and short stories' },
  { value: 'B2', label: 'Upper intermediate', description: 'Fluid, more nuanced conversation' },
] as const

export type Level = (typeof LEVELS)[number]['value']

export const SCENARIOS = [
  {
    id: 'cafe',
    title: 'At a Café',
    hebrewTitle: 'בבית הקפה',
    description: 'Order a drink, ask about the menu and pay the bill.',
    character: 'Noa, the barista',
    greeting: 'שלום! ברוכים הבאים לבית הקפה. מה תרצו להזמין?',
    greetingTranslation: 'Hi! Welcome to the café. What would you like to order?',
    greetingWords: [
      { word: 'שלום', translation: 'hello' },
      { word: 'ברוכים', translation: 'welcome (lit. blessed)' },
      { word: 'הבאים', translation: 'those who come' },
      { word: 'לבית', translation: 'to the house of' },
      { word: 'הקפה', translation: 'the coffee (בית קפה = café)' },
      { word: 'מה', translation: 'what' },
      { word: 'תרצו', translation: 'would you (pl.) like' },
      { word: 'להזמין', translation: 'to order' },
    ],
  },
  {
    id: 'market',
    title: 'At the Market',
    hebrewTitle: 'בשוק',
    description: 'Ask for prices, compare produce and bargain a little.',
    character: 'Avi, the fruit vendor',
    greeting: 'בוקר טוב! יש לנו עגבניות טריות היום. מה אתם מחפשים?',
    greetingTranslation: 'Good morning! We have fresh tomatoes today. What are you looking for?',
    greetingWords: [
      { word: 'בוקר', translation: 'morning' },
      { word: 'טוב', translation: 'good' },
      { word: 'יש', translation: 'there is (יש לנו = we have)' },
      { word: 'לנו', translation: 'to us' },
      { word: 'עגבניות', translation: 'tomatoes' },
      { word: 'טריות', translation: 'fresh' },
      { word: 'היום', translation: 'today' },
      { word: 'מה', translation: 'what' },
      { word: 'אתם', translation: 'you (pl.)' },
      { word: 'מחפשים', translation: 'looking for' },
    ],
  },
  {
    id: 'making_plans',
    title: 'Making Plans with Friends',
    hebrewTitle: 'קובעים תוכניות עם חברים',
    description: 'Suggest an outing, agree on a time and pick a place.',
    character: 'Maya, your friend',
    greeting: 'היי! מה אתם עושים בסוף השבוע?',
    greetingTranslation: 'Hey! What are you doing this weekend?',
    greetingWords: [
      { word: 'היי', translation: 'hey' },
      { word: 'מה', translation: 'what' },
      { word: 'אתם', translation: 'you (pl.)' },
      { word: 'עושים', translation: 'doing' },
      { word: 'בסוף', translation: 'at the end of' },
      { word: 'השבוע', translation: 'the week (סוף השבוע = weekend)' },
    ],
  },
  {
    id: 'meeting_someone',
    title: 'Meeting Someone New',
    hebrewTitle: 'פוגשים מישהו חדש',
    description: 'Introduce yourself, ask where they are from and make small talk.',
    character: 'Daniel, a new acquaintance',
    greeting: 'נעים מאוד! איך קוראים לך?',
    greetingTranslation: 'Nice to meet you! What is your name?',
    greetingWords: [
      { word: 'נעים', translation: 'pleasant (נעים מאוד = nice to meet you)' },
      { word: 'מאוד', translation: 'very' },
      { word: 'איך', translation: 'how' },
      { word: 'קוראים', translation: '(they) call (איך קוראים לך = what is your name)' },
      { word: 'לך', translation: 'you' },
    ],
  },
] as const

export type Scenario = (typeof SCENARIOS)[number]
export type ScenarioId = Scenario['id']

export function isLevel(value: unknown): value is Level {
  return LEVELS.some((level) => level.value === value)
}

export function isScenarioId(value: unknown): value is ScenarioId {
  return SCENARIOS.some((scenario) => scenario.id === value)
}

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id)
}

export function getLevel(value: string) {
  return LEVELS.find((level) => level.value === value)
}
