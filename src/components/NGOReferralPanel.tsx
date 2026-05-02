import { Box, VStack, HStack, Text, Badge, Button, Divider } from '@chakra-ui/react'
import {
  FiPhone, FiMapPin, FiClock, FiShield, FiExternalLink,
  FiCheckCircle, FiAlertOctagon,
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { NGO, RiskLevel } from '../types'
import { getRiskColor } from '../services/riskDetection'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.07)',
  accentBorder:'rgba(101,163,13,0.25)',
  red:         '#dc2626',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

const typeColors: Record<NGO['type'], string> = {
  hospital:   '#3b82f6',
  ngo:        '#8b5cf6',
  police:     '#ef4444',
  government: '#f59e0b',
  counseling: '#10b981',
}

const typeLabels: Record<NGO['type'], { en: string; rw: string }> = {
  hospital:   { en: 'Hospital',   rw: 'Ibitaro'    },
  ngo:        { en: 'NGO',        rw: 'Umuryango'  },
  police:     { en: 'Police',     rw: 'Polisi'     },
  government: { en: 'Government', rw: 'Leta'       },
  counseling: { en: 'Counseling', rw: 'Inama'      },
}

interface NGOCardProps {
  ngo: NGO
  language: 'en' | 'rw'
  isRecommended?: boolean
  riskLevel?: RiskLevel
  index: number
}

