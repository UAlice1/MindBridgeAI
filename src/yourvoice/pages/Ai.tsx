import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiMic, FiSend, FiSquare, FiVolume2, FiVolumeX } from 'react-icons/fi'
import Listener, { type ListenerMood } from '../components/Listener'
import { useApp } from '../lib/context'
import { replyFor, type Flag } from '../lib/demoReply'

function Suggestion({ flag }: { flag: Flag }) {
  const { t, openHelp } = useApp()
  if (!flag) return null
  return (
    <div role="status" className={`rounded-2xl p-4 ${flag === 'danger' ? 'bg-rose-soft' : 'bg-sun-soft'}`}>
      <b>{flag === 'danger' ? t('Are you safe right now?', 'Ese ubu uratekanye?') : t('Isange One Stop Center can help', 'Isange One Stop Center ishobora kugufasha')}</b>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-danger" onClick={openHelp}>{t('Urgent help', 'Ubutabazi')}</button>
        {flag === 'violence' && <Link className="btn-main" to="/app/report">{t('Report, if you want to', 'Tanga raporo niba ubishaka')}</Link>}
        <Link className="btn-line" to="/app/support">{t('Talk to a person', 'Vugana n’umuntu')}</Link>
      </div>
    </div>
  )
}

interface Msg { me: boolean; text: string; flag?: Flag }

export function Chat() {
  const { t, lang } = useApp()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [msgs, busy])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const send = (raw: string) => {
    const value = raw.trim()
    if (!value || busy) return
    const r = replyFor(value, lang, msgs.filter(m => m.me).length)
    setMsgs(m => [...m, { me: true, text: value }])
    setText('')
    setBusy(true)
    timer.current = window.setTimeout(() => {
      setMsgs(m => [...m, { me: false, ...r }])
      setBusy(false)
    }, 900)
  }
  const starters = [t('I feel overwhelmed', 'Ndumva byandenze'), t('I can’t sleep', 'Sinshobora gusinzira'), t('Someone is hurting me (abuse)', 'Nkorerwa ihohoterwa')]
  return (
    <section className="flex h-[calc(100dvh-12rem)] min-h-[28rem] flex-col rounded-3xl border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <div><h1 className="h2">{t('AI chat', 'Andikira AI')}</h1><p className="text-sm text-soft">{t('This is an AI, not a licensed therapist.', 'Iyi ni AI, si umuvuzi wabyigiye.')}</p></div>
        <Link to="/app/listen" className="btn-line"><FiMic aria-hidden />{t('Switch to voice', 'Koresha ijwi')}</Link>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
        {!msgs.length && (
          <div className="mx-auto max-w-md py-8 text-center">
            <p className="h2">{t('What is on your mind?', 'Ni iki kiri ku mutima wawe?')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">{starters.map(s => <button key={s} className="btn-line" onClick={() => send(s)}>{s}</button>)}</div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col gap-2 ${m.me ? 'items-end' : 'items-start'}`}>
            <p className={`max-w-[85%] rounded-3xl px-5 py-3 break-words whitespace-pre-wrap ${m.me ? 'rounded-br-md bg-pine text-white' : 'rounded-bl-md bg-mist'}`}>{m.text}</p>
            {m.flag && <Suggestion flag={m.flag} />}
          </div>
        ))}
        {busy && <p className="text-soft">{t('Writing…', 'Irandika…')}</p>}
        <div ref={end} />
      </div>
      <form className="flex gap-2 border-t border-line p-3" onSubmit={(e: FormEvent) => { e.preventDefault(); send(text) }}>
        <input aria-label={t('Your message', 'Ubutumwa bwawe')} className="field" value={text} onChange={e => setText(e.target.value)} placeholder={t('Write what you feel', 'Andika uko wiyumva')} autoComplete="off" />
        <button className="btn-main" disabled={busy || !text.trim()} aria-label={t('Send', 'Ohereza')}><FiSend aria-hidden /></button>
      </form>
    </section>
  )
}

