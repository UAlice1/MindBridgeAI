// Sample content for the UI preview. People, cases and figures are invented.
// Partner listings and phone numbers must be confirmed with each organisation before launch.
export const partners = [
  { id: 'isange', name: 'Isange One Stop Center', kind: 'GBV support', featured: true, phone: '3512',
    about: 'Medical care, counselling and legal help for survivors of gender-based violence and child abuse, in one place.',
    aboutRw: 'Ubuvuzi, ubujyanama n’ubufasha mu mategeko ku bahohotewe, byose ahantu hamwe.' },
  { id: 'rnp', name: 'Rwanda National Police', kind: 'Emergency', featured: false, phone: '112',
    about: 'Call when you or someone else is in immediate danger.',
    aboutRw: 'Hamagara igihe wowe cyangwa undi muntu ari mu kaga.' },
  { id: 'haguruka', name: 'HAGURUKA', kind: 'Legal aid', featured: false, phone: '',
    about: 'Legal aid and support for women and children.',
    aboutRw: 'Ubufasha mu mategeko ku bagore n’abana.' },
  { id: 'rwamrec', name: 'RWAMREC', kind: 'Community', featured: false, phone: '',
    about: 'Works with men and boys to prevent gender-based violence.',
    aboutRw: 'Ikorana n’abagabo n’abahungu mu gukumira ihohoterwa.' },
  { id: 'ndera', name: 'Caraes Ndera', kind: 'Mental health', featured: false, phone: '',
    about: 'Specialist mental health and psychiatric care.',
    aboutRw: 'Ubuvuzi bwihariye bw’ubuzima bwo mu mutwe.' },
]

export const counselors = [
  { id: 'c1', name: 'Counselor A.', role: 'Counselor', langs: 'Kinyarwanda, English', online: true },
  { id: 'c2', name: 'Social worker M.', role: 'Social worker', langs: 'Kinyarwanda, French', online: true },
  { id: 'c3', name: 'GBV officer K.', role: 'GBV support', langs: 'Kinyarwanda, English', online: false },
]

export const statuses = ['New', 'In progress', 'Referred', 'Closed'] as const
export type Status = (typeof statuses)[number]
export interface CaseRow {
  id: string; person: string; type: string; risk: 'Urgent' | 'High' | 'Medium' | 'Low'
  status: Status; partner: string; when: string; story: string
}
export const sampleCases: CaseRow[] = [
  { id: 'YV-1042', person: 'Umucyo-7KQ2', type: 'Domestic violence', risk: 'Urgent', status: 'New', partner: 'Isange One Stop Center', when: '10 min ago', story: 'Sample: the person reports feeling unsafe at home and asks for a safe way to be contacted.' },
  { id: 'YV-1041', person: 'Amahoro-M4XD', type: 'Harassment', risk: 'High', status: 'In progress', partner: 'HAGURUKA', when: '2 hours ago', story: 'Sample: the person reports repeated unwanted messages and asks about legal options.' },
  { id: 'YV-1039', person: 'Ikizere-P9RT', type: 'Emotional distress', risk: 'Medium', status: 'Referred', partner: 'Caraes Ndera', when: 'Yesterday', story: 'Sample: the person has had difficulty sleeping and would like to see a specialist.' },
  { id: 'YV-1036', person: 'Urumuri-B2HN', type: 'Family conflict', risk: 'Low', status: 'Closed', partner: 'RWAMREC', when: '3 days ago', story: 'Sample: the person asked for mediation information and received it.' },
]
