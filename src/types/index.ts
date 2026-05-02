export type MessageRole = 'user' | 'ai'

export type EmotionTag =
  | 'neutral'
  | 'stress'
  | 'anxiety'
  | 'sadness'
  | 'anger'
  | 'trauma'
  | 'abuse'
  | 'hopelessness'
  | 'crisis'
  | 'positive'

/** Severity level used to determine crisis alert intensity */
export type CrisisSeverity = 'low' | 'medium' | 'high'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  emotion?: EmotionTag
  language?: 'en' | 'rw' | 'mixed'
}

export interface ChatSession {
  id: string
  messages: Message[]
  startedAt: Date
}

// ── Case management types ─────────────────────────────────────────────────

export type CaseStatus = 'pending' | 'flagged' | 'in_progress' | 'resolved' | 'closed'
export type RiskLevel = 'low' | 'medium' | 'high' | 'urgent'
export type CaseType = 'abuse' | 'crisis' | 'mental_health' | 'other'

export interface MediaAttachment {
  id: string
  name: string
  type: 'audio' | 'image' | 'video' | 'document'
  size: number
  url?: string
  mimeType?: string
}

export interface RiskAnalysis {
  riskLevel: RiskLevel
  riskScore: number
  caseType: CaseType
  isUrgent: boolean
  emotionTags: EmotionTag[]
  flaggedKeywords: string[]
  recommendedNGOs: NGO[]
  analysisText: string
}

export interface Case {
  id: string
  caseNumber: string
  submittedAt: Date
  updatedAt: Date
  status: CaseStatus
  riskLevel: RiskLevel
  riskScore: number
  caseType: CaseType
  isUrgent: boolean
  isAnonymous: boolean
  description: string
  mediaAttachments: MediaAttachment[]
  emotionTags: EmotionTag[]
  flaggedKeywords: string[]
  province?: string
  district?: string
  assignedNGO?: NGO
  assignedAt?: Date
  contactName?: string
  contactPhone?: string
  professionalNotes?: string
  responseMessage?: string
}

export interface Notification {
  id: string
  caseId: string
  caseNumber: string
  type: 'new_case' | 'new_urgent' | 'update' | 'resolved'
  message: string
  timestamp: Date
  read: boolean
  riskLevel: RiskLevel
}

export interface NGO {
  id: string
  name: string
  province: string
  services: string[]
  contact: string
  phone: string
  email?: string
  focus?: string
  emergencyHotline?: string
}
