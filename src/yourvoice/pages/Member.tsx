import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiFileText, FiMessageCircle, FiMic, FiUsers } from 'react-icons/fi'
import Listener from '../components/Listener'
import { counselors } from '../data/sample'
import { useApp } from '../lib/context'

function useMoods() {
  const { t } = useApp()
  return [['😞', t('Very low', 'Nabi cyane')], ['😕', t('Low', 'Nabi')], ['😐', t('Okay', 'Biringaniye')], ['🙂', t('Good', 'Neza')], ['😊', t('Very good', 'Neza cyane')]]
}

function MoodPick({ value, onPick }: { value: number; onPick: (n: number) => void }) {
  const moods = useMoods()
  return (
    <div className="grid grid-cols-5 gap-2">
      {moods.map(([face, name], i) => (
        <button key={i} aria-pressed={value === i + 1} onClick={() => onPick(i + 1)} className={`rounded-2xl border p-2 text-center ${value === i + 1 ? 'border-pine bg-leaf' : 'border-line bg-white hover:bg-mist'}`}>
          <span className="block text-3xl" aria-hidden>{face}</span><span className="text-xs font-bold sm:text-sm">{name}</span>
        </button>
      ))}
    </div>
  )
}

export function Home() {
  const { t, alias } = useApp()
  const [mood, setMood] = useState(0)
  const links = [
    ['/app/chat', t('Write to the AI', 'Andikira AI'), <FiMessageCircle key="i" />],
    ['/app/support', t('Talk to a professional', 'Vugana n’inzobere'), <FiUsers key="i" />],
    ['/app/report', t('Report violence or abuse', 'Tanga raporo y’ihohoterwa'), <FiFileText key="i" />],
  ] as const
  return (
    <div className="space-y-5">
      <h1 className="h1">{t('Hello', 'Muraho')}, {alias}</h1>
      <section className="card">
        <h2 className="h2 mb-4">{t('How are you feeling today?', 'Wiyumva ute uyu munsi?')}</h2>
        <MoodPick value={mood} onPick={setMood} />
        {mood > 0 && <p className="mt-4 text-soft" role="status">{mood < 3 ? t('Thank you for being honest. Talking may help a little.', 'Urakoze kubivuga. Kuganira bishobora kugufasha.') : t('Thank you for checking in.', 'Urakoze kutubwira.')}</p>}
      </section>
      <section className="grid items-center gap-4 rounded-3xl bg-pine p-6 text-white sm:grid-cols-[1fr_14rem]">
        <div><h2 className="h1">{t('Ihumure is here to listen', 'Ihumure irahari ngo ikumve')}</h2><p className="mt-2 text-leaf">{t('Speak out loud, or just type.', 'Vuga, cyangwa wandike.')}</p><Link to="/app/listen" className="btn mt-5 bg-sun text-ink"><FiMic aria-hidden />{t('Start talking', 'Tangira kuvuga')}</Link></div>
        <Listener className="mx-auto h-52" />
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {links.map(([to, label, icon]) => <Link key={to} to={to} className="card hover:border-pine"><span className="text-2xl text-pine" aria-hidden>{icon}</span><b className="mt-3 block text-lg">{label}</b></Link>)}
      </div>
    </div>
  )
}

