// ---------------------------------------------------------------------------
// Supported target locales for Translate & Adapt. Each locale carries the
// human-readable language + region used both in the UI and in the AI prompt so
// the model adapts wording to the right market (not just a literal translation).
// ---------------------------------------------------------------------------

export interface Locale {
  /** BCP-47-ish code used as the stable key. */
  code: string
  /** Language name in English. */
  language: string
  /** Region / market this locale targets. */
  region: string
}

export const SOURCE_LOCALES: Locale[] = [
  { code: "en", language: "English", region: "United States" },
  { code: "en-GB", language: "English", region: "United Kingdom" },
  { code: "es", language: "Spanish", region: "Spain" },
  { code: "fr", language: "French", region: "France" },
  { code: "de", language: "German", region: "Germany" },
]

export const TARGET_LOCALES: Locale[] = [
  { code: "es", language: "Spanish", region: "Spain" },
  { code: "es-419", language: "Spanish", region: "Latin America" },
  { code: "fr", language: "French", region: "France" },
  { code: "fr-CA", language: "French", region: "Canada" },
  { code: "de", language: "German", region: "Germany" },
  { code: "pt-BR", language: "Portuguese", region: "Brazil" },
  { code: "pt-PT", language: "Portuguese", region: "Portugal" },
  { code: "it", language: "Italian", region: "Italy" },
  { code: "nl", language: "Dutch", region: "Netherlands" },
  { code: "ja", language: "Japanese", region: "Japan" },
  { code: "ko", language: "Korean", region: "South Korea" },
  { code: "zh-Hans", language: "Chinese (Simplified)", region: "Mainland China" },
  { code: "zh-Hant", language: "Chinese (Traditional)", region: "Taiwan" },
  { code: "ar", language: "Arabic", region: "Saudi Arabia" },
  { code: "hi", language: "Hindi", region: "India" },
  { code: "ru", language: "Russian", region: "Russia" },
  { code: "tr", language: "Turkish", region: "Türkiye" },
  { code: "pl", language: "Polish", region: "Poland" },
  { code: "id", language: "Indonesian", region: "Indonesia" },
  { code: "th", language: "Thai", region: "Thailand" },
  { code: "vi", language: "Vietnamese", region: "Vietnam" },
  { code: "sv", language: "Swedish", region: "Sweden" },
]

const TARGET_BY_CODE = new Map(TARGET_LOCALES.map((l) => [l.code, l]))
const SOURCE_BY_CODE = new Map(SOURCE_LOCALES.map((l) => [l.code, l]))

export function getLocale(code: string): Locale | undefined {
  return TARGET_BY_CODE.get(code) ?? SOURCE_BY_CODE.get(code)
}

/** "Spanish (Latin America)" style label. */
export function localeLabel(code: string): string {
  const l = getLocale(code)
  if (!l) return code
  return `${l.language} (${l.region})`
}

/** Right-to-left scripts that need RTL rendering hints. */
const RTL_PREFIXES = ["ar", "he", "fa", "ur"]
export function isRtl(code: string): boolean {
  return RTL_PREFIXES.some((p) => code.startsWith(p))
}

export const CONTENT_TYPES = [
  {
    id: "store_listing",
    label: "App store listing",
    description: "Title, subtitle, description, and keywords for the App Store / Play Store.",
  },
  {
    id: "ui_strings",
    label: "In-app UI strings",
    description: "Buttons, labels, and messages shown inside the app.",
  },
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]["id"]

export const TONES = [
  { id: "neutral", label: "Neutral" },
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "playful", label: "Playful" },
] as const

export type Tone = (typeof TONES)[number]["id"]

/** Starter segments for a new project, by content type. */
export function defaultSegments(type: ContentType): { key: string; text: string }[] {
  if (type === "store_listing") {
    return [
      { key: "title", text: "" },
      { key: "subtitle", text: "" },
      { key: "description", text: "" },
      { key: "keywords", text: "" },
      { key: "whats_new", text: "" },
    ]
  }
  return [
    { key: "cta_primary", text: "" },
    { key: "cta_secondary", text: "" },
    { key: "empty_state", text: "" },
    { key: "error_generic", text: "" },
  ]
}
