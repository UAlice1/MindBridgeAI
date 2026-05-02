import type { NGO } from '../types'

export const NGO_DATABASE: NGO[] = [
  {
    id: 'isange-chuk',
    name: 'Isange One Stop Center — CHUK',
    shortName: 'Isange CHUK',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 386 200',
    phone2: '3512',
    location: 'Kigali University Teaching Hospital (CHUK), Nyarugenge',
    district: 'Nyarugenge',
    province: 'Kigali',
    available24h: true,
    languages: ['en', 'rw', 'fr'],
    description: 'Safe, confidential support for survivors of abuse & gender-based violence. Medical, legal, and psychosocial services under one roof.',
    descriptionRw: 'Inkunga yihishe kandi yizewe ku barokotse guhohoterwa no gutuhohoterwa. Serivisi za muganga, amategeko, n\'inkunga y\'imibereho hamwe.',
    verified: true,
    urgentCapable: true,
    coordinates: { lat: -1.9441, lng: 30.0619 },
  },
  {
    id: 'isange-kacyiru',
    name: 'Isange One Stop Center — Kacyiru Police Hospital',
    shortName: 'Isange Kacyiru',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 311 811',
    location: 'Rwanda National Police Hospital, Kacyiru',
    district: 'Gasabo',
    province: 'Kigali',
    available24h: true,
    languages: ['en', 'rw'],
    description: 'Isange One Stop Center providing integrated GBV response services including medical care, psychosocial support, and legal assistance.',
    descriptionRw: 'Isange One Stop Center itanga serivisi zihujwe zo gusubiza GBV harimo kuvura, inkunga y\'imibereho, n\'inkunga y\'amategeko.',
    verified: true,
    urgentCapable: true,
    coordinates: { lat: -1.9355, lng: 30.0928 },
  },
  {
    id: 'caraes-ndera',
    name: 'Caraes Ndera Neuropsychiatric Hospital',
    shortName: 'Caraes Ndera',
    type: 'hospital',
    caseTypes: ['mental_health', 'crisis', 'general_support'],
    phone: '+250 788 386 200',
    location: 'Ndera, Gasabo District, Kigali',
    district: 'Gasabo',
    province: 'Kigali',
    available24h: true,
    languages: ['en', 'rw', 'fr'],
    description: 'Rwanda\'s leading neuropsychiatric hospital providing mental health care, crisis intervention, and psychiatric support.',
    descriptionRw: 'Ibitaro by\'indwara zo mu mutwe bya mbere mu Rwanda bitanga ubuvuzi bw\'ubuzima bwo mu mutwe, gufasha mu bihe bikomeye, n\'inkunga ya sikyatiri.',
    verified: true,
    urgentCapable: true,
    coordinates: { lat: -1.9012, lng: 30.1234 },
  },
  {
    id: 'rwanda-police-gbv',
    name: 'Rwanda National Police — GBV Unit',
    shortName: 'RNP GBV Unit',
    type: 'police',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse', 'crisis'],
    phone: '3512',
    phone2: '112',
    location: 'Nationwide — All Police Stations',
    district: 'All Districts',
    province: 'Kigali',
    available24h: true,
    languages: ['en', 'rw'],
    description: 'Rwanda National Police Gender-Based Violence unit. Free, confidential hotline for reporting abuse and violence.',
    descriptionRw: 'Ishami rya Polisi y\'u Rwanda rishinzwe guhohoterwa hakurikijwe igitsina. Inzira ya telefoni ubuntu kandi yihishe yo gutanga raporo y\'ihohoterwa.',
    verified: true,
    urgentCapable: true,
  },
  {
    id: 'haguruka',
    name: 'HAGURUKA — Association for Women & Children Rights',
    shortName: 'HAGURUKA',
    type: 'ngo',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse', 'general_support'],
    phone: '+250 788 303 030',
    email: 'info@haguruka.org.rw',
    location: 'KG 9 Ave, Kiyovu, Kigali',
    district: 'Nyarugenge',
    province: 'Kigali',
    available24h: false,
    languages: ['en', 'rw', 'fr'],
    description: 'Leading NGO providing legal aid, psychosocial support, and advocacy for women and children survivors of violence.',
    descriptionRw: 'Umuryango w\'inkunga utanga inkunga y\'amategeko, inkunga y\'imibereho, n\'ubwigenge ku bagore n\'abana barokotse ihohoterwa.',
    verified: true,
    urgentCapable: false,
    coordinates: { lat: -1.9536, lng: 30.0606 },
  },
  {
    id: 'rwamrec',
    name: 'RWAMREC — Rwanda Men\'s Resource Centre',
    shortName: 'RWAMREC',
    type: 'ngo',
    caseTypes: ['domestic_violence', 'gbv', 'mental_health', 'general_support'],
    phone: '+250 788 520 520',
    email: 'info@rwamrec.org',
    location: 'KG 11 Ave, Kigali',
    district: 'Gasabo',
    province: 'Kigali',
    available24h: false,
    languages: ['en', 'rw'],
    description: 'Organization working with men and boys to prevent GBV and promote gender equality. Counseling and community programs.',
    descriptionRw: 'Umuryango ukora n\'abagabo n\'abahungu kurwanya GBV no guteza imbere uburinganire bw\'ibitsina. Inama n\'porogaramu z\'umuryango.',
    verified: true,
    urgentCapable: false,
  },
  {
    id: 'kgbv-southern',
    name: 'Isange One Stop Center — Butare',
    shortName: 'Isange Butare',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 450 450',
    location: 'CHUB University Teaching Hospital, Huye',
    district: 'Huye',
    province: 'Southern',
    available24h: true,
    languages: ['en', 'rw', 'fr'],
    description: 'Isange One Stop Center at CHUB providing GBV response services for Southern Province.',
    descriptionRw: 'Isange One Stop Center kuri CHUB itanga serivisi zo gusubiza GBV ku ntara y\'Amajyepfo.',
    verified: true,
    urgentCapable: true,
  },
  {
    id: 'kgbv-northern',
    name: 'Isange One Stop Center — Ruhengeri',
    shortName: 'Isange Ruhengeri',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 560 560',
    location: 'Ruhengeri Referral Hospital, Musanze',
    district: 'Musanze',
    province: 'Northern',
    available24h: true,
    languages: ['en', 'rw'],
    description: 'Isange One Stop Center at Ruhengeri Referral Hospital providing GBV response services for Northern Province.',
    descriptionRw: 'Isange One Stop Center kuri Ruhengeri Referral Hospital itanga serivisi zo gusubiza GBV ku ntara y\'Amajyaruguru.',
    verified: true,
    urgentCapable: true,
  },
  {
    id: 'kgbv-eastern',
    name: 'Isange One Stop Center — Kibungo',
    shortName: 'Isange Kibungo',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 670 670',
    location: 'Kibungo Referral Hospital, Ngoma',
    district: 'Ngoma',
    province: 'Eastern',
    available24h: true,
    languages: ['en', 'rw'],
    description: 'Isange One Stop Center at Kibungo Referral Hospital providing GBV response services for Eastern Province.',
    descriptionRw: 'Isange One Stop Center kuri Kibungo Referral Hospital itanga serivisi zo gusubiza GBV ku ntara y\'Iburasirazuba.',
    verified: true,
    urgentCapable: true,
  },
  {
    id: 'kgbv-western',
    name: 'Isange One Stop Center — Kibuye',
    shortName: 'Isange Kibuye',
    type: 'hospital',
    caseTypes: ['domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '+250 788 780 780',
    location: 'Kibuye Referral Hospital, Karongi',
    district: 'Karongi',
    province: 'Western',
    available24h: true,
    languages: ['en', 'rw'],
    description: 'Isange One Stop Center at Kibuye Referral Hospital providing GBV response services for Western Province.',
    descriptionRw: 'Isange One Stop Center kuri Kibuye Referral Hospital itanga serivisi zo gusubiza GBV ku ntara y\'Iburengerazuba.',
    verified: true,
    urgentCapable: true,
  },
  {
    id: 'rnp-emergency',
    name: 'Rwanda Emergency Services',
    shortName: 'Emergency 112',
    type: 'police',
    caseTypes: ['crisis', 'domestic_violence', 'sexual_abuse', 'gbv', 'child_abuse'],
    phone: '112',
    location: 'Nationwide',
    district: 'All Districts',
    province: 'Kigali',
    available24h: true,
    languages: ['en', 'rw', 'fr'],
    description: 'Rwanda national emergency services. Call 112 for immediate life-threatening emergencies.',
    descriptionRw: 'Serivisi z\'ubutabazi bw\'u Rwanda. Hamagara 112 mu bihe bikomeye by\'akaga.',
    verified: true,
    urgentCapable: true,
  },
]

/** Get NGOs that can handle a specific case type */
export function getNGOsByCaseType(caseType: string): NGO[] {
  return NGO_DATABASE.filter(ngo => ngo.caseTypes.includes(caseType as never))
}

/** Get NGOs by province */
export function getNGOsByProvince(province: string): NGO[] {
  return NGO_DATABASE.filter(
    ngo => ngo.province === province || ngo.district === 'All Districts'
  )
}

/** Get urgent-capable NGOs */
export function getUrgentNGOs(): NGO[] {
  return NGO_DATABASE.filter(ngo => ngo.urgentCapable && ngo.available24h)
}

/** Route case to best NGOs based on type, urgency, and location */
export function routeCase(
  caseType: string,
  isUrgent: boolean,
  province?: string
): NGO[] {
  let candidates = NGO_DATABASE.filter(ngo =>
    ngo.caseTypes.includes(caseType as never)
  )

  if (isUrgent) {
    candidates = candidates.filter(ngo => ngo.urgentCapable && ngo.available24h)
  }

  if (province) {
    const local = candidates.filter(
      ngo => ngo.province === province || ngo.district === 'All Districts'
    )
    if (local.length > 0) return local.slice(0, 3)
  }

  // Default to Kigali + nationwide
  return candidates
    .sort((a, b) => {
      if (a.province === 'Kigali' && b.province !== 'Kigali') return -1
      if (b.province === 'Kigali' && a.province !== 'Kigali') return 1
      if (a.available24h && !b.available24h) return -1
      if (b.available24h && !a.available24h) return 1
      return 0
    })
    .slice(0, 3)
}
