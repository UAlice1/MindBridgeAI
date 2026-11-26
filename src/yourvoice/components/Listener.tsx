export type ListenerMood = 'idle' | 'listening' | 'thinking' | 'speaking' | 'caring'

/** The cartoon companion, "Ihumure". `mouth` (0 to 1) opens the mouth while speaking. */
export default function Listener({ mood = 'idle', mouth = 0, className = '' }: { mood?: ListenerMood; mouth?: number; className?: string }) {
  const look = mood === 'thinking' ? { x: 4, y: -4 } : { x: 0, y: 0 }
  const tilt = mood === 'listening' ? -4 : mood === 'caring' ? 4 : 0
  const brow = mood === 'caring' ? 5 : 0
  return (
    <svg viewBox="0 0 320 340" className={className} role="img" aria-label={`Ihumure, the cartoon AI listener, ${mood}`}>
      <circle cx="160" cy="165" r="145" fill="#d5e6dd" />
      <path d="M45 235c30-40 40-95 22-150" stroke="#8fb8a5" strokeWidth="6" fill="none" strokeLinecap="round" />
      {[[70, 105, -35], [80, 140, 30], [72, 172, -30], [66, 205, 30]].map(([x, y, r]) => (
        <ellipse key={y} cx={x} cy={y} rx="22" ry="9" fill="#8fb8a5" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <g className="breathe">
        <path d="M62 340c0-62 38-92 98-92s98 30 98 92z" fill="#1c5044" />
        <path d="M128 250l32 40 32-40" fill="#f4bb4a" />
        <path d="M138 222h44v30c0 14-44 14-44 0z" fill="#7d4a31" />
        <g transform={`rotate(${tilt} 160 220)`} style={{ transition: 'transform .5s' }}>
          <circle cx="160" cy="112" r="82" fill="#241c1a" />
          <circle cx="160" cy="46" r="34" fill="#241c1a" />
          <path d="M96 92c34-26 94-26 128 0l-4-20c-34-24-86-24-120 0z" fill="#f4bb4a" />
          <circle cx="96" cy="152" r="14" fill="#8e563a" /><circle cx="224" cy="152" r="14" fill="#8e563a" />
          <circle cx="94" cy="172" r="5" fill="#f4bb4a" /><circle cx="226" cy="172" r="5" fill="#f4bb4a" />
          <path d="M98 128c0-34 28-46 62-46s62 12 62 46v36c0 42-28 68-62 68s-62-26-62-68z" fill="#8e563a" />
          <g stroke="#241c1a" strokeWidth="5" strokeLinecap="round" fill="none">
            <path d={`M118 ${130 + brow}q14-9 28-${2 + brow * 2}`} />
            <path d={`M202 ${130 + brow}q-14-9-28-${2 + brow * 2}`} />
          </g>
          <g className="blink">
            <ellipse cx="133" cy="154" rx="12" ry="13" fill="#fff" /><ellipse cx="187" cy="154" rx="12" ry="13" fill="#fff" />
            <circle cx={133 + look.x} cy={155 + look.y} r="7.5" fill="#241c1a" /><circle cx={187 + look.x} cy={155 + look.y} r="7.5" fill="#241c1a" />
            <circle cx={136 + look.x} cy={152 + look.y} r="2.5" fill="#fff" /><circle cx={190 + look.x} cy={152 + look.y} r="2.5" fill="#fff" />
          </g>
          <path d="M155 176q5 6 11 0" stroke="#5f3522" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="115" cy="182" r="11" fill="#c0694a" opacity=".45" /><circle cx="205" cy="182" r="11" fill="#c0694a" opacity=".45" />
          {mood === 'speaking' && mouth > 0.1
            ? <g><ellipse cx="160" cy="201" rx={19 - mouth * 4} ry={3 + mouth * 11} fill="#4a1720" /><ellipse cx="160" cy={203 + mouth * 6} rx="9" ry={1 + mouth * 4} fill="#cf6b70" /></g>
            : <path d="M139 197q21 17 42 0" stroke="#4a1720" strokeWidth="5" fill="none" strokeLinecap="round" />}
        </g>
      </g>
      {mood === 'thinking' && [0, 1, 2].map(i => <circle key={i} cx={246 + i * 18} cy={70 - i * 14} r={4 + i * 2} fill="#1c5044" />)}
    </svg>
  )
}
