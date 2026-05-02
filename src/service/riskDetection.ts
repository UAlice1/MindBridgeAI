import type { RiskAnalysis, RiskLevel, CaseType, EmotionTag } from '../types'
import { routeCase } from '../data/ngos'

// ── Keyword banks ─────────────────────────────────────────────────────────

const URGENT_KEYWORDS = [
  // Immediate danger / life threat
  'kill me', 'going to kill', 'will kill', 'murder', 'knife', 'gun', 'weapon',
  'kill myself', 'end my life', 'suicide', 'suicidal', 'want to die',
  'no reason to live', 'better off dead', 'hurt myself', 'self harm',
  'self-harm', 'cut myself', 'overdose', 'end it all', 'not worth living',
  'trapped and scared', 'he has a weapon', 'she has a weapon',
  'locked me in', 'cant escape', "can't escape", 'help me now', 'please help now',
  // Kinyarwanda
  'kwiyahura', 'kwicwa', 'gupfa', 'sinshaka kubaho', 'nshaka gupfa',
  'afite intwaro', 'anshaka kwica', 'ndi mu kaga',
]

const HIGH_RISK_KEYWORDS = [
  // Abuse
  'abuse', 'abused', 'abusing', 'hit me', 'beats me', 'beat me', 'hitting me',
  'slapped', 'kicked', 'punched', 'choked', 'strangled', 'forced me', 'raped',
  'rape', 'sexual abuse', 'molested', 'touched me', 'domestic violence',
  'he hurts me', 'she hurts me', 'they hurt me', 'my husband hits',
  'my wife hits', 'my partner hits', 'controlling me', 'threatens me',
  'threatened me', 'locked me', 'trapped', 'gbv', 'gender based violence',
  'isange', 'child abuse', 'abusing my child', 'hurting my child',
  // Hopelessness
  'hopeless', 'worthless', 'no point', 'give up', 'cant go on', "can't go on",
  'nothing matters', 'nobody cares', 'no one cares', 'pointless',
  'no future', 'no hope', 'empty inside', 'numb',
  // Kinyarwanda
  'barakuye', 'baranteye', 'banteye', 'bankubise', 'banshutse',
  'bannyagiye', 'bankoze ibikorwa', 'gufata ku ngufu', 'gukubitwa',
  'guhungabana', 'guhohoterwa', 'kwiheba', 'nta cyo bifite',
]

const MEDIUM_RISK_KEYWORDS = [
  'trauma', 'traumatized', 'flashback', 'nightmare', 'ptsd',
  'haunted', "can't forget", 'keeps coming back', 'triggered',
  'depressed', 'depression', 'heartbroken', 'grief', 'loss',
  'crying every day', 'cant sleep', "can't sleep", 'panic attack',
  'anxiety attack', 'breaking down', 'falling apart',
  'ingorane', 'ibintu byabaye', 'agahinda', 'imibabaro',
]

const LOW_RISK_KEYWORDS = [
  'stressed', 'stress', 'anxious', 'anxiety', 'worried', 'worry',
  'sad', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'pressure',
  'nervous', 'scared', 'fear', 'angry', 'frustrated',
  'munaniro', 'ubwoba', 'gutinya', 'impungenge', 'uburakari',
]

// ── Case type detection ───────────────────────────────────────────────────

const CASE_TYPE_PATTERNS: Record<CaseType, string[]> = {
  domestic_violence: [
    'husband', 'wife', 'partner', 'spouse', 'boyfriend', 'girlfriend',
    'domestic', 'home violence', 'family violence', 'intimate partner',
    'hits me at home', 'beats me at home',
  ],
  sexual_abuse: [
    'rape', 'raped', 'sexual abuse', 'molested', 'touched me', 'forced sex',
    'sexual assault', 'gufata ku ngufu',
  ],
  child_abuse: [
    'child abuse', 'abusing my child', 'hurting my child', 'my child is being',
    'children are being', 'minor', 'underage',
  ],
  gbv: [
    'gbv', 'gender based violence', 'gender-based violence', 'woman abuse',
    'girl abuse', 'female violence',
  ],
  crisis: [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'self harm',
    'want to die', 'crisis', 'emergency',
  ],
  mental_health: [
    'depression', 'anxiety', 'mental health', 'psychiatric', 'therapy',
    'counseling', 'mental illness', 'breakdown',
  ],
  general_support: [],
}

// ── Scoring ───────────────────────────────────────────────────────────────

