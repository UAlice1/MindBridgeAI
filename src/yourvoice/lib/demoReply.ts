// UI preview only: scripted replies stand in for the server-side AI. The keyword
// check is a placeholder and must not be relied on as real crisis detection.
import type { Lang } from './context'

export type Flag = 'danger' | 'violence' | null

const danger = ['suicid', 'kill myself', 'kill me', 'end my life', 'want to die', 'hurt myself', 'self harm', 'self-harm', 'weapon', 'nshaka gupfa', 'sinshaka kubaho', 'kwiyahura', 'ndi mu kaga']
const violence = ['rape', 'abuse', 'gbv', 'violence', 'hit me', 'hits me', 'beat me', 'beats me', 'forced me', 'harass', 'assault', 'threaten', 'bankubise', 'gufata ku ngufu', 'ihohoterwa', 'guhohoterwa', 'gukubitwa']

function flagFor(text: string): Flag {
  const s = text.toLowerCase()
  if (danger.some(k => s.includes(k))) return 'danger'
  if (violence.some(k => s.includes(k))) return 'violence'
  return null
}

const general = {
  en: [
    'Thank you for telling me. What part of this feels heaviest right now?',
    'I hear you. Take your time, there is no rush here. How long have you been carrying this?',
    'That sounds tiring. Would you like to keep talking, or try a slow breath together first?',
  ],
  rw: [
    'Urakoze kubimbwira. Ni iki kikuremereye cyane ubu?',
    'Ndakumva. Fata umwanya wawe. Ibi bimaze igihe kingana iki?',
    'Birumvikana ko binaniza. Urashaka gukomeza kuvuga, cyangwa tubanze duhumeke buhoro?',
  ],
}

export function replyFor(text: string, lang: Lang, turn: number): { text: string; flag: Flag } {
  const flag = flagFor(text)
  const en = lang === 'en'
  if (flag === 'danger')
    return { flag, text: en
      ? 'I am glad you told me. Your safety comes first. If you are in danger now, call 112. Is there someone you trust who can be with you?'
      : 'Nishimiye ko ubimbwiye. Umutekano wawe ni wo uza mbere. Niba uri mu kaga, hamagara 112. Hari umuntu wizeye ushobora kuba hamwe nawe?' }
  if (flag === 'violence')
    return { flag, text: en
      ? 'I am sorry this happened. It is not your fault. Isange One Stop Center can offer medical, legal and emotional support. You decide whether to report, and when.'
      : 'Mbabajwe n’ibyakubayeho. Si ikosa ryawe. Isange One Stop Center ishobora kugufasha mu buvuzi, mu mategeko no mu marangamutima. Ni wowe uhitamo niba utanga raporo n’igihe uyitangira.' }
  return { flag, text: general[lang][turn % general[lang].length] }
}
