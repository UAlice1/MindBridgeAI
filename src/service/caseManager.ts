import type { Case, CaseStatus, MediaAttachment, RiskAnalysis, Notification } from '../types'

// ── In-memory case store (simulates backend) ──────────────────────────────
let cases: Case[] = []
let notifications: Notification[] = []

function generateCaseNumber(): string {
  const prefix = 'YV'
  const date = new Date()
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}-${dateStr}-${rand}`
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ── Case submission ───────────────────────────────────────────────────────

export interface SubmitCaseInput {
  description: string
  riskAnalysis: RiskAnalysis
  isAnonymous: boolean
  province?: string
  district?: string
  mediaAttachments?: MediaAttachment[]
  contactPhone?: string
  contactName?: string
}

export function submitCase(input: SubmitCaseInput): Case {
  const now = new Date()
  const caseId = generateId()
  const caseNumber = generateCaseNumber()

  const newCase: Case = {
    id: caseId,
    caseNumber,
    submittedAt: now,
    updatedAt: now,
    status: input.riskAnalysis.isUrgent ? 'flagged' : 'pending',
    riskLevel: input.riskAnalysis.riskLevel,
    caseType: input.riskAnalysis.caseType,
    isAnonymous: input.isAnonymous,
    isUrgent: input.riskAnalysis.isUrgent,
    description: input.isAnonymous ? '[Anonymous submission]' : input.description,
    mediaAttachments: input.mediaAttachments ?? [],
    emotionTags: input.riskAnalysis.emotionTags,
    flaggedKeywords: input.riskAnalysis.flaggedKeywords,
    riskScore: input.riskAnalysis.riskScore,
    province: input.province,
    district: input.district,
    assignedNGO: input.riskAnalysis.recommendedNGOs[0],
    assignedAt: now,
    contactPhone: input.isAnonymous ? undefined : input.contactPhone,
    contactName: input.isAnonymous ? undefined : input.contactName,
  }

  cases.unshift(newCase)

  // Create notification for professionals
  const notification: Notification = {
    id: generateId(),
    caseId,
    caseNumber,
    type: input.riskAnalysis.isUrgent ? 'new_urgent' : 'new_case',
    message: input.riskAnalysis.isUrgent
      ? `🚨 URGENT case ${caseNumber} requires immediate attention`
      : `New case ${caseNumber} submitted — ${input.riskAnalysis.caseType.replace('_', ' ')}`,
    timestamp: now,
    read: false,
    riskLevel: input.riskAnalysis.riskLevel,
  }
  notifications.unshift(notification)

  return newCase
}

// ── Case retrieval ────────────────────────────────────────────────────────

export function getAllCases(): Case[] {
  return [...cases]
}

export function getCaseById(id: string): Case | undefined {
  return cases.find(c => c.id === id)
}

export function getUrgentCases(): Case[] {
  return cases.filter(c => c.isUrgent && c.status !== 'resolved' && c.status !== 'closed')
}

export function getCasesByStatus(status: CaseStatus): Case[] {
  return cases.filter(c => c.status === status)
}

// ── Case updates ──────────────────────────────────────────────────────────

export function updateCaseStatus(id: string, status: CaseStatus, notes?: string): Case | undefined {
  const c = cases.find(c => c.id === id)
  if (!c) return undefined
  c.status = status
  c.updatedAt = new Date()
  if (notes) c.professionalNotes = notes

  const notification: Notification = {
    id: generateId(),
    caseId: id,
    caseNumber: c.caseNumber,
    type: status === 'resolved' ? 'resolved' : 'update',
    message: `Case ${c.caseNumber} status updated to ${status}`,
    timestamp: new Date(),
    read: false,
    riskLevel: c.riskLevel,
  }
  notifications.unshift(notification)

  return c
}

export function respondToCase(id: string, message: string): Case | undefined {
  const c = cases.find(c => c.id === id)
  if (!c) return undefined
  c.responseMessage = message
  c.status = 'in_progress'
  c.updatedAt = new Date()
  return c
}

// ── Notifications ─────────────────────────────────────────────────────────

export function getNotifications(): Notification[] {
  return [...notifications]
}

export function getUnreadCount(): number {
  return notifications.filter(n => !n.read).length
}

export function markAllRead(): void {
  notifications.forEach(n => { n.read = true })
}

export function markNotificationRead(id: string): void {
  const n = notifications.find(n => n.id === id)
  if (n) n.read = true
}

// ── Stats ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number
  urgent: number
  pending: number
  inProgress: number
  resolved: number
  byRiskLevel: Record<string, number>
  byCaseType: Record<string, number>
}

export function getDashboardStats(): DashboardStats {
  const byRiskLevel: Record<string, number> = {}
  const byCaseType: Record<string, number> = {}

  for (const c of cases) {
    byRiskLevel[c.riskLevel] = (byRiskLevel[c.riskLevel] ?? 0) + 1
    byCaseType[c.caseType] = (byCaseType[c.caseType] ?? 0) + 1
  }

  return {
    total: cases.length,
    urgent: cases.filter(c => c.isUrgent).length,
    pending: cases.filter(c => c.status === 'pending').length,
    inProgress: cases.filter(c => c.status === 'in_progress').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
    byRiskLevel,
    byCaseType,
  }
}

// ── Seed demo data for dashboard preview ─────────────────────────────────

export function seedDemoData(): void {
  if (cases.length > 0) return

  const demoNow = new Date()
  const ago = (mins: number) => new Date(demoNow.getTime() - mins * 60 * 1000)

  const demoCases: Case[] = [
    {
      id: 'demo-1',
      caseNumber: 'YV-20260502-1847',
      submittedAt: ago(5),
      updatedAt: ago(5),
      status: 'flagged',
      riskLevel: 'urgent',
      caseType: 'domestic_violence',
      isAnonymous: true,
      isUrgent: true,
      description: '[Anonymous submission]',
      mediaAttachments: [],
      emotionTags: ['abuse', 'crisis'],
      flaggedKeywords: ['beats me', 'locked me', 'trapped'],
      riskScore: 85,
      province: 'Kigali',
      district: 'Gasabo',
      assignedNGO: undefined,
    },
    {
      id: 'demo-2',
      caseNumber: 'YV-20260502-2031',
      submittedAt: ago(22),
      updatedAt: ago(10),
      status: 'in_progress',
      riskLevel: 'high',
      caseType: 'gbv',
      isAnonymous: false,
      isUrgent: false,
      description: 'User reported ongoing harassment and threats from a neighbor.',
      mediaAttachments: [],
      emotionTags: ['abuse', 'anxiety'],
      flaggedKeywords: ['threatens me', 'gbv'],
      riskScore: 60,
      province: 'Southern',
      district: 'Huye',
      contactName: 'Anonymous User',
    },
    {
      id: 'demo-3',
      caseNumber: 'YV-20260502-3312',
      submittedAt: ago(45),
      updatedAt: ago(45),
      status: 'pending',
      riskLevel: 'medium',
      caseType: 'mental_health',
      isAnonymous: true,
      isUrgent: false,
      description: '[Anonymous submission]',
      mediaAttachments: [],
      emotionTags: ['hopelessness', 'sadness'],
      flaggedKeywords: ['hopeless', 'no hope', 'depression'],
      riskScore: 35,
      province: 'Northern',
    },
    {
      id: 'demo-4',
      caseNumber: 'YV-20260501-4421',
      submittedAt: ago(180),
      updatedAt: ago(60),
      status: 'resolved',
      riskLevel: 'high',
      caseType: 'sexual_abuse',
      isAnonymous: true,
      isUrgent: false,
      description: '[Anonymous submission]',
      mediaAttachments: [],
      emotionTags: ['abuse', 'trauma'],
      flaggedKeywords: ['sexual abuse', 'raped'],
      riskScore: 70,
      province: 'Eastern',
      responseMessage: 'Case reviewed and referred to Isange One Stop Center Kibungo. Follow-up scheduled.',
    },
  ]

  cases = demoCases

  notifications = [
    {
      id: 'notif-1',
      caseId: 'demo-1',
      caseNumber: 'YV-20260502-1847',
      type: 'new_urgent',
      message: '🚨 URGENT case YV-20260502-1847 requires immediate attention',
      timestamp: ago(5),
      read: false,
      riskLevel: 'urgent',
    },
    {
      id: 'notif-2',
      caseId: 'demo-2',
      caseNumber: 'YV-20260502-2031',
      type: 'update',
      message: 'Case YV-20260502-2031 status updated to in_progress',
      timestamp: ago(10),
      read: false,
      riskLevel: 'high',
    },
    {
      id: 'notif-3',
      caseId: 'demo-4',
      caseNumber: 'YV-20260501-4421',
      type: 'resolved',
      message: 'Case YV-20260501-4421 has been resolved',
      timestamp: ago(60),
      read: true,
      riskLevel: 'high',
    },
  ]
}