function scoreText(text: string): {
  score: number
  flagged: string[]
  riskLevel: RiskLevel
  isUrgent: boolean
} {
  const lower = text.toLowerCase()
  const flagged: string[] = []
  let score = 0

  for (const kw of URGENT_KEYWORDS) {
    if (lower.includes(kw)) {
      flagged.push(kw)
      score += 40
    }
  }

  for (const kw of HIGH_RISK_KEYWORDS) {
    if (lower.includes(kw) && !flagged.includes(kw)) {
      flagged.push(kw)
      score += 20
    }
  }

  for (const kw of MEDIUM_RISK_KEYWORDS) {
    if (lower.includes(kw) && !flagged.includes(kw)) {
      flagged.push(kw)
      score += 10
    }
  }

  for (const kw of LOW_RISK_KEYWORDS) {
    if (lower.includes(kw) && !flagged.includes(kw)) {
      flagged.push(kw)
      score += 3
    }
  }

  // Cap at 100
  score = Math.min(score, 100)

  const isUrgent = score >= 70 || URGENT_KEYWORDS.some(k => lower.includes(k))

  let riskLevel: RiskLevel
  if (isUrgent || score >= 70) riskLevel = 'urgent'
  else if (score >= 40) riskLevel = 'high'
  else if (score >= 20) riskLevel = 'medium'
  else riskLevel = 'low'

  return { score, flagged: [...new Set(flagged)], riskLevel, isUrgent }
}

function detectCaseType(text: string): CaseType {
  const lower = text.toLowerCase()
  const scores: Partial<Record<CaseType, number>> = {}

  for (const [type, keywords] of Object.entries(CASE_TYPE_PATTERNS)) {
    const count = keywords.filter(k => lower.includes(k)).length
    if (count > 0) scores[type as CaseType] = count
  }

  if (Object.keys(scores).length === 0) return 'general_support'

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as CaseType
}

function detectEmotions(text: string): EmotionTag[] {
  const lower = text.toLowerCase()
  const emotions: EmotionTag[] = []

  const checks: [EmotionTag, string[]][] = [
    ['crisis',       ['suicide', 'suicidal', 'kill myself', 'end my life', 'kwiyahura']],
    ['abuse',        ['abuse', 'abused', 'raped', 'hit me', 'beats me', 'barakuye', 'guhohoterwa']],
    ['hopelessness', ['hopeless', 'worthless', 'no hope', 'give up', 'kwiheba']],
    ['trauma',       ['trauma', 'flashback', 'nightmare', 'ptsd', 'ingorane']],
    ['sadness',      ['sad', 'crying', 'depressed', 'grief', 'agahinda']],
    ['anxiety',      ['anxious', 'anxiety', 'panic', 'scared', 'ubwoba']],
    ['stress',       ['stress', 'stressed', 'overwhelmed', 'exhausted', 'munaniro']],
    ['anger',        ['angry', 'furious', 'rage', 'hate', 'uburakari']],
    ['positive',     ['better', 'happy', 'grateful', 'thank', 'murakoze']],
  ]

  for (const [tag, keywords] of checks) {
    if (keywords.some(k => lower.includes(k))) emotions.push(tag)
  }

  return emotions.length > 0 ? emotions : ['neutral']
}

// ── Main analysis function ────────────────────────────────────────────────

export function analyzeRisk(text: string, province?: string): RiskAnalysis {
  const { score, flagged, riskLevel, isUrgent } = scoreText(text)
  const caseType = detectCaseType(text)
  const emotionTags = detectEmotions(text)
  const recommendedNGOs = routeCase(caseType, isUrgent, province)

  const reasoningMap: Record<RiskLevel, string> = {
    urgent: 'Immediate danger indicators detected. Case flagged as URGENT — emergency response required.',
    high:   'High-risk indicators detected including abuse or severe distress. Professional intervention recommended.',
    medium: 'Moderate distress signals detected. Professional support strongly advised.',
    low:    'Low-level emotional distress detected. Supportive resources provided.',
  }

  return {
    riskLevel,
    riskScore: score,
    caseType,
    flaggedKeywords: flagged,
    emotionTags,
    isUrgent,
    recommendedNGOs,
    reasoning: reasoningMap[riskLevel],
  }
}

/** Analyze a full conversation history */
export function analyzeConversationRisk(messages: string[], province?: string): RiskAnalysis {
  const combined = messages.join(' ')
  return analyzeRisk(combined, province)
}

/** Get risk level color */
export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    urgent: '#dc2626',
    high:   '#ea580c',
    medium: '#d97706',
    low:    '#65a30d',
  }
  return colors[level]
}

/** Get risk level background */
export function getRiskBg(level: RiskLevel): string {
  const bgs: Record<RiskLevel, string> = {
    urgent: 'rgba(220,38,38,0.08)',
    high:   'rgba(234,88,12,0.08)',
    medium: 'rgba(217,119,6,0.08)',
    low:    'rgba(101,163,13,0.08)',
  }
  return bgs[level]
}

/** Get risk level label */
export function getRiskLabel(level: RiskLevel, lang: 'en' | 'rw' = 'en'): string {
  const labels: Record<RiskLevel, { en: string; rw: string }> = {
    urgent: { en: 'URGENT',  rw: 'BIKENEWE NONAHA' },
    high:   { en: 'High Risk',   rw: 'Ingorane Ikomeye'  },
    medium: { en: 'Medium Risk', rw: 'Ingorane Hagati'   },
    low:    { en: 'Low Risk',    rw: 'Ingorane Nto'      },
  }
  return labels[level][lang]
}