function NGOCard({ ngo, language, isRecommended, riskLevel, index }: NGOCardProps) {
  const typeColor = typeColors[ngo.type]
  const typeLabel = typeLabels[ngo.type][language]
  const desc = language === 'rw' ? ngo.descriptionRw : ngo.description

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Box
        bg={C.bg}
        border={`1.5px solid ${isRecommended ? (riskLevel ? getRiskColor(riskLevel) + '40' : C.accentBorder) : C.border}`}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={isRecommended ? '0 2px 12px rgba(101,163,13,0.12)' : '0 1px 4px rgba(0,0,0,0.05)'}
      >
        {/* Header */}
        <HStack
          px={4} py={3}
          bg={isRecommended ? C.accentSoft : C.card}
          borderBottom={`1px solid ${C.border}`}
          justify="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <HStack spacing={2} flex={1} minW={0}>
            {isRecommended && (
              <Box color={C.accent} flexShrink={0}>
                <FiCheckCircle size={14} />
              </Box>
            )}
            <Text fontSize="sm" fontWeight="800" color={C.text} noOfLines={1}>
              {ngo.name}
            </Text>
          </HStack>
          <HStack spacing={1.5} flexShrink={0}>
            {ngo.verified && (
              <HStack
                spacing={1} px={2} py={0.5}
                bg={C.accentSoft} borderRadius="full"
                border={`1px solid ${C.accentBorder}`}
              >
                <FiShield size={10} color={C.accent} />
                <Text fontSize="9px" fontWeight="800" color={C.accent} letterSpacing="0.04em">
                  {language === 'rw' ? 'YEMEJWE' : 'VERIFIED'}
                </Text>
              </HStack>
            )}
            <Badge
              fontSize="9px" px={2} py={0.5} borderRadius="full"
              bg={`${typeColor}15`} color={typeColor}
              border={`1px solid ${typeColor}30`}
              fontWeight="700"
            >
              {typeLabel}
            </Badge>
          </HStack>
        </HStack>

        {/* Body */}
        <VStack spacing={3} px={4} py={3} align="stretch">
          <Text fontSize="xs" color={C.textSub} lineHeight="1.65">
            {desc}
          </Text>

          {/* Meta */}
          <VStack spacing={1.5} align="stretch">
            <HStack spacing={2}>
              <Box color={C.textMuted} flexShrink={0}><FiMapPin size={12} /></Box>
              <Text fontSize="xs" color={C.textMuted} noOfLines={1}>{ngo.location}</Text>
            </HStack>
            {ngo.available24h && (
              <HStack spacing={2}>
                <Box color={C.accent} flexShrink={0}><FiClock size={12} /></Box>
                <Text fontSize="xs" color={C.accent} fontWeight="600">
                  {language === 'rw' ? 'Ihari igihe cyose — 24/7' : 'Available 24/7'}
                </Text>
              </HStack>
            )}
          </VStack>

          {/* Actions */}
          <HStack spacing={2} flexWrap="wrap">
            <Button
              as="a"
              href={`tel:${ngo.phone}`}
              size="xs"
              bg={C.accent} color="#ffffff"
              leftIcon={<FiPhone size={11} />}
              borderRadius="lg"
              _hover={{ bg: C.accentHover }}
              boxShadow="0 1px 4px rgba(101,163,13,0.3)"
              flexShrink={0}
            >
              {ngo.phone}
            </Button>
            {ngo.phone2 && (
              <Button
                as="a"
                href={`tel:${ngo.phone2}`}
                size="xs"
                variant="outline"
                colorScheme="red"
                leftIcon={<FiPhone size={11} />}
                borderRadius="lg"
                flexShrink={0}
              >
                {ngo.phone2}
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────

interface NGOReferralPanelProps {
  ngos: NGO[]
  language: 'en' | 'rw'
  riskLevel?: RiskLevel
  isUrgent?: boolean
  caseNumber?: string
}

export default function NGOReferralPanel({
  ngos,
  language,
  riskLevel,
  isUrgent,
  caseNumber,
}: NGOReferralPanelProps) {
  const labels = {
    en: {
      title:       'Connected Support Organizations',
      subtitle:    'These verified organizations are ready to help you',
      urgent:      'URGENT — Immediate response required',
      caseRef:     'Case Reference',
      recommended: 'Recommended for your situation',
      all:         'All Available Organizations',
      emergency:   'If you are in immediate danger, call 112 now',
    },
    rw: {
      title:       'Imiryango y\'Inkunga Ihujwe',
      subtitle:    'Imiryango yemejwe iri hano kukufasha',
      urgent:      'BIKENEWE NONAHA — Igisubizo cyihuse gikenewe',
      caseRef:     'Inomero y\'Ikibazo',
      recommended: 'Irasabwa ku bibazo byawe',
      all:         'Imiryango Yose Ihari',
      emergency:   'Niba uri mu kaga nonaha, hamagara 112',
    },
  }
  const t = labels[language]

  const recommended = ngos.slice(0, 2)
  const others = ngos.slice(2)

  return (
    <Box
      bg={C.bg}
      border={`1.5px solid ${isUrgent ? '#dc262640' : C.border}`}
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={isUrgent ? '0 4px 20px rgba(220,38,38,0.12)' : '0 2px 8px rgba(0,0,0,0.06)'}
    >
      {/* Header */}
      <Box
        px={5} py={4}
        bg={isUrgent ? 'rgba(220,38,38,0.05)' : C.accentSoft}
        borderBottom={`1.5px solid ${isUrgent ? '#dc262630' : C.accentBorder}`}
      >
        {isUrgent && (
          <HStack spacing={2} mb={2}>
            <Box color="#dc2626"><FiAlertOctagon size={14} /></Box>
            <Text fontSize="xs" fontWeight="900" color="#dc2626" letterSpacing="0.06em">
              {t.urgent}
            </Text>
          </HStack>
        )}
        <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={2}>
          <VStack spacing={0.5} align="flex-start">
            <Text fontSize="sm" fontWeight="800" color={C.text}>{t.title}</Text>
            <Text fontSize="xs" color={C.textMuted}>{t.subtitle}</Text>
          </VStack>
          {caseNumber && (
            <HStack
              spacing={1.5} px={3} py={1}
              bg={C.bg} borderRadius="full"
              border={`1.5px solid ${C.border}`}
            >
              <FiExternalLink size={11} color={C.textMuted} />
              <Text fontSize="10px" fontWeight="700" color={C.textMuted}>
                {t.caseRef}: {caseNumber}
              </Text>
            </HStack>
          )}
        </HStack>
      </Box>

      {/* Emergency banner */}
      {isUrgent && (
        <Box
          px={5} py={3}
          bg="rgba(220,38,38,0.06)"
          borderBottom={`1px solid rgba(220,38,38,0.15)`}
        >
          <HStack spacing={2} justify="space-between" flexWrap="wrap" gap={2}>
            <Text fontSize="xs" fontWeight="700" color="#dc2626">
              {t.emergency}
            </Text>
            <Button
              as="a" href="tel:112"
              size="xs"
              bg="#dc2626" color="#ffffff"
              leftIcon={<FiPhone size={11} />}
              borderRadius="lg"
              _hover={{ bg: '#b91c1c' }}
              flexShrink={0}
            >
              112
            </Button>
          </HStack>
        </Box>
      )}

      {/* NGO list */}
      <VStack spacing={3} px={4} py={4} align="stretch">
        {recommended.length > 0 && (
          <>
            <Text fontSize="10px" fontWeight="800" color={C.textMuted} letterSpacing="0.06em" textTransform="uppercase">
              {t.recommended}
            </Text>
            {recommended.map((ngo, i) => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                language={language}
                isRecommended
                riskLevel={riskLevel}
                index={i}
              />
            ))}
          </>
        )}

        {others.length > 0 && (
          <>
            <Divider borderColor={C.border} />
            <Text fontSize="10px" fontWeight="800" color={C.textMuted} letterSpacing="0.06em" textTransform="uppercase">
              {t.all}
            </Text>
            {others.map((ngo, i) => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                language={language}
                isRecommended={false}
                index={i + recommended.length}
              />
            ))}
          </>
        )}
      </VStack>
    </Box>
  )
}
