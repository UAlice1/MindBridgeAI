import { Box, HStack, VStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import BrainLogo from './BrainLogo'

const MotionBox = motion.create(Box)

const C = {
  bubble:    '#f9fafb',
  border:    '#e5e7eb',
  avatar:    'rgba(101,163,13,0.08)',
  avatarBdr: '#b5d44a',
  dot:       '#65a30d',
  name:      '#65a30d',
  hint:      '#9ca3af',
}

interface TypingIndicatorProps {
  language: 'en' | 'rw'
}

export default function TypingIndicator({ language }: TypingIndicatorProps) {
  return (
    <MotionBox
      px={{ base: 4, md: 6 }} py={3}
      display="flex" justifyContent="flex-start"
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
    >
      <HStack spacing={3} align="flex-start">
        <Box
          w="32px" h="32px" borderRadius="xl"
          bg={C.avatar} border={`1px solid ${C.avatarBdr}`}
          display="flex" alignItems="center" justifyContent="center"
          flexShrink={0} mt="2px"
        >
          <BrainLogo size={17} />
        </Box>

        <VStack spacing={1.5} align="flex-start">
          <Text fontSize="xs" fontWeight="700" color={C.name} px={1} letterSpacing="0.01em">
            YourVoice AI
          </Text>

          <Box
            bg={C.bubble} border={`1px solid ${C.border}`}
            borderRadius="18px 18px 18px 4px"
            px={4} py={3}
            boxShadow="0 1px 4px rgba(0,0,0,0.06)"
          >
            <HStack spacing={1.5} align="center">
              {[0, 1, 2].map((i) => (
                <Box
                  key={i} w="7px" h="7px" borderRadius="full"
                  bg={C.dot} className="typing-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </HStack>
          </Box>

          <Text fontSize="10px" color={C.hint} px={1}>
            {language === 'rw' ? 'Irimo gutekereza...' : 'Thinking...'}
          </Text>
        </VStack>
      </HStack>
    </MotionBox>
  )
}
