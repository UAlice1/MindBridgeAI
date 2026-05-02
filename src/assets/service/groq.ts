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
const SYSTEM_PROMPT = `Uri "YourVoice AI", umufasha w'ubuzima bwo mu mutwe ufite imbabazi, wubatswe gufasha abantu bo i Kigali, Rwanda, n'ahandi hantu.

INSHINGANO YAWE:
Utanga ahantu hizewe, hatazwi, kandi hatekanye aho abantu bashobora gusangira ibyiyumvo byabo, ingorane, ihungabana, cyangwa ibibazo by'ubuzima bwabo, maze babone inkunga ya AI mu gihe nyacyo. Uri inkunga ya mbere — ntabwo usimbuye inzobere mu buvuzi.

═══════════════════════════════════════
URURIMI
═══════════════════════════════════════
- Menya niba umukoresha abandika mu Kinyarwanda, Icyongereza, cyangwa ururimi ruvanze.
- Subiza MU RURIMI RUMWE umukoresha akoresha.
- Niba avanze indimi zombi, subiza mu ndimi zombi neza.
- Amagambo y'ingenzi mu Kinyarwanda yo kumenya:
  * "mfite munaniro" = ndi munaniro / nshobora gukomeza
  * "mfite na stress" = mfite umunaniro
  * "ntago nishimye" = sinishimye
  * "mfite agahinda" = mfite agahinda
  * "Ntibishoboka" = ntishoboka / ntinshobora
  * "Ndi wenyine" = ndi wenyine / nta muntu
  * "Bifasha" = bifasha
  * "Murakoze" = murakoze
  * "bankubise" = bankubise / baranteye
  * "Baranteye" = baranteye / bankoze nabi
  * "Ntibakunda" = ntibankunda
  * "Ndi mu bibazo bikomeye" = ndi mu bibazo / ndi mu kaga
  * "sinshaka kubaho" = nshaka gupfa / sinshaka kubaho
  * "nshaka gupfa" = nshaka gupfa
  * "nta cyo bifite" = nta cyo bifite / nta gaciro mfite
  * "nta muntu" = nta muntu wambwira / ndi wenyine
  * "gufata ku ngufu" = guhohoterwa / gufatwa ku ngufu
  * "guhohoterwa" = guhohoterwa / gukubitwa
  * "kwiheba" = kwiheba / gutakaza ibyiringiro

═══════════════════════════════════════
IMYITWARIRE NGENDERWAHO
═══════════════════════════════════════

1. INKUNGA Y'IKIGANIRO
   - Vugana nk'umuntu w'ineza, ufite imbabazi — ntabwo nk'imashini
   - Banza WEMEZE ibyiyumvo by'umukoresha mbere ya byose
   - Subiza GUFI (interuro 3–5) kandi neza
   - Koresha ururimi rworoshye, rutari rw'ubuvuzi
   - Urugero rw'ijwi: "Ibyo uvuga birumvikana. Ndi hano nawe."

2. GUSOBANUKIRWA IBYIYUMVO
   - Menya ibyiyumvo: umunaniro, ubwoba, agahinda, uburakari, ihungabana, kwiheba, guhohoterwa
   - Subiza mu buryo bwerekana ko usobanukirwa neza uko umukoresha yiyumva
   - Subiramo amagambo y'ibyiyumvo bye neza
   - Ntuzigera ugabanya cyangwa uretse ibyo basangira

3. INKUNGA Y'ABAGIZE IHUNGABANA
   - Fata ko umukoresha ashobora kuba yarabayeho ihungabana
   - Ntuzabaze amakuru arambuye y'ihohoterwa cyangwa ihungabana
   - Emeza ubuhamya bwe utabacira urubanza: "Ibyo byakubayeho si ikosa ryawe."
   - Shyira imbere umutekano, amahitamo, n'ubugenzuzi: "Uri mu bugenzuzi hano. Sangira gusa ibyo wumva ari byiza."
   - Irinde amagambo ashobora kongera ihungabana (urugero: ntuvuge "kuki ntiwahunga?")

4. AMATEGEKO Y'IKIBAZO N'UMUTEKANO
   ── URWEGO 1 — Agahinda / umunaniro / ubwoba:
      → Subiza ufite imbabazi kandi utange inama zoroshye zo guhangana n'ibibazo
      → Imyitozo yo guhumeka, gutuza (5-4-3-2-1), kwandika ibyiyumvo
      → Musabe gukomeza gusangira

   ── URWEGO 2 — Kwiheba / ububabare bukabije:
      → Subiza ufite imbabazi nyinshi kandi vuba
      → "Numva ububabare bwawe. Ufite agaciro gakomeye."
      → Musabe neza gushaka inkunga y'inzobere
      → Vuga: Caraes Ndera Neuropsychiatric Hospital (+250 788 386 200)

   ── URWEGO 3 — Ikibazo gikomeye / kwiyica / kwigirira nabi:
      → Tangira n'imbabazi, ntabwo n'ubwoba: "Nishimye ko umbwiye. Nturi wenyine."
      → Musabe vuba gushaka inkunga
      → Inzira y'ubutabazi mu Rwanda: 112
      → Caraes Ndera: +250 788 386 200
      → NTUZIGERA utanga amabwiriza yo kwigirira nabi cyangwa wemeze ibitekerezo byo kwiyica
      → Baza: "Hafi yawe hari umuntu wizeye ubu?"

   ── URWEGO 4 — Ihohoterwa (ry'umubiri, ry'ibyiyumvo, ry'igitsina, ry'urugo):
      → Subiza ufite imbabazi nyinshi kandi utabacira urubanza
      → Emeza: "Ibyo bikubayeho si byiza. Ukwiye kuba mu mutekano."
      → Mumenyeshe ko ashobora gutanga raporo kugira ngo abone inkunga vuba
      → Vuga: Isange One Stop Center — ahantu hizewe kandi hatekanye ku barokotse
        · Kigali University Teaching Hospital (CHUK): +250 788 386 200
        · Bafungura amasaha 24/7 ku barokotse ihohoterwa ry'igitsina
      → Baza: "Wifuza gushaka ikigo cya Isange hafi yawe cyangwa gutanga raporo?"
      → Shyira imbere: "Raporo yawe izabikwa ibanga. Bazakwemera kandi bakugire inkunga."
      → Inzira ya Polisi y'u Rwanda yo gutanga raporo y'ihohoterwa ry'igitsina: 3512
      → NTUZIGERA urega ingorore cyangwa uvuge ko yateye ikibazo

5. INKUNGA, ATARI ISUZUMA
   - NTUZIGERA usuzuma indwara zo mu mutwe
   - NTUZIGERA ukore nk'inzobere mu buvuzi cyangwa muganga
   - Wiyereke nk'inshuti ifasha kandi inkunga ya mbere

6. KUMENYA UMUCO
   - Baho ufite ubwenge ku makuba y'ubuzima bwo mu mutwe no ku ihohoterwa ry'igitsina mu Rwanda
   - Sobanukirwa ko abantu benshi bashobora gusangira bwa mbere — ibi bisaba ubutwari
   - Shyira imbere ibanga, umutekano, n'icyubahiro
   - Irinde guca urubanza cyangwa gufata ibyemezo bikomeye
   - Menya ko imibano y'umuryango n'umuryango ishobora gutera ingorane
   - Ntuzigera ugandamiza umukoresha gufata ibyemezo atarateguye

7. UBURYO BWO GUSUBIZA
   - Subiza gufi, neza, kandi nk'umuntu
   - Irinde interuro ndende — koresha interuro 2–4 gufi
   - Baza ikibazo KIMWE gikomeye kugira ngo ikiganiro gikomeze
   - Koresha ururimi rworoshye rw'ikiganiro
   - Koresha imirongo mishya iyo bikenewe

8. UMUTEKANO N'ICYUBAHIRO BY'UMUKORESHA
   - Ntuzigera wemeze ibitekerezo byo kwigaya (urugero: "nta gaciro mfite")
   - Binyuranye nabo neza: "Ibyo si ukuri — ufite agaciro."
   - Buri gihe rangiza mu buryo bumusaba gukomeza gusangira
   - Mubutse kenshi: "Aha ni ahantu hatekanye. Ushobora gusangira byinshi cyangwa bike uko ubona ari ngombwa."

═══════════════════════════════════════
INTEGO
═══════════════════════════════════════
Gira ngo buri mukoresha yumve ko yumvwe, ari mu mutekano, afite inkunga, kandi ari wenyine gake.
Shyira imbere umutekano n'icyubahiro bye byose.`

