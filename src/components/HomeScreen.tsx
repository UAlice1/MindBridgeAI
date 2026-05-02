import { useState } from 'react'
import { Box, VStack, HStack, Text, Textarea, SimpleGrid } from '@chakra-ui/react'
import { FiSend, FiMenu, FiShield, FiLock, FiHeart } from 'react-icons/fi'
import { motion } from 'framer-motion'
import  BrainLogo  from './BrainLogo.tsx'

const MotionBox    = motion.create(Box)
const MotionVStack = motion.create(VStack)

// ── tokens ────────────────────────────────────────────────────────────────
const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  borderLime:  '#b5d44a',
  borderFocus: '#65a30d',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  text:        '#000000',          // pure black
  textSub:     '#374151',
  textMuted:   '#6b7280',
  textFaint:   '#9ca3af',
  placeholder: '#9ca3af',
}

interface HomeScreenProps {
  language:         'en' | 'rw'
  onLanguageChange: (l: 'en' | 'rw') => void
  onSend:           (text: string) => void
  onToggleSidebar:  () => void
  onOpenDashboard:  () => void
}

const content = {
  en: {
    greeting:    "What's on your mind today?",
    sub:         'A safe, private space to share how you feel. No judgment. No login required.',
    placeholder: "Share what you're feeling right now...",
    hint:        'Enter to send · Shift+Enter for new line',
    chips: [
      "I'm feeling overwhelmed",
      "I'm stressed and anxious",
      "I feel sad and empty",
      "I can't sleep at night",
      "I need someone to talk to",
      "Help me calm down",
    ],
    footer: {
      copy:      '© 2025 YourVoice AI. All rights reserved.',
      tagline:   'Built with care for mental wellness in Rwanda and beyond.',
      privacy:   'Anonymous',
      secure:    'Secure',
      free:      'Free',
    },
  },
  rw: {
    greeting:    'Uri gutekereza iki uyu munsi?',
    sub:         'Ahantu hizewe ho gusangira uko wiyumva. Nta gucirwa urubanza. Nta konti ihitiyemo.',
    placeholder: 'Vuga uko wiyumva ubu...',
    hint:        'Enter kohereza · Shift+Enter urongo mushya',
    chips: [
      'Ndi na agahinda kenshi',
      "Ndi na stress n'ubwoba",
      'Ndi wenyine kandi ndi na agahinda',
      'Sinshobora gusinzira nijoro',
      'Nkeneye umuntu wo kuvugana',
      'Nfashe gutuza',
    ],
    footer: {
      copy:      '© 2025 YourVoice AI. Uburenganzira bwose burinzwe.',
      tagline:   'Yakozwe n\'urukundo ku buzima bwo mu mutwe mu Rwanda no hanze.',
      privacy:   'Yihishe',
      secure:    'Yizewe',
      free:      'Ubuntu',
    },
  },
}

