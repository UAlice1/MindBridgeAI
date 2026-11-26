import { useEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FiActivity, FiFileText, FiHeart, FiHome, FiLogOut, FiMessageCircle, FiMic, FiPhone, FiSettings, FiUsers, FiGrid, FiShield, FiInbox } from 'react-icons/fi'
import { useApp } from '../lib/context'

// Leaves immediately and replaces this entry, so "back" does not return to this page.
const quickExit = () => window.location.replace('https://www.google.com')

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-pine">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <path d="M16 3C8 3 3 8 3 14.500S8 26 15 26l7 4-1-5c5-2 8-6 8-10.500C29 8 24 3 16 3z" fill="#1c5044" />
        <path d="M16 20.500c-9-5.500-5-11.500 0-7.500 5-4 9 2 0 7.500z" fill="#f4bb4a" />
      </svg>
      <span className="max-[400px]:text-base">YourVoice</span>
    </Link>
  )
}

function PreviewBar() {
  const { t } = useApp()
  return (
    <p className="bg-ink px-4 py-1.5 text-center text-sm text-white">
      {t('Design preview: sample data only. Nothing is sent to anyone.', 'Igerageza: amakuru ni ay’urugero. Nta kintu cyoherezwa.')}
    </p>
  )
}

function LangSwitch() {
  const { lang, setLang } = useApp()
  return (
    <div className="flex rounded-full border border-line bg-white p-0.5 text-sm font-bold" role="group" aria-label="Language">
      {(['en', 'rw'] as const).map(l => (
        <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)} className={`rounded-full px-3 py-2 ${lang === l ? 'bg-pine text-white' : 'text-soft'}`}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function SafetyButtons() {
  const { t, openHelp } = useApp()
  return (
    <>
      <button className="btn-danger px-3 sm:px-4" onClick={openHelp}><FiPhone aria-hidden /><span className="max-sm:sr-only">{t('Urgent help', 'Ubutabazi')}</span></button>
      <button className="btn-line px-3 sm:px-4" onClick={quickExit} title={t('Leave this site now', 'Va kuri uru rubuga')}><FiLogOut aria-hidden /><span className="max-sm:sr-only">{t('Quick exit', 'Sohoka vuba')}</span></button>
    </>
  )
}

export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useApp()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])
  const lines = [
    ['112', t('Police emergency: immediate danger', 'Polisi: uri mu kaga ako kanya')],
    ['3512', t('Gender-based violence', 'Ihohoterwa rishingiye ku gitsina')],
    ['116', t('Child helpline', 'Umurongo w’abana')],
  ]
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="help-title" className="m-auto w-[min(94vw,28rem)] rounded-3xl bg-white p-6 text-ink backdrop:bg-ink/60">
      <h2 id="help-title" className="h2">{t('Get help now', 'Saba ubufasha nonaha')}</h2>
      <p className="mt-1 text-soft">{t('Tap a number to call. Move to a safer place first if you can.', 'Kanda nimero uhamagare. Niba ubishoboye, banza ujye ahatekanye.')}</p>
      <div className="mt-4 grid gap-2">
        {lines.map(([n, d]) => (
          <a key={n} href={`tel:${n}`} className="flex items-center gap-4 rounded-2xl bg-rose-soft p-4 hover:bg-leaf">
            <span className="w-16 text-2xl font-extrabold text-rose">{n}</span><span className="font-semibold">{d}</span>
          </a>
        ))}
      </div>
      <button className="btn-line mt-4 w-full" onClick={onClose}>{t('Close', 'Funga')}</button>
    </dialog>
  )
}