// ── Chat session type ─────────────────────────────────────────────────────
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
    session.history.push({ role: 'assistant', content: reply })
    return reply

  } catch (error: unknown) {
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
    // Common words
    'ndi', 'muri', 'kuri', 'turi', 'murakoze', 'yego', 'oya', 'bite',
    'amakuru', 'ni', 'ko', 'mu', 'ku', 'wa', 'ba', 'za', 'na', 'se',
    // Emotional / mental health
    'sinishimye', 'agahinda', 'munaniro', 'bifasha', 'ntibishoboka',
    'ubwoba', 'gutinya', 'kwiheba', 'ingorane', 'ibibazo', 'gufasha',
    'umuntu', 'abantu', 'ubuzima', 'imibabaro', 'ibyishimo', 'akababaro',
    'ihungabana', 'uburakari', 'umujinya', 'impungenge', 'umunaniro',
    // Crisis / abuse
    'barakuye', 'baranteye', 'ntibakundira', 'wenyine', 'bankubise',
    'banteye', 'banshutse', 'bannyagiye', 'guhohoterwa', 'gukubitwa',
    'kwiyahura', 'kwicwa', 'gupfa', 'sinshaka', 'nshaka',
    // Positive
    'nishimye', 'ibyishimo', 'umunezero',
    // Common verbs / connectors
    'nshaka', 'ndashaka', 'numva', 'mbona', 'nkora', 'nzana',
    'ndagira', 'ndabona', 'ndumva', 'ntibishoboka', 'ntinshobora',
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

  // ── Abuse / GBV ──────────────────────────────────────────────────────────
  const abuseKeywords = [
    // English
    'abuse', 'abused', 'abusing', 'hit me', 'beats me', 'beat me', 'hitting me',
    'slapped', 'kicked', 'punched', 'choked', 'strangled', 'forced me', 'raped',
    'rape', 'sexual abuse', 'molested', 'touched me', 'domestic violence',
    'he hurts me', 'she hurts me', 'they hurt me', 'my husband hits',
    'my wife hits', 'my partner hits', 'controlling me', 'threatens me',
    'threatened me', 'locked me', 'trapped', 'gbv', 'gender based violence',
    'isange',
    // Kinyarwanda
    'barakuye', 'baranteye', 'banteye', 'bankubise', 'banshutse',
    'bannyagiye', 'bankoze ibikorwa', 'gufata ku ngufu', 'gukubitwa',
    'guhungabana', 'guhohoterwa', 'gutekereza nabi', 'bankoze nabi',
    'banfashe ku ngufu', 'bannyutsemo', 'bampinze', 'bampigiye',
    'bampigye', 'banteye ingorane', 'banteye ubwoba',
  ]

  // ── Crisis / suicidal ────────────────────────────────────────────────────
  const crisisKeywords = [
    // English
    'kill myself', 'end my life', 'suicide', 'suicidal', 'want to die',
    'no reason to live', 'better off dead', 'hurt myself', 'self harm',
    'self-harm', 'cut myself', 'overdose', 'end it all', 'not worth living',
    // Kinyarwanda
    'kwiyahura', 'kwicwa', 'gupfa', 'sinshaka kubaho', 'nshaka gupfa',
    'nshaka kwiyahura', 'nshaka gupfa', 'nta mpamvu yo kubaho',
    'nta gaciro mfite', 'nshaka kurangiza ubuzima', 'nshaka gusiga ubuzima',
    'nta cyo nkwiye', 'sinshaka kubaho', 'nshaka gupfa vuba',
  ]

  // ── Hopelessness ─────────────────────────────────────────────────────────
  const hopelessnessKeywords = [
    // English
    'hopeless', 'worthless', 'no point', 'give up', 'cant go on', "can't go on",
    'nothing matters', 'nobody cares', 'alone', 'no one cares', 'pointless',
    'no future', 'no hope', 'empty inside', 'numb',
    // Kinyarwanda
    'kwiheba', 'nta cyo bifite', 'sinishimye', 'nta muntu', 'ndi wenyine',
    'nta byiringiro', 'nta gihe kizaza', 'nta muntu wambwira',
    'nta muntu wankunda', 'nta muntu wanfasha', 'nta cyo nkwiye',
    'nta gaciro mfite', 'nta cyo nshobora', 'nta cyo bifite',
    'nta muntu wanyumva' , 'nta muntu wanjye',
  ]

  // ── Trauma / PTSD ────────────────────────────────────────────────────────
  const traumaKeywords = [
    // English
    'trauma', 'traumatized', 'flashback', 'nightmare', 'ptsd',
    'haunted', "can't forget", 'keeps coming back', 'triggered',
    // Kinyarwanda
    'ihungabana', 'ibintu byabaye', 'sinibagirwa', 'bigaruka',
    'inzozi mbi', 'ntibishoboka kwibagirwa', 'ibintu bimpagarara',
    'ibintu bimpa ubwoba', 'ibintu byabaye bigaruka', 'ntibishoboka',
    'ibintu byabaye ntibigenda', 'ibintu byabaye bikomeza',
  ]

  // ── Sadness / depression ─────────────────────────────────────────────────
  const sadnessKeywords = [
    // English
    'sad', 'cry', 'crying', 'tears', 'depressed', 'depression', 'empty',
    'heartbroken', 'grief', 'loss', 'lonely', 'miss',
    // Kinyarwanda
    'agahinda', 'imibabaro', 'akababaro', 'ndi na agahinda',
    'mfite agahinda', 'ndira', 'amarira', 'ndi wenyine',
    'nshaka gusanga', 'nta muntu', 'nta nshuti', 'nta muryango',
    'nta muntu wankunda', 'nta muntu wanjye', 'nta muntu wanjya',
    'sinishimye', 'ntago nishimye', 'nta neza', 'nta byishimo',
  ]

  // ── Anxiety / fear ───────────────────────────────────────────────────────
  const anxietyKeywords = [
    // English
    'anxious', 'anxiety', 'panic', 'worried', 'worry', 'fear', 'scared',
    'nervous', 'overwhelmed', 'dread', 'terror',
    // Kinyarwanda
    'ubwoba', 'gutinya', 'impungenge', 'ntinya', 'mfite ubwoba',
    'ndi na ubwoba', 'ntinya cyane', 'ntinya ibintu', 'ntinya abantu',
    'ntinya ejo', 'ntinya ejo hazaza', 'ntinya ibizaba',
  ]

  // ── Stress / exhaustion ──────────────────────────────────────────────────
  const stressKeywords = [
    // English
    'stress', 'stressed', 'pressure', 'exhausted', 'tired', 'burnout',
    'too much', 'overwhelm', "can't cope", 'breaking down',
    // Kinyarwanda
    'munaniro', 'ndi na stress', 'ingorane', 'mfite munaniro',
    'ndi munaniro', 'ndi na munaniro', 'ndi na ingorane',
    'ndi na umunaniro', 'umunaniro', 'ndi na umunaniro',
    'nshobora gukomeza', 'ntinshobora gukomeza', 'ndi na ibibazo',
    'ibibazo byinshi', 'ndi na ibibazo byinshi',
  ]

  // ── Anger / frustration ──────────────────────────────────────────────────
  const angerKeywords = [
    // English
    'angry', 'anger', 'furious', 'rage', 'frustrated', 'frustration',
    'hate', 'irritated', 'livid', 'explode',
    // Kinyarwanda
    'uburakari', 'umujinya', 'ndi na uburakari', 'ndi na umujinya',
    'ndi na ishyari', 'ishyari', 'ndi na umujinya mwinshi',
    'ndi na uburakari bwinshi', 'ndi na umujinya ukomeye',
  ]

  // ── Priority order: most severe first ────────────────────────────────────
  if (abuseKeywords.some(k => lower.includes(k)))        return { tag: 'abuse',        severity: 'high'   }
  if (crisisKeywords.some(k => lower.includes(k)))       return { tag: 'crisis',       severity: 'high'   }
  if (hopelessnessKeywords.some(k => lower.includes(k))) return { tag: 'hopelessness', severity: 'high'   }
  if (traumaKeywords.some(k => lower.includes(k)))       return { tag: 'trauma',       severity: 'medium' }
  if (sadnessKeywords.some(k => lower.includes(k)))      return { tag: 'sadness',      severity: 'medium' }
  if (anxietyKeywords.some(k => lower.includes(k)))      return { tag: 'anxiety',      severity: 'low'    }
  if (stressKeywords.some(k => lower.includes(k)))       return { tag: 'stress',       severity: 'low'    }
  if (angerKeywords.some(k => lower.includes(k)))        return { tag: 'anger',        severity: 'low'    }

  const positiveKeywords = [
    // English
    'happy', 'better', 'good', 'great', 'thank', 'helped', 'grateful',
    // Kinyarwanda
    'ibyishimo', 'murakoze', 'bifasha', 'nishimye', 'umunezero',
    'nishimye cyane', 'nishimye cane', 'nishimye muri make',
    'nishimye ko', 'nishimye kuko', 'nishimye kubera',
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
    trauma:       '#c084fc',
    sadness:      '#60a5fa',
    anxiety:      '#facc15',
    stress:       '#fb923c',
    anger:        '#f87171',
    positive:     '#4ade80',
    neutral:      '#a78bfa',
  }
  return colors[emotion] ?? '#a78bfa'
}

export function getEmotionLabel(emotion: string, lang: 'en' | 'rw' | 'mixed' = 'en'): string {
  const labels: Record<string, { en: string; rw: string }> = {
    crisis:       { en: 'Crisis',       rw: 'Ikibazo gikomeye'  },
    abuse:        { en: 'Abuse',        rw: 'Guhohoterwa'       },
    hopelessness: { en: 'Hopelessness', rw: 'Kwiheba'           },
    trauma:       { en: 'Trauma',       rw: 'Ihungabana'        },
    sadness:      { en: 'Sadness',      rw: 'Agahinda'          },
    anxiety:      { en: 'Anxiety',      rw: 'Ubwoba'            },
    stress:       { en: 'Stress',       rw: 'Umunaniro'         },
    anger:        { en: 'Frustration',  rw: 'Uburakari'         },
    positive:     { en: 'Positive',     rw: 'Ibyishimo'         },
    neutral:      { en: 'Neutral',      rw: 'Bisanzwe'          },
  }
  const entry = labels[emotion]
  if (!entry) return emotion
  return lang === 'rw' ? entry.rw : entry.en
}
