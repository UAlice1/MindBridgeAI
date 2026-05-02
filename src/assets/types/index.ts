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