export function Mood() {
  const { t } = useApp()
  const moods = useMoods()
  const [today, setToday] = useState(0)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const week = [2, 3, 2, 4, 3, 4, saved ? today : 0]
  const days = [t('Thu', 'Kane'), t('Fri', 'Gatanu'), t('Sat', 'Gatandatu'), t('Sun', 'Cyumweru'), t('Mon', 'Mbere'), t('Tue', 'Kabiri'), t('Today', 'Uyu munsi')]
  return (
    <div className="space-y-5">
      <h1 className="h1">{t('My mood', 'Uko niyumva')}</h1>
      <section className="card">
        <h2 className="h2 mb-4">{t('Today', 'Uyu munsi')}</h2>
        <MoodPick value={today} onPick={n => { setToday(n); setSaved(false) }} />
        <label className="label mt-5" htmlFor="note">{t('Note (optional)', 'Icyo wongeraho (si ngombwa)')}</label>
        <textarea id="note" rows={3} className="field" value={note} onChange={e => setNote(e.target.value)} />
        <button className="btn-main mt-4" disabled={!today || saved} onClick={() => setSaved(true)}>{saved ? t('Saved in preview', 'Byabitswe mu igerageza') : t('Save check-in', 'Bika')}</button>
      </section>
      <section className="card">
        <h2 className="h2">{t('Last 7 days (sample)', 'Iminsi 7 ishize (urugero)')}</h2>
        <div className="mt-6 grid h-52 grid-cols-7 items-end gap-2 sm:gap-4">
          {week.map((n, i) => (
            <div key={i} className="flex h-full flex-col justify-end text-center" aria-label={`${days[i]}: ${n ? moods[n - 1][1] : '-'}`} role="img">
              <span aria-hidden>{n ? moods[n - 1][0] : ''}</span>
              <span className={`rounded-t-xl ${i === 6 ? 'bg-sun' : 'bg-pine'}`} style={{ height: `${n * 15}%` }} />
              <span className="mt-2 truncate border-t border-line pt-1 text-xs text-soft">{days[i]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function Support() {
  const { t } = useApp()
  const [who, setWho] = useState('')
  const [mode, setMode] = useState<'chat' | 'visit'>('chat')
  const [when, setWhen] = useState('')
  const [sent, setSent] = useState(false)
  if (sent) return (
    <div className="card mx-auto max-w-xl text-center">
      <h1 className="h1">{t('This is how a request will look', 'Uku ni ko ubusabe buzagaragara')}</h1>
      <p className="mt-3 text-soft">{t('Preview only: no professional was contacted. If you need help now, use Urgent help.', 'Ni igerageza: nta nzobere yamenyeshejwe. Niba ukeneye ubufasha ubu, kanda Ubutabazi.')}</p>
      <button className="btn-main mt-5" onClick={() => setSent(false)}>{t('Back', 'Subira inyuma')}</button>
    </div>
  )
  return (
    <div className="space-y-5">
      <h1 className="h1">{t('Talk to a professional', 'Vugana n’inzobere')}</h1>
      <div className="flex flex-wrap gap-2">
        {([['chat', t('Live chat', 'Ikiganiro ako kanya')], ['visit', t('Schedule a time', 'Teganya igihe')]] as const).map(([m, l]) => <button key={m} aria-pressed={mode === m} className={mode === m ? 'btn-main' : 'btn-line'} onClick={() => setMode(m)}>{l}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {counselors.map(c => (
          <button key={c.id} aria-pressed={who === c.id} disabled={mode === 'chat' && !c.online} onClick={() => setWho(c.id)} className={`card text-left ${who === c.id ? 'border-pine bg-leaf' : ''}`}>
            <b className="block text-lg">{c.name}</b><span className="block text-soft">{c.role}</span><span className="mt-2 block text-sm">{c.langs}</span>
            <span className={`mt-3 block font-bold ${c.online ? 'text-pine' : 'text-soft'}`}>{c.online ? t('Available', 'Arahari') : t('Away', 'Ntahari')}</span>
          </button>
        ))}
      </div>
      {mode === 'visit' && <div className="max-w-sm"><label className="label" htmlFor="when">{t('Preferred time', 'Igihe wifuza')}</label><input id="when" type="datetime-local" className="field" value={when} onChange={e => setWhen(e.target.value)} /></div>}
      <button className="btn-main" disabled={!who || (mode === 'visit' && !when) || (mode === 'chat' && !counselors.find(c => c.id === who)?.online)} onClick={() => setSent(true)}>{t('Request support', 'Saba ubufasha')}</button>
    </div>
  )
}

export function Settings() {
  const { t, alias } = useApp()
  const [keep, setKeep] = useState(false)
  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="h1">{t('Privacy', 'Ubuzima bwite')}</h1>
      <section className="card"><h2 className="h2">{t('Your anonymous name', 'Izina ryawe ryihishe')}</h2><p className="mt-2 text-lg font-bold text-pine">{alias}</p></section>
      <section className="card">
        <label className="flex items-center justify-between gap-4"><span><b className="block">{t('Keep my chat history', 'Bika ibiganiro byanjye')}</b><span className="text-soft">{t('Off by default, for shared phones.', 'Ntibibikwa keretse ubihisemo.')}</span></span><input type="checkbox" className="size-6 shrink-0 accent-pine" checked={keep} onChange={e => setKeep(e.target.checked)} /></label>
      </section>
      <section className="card">
        <h2 className="h2">{t('Leave or delete', 'Sohoka cyangwa usibe')}</h2>
        <div className="mt-4 flex flex-wrap gap-2"><Link to="/" className="btn-line">{t('Sign out', 'Sohoka')}</Link><button className="btn-danger" disabled>{t('Delete account (not connected yet)', 'Siba konti (ntibirakora)')}</button></div>
      </section>
    </div>
  )
}
