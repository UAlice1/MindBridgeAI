import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Badge, Button, Input } from '@chakra-ui/react'
import { FiArrowLeft, FiDownload, FiCheckCircle, FiClock, FiAlertOctagon } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { Case } from '../types'
import { getAllCases } from '../service/caseManager'
import RiskBadge from './RiskBadge'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  borderLime:  '#b5d44a',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

interface SubmissionReportProps {
  language: 'en' | 'rw'
  onBack: () => void
}

const content = {
  en: {
    title:           'Submission Reports',
    subtitle:        'Track your submitted cases and their status',
    noSubmissions:   'No submissions yet',
    noSubmissionsDesc: 'Cases you submit will appear here',
    caseNumber:      'Case Number',
    status:          'Status',
    submitted:       'Submitted',
    riskLevel:       'Risk Level',
    anonymous:       'Anonymous',
    named:           'Identified',
    details:         'View Details',
    download:        'Download Report',
    pending:         'Pending',
    flagged:         'Flagged',
    inProgress:      'In Progress',
    resolved:        'Resolved',
    closed:          'Closed',
    exportCSV:       'Export as CSV',
    noData:          'No data available',
  },
  rw: {
    title:           'Raporo y\'Ibisubizo',
    subtitle:        'Sukuza ibisubizo byawe kandi eba imiterere yazo',
    noSubmissions:   'Nta bisubizo',
    noSubmissionsDesc: 'Ibisubizo ubwiyunge mubisubiza bizohere hano',
    caseNumber:      'Umubare w\'Ubwiyunge',
    status:          'Imiterere',
    submitted:       'Bisubizwa',
    riskLevel:       'Ingorane',
    anonymous:       'Yihishe',
    named:           'Menya',
    details:         'Reba Ibisoza',
    download:        'Yandikiramo Raporo',
    pending:         'Ibitegeka',
    flagged:         'Byasigaye',
    inProgress:      'Ikorera',
    resolved:        'Byasolved',
    closed:          'Byarafunzwe',
    exportCSV:       'Inyandika nka CSV',
    noData:          'Nta makuru',
  },
}

const statusIcons = {
  pending:     FiClock,
  flagged:     FiAlertOctagon,
  in_progress: FiClock,
  resolved:    FiCheckCircle,
  closed:      FiCheckCircle,
}

const statusLabels = {
  pending:     'pending',
  flagged:     'flagged',
  in_progress: 'inProgress',
  resolved:    'resolved',
  closed:      'closed',
}

