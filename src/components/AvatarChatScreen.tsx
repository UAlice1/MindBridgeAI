import { useState, useRef, useEffect, useCallback } from 'react'
import { Box, VStack, HStack, Text, Button, IconButton } from '@chakra-ui/react'
import { FiMic, FiMicOff, FiMenu, FiSkipForward, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import type { Message, EmotionTag, CrisisSeverity } from '../types'
import {
  createChatSession,
  sendMessage,
  detectEmotionWithSeverity,
  detectLanguage,
  type ChatSession,
} from '../service/groq'
import { ttsService, detectResponseEmotion, type VoiceEmotion } from '../service/textToSpeech'
import TherapistAvatar from './TherapistAvatar'
import CrisisAlert from './CrisisAlert'
import ChatHeader from './ChatHeader'
import { toaster } from './AppToaster'

const MotionBox = motion.create(Box)

interface AvatarChatScreenProps {
  language: 'en' | 'rw'
  initialMessage?: string
  onToggleSidebar: () => void
  onNewChat: () => void
}

const C = {
  bg: '#ffffff',
  card: '#f9fafb',
  border: '#e5e7eb',
  accent: '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft: 'rgba(101,163,13,0.1)',
  text: '#111827',
  textMuted: '#6b7280',
  red: '#dc2626',
  redSoft: 'rgba(220,38,38,0.1)',
}

const WELCOME_MESSAGES: Record<'en' | 'rw', string> = {
  en: `Hello, I'm your voice therapist. I'm here to listen and support you. How are you feeling today?`,
  rw: `Muraho, ndi umuvuzi wawe w'ijwi. Ndi hano kumva no kugufasha. Bite uyu munsi?`,
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function AvatarChatScreen({
  language,
  initialMessage,
  onToggleSidebar,
  onNewChat,
}: AvatarChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentAIMessage, setCurrentAIMessage] = useState<string>('')
  const [avatarEmotion, setAvatarEmotion] = useState<VoiceEmotion>('neutral')
  const [showCrisis, setShowCrisis] = useState(false)
  const [crisisSeverity, setCrisisSeverity] = useState<CrisisSeverity>('medium')
  const [isAbuse, setIsAbuse] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const initialSentRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

    // Speak welcome message
    if (!isMuted && ttsService.isAvailable()) {
      speakMessage(WELCOME_MESSAGES[language], 'caring')
    }
  }, [language, isMuted])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * Speak a message with the avatar
   */
  const speakMessage = async (text: string, emotion: VoiceEmotion = 'neutral') => {
    if (isMuted || !ttsService.isAvailable()) return

    setIsSpeaking(true)
    setAvatarEmotion(emotion)
    setCurrentAIMessage(text)

    try {
      await ttsService.speakLong(text, {
        language,
        emotion,
        onEnd: () => {
          setIsSpeaking(false)
          setCurrentAIMessage('')
          setAvatarEmotion('neutral')
        },
        onError: (error) => {
          console.error('TTS error:', error)
          setIsSpeaking(false)
          setCurrentAIMessage('')
        },
      })
    } catch (error) {
      console.error('Speech error:', error)
      setIsSpeaking(false)
      setCurrentAIMessage('')
    }
  }

  /**
   * Start voice recording
   */
  const startListening = useCallback(() => {
    // @ts-expect-error - SpeechRecognition may not be in types
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      toaster.create({
        title: language === 'rw' ? 'Ijwi ntishoboka' : 'Voice not supported',
        description:
          language === 'rw'
            ? 'Iyi porogaramu ntiyemera ijwi'
            : 'Voice input is not supported in this browser',
        type: 'error',
        duration: 3000,
      })
      return
    }

    // Stop any ongoing speech
    if (isSpeaking) {
      ttsService.stop()
      setIsSpeaking(false)
    }

    setTranscript('')
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = language === 'rw' ? 'rw-RW' : 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        }
      }
      if (final) {
        setTranscript(final)
        handleSend(final)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      if (event.error !== 'no-speech') {
        toaster.create({
          title: language === 'rw' ? 'Ikosa' : 'Error',
          description:
            language === 'rw'
              ? 'Ntishobora kumva. Gerageza nanone.'
              : 'Could not understand. Please try again.',
          type: 'error',
          duration: 3000,
        })
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [language, isSpeaking])

  /**
   * Stop voice recording
   */
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  /**
   * Send message to AI
   */
  const handleSend = useCallback(
    async (text: string, session?: ChatSession) => {
      const activeSession = session ?? chatSession
      if (!activeSession || isLoading) return

      const detectedLang = detectLanguage(text)
      const { tag: detectedEmotionTag, severity } = detectEmotionWithSeverity(text)
      const detectedEmotion = detectedEmotionTag as EmotionTag

      // Crisis detection
      if (
        detectedEmotion === 'crisis' ||
        detectedEmotion === 'hopelessness' ||
        detectedEmotion === 'abuse'
      ) {
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

        // Speak the response
        const emotion = detectResponseEmotion(response)
        await speakMessage(response, emotion)
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : ''
        const isRateLimited = msg.startsWith('RATE_LIMITED')
        const retryAfterSec = isRateLimited ? parseInt(msg.split(':')[1] ?? '60', 10) : 0

        if (isRateLimited) {
          const retryAfterMin = Math.ceil(retryAfterSec / 60)
          toaster.create({
            title: language === 'rw' ? 'Gerageza nyuma gato' : 'Too many requests',
            description:
              language === 'rw'
                ? `Gerageza nyuma y'iminota ${retryAfterMin}.`
                : `Please try again in about ${retryAfterMin} minute${retryAfterMin !== 1 ? 's' : ''}.`,
            type: 'warning',
            duration: 5000,
          })
        }

        const fallbackMsg: Message = {
          id: generateId(),
          role: 'ai',
          content:
            language === 'rw'
              ? 'Mbabarira, hari ikibazo. Gerageza nanone. Ndi hano nawe. 💚'
              : "I'm sorry, there was an issue. Please try again. I'm still here for you. 💚",
          timestamp: new Date(),
          emotion: 'neutral',
          language,
        }
        setMessages((prev) => [...prev, fallbackMsg])

        await speakMessage(fallbackMsg.content, 'caring')
      } finally {
        setIsLoading(false)
      }
    },
    [chatSession, isLoading, language, isMuted]
  )

  // Send initial message
  useEffect(() => {
    if (initialMessage && chatSession && messages.length === 1 && !initialSentRef.current) {
      initialSentRef.current = true
      handleSend(initialMessage, chatSession)
    }
  }, [initialMessage, chatSession, messages.length, handleSend])

  /**
   * Clear conversation
   */
  const handleClear = () => {
    ttsService.stop()
    const session = createChatSession()
    setChatSession(session)
    setShowCrisis(false)
    setCrisisSeverity('medium')
    setIsAbuse(false)
    initialSentRef.current = false
    setIsSpeaking(false)
    setIsListening(false)

    const welcomeMsg: Message = {
      id: generateId(),
      role: 'ai',
      content: WELCOME_MESSAGES[language],
      timestamp: new Date(),
      emotion: 'neutral',
      language,
    }
    setMessages([welcomeMsg])

    if (!isMuted) {
      speakMessage(WELCOME_MESSAGES[language], 'caring')
    }
  }

  /**
   * Skip current speech
   */
  const handleSkipSpeech = () => {
    ttsService.stop()
    setIsSpeaking(false)
    setCurrentAIMessage('')
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length

  return (
    <Box flex={1} display="flex" flexDirection="column" h="100%" bg={C.bg}>
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        onClear={handleClear}
        onNewChat={onNewChat}
        language={language}
        messageCount={userMessageCount}
      />

      {/* Main content */}
      <Box flex={1} overflowY="auto" py={4} bg={C.bg}>
        <AnimatePresence>
          {showCrisis && (
            <CrisisAlert
              language={language}
              severity={crisisSeverity}
              isAbuse={isAbuse}
              onRequestReport={() => {
                const reportMsg =
                  language === 'rw'
                    ? 'Nshaka inkunga yo gutanga raporo yihishe.'
                    : "I'd like help submitting a confidential report."
                handleSend(reportMsg)
              }}
            />
          )}
        </AnimatePresence>

        <Box maxW="800px" mx="auto" px={4}>
          <VStack gap={6}>
            {/* Avatar */}
            <TherapistAvatar
              emotion={avatarEmotion}
              isSpeaking={isSpeaking}
              isListening={isListening}
              language={language}
              currentMessage={currentAIMessage}
              onToggleMute={() => {
                if (isSpeaking) {
                  ttsService.stop()
                  setIsSpeaking(false)
                }
                setIsMuted(!isMuted)
              }}
              isMuted={isMuted}
            />

            {/* Conversation transcript */}
            {messages.length > 1 && (
              <MotionBox
                w="full"
                bg={C.card}
                border={`1.5px solid ${C.border}`}
                borderRadius="xl"
                p={4}
                maxH="200px"
                overflowY="auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VStack gap={3} align="stretch">
                  {messages.slice(1).map((msg) => (
                    <Box key={msg.id}>
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color={msg.role === 'user' ? C.accent : C.textMuted}
                        mb={1}
                      >
                        {msg.role === 'user'
                          ? language === 'rw'
                            ? 'Wowe'
                            : 'You'
                          : language === 'rw'
                          ? 'Umuvuzi'
                          : 'Therapist'}
                      </Text>
                      <Text fontSize="sm" color={C.text} lineHeight="1.6">
                        {msg.content}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </MotionBox>
            )}

            {/* Voice controls */}
            <VStack gap={3} w="full" maxW="400px">
              {/* Microphone button */}
              <Button
                size="lg"
                h="64px"
                w="64px"
                borderRadius="full"
                bg={isListening ? C.red : C.accent}
                color="#ffffff"
                _hover={{ bg: isListening ? '#b91c1c' : C.accentHover }}
                onClick={isListening ? stopListening : startListening}
                isDisabled={isLoading || isSpeaking}
                boxShadow={
                  isListening
                    ? '0 0 0 12px rgba(220,38,38,0.2)'
                    : '0 4px 16px rgba(101,163,13,0.4)'
                }
              >
                {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
              </Button>

              <Text fontSize="sm" fontWeight="700" color={C.textMuted} textAlign="center">
                {isListening
                  ? language === 'rw'
                    ? 'Ndumva... Vuga nonaha'
                    : 'Listening... Speak now'
                  : isSpeaking
                  ? language === 'rw'
                    ? 'Ndavuga...'
                    : 'Speaking...'
                  : language === 'rw'
                  ? 'Kanda uvuge'
                  : 'Tap to speak'}
              </Text>

              {/* Control buttons */}
              <HStack spacing={2} justify="center">
                {/* Skip speech */}
                {isSpeaking && (
                  <IconButton
                    size="sm"
                    variant="outline"
                    aria-label="Skip"
                    onClick={handleSkipSpeech}
                  >
                    <FiSkipForward size={16} />
                  </IconButton>
                )}

                {/* Mute toggle */}
                <IconButton
                  size="sm"
                  variant="outline"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  onClick={() => {
                    if (isSpeaking) {
                      ttsService.stop()
                      setIsSpeaking(false)
                    }
                    setIsMuted(!isMuted)
                  }}
                  colorScheme={isMuted ? 'red' : 'gray'}
                >
                  {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                </IconButton>
              </HStack>

              {/* Info text */}
              <Text fontSize="xs" color={C.textMuted} textAlign="center" px={4}>
                {language === 'rw'
                  ? 'Vuga ibyiyumvo byawe. Ndumva kandi ndi hano kugufasha.'
                  : 'Speak your feelings. I'm listening and here to help.'}
              </Text>
            </VStack>
          </VStack>
        </Box>

        <div ref={messagesEndRef} />
      </Box>
    </Box>
  )
}
