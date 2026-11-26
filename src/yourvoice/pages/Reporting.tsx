import { useState } from 'react'
import { FiPhone, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { partners } from '../data/sample'
import { useApp } from '../lib/context'

export function Partners() {
  const { t } = useApp()
  return (
    <div>
      <h1 className="h1">{t('Where you can get help', 'Aho wabona ubufasha')}</h1>
      <p className="mt-2 text-soft">{t('Proposed partners. Details will be confirmed before launch.', 'Abafatanyabikorwa bateganyijwe. Amakuru azemezwa mbere yo gutangira.')}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {partners.map(p => (
          <article key={p.id} className={p.featured ? 'rounded-3xl bg-pine p-6 text-white md:col-span-2' : 'card'}>
            <p className={`font-bold ${p.featured ? 'text-sun' : 'text-soft'}`}>{p.kind}</p>
            <h2 className="h2 mt-1">{p.name}</h2>
            <p className={`mt-2 ${p.featured ? 'text-leaf' : 'text-soft'}`}>{t(p.about, p.aboutRw)}</p>
            {p.phone && <a href={`tel:${p.phone}`} className={`mt-4 ${p.featured ? 'btn bg-sun text-ink' : 'btn-line'}`}><FiPhone aria-hidden />{t('Call', 'Hamagara')} {p.phone}</a>}
          </article>
        ))}
      </div>
    </div>
  )
}

export function Report() {
  const { t, openHelp } = useApp()
  const [step, setStep] = useState(0)
  const [safe, setSafe] = useState<boolean | null>(null)
  const [type, setType] = useState('')
  const [story, setStory] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [to, setTo] = useState('isange')
  const [contact, setContact] = useState('app')
  const [agree, setAgree] = useState(false)
  const steps = [t('Safety', 'Umutekano'), t('What happened', 'Ibyabaye'), t('Who receives it', 'Uyakira'), t('Review', 'Genzura')]
  const types = [t('Physical violence', 'Ihohoterwa ku mubiri'), t('Sexual violence', 'Ihohoterwa rishingiye ku gitsina'), t('Emotional abuse', 'Ihohoterwa ry’amarangamutima'), t('Economic abuse', 'Ihohoterwa ry’umutungo'), t('Harassment', 'Itotezwa'), t('Something else', 'Ikindi')]
  const ready = [safe !== null, type !== '' && story.trim() !== '', to !== '', agree][step]
  const receivers = partners.filter(p => p.id !== 'rnp')

  if (step === 4) return (
    <div className="card mx-auto max-w-xl text-center">
      <h1 className="h1">{t('Preview finished', 'Igerageza rirangiye')}</h1>
      <p className="mt-3 text-soft">{t('No report was sent. To report something real now, call 3512 or 112.', 'Nta raporo yoherejwe. Niba ushaka gutanga raporo nyayo ubu, hamagara 3512 cyangwa 112.')}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2"><button className="btn-danger" onClick={openHelp}>{t('Urgent help', 'Ubutabazi')}</button><Link to="/app/reports" className="btn-line">{t('See a sample report', 'Reba urugero')}</Link></div>
    </div>
  )
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="h1">{t('Make a report', 'Tanga raporo')}</h1>
      <ol className="my-5 grid grid-cols-4 gap-2">{steps.map((s, i) => <li key={i} aria-current={i === step ? 'step' : undefined} className={`border-t-4 pt-2 text-xs font-bold sm:text-sm ${i <= step ? 'border-pine' : 'border-line text-soft'}`}>{s}</li>)}</ol>
      <div className="card">
        {step === 0 && <>
          <h2 className="h2">{t('Are you safe right now?', 'Ese ubu uratekanye?')}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <button aria-pressed={safe === true} className={safe === true ? 'btn-main' : 'btn-line'} onClick={() => setSafe(true)}>{t('Yes, I can continue', 'Yego, nshobora gukomeza')}</button>
            <button aria-pressed={safe === false} className={safe === false ? 'btn-danger' : 'btn-line'} onClick={() => { setSafe(false); openHelp() }}>{t('No, or not sure', 'Oya, cyangwa simbizi')}</button>
          </div>
          <p className="mt-5 text-soft">{t('You can stop at any time. Nothing is sent until the last step.', 'Ushobora guhagarika igihe cyose. Nta kintu cyoherezwa mbere y’intambwe ya nyuma.')}</p>
        </>}
        {step === 1 && <>
          <fieldset><legend className="label">{t('What kind of harm?', 'Ni irihe hohoterwa?')}</legend><div className="flex flex-wrap gap-2">{types.map(x => <button type="button" key={x} aria-pressed={type === x} className={type === x ? 'btn-main' : 'btn-line'} onClick={() => setType(x)}>{x}</button>)}</div></fieldset>
          <label className="label mt-6" htmlFor="story">{t('Tell only what you want to', 'Vuga gusa ibyo ushaka')}</label>
          <textarea id="story" className="field" rows={6} value={story} onChange={e => setStory(e.target.value)} />
          <label className="btn-line mt-4 focus-within:outline-3 focus-within:outline-sun"><FiPlus aria-hidden />{t('Add photo or document', 'Ongeraho ifoto cyangwa inyandiko')}<input type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={e => setFiles(Array.from(e.target.files ?? [], f => f.name))} /></label>
          {files.length > 0 && <p className="mt-2 text-sm break-all text-soft">{files.join(', ')}</p>}
          <p className="mt-3 text-sm text-soft">{t('Files can reveal who or where you are.', 'Dosiye zishobora kugaragaza uwo uri cyangwa aho uri.')}</p>
        </>}
        {step === 2 && <>
          <fieldset><legend className="label">{t('Who should receive this?', 'Ni nde wayakira?')}</legend><div className="grid gap-2">{receivers.map(p => (
            <label key={p.id} className="flex items-start gap-3 rounded-2xl border border-line p-4 has-checked:border-pine has-checked:bg-leaf"><input type="radio" name="to" className="mt-1 size-5 accent-pine" checked={to === p.id} onChange={() => setTo(p.id)} /><span><b>{p.name}</b>{p.featured && <span className="ml-2 rounded-full bg-sun px-2 py-0.5 text-sm font-bold">{t('Suggested', 'Byagirwamo inama')}</span>}<span className="block text-soft">{t(p.about, p.aboutRw)}</span></span></label>
          ))}</div></fieldset>
          <label className="label mt-5" htmlFor="contact">{t('How may they reply?', 'Bagusubiza bate?')}</label>
          <select id="contact" className="field" value={contact} onChange={e => setContact(e.target.value)}><option value="app">{t('Only inside YourVoice', 'Muri YourVoice gusa')}</option><option value="none">{t('Do not reply', 'Ntibasubize')}</option></select>
        </>}
        {step === 3 && <>
          <h2 className="h2">{t('Check before sending', 'Genzura mbere yo kohereza')}</h2>
          <dl className="mt-4 space-y-3">{[[t('Kind', 'Ubwoko'), type], [t('Your words', 'Amagambo yawe'), story], [t('Files', 'Dosiye'), String(files.length)], [t('Receiver', 'Uyakira'), partners.find(p => p.id === to)?.name ?? ''], [t('Reply', 'Igisubizo'), contact === 'app' ? t('Only inside YourVoice', 'Muri YourVoice gusa') : t('Do not reply', 'Ntibasubize')]].map(([k, v]) => <div key={k}><dt className="text-sm font-bold text-soft">{k}</dt><dd className="break-words whitespace-pre-wrap">{v}</dd></div>)}</dl>
          <label className="mt-5 flex gap-3 font-semibold"><input type="checkbox" className="size-5 shrink-0 accent-pine" checked={agree} onChange={e => setAgree(e.target.checked)} />{t('I choose to share this with the receiver above.', 'Nemeye gusangiza ibi uwatoranyijwe hejuru.')}</label>
        </>}
        <div className="mt-7 flex justify-between gap-3">
          <button className="btn-line" disabled={step === 0} onClick={() => setStep(step - 1)}>{t('Back', 'Subira inyuma')}</button>
          <button className="btn-main" disabled={!ready} onClick={() => setStep(step + 1)}>{step === 3 ? t('Finish preview', 'Soza igerageza') : t('Continue', 'Komeza')}</button>
        </div>
      </div>
    </div>
  )
}

export function MyReports() {
  const { t } = useApp()
  const done = [t('Received', 'Yakiriwe'), t('Being reviewed', 'Irasuzumwa'), t('Support offered', 'Ubufasha bwatanzwe'), t('Closed', 'Yafunzwe')]
  return (
    <div className="space-y-5">
      <h1 className="h1">{t('My reports', 'Raporo zanjye')}</h1>
      <article className="card">
        <p className="text-soft">{t('Sample', 'Urugero')} · YV-1042</p>
        <h2 className="h2">Isange One Stop Center</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-4">{done.map((d, i) => <li key={i} className={`border-t-4 pt-2 font-bold ${i < 2 ? 'border-pine' : 'border-line text-soft'}`}>{d}</li>)}</ol>
        <p className="mt-5 rounded-2xl bg-mist p-4">{t('“We have received your report. You can reply here when it is safe for you.”', '“Twakiriye raporo yawe. Ushobora kudusubiza hano igihe utekanye.”')}</p>
      </article>
      <Link to="/app/report" className="btn-main"><FiPlus aria-hidden />{t('New report', 'Raporo nshya')}</Link>
    </div>
  )
}
