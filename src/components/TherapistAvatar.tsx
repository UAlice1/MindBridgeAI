import { useEffect, useState, useRef } from 'react'
import { Box, VStack, HStack, Text, Circle } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiVolume2, FiVolumeX, FiMic, FiMicOff } from 'react-icons/fi'

const MotionBox = motion.create(Box)
const MotionCircle = motion.create(Circle)

const C = {
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.1)',
  border:      '#e5e7eb',
  text:        '#111827',
  textMuted:   '#6b7280',
  bg:          '#ffffff',
  card:        '#f9fafb',
}

interface TherapistAvatarProps {
  emotion?: 'neutral' | 'happy' | 'caring' | 'concerned' | 'hopeful'
  isSpeaking: boolean
  isListening: boolean
  language: 'en' | 'rw'
  currentMessage?: string
  onToggleMute?: () => void
  isMuted?: boolean
}

/** Animated therapist avatar with emotions and lip-sync */
export default function TherapistAvatar({
  emotion = 'neutral',
  isSpeaking,
  isListening,
  language,
  currentMessage,
  onToggleMute,
  isMuted = false,
}: TherapistAvatarProps) {
  const [mouthOpen, setMouthOpen] = useState(false)
  const mouthInterval = useRef<NodeJS.Timeout>()

  // Animate mouth when speaking
  useEffect(() => {
    if (isSpeaking) {
      mouthInterval.current = setInterval(() => {
        setMouthOpen((prev) => !prev)
      }, 180)
    } else {
      setMouthOpen(false)
      if (mouthInterval.current) {
        clearInterval(mouthInterval.current)
      }
    }
    return () => {
      if (mouthInterval.current) {
        clearInterval(mouthInterval.current)
      }
    }
  }, [isSpeaking])

  // Emotion colors and expressions
  const emotionConfig = {
    neutral:   { color: '#a78bfa', label: language === 'rw' ? 'Ndumva' : 'Listening' },
    happy:     { color: '#4ade80', label: language === 'rw' ? 'Nishimye' : 'Happy' },
    caring:    { color: '#60a5fa', label: language === 'rw' ? 'Ndi kumva' : 'I understand' },
    concerned: { color: '#f97316', label: language === 'rw' ? 'Ndabivuyeho' : 'I care' },
    hopeful:   { color: '#facc15', label: language === 'rw' ? 'Byiza' : 'Hopeful' },
  }

  const config = emotionConfig[emotion]

  return (
    <VStack spacing={4} align="center" py={6}>
      {/* Avatar container */}
      <Box position="relative">
        {/* Glow effect when speaking or listening */}
        {(isSpeaking || isListening) && (
          <MotionCircle
            size="260px"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg={isSpeaking ? config.color : C.accent}
            opacity={0.15}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          />
        )}

        {/* Main avatar circle */}
        <MotionBox
          w="220px"
          h="220px"
          borderRadius="full"
          bg={C.card}
          border={`4px solid ${isSpeaking ? config.color : isListening ? C.accent : C.border}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          boxShadow={isSpeaking ? `0 8px 32px ${config.color}40` : '0 4px 16px rgba(0,0,0,0.08)'}
          animate={{
            borderColor: isSpeaking ? config.color : isListening ? C.accent : C.border,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Face SVG */}
          <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
            {/* Head */}
            <circle cx="80" cy="70" r="50" fill={config.color} opacity="0.2" />
            
            {/* Eyes */}
            <motion.circle
              cx="65"
              cy="65"
              r="4"
              fill={C.text}
              animate={isListening ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <motion.circle
              cx="95"
              cy="65"
              r="4"
              fill={C.text}
              animate={isListening ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            />

            {/* Eyebrows */}
            <motion.path
              d="M 55 55 Q 65 50 75 55"
              stroke={C.text}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={emotion === 'concerned' ? { y: [-2, 0, -2] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <motion.path
              d="M 85 55 Q 95 50 105 55"
              stroke={C.text}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              animate={emotion === 'concerned' ? { y: [-2, 0, -2] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />

            {/* Mouth */}
            {mouthOpen ? (
              // Open mouth (speaking)
              <motion.ellipse
                cx="80"
                cy="85"
                rx="8"
                ry="10"
                fill={C.text}
                opacity="0.6"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.1 }}
              />
            ) : emotion === 'happy' ? (
              // Smile
              <path
                d="M 65 85 Q 80 95 95 85"
                stroke={C.text}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            ) : emotion === 'concerned' ? (
              // Concerned mouth
              <path
                d="M 65 90 Q 80 85 95 90"
                stroke={C.text}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Neutral mouth
              <line
                x1="68"
                y1="88"
                x2="92"
                y2="88"
                stroke={C.text}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Listening indicator */}
          {isListening && (
            <Box position="absolute" bottom={4} right={4}>
              <MotionCircle
                size="32px"
                bg={C.accent}
                color="#ffffff"
                boxShadow="0 2px 8px rgba(101,163,13,0.4)"
              >
                <FiMic size={14} />
              </MotionCircle>
            </Box>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <Box position="absolute" bottom={4} right={4}>
              <MotionCircle
                size="32px"
                bg={config.color}
                color="#ffffff"
                boxShadow={`0 2px 8px ${config.color}60`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
              </MotionCircle>
            </Box>
          )}
        </MotionBox>

        {/* Mute toggle button */}
        {onToggleMute && (
          <Box
            as="button"
            position="absolute"
            top={2}
            right={2}
            w="36px"
            h="36px"
            borderRadius="full"
            bg={C.bg}
            border={`2px solid ${C.border}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={isMuted ? C.textMuted : config.color}
            cursor="pointer"
            _hover={{ borderColor: config.color }}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            boxShadow="0 2px 8px rgba(0,0,0,0.1)"
          >
            {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </Box>
        )}
      </Box>

      {/* Status text */}
      <VStack spacing={2} textAlign="center">
        <HStack spacing={2}>
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg={isSpeaking ? config.color : isListening ? C.accent : C.textMuted}
            animate={isSpeaking || isListening ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <Text fontSize="sm" fontWeight="700" color={isSpeaking ? config.color : isListening ? C.accent : C.textMuted}>
            {isSpeaking
              ? (language === 'rw' ? 'Ndavuga...' : 'Speaking...')
              : isListening
              ? (language === 'rw' ? 'Ndumva...' : 'Listening...')
              : config.label}
          </Text>
        </HStack>

        {/* Current message preview */}
        <AnimatePresence>
          {currentMessage && isSpeaking && (
            <MotionBox
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              maxW="400px"
            >
              <Text
                fontSize="xs"
                color={C.textMuted}
                lineHeight="1.6"
                px={4}
                py={2}
                bg={C.accentSoft}
                borderRadius="lg"
                border={`1px solid ${C.border}`}
              >
                {currentMessage.slice(0, 100)}
                {currentMessage.length > 100 ? '...' : ''}
              </Text>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </VStack>
  )
}