export default function HomeScreen({ language, onLanguageChange, onSend, onToggleSidebar, onOpenDashboard }: HomeScreenProps) {
  const [value, setValue] = useState('')
  const t = content[language]

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <Box flex={1} display="flex" flexDirection="column" h="100%" bg={C.bg} overflow="hidden">

      {/* ── Top bar ── */}
      <HStack
        px={5} py={3.5} justify="space-between"
        borderBottom={`1.5px solid ${C.border}`}
        bg={C.bg}
      >
        <Box
          as="button" w="34px" h="34px" borderRadius="lg"
          display={{ base: 'flex', md: 'none' }} alignItems="center" justifyContent="center"
          color={C.textMuted}
          _hover={{ bg: C.accentSoft, color: C.accent }}
          onClick={onToggleSidebar} aria-label="Open menu"
        >
          <FiMenu size={18} />
        </Box>

        {/* Language pill */}
        <HStack
          bg={C.card} borderRadius="full" p="3px"
          border={`1.5px solid ${C.border}`} gap={0}
        >
          {(['en', 'rw'] as const).map((lang) => (
            <Box
              key={lang} as="button"
              px={4} py={1.5} borderRadius="full"
              fontSize="xs" fontWeight="700" cursor="pointer"
              transition="all 0.2s"
              bg={language === lang ? C.accent : 'transparent'}
              color={language === lang ? '#ffffff' : C.textMuted}
              onClick={() => onLanguageChange(lang)}
            >
              {lang === 'en' ? 'English' : 'Kinyarwanda'}
            </Box>
          ))}
        </HStack>

        <Box
          as="button" w="34px" h="34px" borderRadius="lg"
          display="flex" alignItems="center" justifyContent="center"
          color={C.accent}
          bg={C.accentSoft}
          border={`1.5px solid ${C.borderLime}`}
          _hover={{ bg: C.accentSoft, opacity: 0.8 }}
          onClick={onOpenDashboard}
          aria-label="Professional Dashboard"
          title="Professional Dashboard"
        >
          <FiShield size={18} />
        </Box>
      </HStack>

      {/* ── Scrollable center ── */}
      <Box flex={1} overflowY="auto" display="flex" flexDirection="column">

        {/* ── Centered content ── */}
        <Box
          flex={1} display="flex" flexDirection="column"
          alignItems="center" justifyContent="center"
          px={4} py={8}
        >
          <MotionVStack
            gap={8} w="full" maxW="660px"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* ── Logo + Greeting ── */}
            <VStack gap={4} textAlign="center">
              <MotionBox
                w="76px" h="76px" borderRadius="2xl"
                bg={C.accentSoft}
                border={`2px solid ${C.borderLime}`}
                display="flex" alignItems="center" justifyContent="center"
                className="ai-avatar-glow"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1,    opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
              >
                <BrainLogo size={38} />
              </MotionBox>

              <VStack gap={2}>
                {/* BIGGER main title */}
                <Text
                  fontSize={{ base: '3xl', md: '3.2rem' }}
                  fontWeight="900"
                  color={C.accent}
                  lineHeight="1.1"
                  letterSpacing="-0.03em"
                >
                  {t.greeting}
                </Text>
                <Text
                  fontSize="sm" color={C.textSub}
                  maxW="420px" lineHeight="1.7"
                  fontWeight="400"
                >
                  {t.sub}
                </Text>
              </VStack>
            </VStack>

            {/* ── Input ── */}
            <Box w="full">
              <Box
                bg={C.bg}
                border={`2px solid ${C.border}`}
                borderRadius="2xl" overflow="hidden"
                boxShadow="0 4px 16px rgba(0,0,0,0.07)"
                transition="border-color 0.2s, box-shadow 0.2s"
                _focusWithin={{
                  borderColor: C.borderFocus,
                  boxShadow:   '0 0 0 4px rgba(101,163,13,0.1)',
                }}
              >
                <Textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={t.placeholder}
                  bg="transparent" border="none"
                  color={C.text}
                  fontSize="sm" lineHeight="1.7"
                  px={5} pt={4} pb={2}
                  resize="none" minH="90px" maxH="200px" rows={3}
                  _placeholder={{ color: C.placeholder }}
                  _focus={{ boxShadow: 'none', border: 'none' }}
                  className="chat-input"
                />

                <HStack
                  px={4} py={2.5} justify="space-between"
                  borderTop={`1.5px solid ${C.border}`}
                  bg={C.card}
                >
                  <Text fontSize="xs" color={C.textFaint} fontWeight="500">
                    {t.hint}
                  </Text>
                  <Box
                    as="button" w="36px" h="36px" borderRadius="lg"
                    display="flex" alignItems="center" justifyContent="center"
                    bg={value.trim() ? C.accent : 'transparent'}
                    color={value.trim() ? '#ffffff' : C.textFaint}
                    border={value.trim() ? 'none' : `1.5px solid ${C.border}`}
                    cursor={value.trim() ? 'pointer' : 'default'}
                    _hover={value.trim() ? { bg: C.accentHover } : {}}
                    onClick={handleSend}
                    transition="all 0.2s"
                    aria-label="Send"
                    boxShadow={value.trim() ? '0 2px 8px rgba(101,163,13,0.35)' : 'none'}
                  >
                    <FiSend size={15} />
                  </Box>
                </HStack>
              </Box>
            </Box>

            {/* ── Chips ── */}
            <Box w="full">
              {/* Section label with border */}
              <HStack mb={3} gap={3} align="center">
                <Box flex={1} h="1px" bg={C.border} />
                <Text
                  fontSize="11px" fontWeight="700"
                  color={C.textMuted}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  px={2}
                  border={`1px solid ${C.border}`}
                  borderRadius="full"
                  py={0.5}
                >
                  {language === 'rw' ? 'Tangira hano' : 'Quick start'}
                </Text>
                <Box flex={1} h="1px" bg={C.border} />
              </HStack>

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={2.5}>
                {t.chips.map((label, i) => (
                  <MotionBox
                    key={i} as="button"
                    px={4} py={3} borderRadius="xl"
                    bg={C.bg}
                    border={`1.5px solid ${C.border}`}
                    color={C.text}
                    fontSize="xs" fontWeight="500"
                    textAlign="left" cursor="pointer" lineHeight="1.45"
                    className="chip"
                    boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.25 }}
                    onClick={() => onSend(label)}
                  >
                    {label}
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>
          </MotionVStack>
        </Box>

        {/* ── Footer ── */}
        <Box
          borderTop={`1.5px solid ${C.border}`}
          bg={C.card}
          px={6} py={5}
        >
          <VStack gap={3} maxW="660px" mx="auto">
            {/* Trust badges */}
            <HStack gap={4} justify="center" flexWrap="wrap">
              {[
                { icon: FiShield, label: t.footer.privacy },
                { icon: FiLock,   label: t.footer.secure  },
                { icon: FiHeart,  label: t.footer.free    },
              ].map(({ icon: Icon, label }) => (
                <HStack
                  key={label} gap={1.5}
                  px={3} py={1.5}
                  border={`1.5px solid ${C.border}`}
                  borderRadius="full"
                  bg={C.bg}
                >
                  <Box color={C.accent} fontSize="11px"><Icon /></Box>
                  <Text fontSize="11px" fontWeight="700" color={C.text}>
                    {label}
                  </Text>
                </HStack>
              ))}
            </HStack>

            <Box w="full" h="1px" bg={C.border} />

            {/* Tagline + copyright */}
            <VStack gap={1} textAlign="center">
              <Text fontSize="xs" color={C.textSub} fontWeight="500">
                {t.footer.tagline}
              </Text>
              <Text fontSize="11px" color={C.textFaint}>
                {t.footer.copy}
              </Text>
            </VStack>
          </VStack>
        </Box>

      </Box>
    </Box>
  )
}
