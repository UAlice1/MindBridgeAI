interface BrainLogoProps {
  size?:      number
  color?:     string
  glowColor?: string
}

export default function BrainLogo({
  size      = 28,
  color     = '#65a30d',
  glowColor = 'rgba(101,163,13,0.3)',
}: BrainLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
    >
      <path
        d="M12 3C9.5 3 7.5 4.5 6.8 6.6C5.2 6.8 4 8.2 4 9.8C4 10.6 4.3 11.3 4.8 11.9C4.3 12.4 4 13.2 4 14C4 15.7 5.3 17.1 7 17.3C7.6 18.8 9.1 19.8 10.8 19.9V12.5"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M12 3C14.5 3 16.5 4.5 17.2 6.6C18.8 6.8 20 8.2 20 9.8C20 10.6 19.7 11.3 19.2 11.9C19.7 12.4 20 13.2 20 14C20 15.7 18.7 17.1 17 17.3C16.4 18.8 14.9 19.8 13.2 19.9V12.5"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
      <line
        x1="12" y1="3.5" x2="12" y2="19.5"
        stroke={color} strokeWidth="1" strokeLinecap="round"
        strokeDasharray="2 2.5" opacity="0.4"
      />
      <circle cx="8"    cy="10"   r="1"   fill={color} opacity="0.7" />
      <circle cx="16"   cy="10"   r="1"   fill={color} opacity="0.7" />
      <circle cx="7.5"  cy="14.5" r="0.8" fill={color} opacity="0.5" />
      <circle cx="16.5" cy="14.5" r="0.8" fill={color} opacity="0.5" />
    </svg>
  )
}