export function PublicLayout() {
  const { t } = useApp()
  return (
    <div className="flex min-h-dvh flex-col">
      <PreviewBar />
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Logo />
        <div className="flex items-center gap-2"><LangSwitch /><SafetyButtons /></div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="mt-16 border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-4 py-8 text-soft">
          <p className="max-w-md">{t('YourVoice supports, and does not replace, professional care.', 'YourVoice yunganira inzobere, ntizisimbura.')}</p>
          <nav className="flex flex-wrap gap-5 font-bold">
            <Link to="/partners">{t('Partners', 'Abafatanyabikorwa')}</Link>
            <Link to="/staff/login">{t('For professionals', 'Inzobere')}</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

type Item = [to: string, label: string, icon: ReactNode]

function Shell({ items, end, foot, safety }: { items: Item[]; end: string; foot: ReactNode; safety: boolean }) {
  const { t } = useApp()
  return (
    <div className="flex min-h-dvh flex-col">
      <PreviewBar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 max-lg:flex-col">
        <aside className="shrink-0 px-4 pt-4 lg:sticky lg:top-0 lg:flex lg:h-[calc(100dvh-2rem)] lg:w-64 lg:flex-col lg:py-6">
          <div className="flex items-center justify-between gap-2"><Logo /><div className="flex gap-1 lg:hidden"><LangSwitch />{safety && <SafetyButtons />}</div></div>
          <nav aria-label={t('Main', 'Ibikubiyemo')} className="mt-4 flex gap-1 overflow-x-auto pb-2 lg:mt-8 lg:flex-col">
            {items.map(([to, label, icon]) => (
              <NavLink key={to} to={to} end={to === end} className={({ isActive }) => `flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-4 py-2 font-bold ${isActive ? 'bg-pine text-white' : 'text-soft hover:bg-leaf'}`}>
                {icon}{label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto max-lg:hidden">{foot}</div>
        </aside>
        <div className="min-w-0 flex-1 px-4 pb-12 lg:pl-8">
          <div className="hidden justify-end gap-2 py-5 lg:flex"><LangSwitch />{safety && <SafetyButtons />}</div>
          <main className="max-lg:pt-4"><Outlet /></main>
        </div>
      </div>
    </div>
  )
}

export function AppLayout() {
  const { t, alias } = useApp()
  const items: Item[] = [
    ['/app', t('Home', 'Ahabanza'), <FiHome key="i" aria-hidden />],
    ['/app/chat', t('AI chat', 'Andikira AI'), <FiMessageCircle key="i" aria-hidden />],
    ['/app/listen', t('AI listener', 'Vugana na AI'), <FiMic key="i" aria-hidden />],
    ['/app/support', t('Human support', 'Inzobere'), <FiUsers key="i" aria-hidden />],
    ['/app/report', t('Report', 'Tanga raporo'), <FiFileText key="i" aria-hidden />],
    ['/app/reports', t('My reports', 'Raporo zanjye'), <FiInbox key="i" aria-hidden />],
    ['/app/mood', t('My mood', 'Uko niyumva'), <FiActivity key="i" aria-hidden />],
    ['/app/partners', t('Partners', 'Abafatanyabikorwa'), <FiHeart key="i" aria-hidden />],
    ['/app/settings', t('Privacy', 'Ubuzima bwite'), <FiSettings key="i" aria-hidden />],
  ]
  return <Shell items={items} end="/app" safety foot={<p className="rounded-2xl bg-leaf p-4 text-sm text-soft">{t('Anonymous as', 'Izina ryihishe')}<br /><b className="text-base text-ink">{alias}</b></p>} />
}

export function StaffLayout() {
  const items: Item[] = [
    ['/staff', 'Requests', <FiInbox key="i" aria-hidden />],
    ['/staff/cases', 'Cases', <FiFileText key="i" aria-hidden />],
    ['/staff/messages', 'Messages', <FiMessageCircle key="i" aria-hidden />],
    ['/admin', 'Admin', <FiGrid key="i" aria-hidden />],
  ]
  return <Shell items={items} end="/staff" safety={false} foot={<p className="flex items-center gap-2 text-soft"><FiShield aria-hidden /> Staff area</p>} />
}