// Minimal types for the browser speech API, which TypeScript's DOM library does not include.
interface Recognition {
  lang: string; interimResults: boolean; start(): void; stop(): void; abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }

export function Listen() {
  const { t, lang } = useApp()
  const [mood, setMood] = useState<ListenerMood>('idle')
  const [mouth, setMouth] = useState(0)
  const [caption, setCaption] = useState('')
  const [heard, setHeard] = useState('')
  const [flag, setFlag] = useState<Flag>(null)
  const [muted, setMuted] = useState(false)
  const [note, setNote] = useState('')
  const [consent, setConsent] = useState(false)
  const [askMic, setAskMic] = useState(false)
  const [text, setText] = useState('')
  const turn = useRef(0)
  const rec = useRef<Recognition | null>(null)
  const thinkTimer = useRef(0)
  const mouthTimer = useRef(0)
  const speakTimer = useRef(0)
  const session = useRef(0)

  const stopAll = useCallback(() => {
    session.current++
    window.clearTimeout(thinkTimer.current)
    window.clearTimeout(speakTimer.current)
    window.clearInterval(mouthTimer.current)
    rec.current?.abort()
    rec.current = null
    window.speechSynthesis?.cancel()
  }, [])
  useEffect(() => stopAll, [stopAll])

  const stop = () => { stopAll(); setMood('idle'); setMouth(0) }

  const speak = (line: string, f: Flag) => {
    const id = session.current
    setMood('speaking')
    let n = 0
    mouthTimer.current = window.setInterval(() => { n++; setMouth(0.15 + Math.abs(Math.sin(n * 1.7)) * 0.85) }, 110)
    const done = () => {
      if (id !== session.current) return
      window.clearInterval(mouthTimer.current)
      window.clearTimeout(speakTimer.current)
      setMouth(0)
      setMood(f ? 'caring' : 'idle')
    }
    const synth = window.speechSynthesis
    const voice = synth?.getVoices().find(v => v.lang.toLowerCase().startsWith(lang))
    // Without a matching voice, animate and show the caption instead of mispronouncing it.
    if (!muted && voice) {
      const u = new SpeechSynthesisUtterance(line)
      u.voice = voice
      u.lang = voice.lang
      u.rate = 0.92
      u.onend = done
      u.onerror = done
      synth.speak(u)
      speakTimer.current = window.setTimeout(done, 3000 + line.length * 100)
    } else {
      if (!muted) setNote(t('No voice for this language on this device, so the answer is shown as text.', 'Iki gikoresho nta jwi ry’uru rurimi gifite; igisubizo cyanditse.'))
      speakTimer.current = window.setTimeout(done, Math.max(2500, line.length * 55))
    }
  }

  const answer = (said: string) => {
    const value = said.trim()
    if (!value) return
    stopAll()
    const id = session.current
    setHeard(value)
    setCaption('')
    setNote('')
    setMood('thinking')
    const r = replyFor(value, lang, turn.current++)
    setFlag(r.flag)
    thinkTimer.current = window.setTimeout(() => {
      if (id !== session.current) return
      setCaption(r.text)
      speak(r.text, r.flag)
    }, 900)
  }

  const listen = () => {
    const w = window as SpeechWindow
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!Ctor) { setNote(t('This browser cannot hear speech. Please type below.', 'Iyi mushakisha ntishobora kumva ijwi. Andika hasi.')); return }
    stopAll()
    setNote('')
    const r = new Ctor()
    rec.current = r
    r.lang = lang === 'rw' ? 'rw-RW' : 'en-US'
    r.interimResults = false
    let got = false
    r.onresult = e => {
      if (rec.current !== r) return
      got = true
      answer(e.results[0][0].transcript)
    }
    r.onerror = () => { if (rec.current === r) setNote(t('I could not hear you. Check the microphone or type below.', 'Sinakumvise. Reba mikoro cyangwa wandike hasi.')) }
    r.onend = () => { if (rec.current === r && !got) { rec.current = null; setMood('idle') } }
    try { r.start(); setMood('listening') } catch { rec.current = null; setMood('idle') }
  }

  const active = mood === 'listening' || mood === 'thinking' || mood === 'speaking'
  const pressMic = () => {
    if (active) stop()
    else if (consent) listen()
    else setAskMic(true)
  }
  const label = {
    idle: t('Tap to talk', 'Kanda uvuge'), caring: t('Tap to talk', 'Kanda uvuge'),
    listening: t('I’m listening. Tap to stop', 'Ndakumva. Kanda uhagarike'),
    thinking: t('Thinking…', 'Ndatekereza…'), speaking: t('Tap to stop', 'Kanda uhagarike'),
  }[mood]
  return (
    <section className="card mx-auto max-w-3xl text-center">
      <div className="flex items-start justify-between gap-3 text-left">
        <div><h1 className="h2">{t('Talk to Ihumure', 'Vugana na Ihumure')}</h1><p className="text-sm text-soft">{t('A cartoon AI listener, not a licensed therapist.', 'Igishushanyo cya AI, si umuvuzi wabyigiye.')}</p></div>
        <button className="btn-line" aria-pressed={muted} aria-label={t('Mute voice', 'Cecekesha ijwi')} onClick={() => { stop(); setMuted(!muted) }}>{muted ? <FiVolumeX aria-hidden /> : <FiVolume2 aria-hidden />}</button>
      </div>
      <Listener mood={mood} mouth={mouth} className="mx-auto mt-2 h-72 sm:h-80" />
      <div aria-live="polite" className="mx-auto min-h-24 max-w-xl py-3">
        {heard && <p className="text-sm text-soft">{t('You said:', 'Wavuze:')} “{heard}”</p>}
        <p className="mt-1 text-lg font-semibold">{caption || (!heard && t('I have time for you. Where would you like to begin?', 'Mfite umwanya wawe. Urashaka guhera he?'))}</p>
        {note && <p className="mt-1 text-sm text-soft">{note}</p>}
      </div>
      <button onClick={pressMic} aria-label={label} className={`mx-auto grid size-20 place-items-center rounded-full text-3xl text-white ${mood === 'listening' ? 'pulse-ring bg-rose' : 'bg-pine hover:bg-pine-dark'}`}>{active ? <FiSquare aria-hidden /> : <FiMic aria-hidden />}</button>
      <p className="mt-2 font-bold">{label}</p>
      {askMic && (
        <div className="mx-auto mt-4 max-w-xl rounded-2xl bg-sun-soft p-4 text-left">
          <p>{t('Your browser may send your voice to its provider (for example Google) to turn it into text. Make sure nobody unsafe can hear you.', 'Mushakisha yawe ishobora kohereza ijwi ryawe ku bayikoze (nka Google) kugira ngo rihindurwe inyandiko. Banza urebe ko nta muntu ukubangamiye ukumva.')}</p>
          <div className="mt-3 flex flex-wrap gap-2"><button className="btn-main" onClick={() => { setConsent(true); setAskMic(false); listen() }}>{t('Use microphone', 'Koresha mikoro')}</button><button className="btn-line" onClick={() => setAskMic(false)}>{t('I’ll type', 'Ndandika')}</button></div>
        </div>
      )}
      {flag && <div className="mt-5 text-left"><Suggestion flag={flag} /></div>}
      <form className="mt-6 flex gap-2" onSubmit={e => { e.preventDefault(); answer(text); setText('') }}>
        <input className="field" aria-label={t('Type instead', 'Andika')} value={text} onChange={e => setText(e.target.value)} placeholder={t('Or type here', 'Cyangwa wandike hano')} autoComplete="off" />
        <button className="btn-main" disabled={!text.trim()} aria-label={t('Send', 'Ohereza')}><FiSend aria-hidden /></button>
      </form>
    </section>
  )
}