function formatDate(date: Date, lang: 'en' | 'rw'): string {
  const d = new Date(date)
  if (lang === 'rw') {
    return d.toLocaleDateString('rw-RW', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'flagged':      return '#dc2626'  // red
    case 'pending':      return '#f59e0b'  // amber
    case 'in_progress':  return '#3b82f6'  // blue
    case 'resolved':     return '#10b981'  // green
    case 'closed':       return '#6b7280'  // gray
    default:             return '#6b7280'
  }
}

export default function SubmissionReport({ language, onBack }: SubmissionReportProps) {
  const [cases, setCases] = useState<Case[]>([])
  const [searchCaseNumber, setSearchCaseNumber] = useState('')
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)

  const t = content[language]

  useEffect(() => {
    const allCases = getAllCases()
    setCases(allCases)
  }, [])

  const filteredCases = searchCaseNumber
    ? cases.filter(c => c.caseNumber.toLowerCase().includes(searchCaseNumber.toLowerCase()))
    : cases

  const downloadCSV = () => {
    if (cases.length === 0) return

    const headers = [t.caseNumber, t.status, t.riskLevel, t.submitted]
    const rows = cases.map(c => [
      c.caseNumber,
      statusLabels[c.status as keyof typeof statusLabels] || c.status,
      c.riskLevel,
      formatDate(c.submittedAt, language),
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submission-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (selectedCase) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        h="100%"
        w="100%"
        display="flex"
        flexDirection="column"
        bg={C.bg}
      >
        {/* Header */}
        <HStack
          px={6} py={4}
          borderBottom={`1.5px solid ${C.border}`}
          justify="space-between"
          align="center"
        >
          <HStack gap={3}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCase(null)}
              leftIcon={<FiArrowLeft size={18} />}
              color={C.accent}
              _hover={{ bg: 'transparent' }}
            />
            <VStack gap={0} align="flex-start">
              <Text fontSize="lg" fontWeight="800" color={C.text}>{selectedCase.caseNumber}</Text>
              <Text fontSize="xs" color={C.textMuted}>{formatDate(selectedCase.submittedAt, language)}</Text>
            </VStack>
          </HStack>
          <RiskBadge level={selectedCase.riskLevel} language={language} size="md" />
        </HStack>

        {/* Details */}
        <Box flex={1} overflowY="auto" px={6} py={6}>
          <VStack gap={6} align="stretch">

            {/* Status */}
            <Box bg={C.card} borderRadius="xl" border={`1.5px solid ${C.border}`} p={4}>
              <HStack justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="700" color={C.textMuted} textTransform="uppercase">{t.status}</Text>
                <Badge
                  px={3} py={1.5}
                  borderRadius="full"
                  bg={getStatusColor(selectedCase.status)}
                  color="#ffffff"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="capitalize"
                >
                  {statusLabels[selectedCase.status as keyof typeof statusLabels] || selectedCase.status}
                </Badge>
              </HStack>
            </Box>

            {/* Description */}
            {selectedCase.description && selectedCase.description !== '[Anonymous submission]' && (
              <Box bg={C.card} borderRadius="xl" border={`1.5px solid ${C.border}`} p={4}>
                <Text fontSize="xs" fontWeight="700" color={C.textMuted} textTransform="uppercase" mb={2}>{t.details}</Text>
                <Text fontSize="sm" color={C.text} lineHeight="1.6">{selectedCase.description}</Text>
              </Box>
            )}

            {/* Anonymous badge */}
            {selectedCase.isAnonymous && (
              <Badge
                px={3} py={2}
                borderRadius="lg"
                bg={C.accentSoft}
                border={`1.5px solid ${C.borderLime}`}
                color={C.accent}
                fontSize="xs"
                fontWeight="700"
              >
                {t.anonymous}
              </Badge>
            )}

            {/* Contact info if not anonymous */}
            {!selectedCase.isAnonymous && selectedCase.contactName && (
              <Box bg={C.card} borderRadius="xl" border={`1.5px solid ${C.border}`} p={4}>
                <VStack gap={2} align="flex-start">
                  <HStack w="full" justify="space-between">
                    <Text fontSize="xs" color={C.textMuted} fontWeight="700">Name</Text>
                    <Text fontSize="sm" color={C.text} fontWeight="600">{selectedCase.contactName}</Text>
                  </HStack>
                  {selectedCase.contactPhone && (
                    <HStack w="full" justify="space-between">
                      <Text fontSize="xs" color={C.textMuted} fontWeight="700">Phone</Text>
                      <Text fontSize="sm" color={C.text} fontWeight="600">{selectedCase.contactPhone}</Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            )}

            {/* Assigned NGO */}
            {selectedCase.assignedNGO && (
              <Box bg={C.card} borderRadius="xl" border={`1.5px solid ${C.border}`} p={4}>
                <Text fontSize="xs" fontWeight="700" color={C.textMuted} textTransform="uppercase" mb={2}>Assigned NGO</Text>
                <Text fontSize="sm" fontWeight="600" color={C.text}>{selectedCase.assignedNGO.name}</Text>
                {selectedCase.assignedNGO.phone && (
                  <Text fontSize="xs" color={C.textMuted} mt={1}>{selectedCase.assignedNGO.phone}</Text>
                )}
              </Box>
            )}

          </VStack>
        </Box>
      </MotionBox>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      h="100%"
      w="100%"
      display="flex"
      flexDirection="column"
      bg={C.bg}
    >
      {/* Header */}
      <HStack
        px={6} py={4}
        borderBottom={`1.5px solid ${C.border}`}
        justify="space-between"
        align="center"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<FiArrowLeft size={18} />}
          color={C.accent}
          _hover={{ bg: 'transparent' }}
        />
        <VStack gap={0} align="center" flex={1}>
          <Text fontSize="lg" fontWeight="800" color={C.text}>{t.title}</Text>
          <Text fontSize="xs" color={C.textMuted}>{t.subtitle}</Text>
        </VStack>
        {cases.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="green"
            onClick={downloadCSV}
            leftIcon={<FiDownload size={14} />}
            fontSize="xs"
          >
            {t.exportCSV}
          </Button>
        )}
      </HStack>

      {/* Search */}
      {cases.length > 0 && (
        <Box px={6} py={4} borderBottom={`1.5px solid ${C.border}`}>
          <Input
            placeholder={t.caseNumber}
            value={searchCaseNumber}
            onChange={(e) => setSearchCaseNumber(e.target.value)}
            size="sm"
            borderRadius="lg"
            fontSize="sm"
            _placeholder={{ color: C.textMuted }}
          />
        </Box>
      )}

      {/* Content */}
      <Box flex={1} overflowY="auto" px={6} py={6}>
        {filteredCases.length === 0 ? (
          <VStack gap={3} align="center" justify="center" h="full">
            <Text fontSize="md" fontWeight="700" color={C.text}>{t.noSubmissions}</Text>
            <Text fontSize="sm" color={C.textMuted}>{t.noSubmissionsDesc}</Text>
          </VStack>
        ) : (
          <VStack gap={3} align="stretch">
            {filteredCases.map((c) => (
              <MotionBox
                key={c.id}
                as="button"
                onClick={() => setSelectedCase(c)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                bg={C.card}
                border={`1.5px solid ${C.border}`}
                borderRadius="xl"
                p={4}
                textAlign="left"
                transition="all 0.2s"
                _hover={{ borderColor: C.borderLime, boxShadow: '0 4px 12px rgba(101,163,13,0.1)' }}
              >
                <HStack justify="space-between" align="flex-start" gap={3}>
                  <VStack gap={2} align="flex-start" flex={1}>
                    <HStack gap={2} align="center">
                      <Text fontSize="sm" fontWeight="800" color={C.text}>{c.caseNumber}</Text>
                      {c.isAnonymous && (
                        <Badge fontSize="9px" px={2} py={0.5} bg={C.accentSoft} color={C.accent} borderRadius="full">
                          {t.anonymous}
                        </Badge>
                      )}
                    </HStack>
                    <HStack gap={2} fontSize="xs" color={C.textMuted}>
                      <Text>{formatDate(c.submittedAt, language)}</Text>
                      <Text>•</Text>
                      <Text textTransform="capitalize">
                        {statusLabels[c.status as keyof typeof statusLabels] || c.status}
                      </Text>
                    </HStack>
                  </VStack>
                  <RiskBadge level={c.riskLevel} language={language} size="sm" />
                </HStack>
              </MotionBox>
            ))}
          </VStack>
        )}
      </Box>
    </MotionBox>
  )
}
