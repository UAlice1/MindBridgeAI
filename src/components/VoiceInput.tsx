import { useState, useRef, useCallback } from 'react'
import { Box, HStack, VStack, Text, Circle } from '@chakra-ui/react'
import { FiMic, FiMicOff, FiSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const MotionBox = motion.create(Box)
const MotionCircle = motion.create(Circle)

const C = {
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.1)',
  accentBorder:'rgba(101,163,13,0.3)',
  red:         '#dc2626',
  redSoft:     'rgba(220,38,38,0.1)',
  border:      '#e5e7eb',
  text:        '#111827',
  textMuted:   '#6b7280',
  bg:          '#ffffff',
}

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language: 'en' | 'rw'
  disabled?: boolean
}

export default function VoiceInput({ onTranscript, language, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const labels = {
    en: {
      tap:       'Tap to speak',
      recording: 'Listening… speak now',
      stop:      'Tap to stop',
      noSupport: 'Voice not supported in this browser',
      error:     'Could not access microphone',
      send:      'Use this text',
    },
    rw: {
      tap:       'Kanda uvuge',
      recording: 'Ndumva… vuga nonaha',
      stop:      'Kanda uhagarike',
      noSupport: 'Ijwi ntishoboka muri iyi porogaramu',
      error:     'Ntishoboka kugera kuri mikoro',
      send:      'Koresha iki kiganiro',
    },
  }
  const t = labels[language]

  const startRecording = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SpeechRecognitionAPI = w.SpeechRecognition || w.webkitSpeechRecognition

    if (!SpeechRecognitionAPI) {
      setIsSupported(false)
      return
    }

    setError(null)
    setTranscript('')

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language === 'rw' ? 'rw-RW' : 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      setTranscript(final || interim)
    }

    recognition.onerror = () => {
      setError(t.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [language, t.error])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const handleUseTranscript = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim())
      setTranscript('')
    }
  }

  if (!isSupported) {
    return (
      <HStack
        px={3} py={2} borderRadius="lg"
        bg="rgba(220,38,38,0.06)"
        border="1.5px solid rgba(220,38,38,0.2)"
        spacing={2}
      >
        <Box color={C.red}><FiMicOff size={14} /></Box>
        <Text fontSize="xs" color={C.red}>{t.noSupport}</Text>
      </HStack>
    )
  }

  return (
    <VStack spacing={3} align="stretch">
      {/* Mic button */}
      <HStack spacing={3} align="center">
        <MotionCircle
          size="44px"
          bg={isRecording ? C.red : C.accent}
          cursor={disabled ? 'not-allowed' : 'pointer'}
          opacity={disabled ? 0.5 : 1}
          onClick={disabled ? undefined : (isRecording ? stopRecording : startRecording)}
          boxShadow={isRecording
            ? '0 0 0 8px rgba(220,38,38,0.15)'
            : '0 2px 8px rgba(101,163,13,0.3)'}
          animate={isRecording ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ repeat: isRecording ? Infinity : 0, duration: 1.2 }}
          aria-label={isRecording ? t.stop : t.tap}
        >
          {isRecording
            ? <FiSquare size={16} color="#ffffff" />
            : <FiMic size={16} color="#ffffff" />
          }
        </MotionCircle>

        <VStack spacing={0} align="flex-start">
          <Text fontSize="xs" fontWeight="700" color={isRecording ? C.red : C.text}>
            {isRecording ? t.recording : t.tap}
          </Text>
          {isRecording && (
            <HStack spacing={1} mt={0.5}>
              {[0, 1, 2, 3].map(i => (
                <MotionBox
                  key={i}
                  w="3px"
                  borderRadius="full"
                  bg={C.red}
                  animate={{ height: ['4px', '12px', '4px'] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                />
              ))}
            </HStack>
          )}
        </VStack>
      </HStack>

      {/* Transcript preview */}
      <AnimatePresence>
        {transcript && (
          <MotionBox
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <Box
              bg={C.accentSoft}
              border={`1.5px solid ${C.accentBorder}`}
              borderRadius="xl" p={3}
            >
              <Text fontSize="sm" color={C.text} lineHeight="1.6" mb={2}>
                "{transcript}"
              </Text>
              <Box
                as="button"
                px={3} py={1.5}
                bg={C.accent} color="#ffffff"
                borderRadius="lg"
                fontSize="xs" fontWeight="700"
                cursor="pointer"
                _hover={{ bg: C.accentHover }}
                onClick={handleUseTranscript}
              >
                {t.send}
              </Box>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <Text fontSize="xs" color={C.red}>{error}</Text>
      )}
    </VStack>
  )
}
