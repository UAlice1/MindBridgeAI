import { useState, useRef, useEffect, useCallback } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import type { Message, EmotionTag, CrisisSeverity } from '../types'
import {
  createChatSession,
  sendMessage,
  detectEmotionWithSeverity,
  detectLanguage,
  type ChatSession,
} from '../service/groq'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import ChatInput from './ChatInput'
import CrisisAlert from './CrisisAlert'
import { toaster } from './AppToaster'

interface ChatScreenProps {
  language: 'en' | 'rw'
  initialMessage?: string
  onToggleSidebar: () => void
  onNewChat: () => void
}

const WELCOME_MESSAGES: Record<'en' | 'rw', string> = {
  en: `Hello 👋 I'm YourVoice AI.

This is a safe, private space where you can share what's on your mind. I'm here to listen without judgment.

How are you feeling today?`,
  rw: `Muraho 👋 Ndi YourVoice AI.

Aha ni ahantu hizewe kandi hihishe aho ushobora gusangira icyo uri gutekereza. Ndi hano kukumva nta gucirwa urubanza.

Bite uyu munsi?`,
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function ChatScreen({
  language,
  initialMessage,
  onToggleSidebar,
  onNewChat,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)
  const [crisisSeverity, setCrisisSeverity] = useState<CrisisSeverity>('medium')
  const [isAbuse, setIsAbuse] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [currentLang, setCurrentLang] = useState<'en' | 'rw' | 'mixed'>(language)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialSentRef = useRef(false)

  // Initialize session + welcome message
  useEffect(() => {
    const session = createChatSession()
    setChatSession(session)

    const welcomeMsg: Message = {
      id: generateId(),
      role: 'ai',
      content: WELCOME_MESSAGES[language],
      timestamp: new Date(),
      emotion: 'neutral',
      language,
    }
    setMessages([welcomeMsg])
    initialSentRef.current = false
  }, [language])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = useCallback(
    async (text: string, session?: ChatSession) => {
      const activeSession = session ?? chatSession
      if (!activeSession || isLoading) return

      const detectedLang = detectLanguage(text)
      setCurrentLang(detectedLang)

      const { tag: detectedEmotionTag, severity } = detectEmotionWithSeverity(text)
      const detectedEmotion = detectedEmotionTag as EmotionTag

      if (detectedEmotion === 'crisis' || detectedEmotion === 'hopelessness' || detectedEmotion === 'abuse') {
        setShowCrisis(true)
        setCrisisSeverity(severity)
        setIsAbuse(detectedEmotion === 'abuse')
      }

      const userMsg: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
        emotion: detectedEmotion,
        language: detectedLang,
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const response = await sendMessage(activeSession, text)

        const aiMsg: Message = {
          id: generateId(),
          role: 'ai',
          content: response,
          timestamp: new Date(),
          emotion: 'neutral',
          language: detectedLang,
        }

        setMessages((prev) => [...prev, aiMsg])
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : ''
        const isApiKeyError  = msg === 'API_KEY_INVALID'
        const isRateLimited  = msg.startsWith('RATE_LIMITED')
        const retryAfterSec  = isRateLimited ? parseInt(msg.split(':')[1] ?? '60', 10) : 0
        const retryAfterMin  = Math.ceil(retryAfterSec / 60)

        if (isRateLimited) {
          toaster.create({
            title: language === 'rw' ? 'Gerageza nyuma gato' : 'Too many requests — please wait',
            description: language === 'rw'
              ? `Serivisi irakorana cyane ubu. Gerageza nyuma y'iminota ${retryAfterMin}.`
              : `The AI is receiving too many requests right now. Please try again in about ${retryAfterMin} minute${retryAfterMin !== 1 ? 's' : ''}.`,
            type: 'warning',
            duration: Math.min(retryAfterSec * 1000, 15000),
          })
        } else {
          toaster.create({
            title: isApiKeyError ? 'API Key Required' : 'Connection Error',
            description: isApiKeyError
              ? 'Please add your Gemini API key to the .env file (VITE_GEMINI_API_KEY).'
              : 'Could not reach the AI. Please check your connection.',
            type: 'error',
            duration: 5000,
          })
        }

        const fallbackMsg: Message = {
          id: generateId(),
          role: 'ai',
          content: isRateLimited
            ? (language === 'rw'
                ? `Mbabarira, ndi hafi y'abantu benshi ubu. Gerageza nyuma y'iminota ${retryAfterMin}. Ndi hano nawe. 💚`
                : `I'm a little overwhelmed with requests right now. Please try again in about ${retryAfterMin} minute${retryAfterMin !== 1 ? 's' : ''}. I'm still here for you. 💚`)
            : (language === 'rw'
                ? 'Mbabarira, hari ikibazo. Gerageza nanone. Ndi hano nawe. 💚'
                : "I'm sorry, there was an issue. Please try again. I'm still here for you. 💚"),
          timestamp: new Date(),
          emotion: 'neutral',
          language,
        }
        setMessages((prev) => [...prev, fallbackMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [chatSession, isLoading, language]
  )

  // Send initial message once session is ready
  useEffect(() => {
    if (
      initialMessage &&
      chatSession &&
      messages.length === 1 &&
      !initialSentRef.current
    ) {
      initialSentRef.current = true
      handleSend(initialMessage, chatSession)
    }
  }, [initialMessage, chatSession, messages.length, handleSend])

  const handleClear = () => {
    const session = createChatSession()
    setChatSession(session)
    setShowCrisis(false)
    setCrisisSeverity('medium')
    setIsAbuse(false)
    setCurrentLang(language)
    initialSentRef.current = false

    const welcomeMsg: Message = {
      id: generateId(),
      role: 'ai',
      content: WELCOME_MESSAGES[language],
      timestamp: new Date(),
      emotion: 'neutral',
      language,
    }
    setMessages([welcomeMsg])
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length

  return (
    <Box flex={1} display="flex" flexDirection="column" h="100%" bg="#ffffff">
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        onClear={handleClear}
        onNewChat={onNewChat}
        language={language}
        messageCount={userMessageCount}
      />

      {/* Messages area */}
      <Box flex={1} overflowY="auto" py={2} bg="#ffffff">
        <AnimatePresence>
          {showCrisis && (
            <CrisisAlert
              language={language}
              severity={crisisSeverity}
              isAbuse={isAbuse}
              onRequestReport={() => {
                const reportMsg = language === 'rw'
                  ? 'Nshaka inkunga yo gutanga raporo yihishe. Nkubwire uko nakora.'
                  : "I'd like help submitting a confidential report. Please guide me."
                handleSend(reportMsg)
              }}
            />
          )}
        </AnimatePresence>

        {/* Constrain messages to a readable width */}
        <Box maxW="860px" mx="auto">
          <VStack gap={0} align="stretch">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} language={currentLang} />
            ))}

            <AnimatePresence>
              {isLoading && <TypingIndicator language={language} />}
            </AnimatePresence>
          </VStack>
        </Box>

        <div ref={messagesEndRef} />
      </Box>

      <ChatInput onSend={handleSend} isLoading={isLoading} language={language} />
    </Box>
  )
}
