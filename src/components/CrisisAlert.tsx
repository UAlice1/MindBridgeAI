import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Button, Collapse, useDisclosure, Link } from '@chakra-ui/react'
import {
  FiAlertTriangle, FiPhone, FiChevronDown, FiWind,
  FiShield, FiHeart, FiExternalLink, FiAlertOctagon,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import type { CrisisSeverity } from '../types'

const MotionBox = motion.create(Box)

// ── design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:           '#ffffff',
  border:       '#e5e7eb',
  accent:       '#65a30d',
  accentHover:  '#4d7c0f',
  accentSoft:   'rgba(101,163,13,0.07)',
  accentBorder: 'rgba(101,163,13,0.25)',
  red:          '#dc2626',
  redSoft:      'rgba(220,38,38,0.06)',
  redBorder:    'rgba(220,38,38,0.25)',
  orange:       '#ea580c',
  orangeSoft:   'rgba(234,88,12,0.06)',
  orangeBorder: 'rgba(234,88,12,0.25)',
  text:         '#111827',
  textSub:      '#374151',
  textMuted:    '#6b7280',
  card:         '#f9fafb',
  cardBorder:   '#e5e7eb',
}

// ── severity config ────────────────────────────────────────────────────────
const severityConfig: Record<
  CrisisSeverity,
  { bg: string; border: string; iconColor: string; icon: typeof FiAlertTriangle }
> = {
  low:    { bg: C.accentSoft,  border: C.accentBorder,  iconColor: C.accent,  icon: FiHeart         },
  medium: { bg: C.orangeSoft,  border: C.orangeBorder,  iconColor: C.orange,  icon: FiAlertTriangle },
  high:   { bg: C.redSoft,     border: C.redBorder,     iconColor: C.red,     icon: FiAlertOctagon  },
}

// ── bilingual content ──────────────────────────────────────────────────────
const content = {
  en: {
    titles: {
      low:    "You're not alone — support is here",
      medium: "I'm concerned about you — help is available",
      high:   "Your safety matters — please reach out now",
    },
    toggle:  'Show support resources',
    hide:    'Hide resources',

    // Abuse-specific section
    abuseTitle:   'You deserve to be safe',
    abuseMessage: "What's happening to you is not okay and it's not your fault. There are people who will believe you and help you.",
    abuseReport:  'Would you like help submitting a confidential report or finding the nearest support center?',
    isangeTitle:  'Isange One Stop Center',
    isangeDesc:   'Safe, confidential support for survivors of abuse & gender-based violence · Available 24/7',
    isangeLink:   'Find nearest center',
    gbvLine:      'GBV Hotline: 3512',
    gbvDesc:      'Rwanda National Police · Free & confidential',

    // Crisis section
    crisisMessage: "If you're in crisis or having thoughts of self-harm, please reach out immediately:",

    // General resources
    resources: [
      { name: 'Caraes Ndera Hospital',  number: '+250 788 386 200', desc: 'Mental health support · Kigali · 24/7' },
      { name: 'Rwanda Emergency',       number: '112',              desc: 'Emergency services · Free call'        },
    ],

    // Breathing
    breatheTitle: 'Grounding exercise — try this now',
    breatheSteps: ['Breathe in slowly… 1, 2, 3, 4', 'Hold gently… 1, 2, 3, 4', 'Breathe out slowly… 1, 2, 3, 4, 5, 6'],
    breatheRepeat: 'Repeat 3 times. You are safe.',

    // Report CTA
    reportTitle: 'Need help reporting?',
    reportDesc:  'We can help you find the nearest support center or guide you through submitting a confidential report.',
    reportBtn:   'Get help reporting',
  },
  rw: {
    titles: {
      low:    'Ntabwo uri wenyine — inkunga iri hano',
      medium: 'Ndi guhangayika nawe — inkunga ihari',
      high:   'Umutekano wawe ni ingenzi — vugana n\'inkunga nonaha',
    },
    toggle:  'Erekana inkunga',
    hide:    'Hisha inkunga',

    abuseTitle:   'Ukwiye kuba mu mutekano',
    abuseMessage: "Ibikubaho si byiza kandi si ikosa ryawe. Hari abantu bazakwemera kandi bakugufashe.",
    abuseReport:  'Wifuza inkunga yo gutanga raporo yihishe cyangwa gushaka ikigo cy\'inkunga hafi yawe?',
    isangeTitle:  'Isange One Stop Center',
    isangeDesc:   "Inkunga yihishe n'izewe ku barokotse guhohoterwa · Ihari igihe cyose",
    isangeLink:   'Shaka ikigo hafi yawe',
    gbvLine:      'Inzira ya GBV: 3512',
    gbvDesc:      "Polisi y'u Rwanda · Ubuntu kandi yihishe",

    crisisMessage: 'Niba uri mu bihe bikomeye cyangwa ufite ibitekerezo byo kwigirira nabi, vugana n\'inkunga nonaha:',

    resources: [
      { name: 'Caraes Ndera Hospital',  number: '+250 788 386 200', desc: "Inkunga y'ubuzima bwo mu mutwe · Kigali · Igihe cyose" },
      { name: "Ubutabazi bw'u Rwanda",  number: '112',              desc: "Serivisi z'ubutabazi · Guhamagara ubuntu"              },
    ],

    breatheTitle: 'Igikorwa cyo gutuza — gerageza nonaha',
    breatheSteps: ['Injiza umwuka buhoro… 1, 2, 3, 4', 'Garura buhoro… 1, 2, 3, 4', 'Sohora umwuka buhoro… 1, 2, 3, 4, 5, 6'],
    breatheRepeat: 'Subiramo inshuro 3. Uri mu mutekano.',

    reportTitle: 'Ukeneye inkunga yo gutanga raporo?',
    reportDesc:  'Dushobora kukufasha gushaka ikigo cy\'inkunga hafi yawe cyangwa kukuyobora mu gutanga raporo yihishe.',
    reportBtn:   'Bona inkunga yo gutanga raporo',
  },
}

