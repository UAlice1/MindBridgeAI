import { Box, VStack, HStack, Text, IconButton, Separator } from '@chakra-ui/react'
import { FiPlus, FiShield, FiInfo, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import BrainLogo from './BrainLogo'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#f9fafb',
  card:        '#ffffff',
  border:      '#e5e7eb',
  borderLime:  '#b5d44a',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  text:        '#000000',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

interface SidebarProps {
  isOpen:    boolean
  onClose:   () => void
  onNewChat: () => void
  language:  'en' | 'rw'
}

const labels = {
  en: {
    newChat:     'New Conversation',
    about:       'About',
    aboutDesc:   'An AI companion for emotional support. Not a replacement for professional therapy.',
    privacy:     'Anonymous & Private',
    privacyDesc: 'No account. No history. No tracking. Your words stay with you.',
    tagline:     'You are not alone.',
  },
  rw: {
    newChat:     'Ikiganiro Gishya',
    about:       'Ibyerekeye',
    aboutDesc:   "Inshuti ya AI yo gufasha gutuza. Ntabwo isimbuye inzobere z'ubuzima bwo mu mutwe.",
    privacy:     'Yihishe & Yizewe',
    privacyDesc: 'Nta konti. Nta mateka. Nta gukurikirana. Amagambo yawe akomeza kuba yawe.',
    tagline:     'Ntabwo uri wenyine.',
  },
}

// ── Shared panel content ───────────────────────────────────────────────────
function SidebarContent({ onClose, onNewChat, language, showClose }: {
  onClose:   () => void
  onNewChat: () => void
  language:  'en' | 'rw'
  showClose: boolean
}) {
  const t = labels[language]

  return (
    <Box
      w="272px" minW="272px" h="100%"
      bg={C.bg}
      borderRight={`1.5px solid ${C.border}`}
      display="flex" flexDirection="column"
    >
      {/* ── Header ── */}
      <HStack
        px={5} py={5} justify="space-between" align="center"
        borderBottom={`1px solid ${C.border}`}
      >
        <HStack gap={3}>
          <Box
            w="40px" h="40px" borderRadius="xl"
            bg={C.accentSoft}
            border={`1.5px solid ${C.borderLime}`}
            display="flex" alignItems="center" justifyContent="center"
            className="ai-avatar-glow"
          >
            <BrainLogo size={22} />
          </Box>
          <VStack gap={0} align="flex-start">
            <Text fontWeight="800" fontSize="lg" color={C.accent} letterSpacing="-0.02em" lineHeight="1.1">
              YourVoice AI
            </Text>
            <Text fontSize="10px" color={C.textMuted} fontWeight="600" letterSpacing="0.07em" textTransform="uppercase">
              Mental Health Support
            </Text>
          </VStack>
        </HStack>

        {/* Close button — only on mobile drawer */}
        {showClose && (
          <IconButton
            aria-label="Close sidebar"
            size="sm" variant="ghost"
            color={C.textMuted} borderRadius="lg"
            _hover={{ bg: C.accentSoft, color: C.accent }}
            onClick={onClose}
          >
            <FiX size={16} />
          </IconButton>
        )}
      </HStack>

      {/* ── New Conversation ── */}
      <Box px={4} py={4}>
        <HStack
          as="button" w="full" px={4} py={3}
          borderRadius="xl"
          bg={C.accent} color="#ffffff"
          fontSize="sm" fontWeight="700"
          gap={2.5} cursor="pointer" justify="center"
          _hover={{ bg: C.accentHover }}
          onClick={onNewChat}
          boxShadow="0 2px 10px rgba(101,163,13,0.3)"
        >
          <FiPlus size={16} />
          <Text>{t.newChat}</Text>
        </HStack>
      </Box>

      <Separator borderColor={C.border} />

      {/* ── Info cards ── */}
      <VStack flex={1} gap={3} px={4} py={5} align="stretch" overflowY="auto">
        <Box
          bg={C.card} border={`1.5px solid ${C.border}`}
          borderRadius="xl" p={4}
          boxShadow="0 1px 4px rgba(0,0,0,0.06)"
        >
          <HStack gap={2} mb={2.5} pb={2} borderBottom={`1px solid ${C.border}`}>
            <Box color={C.accent}><FiInfo size={14} /></Box>
            <Text fontSize="xs" fontWeight="800" color={C.text} letterSpacing="0.02em" textTransform="uppercase">
              {t.about}
            </Text>
          </HStack>
          <Text fontSize="xs" color={C.textSub} lineHeight="1.7">{t.aboutDesc}</Text>
        </Box>

        <Box
          bg={C.card} border={`1.5px solid ${C.border}`}
          borderRadius="xl" p={4}
          boxShadow="0 1px 4px rgba(0,0,0,0.06)"
        >
          <HStack gap={2} mb={2.5} pb={2} borderBottom={`1px solid ${C.border}`}>
            <Box color={C.accent}><FiShield size={14} /></Box>
            <Text fontSize="xs" fontWeight="800" color={C.text} letterSpacing="0.02em" textTransform="uppercase">
              {t.privacy}
            </Text>
          </HStack>
          <Text fontSize="xs" color={C.textSub} lineHeight="1.7">{t.privacyDesc}</Text>
        </Box>
      </VStack>

      {/* ── Footer tagline ── */}
      <Box px={5} py={4} borderTop={`1px solid ${C.border}`} bg={C.card}>
        <Text fontSize="xs" color={C.accent} textAlign="center" fontStyle="italic" fontWeight="600">
          {t.tagline}
        </Text>
      </Box>
    </Box>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function Sidebar({ isOpen, onClose, onNewChat, language }: SidebarProps) {
  return (
    <>
      {/* ── Desktop: always visible, static ── */}
      <Box display={{ base: 'none', md: 'flex' }} h="100%" flexShrink={0}>
        <SidebarContent
          onClose={onClose}
          onNewChat={onNewChat}
          language={language}
          showClose={false}
        />
      </Box>

      {/* ── Mobile: slide-over drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <MotionBox
              display={{ base: 'block', md: 'none' }}
              position="fixed" inset={0}
              bg="rgba(0,0,0,0.35)"
              zIndex={19}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Drawer panel */}
            <MotionBox
              display={{ base: 'flex', md: 'none' }}
              position="fixed" left={0} top={0} h="100%"
              zIndex={20}
              initial={{ x: -272, opacity: 0 }}
              animate={{ x: 0,    opacity: 1 }}
              exit={{    x: -272, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <SidebarContent
                onClose={onClose}
                onNewChat={onNewChat}
                language={language}
                showClose={true}
              />
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
