import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheck, FiCopy, FiFileText, FiMessageCircle, FiMic, FiUsers } from 'react-icons/fi'
import Listener from '../components/Listener'
import { useApp } from '../lib/context'
import { newAlias, newRecoveryCode } from '../lib/identity'

export function Landing() {
  const { t } = useApp()
  const ways = [
    [<FiMessageCircle key="i" />, t('Write to the AI', 'Andikira AI'), t('A quiet text chat, in English or Kinyarwanda.', 'Ikiganiro cyanditse, mu Cyongereza cyangwa Ikinyarwanda.'), '/app/chat'],
    [<FiMic key="i" />, t('Talk to Ihumure', 'Vugana na Ihumure'), t('A cartoon listener that hears you and answers aloud.', 'Igishushanyo kikumva kikagusubiza mu ijwi.'), '/app/listen'],
    [<FiUsers key="i" />, t('Meet a professional', 'Vugana n’inzobere'), t('Request a counselor or social worker.', 'Saba umujyanama cyangwa umukozi w’imibereho.'), '/app/support'],
    [<FiFileText key="i" />, t('Report safely', 'Tanga raporo'), t('Choose who receives it: Isange or a partner NGO.', 'Hitamo uyakira: Isange cyangwa umufatanyabikorwa.'), '/app/report'],
  ] as const
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-[1.1fr_.9fr] md:py-14">
        <div>
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-pine sm:text-6xl">{t('You can say it here.', 'Hano ushobora kubivuga.')}</h1>
          <p className="mt-5 max-w-lg text-lg text-soft">{t('A place to be heard, to heal, and to get help with violence or abuse. You don’t give your name, email or phone.', 'Ahantu ho kumvwa, gukira no kubona ubufasha ku ihohoterwa. Nta zina, imeyili cyangwa telefoni usabwa.')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/join" className="btn-main px-7 text-lg">{t('Start anonymously', 'Tangira wihishe')}</Link>
            <Link to="/login" className="btn-line px-6 text-lg">{t('I have a code', 'Mfite kode')}</Link>
          </div>
        </div>
        <Listener className="mx-auto w-full max-w-sm" mood="idle" />
      </section>
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="h1">{t('Choose what feels easiest', 'Hitamo icyakoroheye')}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {ways.map(([icon, title, text, to]) => (
            <Link key={to} to={to} className="card flex gap-4 hover:border-pine">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-sun text-xl text-ink" aria-hidden>{icon}</span>
              <span><b className="block text-lg">{title}</b><span className="text-soft">{text}</span></span>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl bg-pine p-6 text-white sm:p-10">
          <h2 className="h1">{t('You decide what happens next', 'Ni wowe uhitamo ibikurikira')}</h2>
          <p className="mt-3 max-w-2xl text-leaf">{t('If you talk about gender-based violence, the AI can suggest Isange One Stop Center or a partner NGO. No report is sent until you choose to send it.', 'Niba uvuze ku ihohoterwa rishingiye ku gitsina, AI ishobora kukugira inama ya Isange One Stop Center cyangwa umufatanyabikorwa. Nta raporo yoherezwa utabihisemo.')}</p>
          <Link to="/partners" className="btn mt-5 bg-sun text-ink">{t('See our partners', 'Reba abafatanyabikorwa')}</Link>
        </div>
      </section>
    </>
  )
}

export function Join() {
  const { t, alias, setAlias } = useApp()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const [adult, setAdult] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true) } catch { setCopied(false) }
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      {!code ? (
        <div className="card">
          <h1 className="h1">{t('Create an anonymous account', 'Fungura konti yihishe')}</h1>
          <p className="mt-2 text-soft">{t('We give you a random name. No personal details.', 'Tuguha izina ritoranyijwe. Nta makuru yawe dusaba.')}</p>
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-leaf p-4">
            <b className="text-xl">{alias}</b>
            <button className="btn-line" onClick={() => setAlias(newAlias())}>{t('Change', 'Hindura')}</button>
          </div>
          <fieldset className="mt-6">
            <legend className="label">{t('Your age group', 'Ikigero cy’imyaka')}</legend>
            <div className="flex flex-wrap gap-2">
              {[t('Under 18', 'Munsi ya 18'), t('18 to 24', '18 kugeza 24'), t('25 or older', '25 no hejuru')].map((a, i) => (
                <label key={i} className="btn-line has-checked:bg-pine has-checked:text-white"><input className="sr-only" type="radio" name="age" checked={adult === String(i)} onChange={() => setAdult(String(i))} />{a}</label>
              ))}
            </div>
          </fieldset>
          <button className="btn-main mt-7 w-full" disabled={!adult} onClick={() => setCode(newRecoveryCode())}>{t('Create account', 'Fungura konti')}</button>
        </div>
      ) : (
        <div className="card">
          <h1 className="h1">{t('Save your recovery code', 'Bika kode yawe')}</h1>
          <p className="mt-2 text-soft">{t('This is the only way back into your account. We cannot recover it for you.', 'Ni yo yonyine igusubiza muri konti yawe. Ntidushobora kuyikugarurira.')}</p>
          <p className="mt-5 rounded-2xl bg-sun-soft p-5 text-center font-mono text-lg font-bold break-all">{code}</p>
          <button className="btn-line mt-3 w-full" onClick={copy}>{copied ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}{copied ? t('Copied', 'Byakoporowe') : t('Copy code', 'Koporora kode')}</button>
          <p className="mt-4 text-sm text-soft">{t('If someone checks your phone, write it on paper and keep it somewhere safe.', 'Niba hari ureba telefoni yawe, yandike ku rupapuro urubike ahatekanye.')}</p>
          <label className="mt-5 flex items-center gap-3 font-semibold"><input type="checkbox" className="size-5 accent-pine" checked={saved} onChange={e => setSaved(e.target.checked)} />{t('I have saved my code', 'Nabitse kode yanjye')}</label>
          <button className="btn-main mt-5 w-full" disabled={!saved} onClick={() => nav('/app')}>{t('Continue', 'Komeza')}</button>
        </div>
      )}
    </div>
  )
}