// ── animated breathing guide ───────────────────────────────────────────────
function BreathingGuide({ language, steps, repeat }: {
  language: 'en' | 'rw'
  steps: string[]
  repeat: string
}) {
  const [step, setStep] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const durations = [4000, 4000, 6000]
    const timer = setTimeout(() => {
      setStep(s => (s + 1) % steps.length)
    }, durations[step])
    return () => clearTimeout(timer)
  }, [active, step, steps.length])

  const startLabel = language === 'rw' ? 'Tangira' : 'Start'
  const stopLabel  = language === 'rw' ? 'Hagarika' : 'Stop'

  return (
    <Box
      bg={C.accentSoft}
      border={`1.5px solid ${C.accentBorder}`}
      borderRadius="xl" p={4}
    >
      <HStack spacing={2} mb={3} justify="space-between">
        <HStack spacing={2}>
          <Box color={C.accent}><FiWind size={14} /></Box>
          <Text fontSize="xs" fontWeight="700" color={C.accent} letterSpacing="0.02em">
            {steps[0].split('…')[0].trim().split(' ').slice(0, 3).join(' ')}
          </Text>
        </HStack>
        <Box
          as="button"
          px={3} py={1} borderRadius="full"
          fontSize="10px" fontWeight="700"
          bg={active ? C.accentSoft : C.accent}
          color={active ? C.accent : '#ffffff'}
          border={`1.5px solid ${active ? C.accentBorder : C.accent}`}
          cursor="pointer"
          onClick={() => { setActive(a => !a); setStep(0) }}
          _hover={{ opacity: 0.85 }}
          transition="all 0.2s"
        >
          {active ? stopLabel : startLabel}
        </Box>
      </HStack>

      <AnimatePresence mode="wait">
        {active ? (
          <MotionBox
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
          >
            <Text fontSize="sm" fontWeight="600" color={C.accent} textAlign="center" py={1}>
              {steps[step]}
            </Text>
            {/* Progress dots */}
            <HStack justify="center" spacing={1.5} mt={2}>
              {steps.map((_, i) => (
                <Box
                  key={i}
                  w={i === step ? '16px' : '6px'} h="6px"
                  borderRadius="full"
                  bg={i === step ? C.accent : C.accentBorder}
                  transition="all 0.3s"
                />
              ))}
            </HStack>
          </MotionBox>
        ) : (
          <MotionBox
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VStack spacing={1} align="stretch">
              {steps.map((s, i) => (
                <Text key={i} fontSize="xs" color={C.textSub} lineHeight="1.65">
                  {i + 1}. {s}
                </Text>
              ))}
              <Text fontSize="xs" color={C.textMuted} fontStyle="italic" mt={1}>
                {repeat}
              </Text>
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}

// ── main component ─────────────────────────────────────────────────────────
interface CrisisAlertProps {
  language: 'en' | 'rw'
  severity?: CrisisSeverity
  isAbuse?: boolean
  onRequestReport?: () => void
}

export default function CrisisAlert({
  language,
  severity = 'medium',
  isAbuse = false,
  onRequestReport,
}: CrisisAlertProps) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: severity === 'high' || isAbuse })
  const t = content[language]
  const sc = severityConfig[severity]
  const Icon = sc.icon

  const title = isAbuse
    ? (language === 'rw' ? 'Ukwiye kuba mu mutekano — inkunga iri hano' : "You deserve to be safe — help is here")
    : t.titles[severity]

  return (
    <MotionBox
      mx={{ base: 3, md: 6 }} my={3}
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 24 }}
    >
      <Box
        bg={sc.bg}
        border={`1.5px solid ${sc.border}`}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow={severity === 'high' || isAbuse
          ? `0 4px 20px ${sc.border}`
          : '0 2px 8px rgba(0,0,0,0.06)'}
      >
        {/* ── Header ── */}
        <HStack
          px={4} py={3.5}
          justify="space-between"
          cursor="pointer"
          onClick={onToggle}
          _hover={{ bg: `${sc.border}` }}
          transition="background 0.15s"
        >
          <HStack spacing={3}>
            <Box color={sc.iconColor} flexShrink={0}>
              <Icon size={16} />
            </Box>
            <Text fontSize="sm" fontWeight="700" color={C.text} lineHeight="1.3">
              {title}
            </Text>
          </HStack>
          <HStack spacing={2} flexShrink={0}>
            <Text fontSize="xs" color={C.textMuted} display={{ base: 'none', sm: 'block' }}>
              {isOpen ? t.hide : t.toggle}
            </Text>
            <Box
              color={C.textMuted}
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0)'}
              transition="transform 0.2s"
            >
              <FiChevronDown size={14} />
            </Box>
          </HStack>
        </HStack>

        {/* ── Expanded content ── */}
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={4} px={4} pb={5} pt={1} align="stretch">

            {/* ── Abuse section ── */}
            {isAbuse && (
              <Box
                bg={C.redSoft}
                border={`1.5px solid ${C.redBorder}`}
                borderRadius="xl" p={4}
              >
                <HStack spacing={2} mb={2}>
                  <Box color={C.red}><FiShield size={14} /></Box>
                  <Text fontSize="xs" fontWeight="800" color={C.red} textTransform="uppercase" letterSpacing="0.04em">
                    {t.abuseTitle}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={C.textSub} lineHeight="1.7" mb={3}>
                  {t.abuseMessage}
                </Text>
                <Text fontSize="xs" color={C.textMuted} lineHeight="1.65" fontStyle="italic">
                  {t.abuseReport}
                </Text>
              </Box>
            )}

            {/* ── Isange One Stop Center (abuse) ── */}
            {isAbuse && (
              <Box
                bg={C.bg}
                border={`1.5px solid ${C.cardBorder}`}
                borderRadius="xl" p={4}
                boxShadow="0 1px 4px rgba(0,0,0,0.06)"
              >
                <HStack spacing={2} mb={1}>
                  <Box color={C.accent}><FiShield size={13} /></Box>
                  <Text fontSize="sm" fontWeight="700" color={C.text}>{t.isangeTitle}</Text>
                </HStack>
                <Text fontSize="xs" color={C.textMuted} mb={3} lineHeight="1.6">{t.isangeDesc}</Text>
                <HStack spacing={2} flexWrap="wrap">
                  <Button
                    as="a"
                    href="tel:+250788386200"
                    size="xs"
                    bg={C.accent} color="#ffffff"
                    leftIcon={<FiPhone size={11} />}
                    borderRadius="lg"
                    _hover={{ bg: C.accentHover }}
                    boxShadow="0 1px 4px rgba(101,163,13,0.3)"
                  >
                    +250 788 386 200
                  </Button>
                  <Button
                    as="a"
                    href="tel:3512"
                    size="xs"
                    variant="outline"
                    colorScheme="red"
                    leftIcon={<FiPhone size={11} />}
                    borderRadius="lg"
                  >
                    {t.gbvLine}
                  </Button>
                </HStack>
                <Text fontSize="10px" color={C.textMuted} mt={2}>{t.gbvDesc}</Text>
              </Box>
            )}

            {/* ── Crisis / general message ── */}
            {!isAbuse && (
              <Text fontSize="xs" color={C.textMuted} lineHeight="1.65">
                {t.crisisMessage}
              </Text>
            )}

            {/* ── Emergency resources ── */}
            <VStack spacing={2.5} align="stretch">
              {t.resources.map((r, i) => (
                <HStack
                  key={i}
                  bg={C.bg}
                  border={`1.5px solid ${C.cardBorder}`}
                  borderRadius="xl" p={3.5}
                  justify="space-between"
                  boxShadow="0 1px 3px rgba(0,0,0,0.05)"
                >
                  <VStack spacing={0} align="flex-start">
                    <Text fontSize="sm" fontWeight="700" color={C.text}>{r.name}</Text>
                    <Text fontSize="xs" color={C.textMuted}>{r.desc}</Text>
                  </VStack>
                  <Button
                    as="a"
                    href={`tel:${r.number}`}
                    size="xs"
                    bg={C.accent} color="#ffffff"
                    leftIcon={<FiPhone size={11} />}
                    borderRadius="lg"
                    _hover={{ bg: C.accentHover }}
                    boxShadow="0 1px 4px rgba(101,163,13,0.3)"
                    flexShrink={0}
                  >
                    {r.number}
                  </Button>
                </HStack>
              ))}
            </VStack>

            {/* ── Breathing / grounding exercise ── */}
            <BreathingGuide
              language={language}
              steps={t.breatheSteps}
              repeat={t.breatheRepeat}
            />

            {/* ── Report CTA ── */}
            {(isAbuse || severity === 'high') && (
              <Box
                bg={C.card}
                border={`1.5px solid ${C.cardBorder}`}
                borderRadius="xl" p={4}
              >
                <HStack spacing={2} mb={1.5}>
                  <Box color={C.accent}><FiExternalLink size={13} /></Box>
                  <Text fontSize="xs" fontWeight="800" color={C.text} textTransform="uppercase" letterSpacing="0.04em">
                    {t.reportTitle}
                  </Text>
                </HStack>
                <Text fontSize="xs" color={C.textSub} lineHeight="1.65" mb={3}>
                  {t.reportDesc}
                </Text>
                <Button
                  size="sm"
                  bg={C.accent} color="#ffffff"
                  borderRadius="lg"
                  _hover={{ bg: C.accentHover }}
                  boxShadow="0 2px 8px rgba(101,163,13,0.3)"
                  onClick={onRequestReport}
                  w="full"
                >
                  {t.reportBtn}
                </Button>
              </Box>
            )}

          </VStack>
        </Collapse>
      </Box>
    </MotionBox>
  )
}
