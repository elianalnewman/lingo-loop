// Shared by the SPA and api/. Values must match the check constraints in
// supabase/migrations/20261016000001_conversations_messages_vocabulary.sql.

export const LEVELS = [
  { value: 'A1', label: 'Beginner', description: 'Greetings, numbers and simple phrases' },
  { value: 'A2', label: 'Elementary', description: 'Everyday exchanges and routines' },
  { value: 'B1', label: 'Intermediate', description: 'Opinions, plans and short stories' },
  { value: 'B2', label: 'Upper intermediate', description: 'Fluid, more nuanced conversation' },
] as const

export type Level = (typeof LEVELS)[number]['value']

// Each scenario opens with a scripted greeting pitched at the learner's level.
// The tutor sees it as its own first turn, so it sets the register for the chat.
export const SCENARIOS = [
  {
    id: 'cafe',
    title: 'At a Café',
    hebrewTitle: 'בבית הקפה',
    description: 'Order a drink, ask about the menu and pay the bill.',
    character: 'Noa, the barista',
    greetings: {
      A1: {
        text: 'שלום! מה אתם רוצים?',
        translation: 'Hi! What do you want?',
        words: [
          { word: 'שלום', translation: 'hello' },
          { word: 'מה', translation: 'what' },
          { word: 'אתם', translation: 'you (pl.)' },
          { word: 'רוצים', translation: 'want' },
        ],
      },
      A2: {
        text: 'שלום! ברוכים הבאים לבית הקפה. מה תרצו להזמין?',
        translation: 'Hi! Welcome to the café. What would you like to order?',
        words: [
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
      B1: {
        text: 'בוקר טוב וברוכים הבאים! היום יש לנו עוגת גבינה טרייה. מה תרצו לשתות?',
        translation: 'Good morning and welcome! Today we have fresh cheesecake. What would you like to drink?',
        words: [
          { word: 'בוקר', translation: 'morning' },
          { word: 'טוב', translation: 'good' },
          { word: 'וברוכים', translation: 'and welcome (lit. blessed)' },
          { word: 'הבאים', translation: 'those who come' },
          { word: 'היום', translation: 'today' },
          { word: 'יש', translation: 'there is (יש לנו = we have)' },
          { word: 'לנו', translation: 'to us' },
          { word: 'עוגת', translation: 'cake of' },
          { word: 'גבינה', translation: 'cheese (עוגת גבינה = cheesecake)' },
          { word: 'טרייה', translation: 'fresh' },
          { word: 'מה', translation: 'what' },
          { word: 'תרצו', translation: 'would you (pl.) like' },
          { word: 'לשתות', translation: 'to drink' },
        ],
      },
      B2: {
        text: 'ערב טוב! אם זו הפעם הראשונה שלכם אצלנו, אני ממליצה על הקפה הקר שלנו. מה בא לכם?',
        translation: "Good evening! If it's your first time here, I recommend our iced coffee. What do you feel like?",
        words: [
          { word: 'ערב', translation: 'evening' },
          { word: 'טוב', translation: 'good' },
          { word: 'אם', translation: 'if' },
          { word: 'זו', translation: 'this (f.)' },
          { word: 'הפעם', translation: 'the time' },
          { word: 'הראשונה', translation: 'the first' },
          { word: 'שלכם', translation: 'yours (pl.)' },
          { word: 'אצלנו', translation: 'at our place' },
          { word: 'אני', translation: 'I' },
          { word: 'ממליצה', translation: 'recommend (f.)' },
          { word: 'על', translation: 'on (ממליצה על = recommend)' },
          { word: 'הקפה', translation: 'the coffee' },
          { word: 'הקר', translation: 'the cold (קפה קר = iced coffee)' },
          { word: 'שלנו', translation: 'our' },
          { word: 'מה', translation: 'what' },
          { word: 'בא', translation: 'comes (בא לכם = you feel like)' },
          { word: 'לכם', translation: 'to you (pl.)' },
        ],
      },
    },
  },
  {
    id: 'market',
    title: 'At the Market',
    hebrewTitle: 'בשוק',
    description: 'Ask for prices, compare produce and bargain a little.',
    character: 'Avi, the fruit vendor',
    greetings: {
      A1: {
        text: 'שלום! יש עגבניות ומלפפונים. מה אתם רוצים?',
        translation: 'Hello! There are tomatoes and cucumbers. What do you want?',
        words: [
          { word: 'שלום', translation: 'hello' },
          { word: 'יש', translation: 'there is / there are' },
          { word: 'עגבניות', translation: 'tomatoes' },
          { word: 'ומלפפונים', translation: 'and cucumbers' },
          { word: 'מה', translation: 'what' },
          { word: 'אתם', translation: 'you (pl.)' },
          { word: 'רוצים', translation: 'want' },
        ],
      },
      A2: {
        text: 'בוקר טוב! יש לנו עגבניות טריות היום. מה אתם מחפשים?',
        translation: 'Good morning! We have fresh tomatoes today. What are you looking for?',
        words: [
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
      B1: {
        text: 'בוקר טוב! תראו איזה עגבניות טריות הגיעו הבוקר. במה אני יכול לעזור לכם?',
        translation: 'Good morning! Look at the fresh tomatoes that came in this morning. How can I help you?',
        words: [
          { word: 'בוקר', translation: 'morning' },
          { word: 'טוב', translation: 'good' },
          { word: 'תראו', translation: 'look (pl.)' },
          { word: 'איזה', translation: 'what (a) / such' },
          { word: 'עגבניות', translation: 'tomatoes' },
          { word: 'טריות', translation: 'fresh' },
          { word: 'הגיעו', translation: 'arrived' },
          { word: 'הבוקר', translation: 'this morning' },
          { word: 'במה', translation: 'with what (במה אני יכול לעזור = how can I help)' },
          { word: 'אני', translation: 'I' },
          { word: 'יכול', translation: 'can (m.)' },
          { word: 'לעזור', translation: 'to help' },
          { word: 'לכם', translation: 'you (pl.)' },
        ],
      },
      B2: {
        text: 'בוקר טוב, בוקר טוב! הכול פה נקטף אתמול, אין מה להשוות לסופר. מה בא לכם היום?',
        translation: "Good morning, good morning! Everything here was picked yesterday, there's no comparing it to the supermarket. What do you feel like today?",
        words: [
          { word: 'בוקר', translation: 'morning' },
          { word: 'טוב', translation: 'good' },
          { word: 'הכול', translation: 'everything' },
          { word: 'פה', translation: 'here' },
          { word: 'נקטף', translation: 'was picked' },
          { word: 'אתמול', translation: 'yesterday' },
          { word: 'אין', translation: "there isn't (אין מה = there's no point)" },
          { word: 'מה', translation: 'what' },
          { word: 'להשוות', translation: 'to compare' },
          { word: 'לסופר', translation: 'to the supermarket' },
          { word: 'בא', translation: 'comes (בא לכם = you feel like)' },
          { word: 'לכם', translation: 'to you (pl.)' },
          { word: 'היום', translation: 'today' },
        ],
      },
    },
  },
  {
    id: 'making_plans',
    title: 'Making Plans with Friends',
    hebrewTitle: 'קובעים תוכניות עם חברים',
    description: 'Suggest an outing, agree on a time and pick a place.',
    character: 'Maya, your friend',
    greetings: {
      A1: {
        text: 'היי! מה אתם עושים בשבת?',
        translation: 'Hey! What are you doing on Saturday?',
        words: [
          { word: 'היי', translation: 'hey' },
          { word: 'מה', translation: 'what' },
          { word: 'אתם', translation: 'you (pl.)' },
          { word: 'עושים', translation: 'doing' },
          { word: 'בשבת', translation: 'on Saturday (Shabbat)' },
        ],
      },
      A2: {
        text: 'היי! מה אתם עושים בסוף השבוע?',
        translation: 'Hey! What are you doing this weekend?',
        words: [
          { word: 'היי', translation: 'hey' },
          { word: 'מה', translation: 'what' },
          { word: 'אתם', translation: 'you (pl.)' },
          { word: 'עושים', translation: 'doing' },
          { word: 'בסוף', translation: 'at the end of' },
          { word: 'השבוע', translation: 'the week (סוף השבוע = weekend)' },
        ],
      },
      B1: {
        text: 'היי! חשבתי שאולי נצא ביחד בסוף השבוע. יש לכם רעיון לאן ללכת?',
        translation: 'Hey! I was thinking maybe we could go out together this weekend. Do you have an idea where to go?',
        words: [
          { word: 'היי', translation: 'hey' },
          { word: 'חשבתי', translation: 'I thought' },
          { word: 'שאולי', translation: 'that maybe' },
          { word: 'נצא', translation: "we'll go out" },
          { word: 'ביחד', translation: 'together' },
          { word: 'בסוף', translation: 'at the end of' },
          { word: 'השבוע', translation: 'the week (סוף השבוע = weekend)' },
          { word: 'יש', translation: 'there is (יש לכם = do you have)' },
          { word: 'לכם', translation: 'to you (pl.)' },
          { word: 'רעיון', translation: 'idea' },
          { word: 'לאן', translation: 'where to' },
          { word: 'ללכת', translation: 'to go' },
        ],
      },
      B2: {
        text: 'היי! סוף סוף נגמר השבוע המטורף הזה. בא לי לעשות משהו כיף בשבת, אולי טיול בצפון. מה דעתכם?',
        translation: 'Hey! This crazy week is finally over. I feel like doing something fun on Saturday, maybe a trip up north. What do you think?',
        words: [
          { word: 'היי', translation: 'hey' },
          { word: 'סוף', translation: 'end (סוף סוף = finally)' },
          { word: 'נגמר', translation: 'is over' },
          { word: 'השבוע', translation: 'the week' },
          { word: 'המטורף', translation: 'the crazy' },
          { word: 'הזה', translation: 'this' },
          { word: 'בא', translation: 'comes (בא לי = I feel like)' },
          { word: 'לי', translation: 'to me' },
          { word: 'לעשות', translation: 'to do' },
          { word: 'משהו', translation: 'something' },
          { word: 'כיף', translation: 'fun' },
          { word: 'בשבת', translation: 'on Saturday (Shabbat)' },
          { word: 'אולי', translation: 'maybe' },
          { word: 'טיול', translation: 'trip, hike' },
          { word: 'בצפון', translation: 'in the north' },
          { word: 'מה', translation: 'what' },
          { word: 'דעתכם', translation: 'your (pl.) opinion (מה דעתכם = what do you think)' },
        ],
      },
    },
  },
  {
    id: 'meeting_someone',
    title: 'Meeting Someone New',
    hebrewTitle: 'פוגשים מישהו חדש',
    description: 'Introduce yourself, ask where they are from and make small talk.',
    character: 'Daniel, a new acquaintance',
    greetings: {
      A1: {
        text: 'שלום! אני דניאל. מה השם שלך?',
        translation: "Hi! I'm Daniel. What's your name?",
        words: [
          { word: 'שלום', translation: 'hello' },
          { word: 'אני', translation: 'I (am)' },
          { word: 'דניאל', translation: 'Daniel' },
          { word: 'מה', translation: 'what' },
          { word: 'השם', translation: 'the name' },
          { word: 'שלך', translation: 'yours' },
        ],
      },
      A2: {
        text: 'נעים מאוד! איך קוראים לך?',
        translation: 'Nice to meet you! What is your name?',
        words: [
          { word: 'נעים', translation: 'pleasant (נעים מאוד = nice to meet you)' },
          { word: 'מאוד', translation: 'very' },
          { word: 'איך', translation: 'how' },
          { word: 'קוראים', translation: '(they) call (איך קוראים לך = what is your name)' },
          { word: 'לך', translation: 'you' },
        ],
      },
      B1: {
        text: 'היי, נעים מאוד! אני דניאל, אני גר כאן בשכונה. איך קוראים לך, ומאיפה הגעת?',
        translation: "Hi, nice to meet you! I'm Daniel, I live here in the neighborhood. What's your name, and where are you from?",
        words: [
          { word: 'היי', translation: 'hi' },
          { word: 'נעים', translation: 'pleasant (נעים מאוד = nice to meet you)' },
          { word: 'מאוד', translation: 'very' },
          { word: 'אני', translation: 'I' },
          { word: 'דניאל', translation: 'Daniel' },
          { word: 'גר', translation: 'live (m.)' },
          { word: 'כאן', translation: 'here' },
          { word: 'בשכונה', translation: 'in the neighborhood' },
          { word: 'איך', translation: 'how' },
          { word: 'קוראים', translation: '(they) call (איך קוראים לך = what is your name)' },
          { word: 'לך', translation: 'you' },
          { word: 'ומאיפה', translation: 'and from where' },
          { word: 'הגעת', translation: 'did you come' },
        ],
      },
      B2: {
        text: 'נעים מאוד, אני דניאל! נדמה לי שכבר ראיתי אותך פה בעבר. מה מביא אותך לשכונה?',
        translation: "Nice to meet you, I'm Daniel! I think I've seen you here before. What brings you to the neighborhood?",
        words: [
          { word: 'נעים', translation: 'pleasant (נעים מאוד = nice to meet you)' },
          { word: 'מאוד', translation: 'very' },
          { word: 'אני', translation: 'I (am)' },
          { word: 'דניאל', translation: 'Daniel' },
          { word: 'נדמה', translation: 'it seems (נדמה לי = I think)' },
          { word: 'לי', translation: 'to me' },
          { word: 'שכבר', translation: 'that already' },
          { word: 'ראיתי', translation: 'I saw' },
          { word: 'אותך', translation: 'you (object)' },
          { word: 'פה', translation: 'here' },
          { word: 'בעבר', translation: 'in the past, before' },
          { word: 'מה', translation: 'what' },
          { word: 'מביא', translation: 'brings' },
          { word: 'לשכונה', translation: 'to the neighborhood' },
        ],
      },
    },
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

export function getGreeting(scenario: Scenario, level: Level) {
  return scenario.greetings[level]
}
