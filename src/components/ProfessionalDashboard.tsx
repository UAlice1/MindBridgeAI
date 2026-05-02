import { useState, useEffect, useCallback } from 'react'
import {
  Box, VStack, HStack, Text, Badge, Button, Textarea,
  SimpleGrid, IconButton,
} from '@chakra-ui/react'
import {
  FiArrowLeft, FiBell, FiAlertOctagon, FiClock, FiUser,
  FiCheckCircle, FiRefreshCw, FiDatabase, FiChevronDown,
  FiChevronUp, FiMapPin, FiTag,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import type { Case, CaseStatus, Notification } from '../types'
import {
  getAllCases,
  getUrgentCases,
  getDashboardStats,
  updateCaseStatus,
  respondToCase,
  getNotifications,
  getUnreadCount,
  markAllRead,
  seedDemoData,
  type DashboardStats,
} from '../service/caseManager'
import RiskBadge from './RiskBadge'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  accentBorder:'rgba(101,163,13,0.25)',
  red:         '#dc2626',
  redSoft:     'rgba(220,38,38,0.06)',
  redBorder:   'rgba(220,38,38,0.25)',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

type FilterStatus = 'all' | CaseStatus

function timeAgo(date: Date, lang: 'en' | 'rw'): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return lang === 'rw' ? 'Nonaha' : 'Just now'
  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    return lang === 'rw' ? `Iminota ${m} ishize` : `${m}m ago`
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    return lang === 'rw' ? `Amasaha ${h} ashize` : `${h}h ago`
  }
  const d = Math.floor(diff / 86400)
  return lang === 'rw' ? `Iminsi ${d} ishize` : `${d}d ago`
}

function statusColor(status: CaseStatus): string {
  const map: Record<CaseStatus, string> = {
    pending:     '#d97706',
    flagged:     '#dc2626',
    assigned:    '#3b82f6',
    in_progress: '#8b5cf6',
    resolved:    '#65a30d',
    closed:      '#6b7280',
  }
  return map[status] ?? '#6b7280'
}

function statusLabel(status: CaseStatus, lang: 'en' | 'rw'): string {
  const map: Record<CaseStatus, { en: string; rw: string }> = {
    pending:     { en: 'Pending',     rw: 'Gutegereza' },
    flagged:     { en: 'Flagged',     rw: 'Yashyizwe Akabati' },
    assigned:    { en: 'Assigned',    rw: 'Yahawe' },
    in_progress: { en: 'In Progress', rw: 'Irakorwa' },
    resolved:    { en: 'Resolved',    rw: 'Yarangiye' },
    closed:      { en: 'Closed',      rw: 'Yafunzwe' },
  }
  return map[status]?.[lang] ?? status
}

// ── Stat Card ─────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number
  color: string
  bg: string
  border: string
}

function StatCard({ label, value, color, bg, border }: StatCardProps) {
  return (
    <Box
      bg={bg}
      border={`1.5px solid ${border}`}
      borderRadius="xl"
      px={4} py={3}
      textAlign="center"
    >
      <Text fontSize="2xl" fontWeight="900" color={color} lineHeight="1">{value}</Text>
      <Text fontSize="10px" fontWeight="700" color={C.textMuted} mt={1} textTransform="uppercase" letterSpacing="0.05em">
        {label}
      </Text>
    </Box>
  )
}

// ── Case Card ─────────────────────────────────────────────────────────────

interface CaseCardProps {
  c: Case
  language: 'en' | 'rw'
  isExpanded: boolean
  onToggle: () => void
  onStatusChange: (id: string, status: CaseStatus) => void
  onRespond: (id: string, msg: string) => void
}