export function Login() {
  const { t } = useApp()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const ok = code.replace(/[^a-z0-9]/gi, '').length === 20
  return (
    <form className="card mx-auto mt-6 max-w-xl max-sm:mx-4" onSubmit={e => { e.preventDefault(); nav('/app') }}>
      <h1 className="h1">{t('Welcome back', 'Murakaza neza')}</h1>
      <label className="label mt-6" htmlFor="code">{t('Recovery code', 'Kode yawe')}</label>
      <input id="code" className="field font-mono uppercase" autoComplete="off" value={code} onChange={e => setCode(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" />
      <button className="btn-main mt-5 w-full" disabled={!ok}>{t('Enter', 'Injira')}</button>
      <p className="mt-4 text-soft">{t('Lost it?', 'Warayitaye?')} <Link className="font-bold text-pine underline" to="/join">{t('Start a new account', 'Fungura konti nshya')}</Link></p>
    </form>
  )
}

export function StaffLogin() {
  const nav = useNavigate()
  return (
    <form className="card mx-auto mt-6 max-w-xl max-sm:mx-4" onSubmit={e => { e.preventDefault(); nav('/staff') }}>
      <h1 className="h1">Professional sign in</h1>
      <p className="mt-2 text-soft">For verified counselors, partner NGOs and Isange staff. Sign-in is not connected yet, so this opens the preview.</p>
      <label className="label mt-6" htmlFor="mail">Work email</label>
      <input id="mail" type="email" className="field" autoComplete="off" />
      <label className="label mt-4" htmlFor="pass">Password</label>
      <input id="pass" type="password" className="field" autoComplete="off" />
      <button className="btn-main mt-6 w-full">Open preview</button>
    </form>
  )
}
