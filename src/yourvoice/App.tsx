import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppContext, type AppState, type Lang } from './lib/context'
import { newAlias } from './lib/identity'
import { AppLayout, HelpDialog, PublicLayout, StaffLayout } from './components/Layouts'
import { Join, Landing, Login, StaffLogin } from './pages/Public'
import { Chat, Listen } from './pages/Ai'
import { Home, Mood, Settings, Support } from './pages/Member'
import { MyReports, Partners, Report } from './pages/Reporting'
import { Admin, Cases, Messages, Requests } from './pages/Staff'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [alias, setAlias] = useState(newAlias)
  const [help, setHelp] = useState(false)
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  const state = useMemo<AppState>(() => ({
    lang, setLang, alias, setAlias,
    t: (en, rw) => (lang === 'en' ? en : rw),
    openHelp: () => setHelp(true),
  }), [lang, alias])

  return (
    <AppContext value={state}>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="join" element={<Join />} />
            <Route path="login" element={<Login />} />
            <Route path="partners" element={<div className="mx-auto max-w-6xl px-4 py-6"><Partners /></div>} />
            <Route path="staff/login" element={<StaffLogin />} />
          </Route>
          <Route path="app" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="listen" element={<Listen />} />
            <Route path="support" element={<Support />} />
            <Route path="report" element={<Report />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="mood" element={<Mood />} />
            <Route path="partners" element={<Partners />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route element={<StaffLayout />}>
            <Route path="staff" element={<Requests />} />
            <Route path="staff/cases" element={<Cases />} />
            <Route path="staff/messages" element={<Messages />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <HelpDialog open={help} onClose={() => setHelp(false)} />
      </BrowserRouter>
    </AppContext>
  )
}
