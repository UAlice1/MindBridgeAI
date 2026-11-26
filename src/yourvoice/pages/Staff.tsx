import { useState } from 'react'
import { counselors, partners, sampleCases, statuses, type CaseRow, type Status } from '../data/sample'

const riskStyle = { Urgent: 'bg-rose text-white', High: 'bg-rose-soft text-rose', Medium: 'bg-sun-soft text-ink', Low: 'bg-leaf text-pine' }
const Risk = ({ level }: { level: CaseRow['risk'] }) => <span className={`rounded-full px-3 py-1 text-sm font-bold ${riskStyle[level]}`}>{level}</span>

export function Requests() {
  const [accepted, setAccepted] = useState<string[]>([])
  const [on, setOn] = useState(true)
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="h1">Support requests</h1><button aria-pressed={on} className={on ? 'btn-main' : 'btn-line'} onClick={() => setOn(!on)}>{on ? 'Available' : 'Away'}</button></div>
      {sampleCases.slice(0, 3).map(c => (
        <article key={c.id} className="card flex flex-wrap items-center justify-between gap-4">
          <div><div className="flex flex-wrap items-center gap-2"><Risk level={c.risk} /><b>{c.person}</b><span className="text-soft">{c.when}</span></div><p className="mt-2 max-w-xl text-soft">{c.type}. {c.story}</p></div>
          <button className="btn-main" disabled={!on || accepted.includes(c.id)} onClick={() => setAccepted([...accepted, c.id])}>{accepted.includes(c.id) ? 'Accepted' : 'Accept'}</button>
        </article>
      ))}
    </div>
  )
}

export function Cases() {
  const [rows, setRows] = useState(sampleCases)
  const [filter, setFilter] = useState<Status | 'All'>('All')
  const [query, setQuery] = useState('')
  const [id, setId] = useState(sampleCases[0].id)
  const shown = rows.filter(c => (filter === 'All' || c.status === filter) && `${c.id} ${c.person} ${c.type}`.toLowerCase().includes(query.toLowerCase()))
  const open = rows.find(c => c.id === id)
  const change = (patch: Partial<CaseRow>) => setRows(rows.map(c => (c.id === id ? { ...c, ...patch } : c)))
  return (
    <div className="space-y-5">
      <h1 className="h1">Cases</h1>
      <div className="flex flex-wrap gap-2">
        <input className="field max-w-xs" aria-label="Search cases" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
        <select className="field max-w-44" aria-label="Filter by status" value={filter} onChange={e => setFilter(e.target.value as Status | 'All')}>{['All', ...statuses].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-2">
          {shown.map(c => <button key={c.id} aria-pressed={id === c.id} onClick={() => setId(c.id)} className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-left ${id === c.id ? 'border-pine bg-leaf' : 'border-line bg-white'}`}><span><b className="block">{c.id} · {c.type}</b><span className="text-soft">{c.person}, {c.when}</span></span><span className="flex items-center gap-3"><span className="font-bold">{c.status}</span><Risk level={c.risk} /></span></button>)}
          {!shown.length && <p className="card text-soft">No cases match. Clear the search or choose another status.</p>}
        </div>
        {open && <aside className="card">
          <h2 className="h2">{open.id}</h2><p className="mt-2 text-soft">{open.story}</p>
          <label className="label mt-5" htmlFor="st">Status</label><select id="st" className="field" value={open.status} onChange={e => change({ status: e.target.value as Status })}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
          <label className="label mt-4" htmlFor="ref">Refer to</label><select id="ref" className="field" value={open.partner} onChange={e => change({ partner: e.target.value })}>{partners.map(p => <option key={p.id}>{p.name}</option>)}</select>
          <label className="label mt-4" htmlFor="pn">Private note</label><textarea key={id} id="pn" rows={3} className="field" />
        </aside>}
      </div>
    </div>
  )
}

export function Messages() {
  const [log, setLog] = useState([{ me: false, text: 'Hello. I would like to talk to someone. (sample)' }])
  const [text, setText] = useState('')
  return (
    <section className="card flex h-[34rem] flex-col">
      <h1 className="h2 border-b border-line pb-3">Umucyo-7KQ2</h1>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">{log.map((m, i) => <p key={i} className={`w-fit max-w-[85%] rounded-3xl px-5 py-3 break-words ${m.me ? 'ml-auto bg-pine text-white' : 'bg-mist'}`}>{m.text}</p>)}</div>
      <form className="flex gap-2" onSubmit={e => { e.preventDefault(); if (text.trim()) { setLog([...log, { me: true, text: text.trim() }]); setText('') } }}><input className="field" aria-label="Message" value={text} onChange={e => setText(e.target.value)} placeholder="Write a reply" /><button className="btn-main">Send</button></form>
    </section>
  )
}

export function Admin() {
  const stats = [['Open cases', sampleCases.filter(c => c.status !== 'Closed').length], ['Urgent', sampleCases.filter(c => c.risk === 'Urgent').length], ['Professionals online', counselors.filter(c => c.online).length], ['Partners', partners.length]] as const
  const [off, setOff] = useState<string[]>([])
  return (
    <div className="space-y-6">
      <h1 className="h1">Admin</h1>
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">{stats.map(([k, v]) => <div key={k} className="card"><dt className="text-soft">{k}</dt><dd className="text-4xl font-extrabold text-pine">{v}</dd></div>)}</dl>
      <section className="card">
        <h2 className="h2">Cases by status</h2>
        <div className="mt-4 space-y-3">{statuses.map(s => { const n = sampleCases.filter(c => c.status === s).length; return <div key={s} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-3"><span>{s}</span><span className="h-4 rounded-full bg-mist"><span className="block h-4 rounded-full bg-pine" style={{ width: `${(n / sampleCases.length) * 100}%` }} /></span><b>{n}</b></div> })}</div>
      </section>
      <section className="card">
        <h2 className="h2">Professionals and partners</h2>
        <ul className="mt-3 divide-y divide-line">{[...counselors.map(c => ({ id: c.id, name: c.name, kind: c.role })), ...partners].map(p => <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><span><b className="block">{p.name}</b><span className="text-soft">{p.kind}</span></span><button className="btn-line" onClick={() => setOff(off.includes(p.id) ? off.filter(x => x !== p.id) : [...off, p.id])}>{off.includes(p.id) ? 'Restore access' : 'Suspend'}</button></li>)}</ul>
      </section>
    </div>
  )
}
