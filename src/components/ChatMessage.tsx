import { Box, HStack, VStack, Text, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Message } from '../types'
import { getEmotionColor, getEmotionLabel } from '../services/gemini'
import BrainLogo from './BrainLogo'

const MotionBox = motion.create(Box)

const C = {
  aiBubble:     '#f9fafb',
  aiBorder:     '#e5e7eb',
  userBubble:   '#65a30d',
  userBorder:   '#4d7c0f',
  aiAvatar:     'rgba(101,163,13,0.08)',
  aiAvatarBdr:  '#b5d44a',
  userAvatar:   '#65a30d',
  text:         '#000000',         // pure black for AI messages
  textUser:     '#ffffff',         // white on lime bubble
  aiName:       '#65a30d',
  userName:     '#65a30d',
  timestamp:    '#9ca3af',
}

interface ChatMessageProps {
  message:  Message
  language: 'en' | 'rw' | 'mixed'
}

export default function ChatMessage({ message, language }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <MotionBox
      w="full" px={{ base: 4, md: 6 }} py={3}
      display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }} className="msg-enter"
    >
      <HStack
        spacing={3} align="flex-start"
        maxW={{ base: '90%', md: '75%', lg: '65%' }}
        flexDirection={isUser ? 'row-reverse' : 'row'}
      >
        {/* Avatar */}
        {isUser ? (
          <Box
            w="32px" h="32px" borderRadius="full"
            bg={C.userAvatar}
            border="2px solid #4d7c0f"
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0} mt="2px"
          >
            <Text fontSize="9px" fontWeight="900" color="#ffffff" letterSpacing="0.05em">
              YOU
            </Text>
          </Box>
        ) : (
          <Box
            w="32px" h="32px" borderRadius="xl"
            bg={C.aiAvatar}
            border={`2px solid ${C.aiAvatarBdr}`}
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0} mt="2px"
          >
            <BrainLogo size={17} />
          </Box>
        )}

        {/* Content */}
        <VStack spacing={1.5} align={isUser ? 'flex-end' : 'flex-start'} flex={1} minW={0}>
          {/* Sender label with border */}
          <Box
            px={2} py={0.5}
            border={`1px solid ${isUser ? '#b5d44a' : '#e5e7eb'}`}
            borderRadius="full"
            bg={isUser ? 'rgba(101,163,13,0.06)' : '#f9fafb'}
          >
            <Text
              fontSize="10px" fontWeight="800"
              color={isUser ? C.userName : C.aiName}
              letterSpacing="0.04em"
              textTransform="uppercase"
            >
              {isUser ? (language === 'rw' ? 'Wewe' : 'You') : 'YourVoice AI'}
            </Text>
          </Box>

          {/* Bubble */}
          <Box
            bg={isUser ? C.userBubble : C.aiBubble}
            border={`2px solid ${isUser ? C.userBorder : C.aiBorder}`}
            borderRadius={isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'}
            px={4} py={3} maxW="full"
            boxShadow={isUser
              ? '0 2px 10px rgba(101,163,13,0.3)'
              : '0 1px 4px rgba(0,0,0,0.07)'}
          >
            <Text
              fontSize="sm"
              color={isUser ? C.textUser : C.text}
              lineHeight="1.75" whiteSpace="pre-wrap" wordBreak="break-word"
              fontWeight="400"
            >
              {message.content}
            </Text>
          </Box>

          {/* Meta */}
          <HStack spacing={2} px={1}>
            <Text fontSize="10px" color={C.timestamp}>
              {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {message.emotion && message.emotion !== 'neutral' && (
              <Badge
                fontSize="10px" px={2} py={0.5} borderRadius="full"
                bg={`${getEmotionColor(message.emotion)}10`}
                color={getEmotionColor(message.emotion)}
                border={`1.5px solid ${getEmotionColor(message.emotion)}40`}
                fontWeight="700" letterSpacing="0.02em"
              >
                {getEmotionLabel(message.emotion, language)}
              </Badge>
            )}
          </HStack>
        </VStack>
      </HStack>
    </MotionBox>
  )
}
