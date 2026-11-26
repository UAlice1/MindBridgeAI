/**
 * Anonymous Hash-Based Authentication System
 * Generates unique hash IDs for users without requiring personal information
 */

const STORAGE_KEY = 'yourvoice_anonymous_hash'
const CONVERSATIONS_KEY = 'yourvoice_conversations'

export interface AnonymousUser {
  hash: string
  createdAt: Date
  lastActive: Date
  conversationCount: number
}

export interface ConversationHistory {
  id: string
  hash: string
  startedAt: Date
  messages: Array<{
    role: 'user' | 'ai'
    content: string
    timestamp: Date
    emotion?: string
  }>
  summary?: string
}

/**
 * Generate a secure anonymous hash ID
 */
function generateHash(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const extraRandom = Math.random().toString(36).substring(2, 15)
  
  // Create a hash that looks like: YV-abc123def456ghi789
  return `YV-${timestamp}${randomPart}${extraRandom}`.toUpperCase().slice(0, 20)
}

/**
 * Get or create an anonymous user hash
 */
export function getOrCreateAnonymousUser(): AnonymousUser {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    
    if (stored) {
      const user = JSON.parse(stored) as AnonymousUser
      // Update last active
      user.lastActive = new Date()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    }
  } catch (error) {
    console.warn('Could not load anonymous user from storage:', error)
  }

  // Create new anonymous user
  const newUser: AnonymousUser = {
    hash: generateHash(),
    createdAt: new Date(),
    lastActive: new Date(),
    conversationCount: 0,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  } catch (error) {
    console.warn('Could not save anonymous user to storage:', error)
  }

  return newUser
}

/**
 * Get current anonymous user (without creating new one)
 */
export function getCurrentAnonymousUser(): AnonymousUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AnonymousUser
    }
  } catch (error) {
    console.warn('Could not load anonymous user:', error)
  }
  return null
}

/**
 * Update anonymous user data
 */
export function updateAnonymousUser(updates: Partial<AnonymousUser>): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const user = JSON.parse(stored) as AnonymousUser
      const updated = { ...user, ...updates, lastActive: new Date() }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    }
  } catch (error) {
    console.warn('Could not update anonymous user:', error)
  }
}

/**
 * Save conversation history
 */
export function saveConversation(conversation: ConversationHistory): void {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY)
    const conversations: ConversationHistory[] = stored ? JSON.parse(stored) : []
    
    // Add new conversation
    conversations.push(conversation)
    
    // Keep only last 50 conversations to avoid storage overflow
    const trimmed = conversations.slice(-50)
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(trimmed))
    
    // Update conversation count
    updateAnonymousUser({ 
      conversationCount: trimmed.filter(c => c.hash === conversation.hash).length 
    })
  } catch (error) {
    console.warn('Could not save conversation:', error)
  }
}

/**
 * Get all conversations for current user
 */
export function getUserConversations(): ConversationHistory[] {
  try {
    const user = getCurrentAnonymousUser()
    if (!user) return []
    
    const stored = localStorage.getItem(CONVERSATIONS_KEY)
    if (!stored) return []
    
    const all: ConversationHistory[] = JSON.parse(stored)
    return all.filter(c => c.hash === user.hash)
  } catch (error) {
    console.warn('Could not load conversations:', error)
    return []
  }
}

/**
 * Clear current anonymous user (logout)
 */
export function clearAnonymousUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Could not clear anonymous user:', error)
  }
}

/**
 * Export user data (for privacy/data portability)
 */
export function exportUserData(): string {
  try {
    const user = getCurrentAnonymousUser()
    const conversations = getUserConversations()
    
    const data = {
      user,
      conversations,
      exportedAt: new Date(),
    }
    
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.warn('Could not export user data:', error)
    return '{}'
  }
}

/**
 * Generate a shareable report ID (for NGO referrals)
 * This is different from the user hash - it's for a specific case/report
 */
export function generateReportId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 11)
  return `RPT-${timestamp}${random}`.toUpperCase()
}