function CaseCard({ c, language, isExpanded, onToggle, onStatusChange, onRespond }: CaseCardProps) {
  const [responseText, setResponseText] = useState('')

  const t = {
    en: {
      caseType:    'Case Type',
      province:    'Province',
      assignedTo:  'Assigned NGO',
      keywords:    'Flagged Keywords',
      notes:       'Professional Notes',
      respond:     'Add Response',
      placeholder: 'Write your response or notes here…',
      markProgress:'Mark as In Progress',
      markResolved:'Mark as Resolved',
      send:        'Send Response',
      anonymous:   'Anonymous',
      score:       'Risk Score',
    },
    rw: {
      caseType:    'Ubwoko bw\'Ikibazo',
      province:    'Intara',
      assignedTo:  'Umuryango Wahawe',
      keywords:    'Amagambo Yashyizwe Akabati',
      notes:       'Ibisobanuro by\'Inzobere',
      respond:     'Ongeraho Igisubizo',
      placeholder: 'Andika igisubizo cyawe cyangwa ibisobanuro hano…',
      markProgress:'Shyira mu Bikorwa',
      markResolved:'Shyira nk\'Yarangiye',
      send:        'Ohereza Igisubizo',
      anonymous:   'Yihishe',
      score:       'Amanota y\'Ingorane',
    },
  }[language]

  const isUrgent = c.isUrgent

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg={C.bg}
        border={`1.5px solid ${isUrgent ? C.red + '50' : C.border}`}
        borderRadius="xl"
        overflow="hidden"
        boxShadow={isUrgent ? '0 0 0 2px rgba(220,38,38,0.12)' : '0 1px 4px rgba(0,0,0,0.05)'}
        sx={isUrgent ? {
          animation: 'urgentPulse 2s ease-in-out infinite',
          '@keyframes urgentPulse': {
            '0%, 100%': { boxShadow: '0 0 0 2px rgba(220,38,38,0.12)' },
            '50%':      { boxShadow: '0 0 0 4px rgba(220,38,38,0.22)' },
          },
        } : {}}
      >
        {/* Card header — always visible */}
        <HStack
          px={4} py={3}
          bg={isUrgent ? C.redSoft : C.card}
          borderBottom={`1px solid ${isUrgent ? C.redBorder : C.border}`}
          justify="space-between"
          cursor="pointer"
          onClick={onToggle}
          flexWrap="wrap"
          gap={2}
        >
          <HStack spacing={3} flex={1} minW={0} flexWrap="wrap" gap={2}>
            {isUrgent && (
              <HStack
                spacing={1} px={2} py={0.5}
                bg={C.red} borderRadius="full"
              >
                <FiAlertOctagon size={10} color="#fff" />
                <Text fontSize="9px" fontWeight="900" color="#fff" letterSpacing="0.06em">URGENT</Text>
              </HStack>
            )}
            <Text fontSize="xs" fontWeight="800" color={C.text} fontFamily="mono">
              {c.caseNumber}
            </Text>
            <RiskBadge level={c.riskLevel} language={language} size="sm" pulse={isUrgent} />
            <Badge
              fontSize="9px" px={2} py={0.5} borderRadius="full"
              bg={`${statusColor(c.status)}15`}
              color={statusColor(c.status)}
              border={`1px solid ${statusColor(c.status)}30`}
              fontWeight="700"
            >
              {statusLabel(c.status, language)}
            </Badge>
          </HStack>

          <HStack spacing={2} flexShrink={0}>
            <HStack spacing={1}>
              <FiClock size={11} color={C.textMuted} />
              <Text fontSize="10px" color={C.textMuted}>{timeAgo(c.submittedAt, language)}</Text>
            </HStack>
            <Box color={C.textMuted}>
              {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </Box>
          </HStack>
        </HStack>

        {/* Summary row */}
        <HStack px={4} py={2.5} spacing={4} flexWrap="wrap" gap={2}>
          <HStack spacing={1.5}>
            <FiTag size={11} color={C.textMuted} />
            <Text fontSize="xs" color={C.textSub} fontWeight="600">
              {c.caseType.replace(/_/g, ' ')}
            </Text>
          </HStack>
          {c.province && (
            <HStack spacing={1.5}>
              <FiMapPin size={11} color={C.textMuted} />
              <Text fontSize="xs" color={C.textMuted}>{c.province}</Text>
            </HStack>
          )}
          <HStack spacing={1.5}>
            <FiUser size={11} color={C.textMuted} />
            <Text fontSize="xs" color={C.textMuted}>
              {c.isAnonymous ? t.anonymous : (c.contactName ?? t.anonymous)}
            </Text>
          </HStack>
        </HStack>

        {/* Description preview */}
        <Box px={4} pb={3}>
          <Text fontSize="xs" color={C.textSub} lineHeight="1.65" noOfLines={isExpanded ? undefined : 2}>
            {c.description}
          </Text>
        </Box>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              overflow="hidden"
            >
              <Box borderTop="1px solid" borderColor={C.border} />
              <VStack spacing={3} px={4} py={4} align="stretch">

                {/* Risk score */}
                <HStack justify="space-between">
                  <Text fontSize="xs" fontWeight="700" color={C.textMuted}>{t.score}</Text>
                  <Text fontSize="xs" fontWeight="800" color={C.text}>{c.riskScore}/100</Text>
                </HStack>

                {/* Flagged keywords */}
                {c.flaggedKeywords.length > 0 && (
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={C.textMuted} mb={1.5} textTransform="uppercase" letterSpacing="0.05em">
                      {t.keywords}
                    </Text>
                    <HStack spacing={1.5} flexWrap="wrap" gap={1.5}>
                      {c.flaggedKeywords.map(kw => (
                        <Badge key={kw} fontSize="9px" colorScheme="red" borderRadius="full" px={2}>
                          {kw}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>
                )}

                {/* Assigned NGO */}
                {c.assignedNGO && (
                  <Box
                    bg={C.accentSoft}
                    border={`1px solid ${C.accentBorder}`}
                    borderRadius="lg" px={3} py={2}
                  >
                    <Text fontSize="10px" fontWeight="700" color={C.textMuted} mb={0.5} textTransform="uppercase" letterSpacing="0.05em">
                      {t.assignedTo}
                    </Text>
                    <Text fontSize="xs" fontWeight="700" color={C.accent}>{c.assignedNGO.name}</Text>
                    <Text fontSize="xs" color={C.textMuted}>{c.assignedNGO.phone}</Text>
                  </Box>
                )}

                {/* Existing response */}
                {c.responseMessage && (
                  <Box
                    bg={C.card}
                    border={`1px solid ${C.border}`}
                    borderRadius="lg" px={3} py={2}
                  >
                    <Text fontSize="10px" fontWeight="700" color={C.textMuted} mb={0.5} textTransform="uppercase" letterSpacing="0.05em">
                      {t.notes}
                    </Text>
                    <Text fontSize="xs" color={C.textSub} lineHeight="1.65">{c.responseMessage}</Text>
                  </Box>
                )}

                {/* Response form */}
                {c.status !== 'resolved' && c.status !== 'closed' && (
                  <Box>
                    <Text fontSize="10px" fontWeight="700" color={C.textMuted} mb={1.5} textTransform="uppercase" letterSpacing="0.05em">
                      {t.respond}
                    </Text>
                    <Textarea
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      placeholder={t.placeholder}
                      size="sm"
                      borderRadius="lg"
                      fontSize="xs"
                      color={C.text}
                      borderColor={C.border}
                      _placeholder={{ color: C.textMuted }}
                      _focus={{ borderColor: C.accent, boxShadow: '0 0 0 2px rgba(101,163,13,0.1)' }}
                      resize="none"
                      rows={3}
                      mb={2}
                    />
                    <HStack spacing={2} flexWrap="wrap" gap={2}>
                      <Button
                        size="xs"
                        bg="rgba(139,92,246,0.1)"
                        color="#8b5cf6"
                        border="1px solid rgba(139,92,246,0.3)"
                        borderRadius="lg"
                        _hover={{ bg: 'rgba(139,92,246,0.18)' }}
                        leftIcon={<FiRefreshCw size={11} />}
                        onClick={() => onStatusChange(c.id, 'in_progress')}
                      >
                        {t.markProgress}
                      </Button>
                      <Button
                        size="xs"
                        bg={C.accentSoft}
                        color={C.accent}
                        border={`1px solid ${C.accentBorder}`}
                        borderRadius="lg"
                        _hover={{ bg: 'rgba(101,163,13,0.15)' }}
                        leftIcon={<FiCheckCircle size={11} />}
                        onClick={() => onStatusChange(c.id, 'resolved')}
                      >
                        {t.markResolved}
                      </Button>
                      {responseText.trim() && (
                        <Button
                          size="xs"
                          bg={C.accent}
                          color="#ffffff"
                          borderRadius="lg"
                          _hover={{ bg: C.accentHover }}
                          onClick={() => {
                            onRespond(c.id, responseText.trim())
                            setResponseText('')
                          }}
                        >
                          {t.send}
                        </Button>
                      )}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  )
}
// ── Main Dashboard ────────────────────────────────────────────────────────

interface ProfessionalDashboardProps {
  language: 'en' | 'rw'
  onBack:   () => void
}

export default function ProfessionalDashboard({ language, onBack }: ProfessionalDashboardProps) {
  const [cases, setCases]               = useState<Case[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats]               = useState<DashboardStats | null>(null)
  const [filter, setFilter]             = useState<FilterStatus>('all')
  const [expandedId, setExpandedId]     = useState<string | null>(null)
  const [showNotifs, setShowNotifs]     = useState(false)
  const [unread, setUnread]             = useState(0)

  const refresh = useCallback(() => {
    setCases(getAllCases())
    setNotifications(getNotifications())
    setStats(getDashboardStats())
    setUnread(getUnreadCount())
  }, [])

  useEffect(() => {
    seedDemoData()
    refresh()
    const interval = setInterval(refresh, 5000)
    return () => clearInterval(interval)
  }, [refresh])

  const handleStatusChange = (id: string, status: CaseStatus) => {
    updateCaseStatus(id, status)
    refresh()
  }

  const handleRespond = (id: string, msg: string) => {
    respondToCase(id, msg)
    refresh()
  }

  const handleMarkAllRead = () => {
    markAllRead()
    refresh()
  }

  const filtered = filter === 'all'
    ? cases
    : cases.filter(c => c.status === filter)

  const urgentCases = getUrgentCases()

  const t = {
    en: {
      title:       'Professional Dashboard',
      subtitle:    'Case management & referral system',
      back:        'Back to YourVoice',
      total:       'Total Cases',
      urgent:      'Urgent',
      pending:     'Pending',
      inProgress:  'In Progress',
      resolved:    'Resolved',
      filter:      'Filter by status',
      all:         'All Cases',
      noCases:     'No cases found',
      noCasesDesc: 'Cases submitted by users will appear here.',
      notifications: 'Notifications',
      markRead:    'Mark all read',
      noNotifs:    'No notifications',
      refresh:     'Refresh',
      urgentAlert: 'URGENT cases require immediate attention',
    },
    rw: {
      title:       'Ikibaho cy\'Inzobere',
      subtitle:    'Gucunga ibikorwa n\'sisitemu yo kohereza',
      back:        'Subira kuri YourVoice',
      total:       'Ibikorwa Byose',
      urgent:      'Bikenewe Nonaha',
      pending:     'Gutegereza',
      inProgress:  'Irakorwa',
      resolved:    'Yarangiye',
      filter:      'Shungura hakurikijwe imimerere',
      all:         'Ibikorwa Byose',
      noCases:     'Nta bikorwa bibonetse',
      noCasesDesc: 'Ibikorwa byatanzwe n\'abakoresha bizagaragara hano.',
      notifications: 'Amatangazo',
      markRead:    'Shyira byose nk\'byasomwe',
      noNotifs:    'Nta matangazo',
      refresh:     'Vugurura',
      urgentAlert: 'Ibikorwa bikenewe nonaha bisaba igisubizo cyihuse',
    },
  }[language]

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all',         label: t.all },
    { value: 'flagged',     label: language === 'rw' ? 'Yashyizwe Akabati' : 'Flagged' },
    { value: 'pending',     label: t.pending },
    { value: 'assigned',    label: language === 'rw' ? 'Yahawe' : 'Assigned' },
    { value: 'in_progress', label: t.inProgress },
    { value: 'resolved',    label: t.resolved },
    { value: 'closed',      label: language === 'rw' ? 'Yafunzwe' : 'Closed' },
  ]

  return (
    <Box h="100%" bg={C.card} display="flex" flexDirection="column" overflow="hidden">

      {/* ── Top bar ── */}
      <Box
        px={5} py={4}
        bg={C.bg}
        borderBottom={`1.5px solid ${C.border}`}
        boxShadow="0 1px 6px rgba(0,0,0,0.06)"
        flexShrink={0}
      >
        <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
          <HStack spacing={3}>
            <Box
              as="button"
              display="flex" alignItems="center" gap="6px"
              px={3} py={1.5}
              borderRadius="lg"
              border={`1.5px solid ${C.border}`}
              bg={C.card}
              color={C.textMuted}
              fontSize="xs" fontWeight="600"
              cursor="pointer"
              _hover={{ bg: C.accentSoft, color: C.accent, borderColor: C.accentBorder }}
              onClick={onBack}
              transition="all 0.2s"
            >
              <FiArrowLeft size={13} />
              {t.back}
            </Box>
            <VStack spacing={0} align="flex-start">
              <Text fontSize="lg" fontWeight="900" color={C.text} lineHeight="1.1">{t.title}</Text>
              <Text fontSize="xs" color={C.textMuted}>{t.subtitle}</Text>
            </VStack>
          </HStack>

          <HStack spacing={2}>
            {/* Refresh */}
            <Box
              as="button"
              px={3} py={1.5}
              borderRadius="lg"
              border={`1.5px solid ${C.border}`}
              bg={C.card}
              color={C.textMuted}
              fontSize="xs" fontWeight="600"
              cursor="pointer"
              _hover={{ bg: C.accentSoft, color: C.accent }}
              onClick={refresh}
              display="flex" alignItems="center" gap="5px"
              transition="all 0.2s"
            >
              <FiRefreshCw size={12} />
              {t.refresh}
            </Box>

            {/* Notifications bell */}
            <Box position="relative">
              <Box
                as="button"
                w="36px" h="36px" borderRadius="lg"
                display="flex" alignItems="center" justifyContent="center"
                border={`1.5px solid ${showNotifs ? C.accentBorder : C.border}`}
                bg={showNotifs ? C.accentSoft : C.card}
                color={showNotifs ? C.accent : C.textMuted}
                cursor="pointer"
                _hover={{ bg: C.accentSoft, color: C.accent }}
                onClick={() => { setShowNotifs(v => !v); if (!showNotifs) handleMarkAllRead() }}
                transition="all 0.2s"
                aria-label={t.notifications}
              >
                <FiBell size={15} />
              </Box>
              {unread > 0 && (
                <Box
                  position="absolute" top="-4px" right="-4px"
                  w="16px" h="16px" borderRadius="full"
                  bg={C.red} color="#ffffff"
                  fontSize="9px" fontWeight="900"
                  display="flex" alignItems="center" justifyContent="center"
                  border="2px solid #ffffff"
                >
                  {unread > 9 ? '9+' : unread}
                </Box>
              )}
            </Box>
          </HStack>
        </HStack>
      </Box>

      <Box flex={1} overflowY="auto" px={4} py={4}>
        <Box maxW="900px" mx="auto">
          <VStack spacing={4} align="stretch">

            {/* ── Urgent alert banner ── */}
            {urgentCases.length > 0 && (
              <Box
                bg={C.redSoft}
                border={`1.5px solid ${C.redBorder}`}
                borderRadius="xl" px={4} py={3}
              >
                <HStack spacing={2}>
                  <Box color={C.red} flexShrink={0}><FiAlertOctagon size={16} /></Box>
                  <Text fontSize="sm" fontWeight="700" color={C.red}>
                    {urgentCases.length} {t.urgentAlert}
                  </Text>
                </HStack>
              </Box>
            )}

            {/* ── Notifications panel ── */}
            <AnimatePresence>
              {showNotifs && (
                <MotionBox
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  overflow="hidden"
                >
                  <Box
                    bg={C.bg}
                    border={`1.5px solid ${C.border}`}
                    borderRadius="xl"
                    overflow="hidden"
                  >
                    <HStack
                      px={4} py={3}
                      borderBottom={`1px solid ${C.border}`}
                      justify="space-between"
                      bg={C.card}
                    >
                      <HStack spacing={2}>
                        <FiBell size={13} color={C.accent} />
                        <Text fontSize="xs" fontWeight="800" color={C.text} textTransform="uppercase" letterSpacing="0.05em">
                          {t.notifications}
                        </Text>
                      </HStack>
                      <Box
                        as="button"
                        fontSize="10px" fontWeight="700" color={C.textMuted}
                        cursor="pointer"
                        _hover={{ color: C.accent }}
                        onClick={handleMarkAllRead}
                      >
                        {t.markRead}
                      </Box>
                    </HStack>
                    <VStack spacing={0} align="stretch" maxH="240px" overflowY="auto">
                      {notifications.length === 0 ? (
                        <Box px={4} py={4} textAlign="center">
                          <Text fontSize="xs" color={C.textMuted}>{t.noNotifs}</Text>
                        </Box>
                      ) : (
                        notifications.map(n => (
                          <HStack
                            key={n.id}
                            px={4} py={3}
                            borderBottom={`1px solid ${C.border}`}
                            bg={n.read ? C.bg : `${C.accentSoft}`}
                            spacing={3}
                            align="flex-start"
                          >
                            <Box
                              w="8px" h="8px" borderRadius="full" mt="4px"
                              bg={n.read ? C.border : (n.riskLevel === 'urgent' ? C.red : C.accent)}
                              flexShrink={0}
                            />
                            <VStack spacing={0} align="flex-start" flex={1} minW={0}>
                              <Text fontSize="xs" color={C.text} lineHeight="1.5">{n.message}</Text>
                              <Text fontSize="10px" color={C.textMuted}>
                                {timeAgo(n.timestamp, language)}
                              </Text>
                            </VStack>
                          </HStack>
                        ))
                      )}
                    </VStack>
                  </Box>
                </MotionBox>
              )}
            </AnimatePresence>

            {/* ── Stats ── */}
            {stats && (
              <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={3}>
                <StatCard
                  label={t.total}
                  value={stats.total}
                  color={C.text}
                  bg={C.bg}
                  border={C.border}
                />
                <StatCard
                  label={t.urgent}
                  value={stats.urgent}
                  color={C.red}
                  bg={C.redSoft}
                  border={C.redBorder}
                />
                <StatCard
                  label={t.pending}
                  value={stats.pending}
                  color="#d97706"
                  bg="rgba(217,119,6,0.06)"
                  border="rgba(217,119,6,0.25)"
                />
                <StatCard
                  label={t.inProgress}
                  value={stats.inProgress}
                  color="#8b5cf6"
                  bg="rgba(139,92,246,0.06)"
                  border="rgba(139,92,246,0.25)"
                />
                <StatCard
                  label={t.resolved}
                  value={stats.resolved}
                  color={C.accent}
                  bg={C.accentSoft}
                  border={C.accentBorder}
                />
              </SimpleGrid>
            )}

            {/* ── Filter tabs ── */}
            <Box
              bg={C.bg}
              border={`1.5px solid ${C.border}`}
              borderRadius="xl" p={1}
            >
              <HStack spacing={1} flexWrap="wrap" gap={1}>
                {filterOptions.map(opt => (
                  <Box
                    key={opt.value}
                    as="button"
                    px={3} py={1.5}
                    borderRadius="lg"
                    fontSize="xs" fontWeight="700"
                    cursor="pointer"
                    bg={filter === opt.value ? C.accent : 'transparent'}
                    color={filter === opt.value ? '#ffffff' : C.textMuted}
                    _hover={filter !== opt.value ? { bg: C.accentSoft, color: C.accent } : {}}
                    onClick={() => setFilter(opt.value)}
                    transition="all 0.15s"
                  >
                    {opt.label}
                  </Box>
                ))}
              </HStack>
            </Box>

            {/* ── Case list ── */}
            {filtered.length === 0 ? (
              <Box
                bg={C.bg}
                border={`1.5px solid ${C.border}`}
                borderRadius="xl" px={6} py={10}
                textAlign="center"
              >
                <Box color={C.textMuted} mb={3} display="flex" justifyContent="center">
                  <FiDatabase size={32} />
                </Box>
                <Text fontSize="sm" fontWeight="700" color={C.text} mb={1}>{t.noCases}</Text>
                <Text fontSize="xs" color={C.textMuted}>{t.noCasesDesc}</Text>
              </Box>
            ) : (
              <AnimatePresence>
                {filtered.map(c => (
                  <CaseCard
                    key={c.id}
                    c={c}
                    language={language}
                    isExpanded={expandedId === c.id}
                    onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    onStatusChange={handleStatusChange}
                    onRespond={handleRespond}
                  />
                ))}
              </AnimatePresence>
            )}

          </VStack>
        </Box>
      </Box>
    </Box>
  )
}
