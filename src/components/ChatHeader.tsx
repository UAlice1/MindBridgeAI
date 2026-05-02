import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react'
import { FiMenu, FiTrash2, FiPlus } from 'react-icons/fi'
import BrainLogo from './BrainLogo'

const C = {
  bg:          '#ffffff',
  border:      '#e5e7eb',
  borderLime:  '#b5d44a',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  text:        '#000000',
  textSub:     '#374151',
  textMuted:   '#6b7280',
  textFaint:   '#9ca3af',
}

interface ChatHeaderProps {
  onToggleSidebar: () => void
  onClear:         () => void
  onNewChat:       () => void
  language:        'en' | 'rw'
  messageCount:    number
}

export default function ChatHeader({ onToggleSidebar, onClear, onNewChat, language, messageCount }: ChatHeaderProps) {
  const clearLabel  = language === 'rw' ? 'Siba ikiganiro'   : 'Clear chat'
  const newLabel    = language === 'rw' ? 'Ikiganiro gishya' : 'New chat'
  const statusLabel = language === 'rw' ? 'Ndi hano nawe'    : 'Here for you · Always listening'

  return (
    <Box
      px={5} py={3.5}
      bg={C.bg}
      borderBottom={`1.5px solid ${C.border}`}
      position="sticky" top={0} zIndex={10}
      boxShadow="0 1px 6px rgba(0,0,0,0.06)"
    >
      <HStack justify="space-between" align="center">

        {/* Left: menu + identity */}
        <HStack gap={3}>
          <Box
            as="button" w="34px" h="34px" borderRadius="lg"
            display={{ base: 'flex', md: 'none' }} alignItems="center" justifyContent="center"
            color={C.textMuted}
            _hover={{ bg: C.accentSoft, color: C.accent }}
            onClick={onToggleSidebar} aria-label="Toggle sidebar"
          >
            <FiMenu size={18} />
          </Box>

          <HStack gap={3}>
            {/* Avatar */}
            <Box
              w="40px" h="40px" borderRadius="xl"
              bg={C.accentSoft}
              border={`2px solid ${C.borderLime}`}
              display="flex" alignItems="center" justifyContent="center"
              className="ai-avatar-glow" flexShrink={0}
            >
              <BrainLogo size={22} />
            </Box>

            <VStack gap={0} align="flex-start">
              <HStack gap={2} align="center">
                {/* BIGGER title */}
                <Text
                  fontWeight="900"
                  fontSize="xl"
                  color={C.accent}
                  letterSpacing="-0.02em"
                  lineHeight="1.1"
                >
                  YourVoice AI
                </Text>
                {/* Live badge */}
                <HStack
                  gap={1} align="center"
                  px={2} py={0.5}
                  border={`1.5px solid ${C.borderLime}`}
                  borderRadius="full"
                  bg={C.accentSoft}
                >
                  <Box
                    w="5px" h="5px" borderRadius="full"
                    bg={C.accent}
                    boxShadow={`0 0 5px ${C.accent}`}
                  />
                  <Text fontSize="9px" color={C.accent} fontWeight="800" letterSpacing="0.06em">
                    LIVE
                  </Text>
                </HStack>
              </HStack>
              <Text fontSize="xs" color={C.textSub} fontWeight="400">
                {statusLabel}
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Right: actions */}
        <HStack gap={1}>
          {messageCount > 0 && (
            <Text
              fontSize="xs" color={C.textFaint} mr={2}
              display={{ base: 'none', sm: 'block' }}
              border={`1px solid ${C.border}`}
              borderRadius="full" px={2} py={0.5}
            >
              {messageCount} {messageCount === 1 ? 'msg' : 'msgs'}
            </Text>
          )}

          <IconButton
            aria-label={newLabel}
            title={newLabel}
            variant="ghost"
            color={C.textMuted}
            size="sm"
            borderRadius="lg"
            _hover={{ bg: C.accentSoft, color: C.accent }}
            onClick={onNewChat}
          >
            <FiPlus size={16} />
          </IconButton>

          <IconButton
            aria-label={clearLabel}
            title={clearLabel}
            variant="ghost"
            color={C.textMuted}
            size="sm"
            borderRadius="lg"
            _hover={{ bg: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
            onClick={onClear}
          >
            <FiTrash2 size={15} />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  )
}
