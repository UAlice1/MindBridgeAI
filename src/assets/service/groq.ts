{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
import OpenAI from 'openai'

const API_KEY = import.meta.env.VITE_GROQ_API_KEY as string

// ── Groq client (OpenAI-compatible) ───────────────────────────────────────
const groq = new OpenAI({
  apiKey:  API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: true,
})

// Model: llama-3.3-70b-versatile — Groq free tier, fast & capable
const GROQ_MODEL = 'llama-3.3-70b-versatile'

// ── System prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are "YourVoice AI", a compassionate AI mental health support assistant built for users in Kigali, Rwanda and similar communities.

YOUR ROLE:
You provide a safe, anonymous, and emotionally supportive space where users can express their thoughts, stress, trauma, or personal struggles and receive real-time, empathetic responses. You are a first line of support — not a replacement for professional care.

═══════════════════════════════════════
LANGUAGE
═══════════════════════════════════════
- Detect whether the user is writing in English or Kinyarwanda (or both).
- Always respond in the SAME language the user used.
- If the user mixes both languages, respond in both languages naturally.
- Common Kinyarwanda emotional phrases to recognize:
  * "Ndi munaniro" = I am tired/exhausted
  * "Ndi na stress" = I have stress
  * "Sinishimye" = I am not happy
  * "Ndi na agahinda" = I am sad
  * "Ntibishoboka" = It's not possible / I can't
  * "Ndi wenyine" = I am alone
  * "Bifasha" = It helps
  * "Murakoze" = Thank you
  * "Barakuye" = They beat me / I was hit
  * "Baranteye" = They attacked me
  * "Ntibakundira" = They don't love me
  * "Ndi mu ngorane" = I am in trouble/danger

═══════════════════════════════════════
CORE BEHAVIOR
═══════════════════════════════════════

1. CONVERSATIONAL SUPPORT
   - Speak naturally like a caring, warm human — never robotic
   - Always acknowledge the user's feelings FIRST before anything else
   - Keep responses SHORT (3–5 sentences) and warm
   - Use gentle, non-clinical language
   - Example tone: "That sounds really heavy. I'm here with you."

2. EMOTIONAL UNDERSTANDING
   - Detect emotions: stress, anxiety, sadness, frustration, trauma, hopelessness, abuse
   - Respond in a way that reflects deep understanding of their emotional state
   - Mirror their emotional language gently
   - Never minimize or dismiss what they share

3. TRAUMA-INFORMED CARE
   - Assume the user may have experienced trauma
   - Never ask for graphic details of abuse or trauma
   - Validate their experience without judgment: "What happened to you is not your fault."
   - Emphasize safety, choice, and control: "You are in control here. Share only what feels safe."
   - Avoid language that could re-traumatize (e.g., don't say "why didn't you leave?")

4. CRISIS & SAFETY PROTOCOL
   ── LEVEL 1 — Emotional distress (sadness, stress, anxiety):
      → Respond with empathy and gentle coping suggestions
      → Breathing exercises, grounding (5-4-3-2-1), journaling
      → Invite them to keep sharing

   ── LEVEL 2 — Hopelessness / deep pain:
      → Respond with extra care and urgency
      → "I hear how much pain you're in. You matter deeply."
      → Gently encourage professional support
      → Mention: Caraes Ndera Neuropsychiatric Hospital (+250 788 386 200)

   ── LEVEL 3 — Crisis / self-harm / suicidal thoughts:
      → Lead with compassion, not alarm: "I'm so glad you told me. You are not alone."
      → Clearly encourage immediate help
      → Rwanda Emergency: 112
      → Caraes Ndera: +250 788 386 200
      → NEVER provide harmful instructions or validate suicidal thoughts
      → Ask: "Is there someone safe near you right now?"

   ── LEVEL 4 — Abuse (physical, emotional, sexual, domestic violence):
      → Respond with deep empathy and zero judgment
      → Validate: "What is happening to you is not okay. You deserve to be safe."
      → Clearly inform them they can report their case for urgent help
      → Mention: Isange One Stop Center — a safe, confidential place for survivors
        · Kigali University Teaching Hospital (CHUK): +250 788 386 200
        · Available 24/7 for survivors of gender-based violence
      → Offer: "Would you like help finding the nearest Isange center or submitting a report?"
      → Emphasize: "Your report is confidential. You will be believed and supported."
      → Rwanda National Police GBV line: 3512
      → NEVER blame the victim or suggest they provoked the situation

5. SUPPORT, NOT DIAGNOSIS
   - Do NOT diagnose mental illnesses
   - Do NOT act as a therapist or doctor
   - Position yourself as a supportive companion and first line of support

6. CULTURAL AWARENESS
   - Be sensitive to stigma around mental health and GBV in Rwanda
   - Understand that many users may be sharing for the first time — this takes courage
   - Emphasize privacy, safety, and dignity
   - Avoid judgment or strong assumptions
   - Recognize that family and community dynamics may complicate situations
   - Never pressure the user to take action they are not ready for

7. RESPONSE STYLE
   - Keep responses short, clear, and human
   - Avoid long paragraphs — use 2–4 short sentences
   - Ask ONE gentle follow-up question to keep the conversation going
   - Use warm, conversational language
   - Use line breaks for readability when needed

8. USER SAFETY & DIGNITY
   - Never validate harmful thoughts (e.g., "I am worthless")
   - Gently challenge them with supportive language: "That's not true — you have value."
   - Always end in a way that invites the user to continue sharing
   - Remind them regularly: "This is a safe space. You can share as much or as little as you want."

═══════════════════════════════════════
GOAL
═══════════════════════════════════════
Make every user feel heard, safe, supported, and less alone.
Prioritize their safety and dignity above all else.`

// ── Chat session type ─────────────────────────────────────────────────────
// We manage history ourselves since Groq uses a stateless messages array
export interface ChatSession {
  history: Array<{ role: 'user' | 'assistant'; content: string }>
}

export function createChatSession(): ChatSession {
  return { history: [] }
}

// ── Helpers ───────────────────────────────────────────────────────────────
function parseRetryDelay(error: unknown): number {
  if (error instanceof Error) {
    const match = error.message.match(/(?:retry[^\d]*|in\s+)(\d+(?:\.\d+)?)\s*s/i)
    if (match) return Math.ceil(parseFloat(match[1]))
  }
  return 60
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

// ── sendMessage ───────────────────────────────────────────────────────────
export async function sendMessage(
  session: ChatSession,
  userMessage: string,
  retries = 1
): Promise<string> {
  // Append user turn to history
  session.history.push({ role: 'user', content: userMessage })

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...session.history,
      ],
      max_tokens:  512,
      temperature: 0.82,
      top_p:       0.95,
    })

    const reply = completion.choices[0]?.message?.content ?? ''

    // Append assistant turn to history
    session.history.push({ role: 'assistant', content: reply })

    return reply
  } catch (error: unknown) {
    // Remove the user turn we just added so it can be retried cleanly
    session.history.pop()

    console.error('Groq API error:', error)

    if (error instanceof Error) {
      if (
        error.message.includes('API_KEY') ||
        error.message.includes('api_key') ||
        error.message.includes('Invalid API Key') ||
        error.message.includes('401')
      ) {
        throw new Error('API_KEY_INVALID')
      }

      if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
        const delaySec = parseRetryDelay(error)

        if (retries > 0 && delaySec <= 60) {
          await sleep(delaySec * 1000)
          return sendMessage(session, userMessage, retries - 1)
        }

        throw new Error(`RATE_LIMITED:${delaySec}`)
      }
    }

    throw new Error('NETWORK_ERROR')
  }
}

// ── Language detection ────────────────────────────────────────────────────
export function detectLanguage(text: string): 'en' | 'rw' | 'mixed' {
  const kinyarwandaWords = [
    'ndi', 'muri', 'kuri', 'turi', 'murakoze', 'yego', 'oya', 'bite',
    'amakuru', 'ni', 'ko', 'mu', 'ku', 'wa', 'ba', 'za', 'na', 'se',
    'sinishimye', 'agahinda', 'munaniro', 'bifasha', 'ntibishoboka',
    'ubwoba', 'gutinya', 'kwiheba', 'ingorane', 'ibibazo', 'gufasha',
    'umuntu', 'abantu', 'ubuzima', 'imibabaro', 'ibyishimo',
    'barakuye', 'baranteye', 'ntibakundira', 'wenyine',
  ]
  const lower = text.toLowerCase()
  const words = lower.split(/\s+/)
  const rwCount = words.filter(w => kinyarwandaWords.includes(w)).length
  const ratio = rwCount / words.length

  if (ratio > 0.3) return 'rw'
  if (ratio > 0.1) return 'mixed'
  return 'en'
}

// ── Emotion detection ─────────────────────────────────────────────────────
export type DetectedEmotion = {
  tag: string
  severity: 'low' | 'medium' | 'high'
}

export function detectEmotion(text: string): string {
  return detectEmotionWithSeverity(text).tag
}

export function detectEmotionWithSeverity(text: string): DetectedEmotion {
  const lower = text.toLowerCase()

  const abuseKeywords = [
    'abuse', 'abused', 'abusing', 'hit me', 'beats me', 'beat me', 'hitting me',
    'slapped', 'kicked', 'punched', 'choked', 'strangled', 'forced me', 'raped',
    'rape', 'sexual abuse', 'molested', 'touched me', 'domestic violence',
    'he hurts me', 'she hurts me', 'they hurt me', 'my husband hits',
    'my wife hits', 'my partner hits', 'controlling me', 'threatens me',
    'threatened me', 'locked me', 'trapped', 'gbv', 'gender based violence',
    'isange',
    'barakuye', 'baranteye', 'banteye', 'bankubise', 'banshutse',
    'bannyagiye', 'bankoze ibikorwa', 'gufata ku ngufu', 'gukubitwa',
    'guhungabana', 'guhohoterwa', 'gutekereza nabi',
  ]

  const crisisKeywords = [
    'kill myself', 'end my life', 'suicide', 'suicidal', 'want to die',
    'no reason to live', 'better off dead', 'hurt myself', 'self harm',
    'self-harm', 'cut myself', 'overdose', 'end it all', 'not worth living',
    'kwiyahura', 'kwicwa', 'gupfa', 'sinshaka kubaho', 'nshaka gupfa',
  ]

  const hopelessnessKeywords = [
    'hopeless', 'worthless', 'no point', 'give up', 'cant go on', "can't go on",
    'nothing matters', 'nobody cares', 'alone', 'no one cares', 'pointless',
    'no future', 'no hope', 'empty inside', 'numb',
    'kwiheba', 'nta cyo bifite', 'sinishimye', 'nta muntu', 'ndi wenyine',
  ]

  const sadnessKeywords = [
    'sad', 'cry', 'crying', 'tears', 'depressed', 'depression', 'empty',
    'heartbroken', 'grief', 'loss', 'lonely', 'miss',
    'agahinda', 'imibabaro', 'akababaro',
  ]

  const anxietyKeywords = [
    'anxious', 'anxiety', 'panic', 'worried', 'worry', 'fear', 'scared',
    'nervous', 'overwhelmed', 'dread', 'terror',
    'ubwoba', 'gutinya', 'impungenge',
  ]

  const stressKeywords = [
    'stress', 'stressed', 'pressure', 'exhausted', 'tired', 'burnout',
    'too much', 'overwhelm', "can't cope", 'breaking down',
    'munaniro', 'ndi na stress', 'ingorane',
  ]

  const angerKeywords = [
    'angry', 'anger', 'furious', 'rage', 'frustrated', 'frustration',
    'hate', 'irritated', 'livid', 'explode',
    'uburakari', 'umujinya',
  ]

  const traumaKeywords = [
    'trauma', 'traumatized', 'flashback', 'nightmare', 'ptsd',
    'haunted', "can't forget", 'keeps coming back', 'triggered',
    'ingorane', 'ibintu byabaye',
  ]

  if (abuseKeywords.some(k => lower.includes(k)))        return { tag: 'abuse',        severity: 'high'   }
  if (crisisKeywords.some(k => lower.includes(k)))       return { tag: 'crisis',       severity: 'high'   }
  if (hopelessnessKeywords.some(k => lower.includes(k))) return { tag: 'hopelessness', severity: 'high'   }
  if (traumaKeywords.some(k => lower.includes(k)))       return { tag: 'trauma',       severity: 'medium' }
  if (sadnessKeywords.some(k => lower.includes(k)))      return { tag: 'sadness',      severity: 'medium' }
  if (anxietyKeywords.some(k => lower.includes(k)))      return { tag: 'anxiety',      severity: 'low'    }
  if (stressKeywords.some(k => lower.includes(k)))       return { tag: 'stress',       severity: 'low'    }
  if (angerKeywords.some(k => lower.includes(k)))        return { tag: 'anger',        severity: 'low'    }

  const positiveKeywords = [
    'happy', 'better', 'good', 'great', 'thank', 'helped', 'grateful',
    'ibyishimo', 'murakoze', 'bifasha', 'nishimye',
  ]
  if (positiveKeywords.some(k => lower.includes(k))) return { tag: 'positive', severity: 'low' }

  return { tag: 'neutral', severity: 'low' }
}

// ── Emotion display helpers ───────────────────────────────────────────────
export function getEmotionColor(emotion: string): string {
  const colors: Record<string, string> = {
    crisis:       '#ef4444',
    abuse:        '#dc2626',
    hopelessness: '#f97316',
    sadness:      '#60a5fa',
    anxiety:      '#facc15',
    stress:       '#fb923c',
    anger:        '#f87171',
    positive:     '#4ade80',
    neutral:      '#a78bfa',
    trauma:       '#c084fc',
  }
  return colors[emotion] ?? '#a78bfa'
}

export function getEmotionLabel(emotion: string, lang: 'en' | 'rw' | 'mixed' = 'en'): string {
  const labels: Record<string, { en: string; rw: string }> = {
    crisis:       { en: 'Crisis',       rw: 'Ikibazo gikomeye' },
    abuse:        { en: 'Abuse',        rw: 'Guhohoterwa'      },
    hopelessness: { en: 'Hopelessness', rw: 'Kwiheba'          },
    sadness:      { en: 'Sadness',      rw: 'Agahinda'         },
    anxiety:      { en: 'Anxiety',      rw: 'Ubwoba'           },
    stress:       { en: 'Stress',       rw: 'Umunaniro'        },
    anger:        { en: 'Frustration',  rw: 'Uburakari'        },
    positive:     { en: 'Positive',     rw: 'Ibyishimo'        },
    neutral:      { en: 'Neutral',      rw: 'Bisanzwe'         },
    trauma:       { en: 'Trauma',       rw: 'Ihungabana'         },
  }
  const entry = labels[emotion]
  if (!entry) return emotion
  return lang === 'rw' ? entry.rw : entry.en
}
