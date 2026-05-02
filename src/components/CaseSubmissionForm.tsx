import { useState, useRef } from 'react'
import {
  Box, VStack, HStack, Text, Textarea, Button, Switch,
  FormControl, FormLabel, Select, Input, Badge, Image,
} from '@chakra-ui/react'
import {
  FiUpload, FiMic, FiImage, FiFile, FiX, FiSend,
  FiShield, FiEye, FiEyeOff, FiAlertOctagon, FiCheckCircle,
  FiFileText, FiMusic,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import type { MediaAttachment, RiskAnalysis } from '../types'
import { analyzeRisk } from '../services/riskDetection'
import { submitCase } from '../services/caseManager'
import RiskBadge from './RiskBadge'
import VoiceInput from './VoiceInput'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  borderFocus: '#65a30d',
  borderLime:  '#b5d44a',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.07)',
  accentBorder:'rgba(101,163,13,0.25)',
  red:         '#dc2626',
  redSoft:     'rgba(220,38,38,0.06)',
  redBorder:   'rgba(220,38,38,0.25)',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western']

interface CaseSubmissionFormProps {
  language:    'en' | 'rw'
  prefillText?: string
  onSubmitted?: (caseNumber: string) => void
  onClose?:    () => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function CaseSubmissionForm({
  language,
  prefillText = '',
  onSubmitted,
  onClose,
}: CaseSubmissionFormProps) {
  const [description, setDescription]   = useState(prefillText)
  const [isAnonymous, setIsAnonymous]   = useState(true)
  const [province, setProvince]         = useState('')
  const [contactName, setContactName]   = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [attachments, setAttachments]   = useState<MediaAttachment[]>([])
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [showVoice, setShowVoice]       = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [caseNumber, setCaseNumber]     = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef  = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const labels = {
    en: {
      title:           'Submit a Confidential Report',
      subtitle:        'Your report is encrypted and handled with strict confidentiality.',
      descLabel:       'Describe your situation',
      descPlaceholder: 'Share what happened or what you are experiencing. You can be as detailed or brief as you feel comfortable with.',
      anonymous:       'Submit anonymously',
      anonymousDesc:   'Your identity will not be recorded',
      province:        'Your province (optional)',
      selectProvince:  'Select province',
      contactName:     'Your name (optional)',
      contactPhone:    'Your phone number (optional)',
      attachments:     'Attach evidence (optional)',
      attachDesc:      'Add photos, audio recordings, or documents as evidence',
      addPhoto:        'Add Photo',
      addAudio:        'Add Audio',
      addDoc:          'Add Document',
      voiceInput:      'Voice input',
      riskDetected:    'Risk level detected',
      submit:          'Submit Report',
      submitting:      'Submitting…',
      successTitle:    'Report Submitted',
      successDesc:     'Your case has been received and will be reviewed by our team.',
      caseRef:         'Your case reference number',
      close:           'Close',
      newReport:       'Submit another report',
      urgentNotice:    'Your case has been flagged as URGENT and will be prioritized immediately.',
      encryption:      'End-to-end encrypted · Strictly confidential',
      attachedFiles:   'Attached files',
    },
    rw: {
      title:           'Tanga Raporo Yihishe',
      subtitle:        'Raporo yawe irinzwe kandi ifatwa mu ibanga ry\'ubuziranenge.',
      descLabel:       'Sobanura ikibazo cyawe',
      descPlaceholder: 'Vuga ibyabaye cyangwa ibyo uri guhurana nawe. Ushobora kuba mu buryo bwose ubona bufasha.',
      anonymous:       'Tanga raporo yihishe',
      anonymousDesc:   'Indangamuntu yawe ntizandikwa',
      province:        'Intara yawe (ntibisabwa)',
      selectProvince:  'Hitamo intara',
      contactName:     'Izina ryawe (ntibisabwa)',
      contactPhone:    'Nimero ya telefoni yawe (ntibisabwa)',
      attachments:     'Ongeraho ibimenyetso (ntibisabwa)',
      attachDesc:      'Ongeraho amafoto, inyandiko za audio, cyangwa inyandiko nk\'ibimenyetso',
      addPhoto:        'Ongeraho Ifoto',
      addAudio:        'Ongeraho Audio',
      addDoc:          'Ongeraho Inyandiko',
      voiceInput:      'Koresha ijwi',
      riskDetected:    'Urwego rw\'ingorane rwabonetse',
      submit:          'Tanga Raporo',
      submitting:      'Gutanga…',
      successTitle:    'Raporo Yatanzwe',
      successDesc:     'Ikibazo cyawe cyakiriwe kandi kizasuzumwa n\'itsinda ryacu.',
      caseRef:         'Inomero y\'ikibazo cyawe',
      close:           'Funga',
      newReport:       'Tanga raporo nshya',
      urgentNotice:    'Ikibazo cyawe cyashyizwe mu bibazo bikenewe nonaha kandi kizafatwa vuba.',
      encryption:      'Yinjiwe mu ibanga · Yihishe burundu',
      attachedFiles:   'Dosiye zashyizweho',
    },
  }
  const t = labels[language]

  const handleDescriptionChange = (val: string) => {
    setDescription(val)
    if (val.trim().length > 20) {
      const analysis = analyzeRisk(val, province || undefined)
      setRiskAnalysis(analysis)
    } else {
      setRiskAnalysis(null)
    }
  }

  const handleVoiceTranscript = (text: string) => {
    const combined = description ? `${description} ${text}` : text
    handleDescriptionChange(combined)
    setShowVoice(false)
  }

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const newAttachments: MediaAttachment[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: file.type.startsWith('image/') ? 'image'
          : file.type.startsWith('audio/') ? 'audio'
          : 'document',
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files)
    e.target.value = ''
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const att = prev.find(a => a.id === id)
      if (att?.url) URL.revokeObjectURL(att.url)
      return prev.filter(a => a.id !== id)
    })
  }

  const handleSubmit = async () => {
    if (!description.trim()) return
    setIsSubmitting(true)

    const analysis = riskAnalysis ?? analyzeRisk(description, province || undefined)
    await new Promise(r => setTimeout(r, 1200))

    const newCase = submitCase({
      description,
      riskAnalysis: analysis,
      isAnonymous,
      province: province || undefined,
      mediaAttachments: attachments,
      contactName:  isAnonymous ? undefined : contactName,
      contactPhone: isAnonymous ? undefined : contactPhone,
    })

    setCaseNumber(newCase.caseNumber)
    setSubmitted(true)
    setIsSubmitting(false)
    onSubmitted?.(newCase.caseNumber)
  }

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <VStack spacing={5} p={6} textAlign="center">
          <Box
            w="64px" h="64px" borderRadius="full"
            bg={C.accentSoft}
            border={`2px solid ${C.accentBorder}`}
            display="flex" alignItems="center" justifyContent="center"
          >
            <FiCheckCircle size={28} color={C.accent} />
          </Box>

          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="900" color={C.accent}>{t.successTitle}</Text>
            <Text fontSize="sm" color={C.textSub} lineHeight="1.7">{t.successDesc}</Text>
          </VStack>

          {riskAnalysis?.isUrgent && (
            <Box
              bg={C.redSoft}
              border={`1.5px solid ${C.redBorder}`}
              borderRadius="xl" px={4} py={3}
              w="full"
            >
              <HStack spacing={2}>
                <FiAlertOctagon size={14} color={C.red} />
                <Text fontSize="xs" fontWeight="700" color={C.red}>{t.urgentNotice}</Text>
              </HStack>
            </Box>
          )}

          <Box
            bg={C.card}
            border={`1.5px solid ${C.border}`}
            borderRadius="xl" px={5} py={4}
            w="full"
          >
            <Text fontSize="xs" color={C.textMuted} mb={1}>{t.caseRef}</Text>
            <Text fontSize="xl" fontWeight="900" color={C.text} letterSpacing="0.04em">
              {caseNumber}
            </Text>
          </Box>

          <HStack spacing={3} w="full">
            <Button
              flex={1} size="sm"
              variant="outline" borderRadius="lg"
              onClick={() => {
                setSubmitted(false)
                setDescription('')
                setAttachments([])
                setRiskAnalysis(null)
                setCaseNumber('')
              }}
            >
              {t.newReport}
            </Button>
            {onClose && (
              <Button
                flex={1} size="sm"
                bg={C.accent} color="#ffffff"
                borderRadius="lg"
                _hover={{ bg: C.accentHover }}
                onClick={onClose}
              >
                {t.close}
              </Button>
            )}
          </HStack>
        </VStack>
      </MotionBox>
    )
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <VStack spacing={0} align="stretch">
      {/* Header */}
      <Box px={5} pt={5} pb={4} borderBottom={`1px solid ${C.border}`}>
        <HStack justify="space-between" align="flex-start">
          <VStack spacing={1} align="flex-start">
            <Text fontSize="lg" fontWeight="900" color={C.text}>{t.title}</Text>
            <HStack spacing={1.5}>
              <FiShield size={11} color={C.accent} />
              <Text fontSize="xs" color={C.accent} fontWeight="600">{t.encryption}</Text>
            </HStack>
          </VStack>
          {onClose && (
            <Box
              as="button" w="30px" h="30px" borderRadius="lg"
              display="flex" alignItems="center" justifyContent="center"
              color={C.textMuted}
              _hover={{ bg: C.card, color: C.text }}
              onClick={onClose}
            >
              <FiX size={16} />
            </Box>
          )}
        </HStack>
        <Text fontSize="xs" color={C.textMuted} mt={1}>{t.subtitle}</Text>
      </Box>

      <Box px={5} py={5}>
        <VStack spacing={4} align="stretch">

          {/* ── Description ── */}
          <FormControl>
            <FormLabel fontSize="xs" fontWeight="700" color={C.text} mb={1.5}>
              {t.descLabel}
            </FormLabel>
            <Box
              border={`2px solid ${C.border}`}
              borderRadius="xl" overflow="hidden"
              _focusWithin={{ borderColor: C.borderFocus, boxShadow: '0 0 0 3px rgba(101,163,13,0.1)' }}
              transition="all 0.2s"
            >
              <Textarea
                value={description}
                onChange={e => handleDescriptionChange(e.target.value)}
                placeholder={t.descPlaceholder}
                bg="transparent" border="none"
                color={C.text} fontSize="sm" lineHeight="1.7"
                px={4} pt={3} pb={2}
                resize="none" minH="120px"
                _placeholder={{ color: C.textMuted }}
                _focus={{ boxShadow: 'none', border: 'none' }}
              />
              <HStack
                px={3} py={2}
                borderTop={`1px solid ${C.border}`}
                bg={C.card}
                justify="space-between"
              >
                <Text fontSize="10px" color={C.textMuted}>
                  {description.length} {language === 'rw' ? 'inyuguti' : 'characters'}
                </Text>
                <Box
                  as="button"
                  px={2.5} py={1}
                  borderRadius="lg"
                  bg={showVoice ? C.accentSoft : 'transparent'}
                  border={`1px solid ${showVoice ? C.accentBorder : C.border}`}
                  color={showVoice ? C.accent : C.textMuted}
                  fontSize="10px" fontWeight="700"
                  cursor="pointer"
                  onClick={() => setShowVoice(v => !v)}
                  display="flex" alignItems="center" gap="4px"
                  transition="all 0.2s"
                >
                  <FiMic size={11} />
                  {t.voiceInput}
                </Box>
              </HStack>
            </Box>
          </FormControl>

          {/* ── Voice input panel ── */}
          <AnimatePresence>
            {showVoice && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                overflow="hidden"
              >
                <Box
                  bg={C.accentSoft}
                  border={`1.5px solid ${C.accentBorder}`}
                  borderRadius="xl" p={4}
                >
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    language={language}
                  />
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>

          {/* ── Risk analysis preview ── */}
          <AnimatePresence>
            {riskAnalysis && (
              <MotionBox
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <HStack
                  px={3} py={2.5}
                  bg={riskAnalysis.isUrgent ? C.redSoft : C.accentSoft}
                  border={`1.5px solid ${riskAnalysis.isUrgent ? C.redBorder : C.accentBorder}`}
                  borderRadius="xl"
                  justify="space-between"
                  flexWrap="wrap" gap={2}
                >
                  <Text fontSize="xs" color={C.textSub} fontWeight="600">
                    {t.riskDetected}:
                  </Text>
                  <RiskBadge level={riskAnalysis.riskLevel} language={language} pulse={riskAnalysis.isUrgent} />
                </HStack>
              </MotionBox>
            )}
          </AnimatePresence>

          {/* ── Anonymous toggle ── */}
          <Box
            bg={C.card}
            border={`1.5px solid ${C.border}`}
            borderRadius="xl" px={4} py={3}
          >
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Box color={isAnonymous ? C.accent : C.textMuted}>
                  {isAnonymous ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </Box>
                <VStack spacing={0} align="flex-start">
                  <Text fontSize="sm" fontWeight="700" color={C.text}>{t.anonymous}</Text>
                  <Text fontSize="xs" color={C.textMuted}>{t.anonymousDesc}</Text>
                </VStack>
              </HStack>
              <Switch
                isChecked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                colorScheme="green"
                size="md"
              />
            </HStack>
          </Box>

          {/* ── Contact info (if not anonymous) ── */}
          <AnimatePresence>
            {!isAnonymous && (
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                overflow="hidden"
              >
                <VStack spacing={3} align="stretch">
                  <Input
                    placeholder={t.contactName}
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    size="sm" borderRadius="lg"
                    fontSize="sm" color={C.text}
                    _placeholder={{ color: C.textMuted }}
                    borderColor={C.border}
                    _focus={{ borderColor: C.borderFocus, boxShadow: '0 0 0 2px rgba(101,163,13,0.1)' }}
                  />
                  <Input
                    placeholder={t.contactPhone}
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    size="sm" borderRadius="lg"
                    fontSize="sm" color={C.text}
                    _placeholder={{ color: C.textMuted }}
                    borderColor={C.border}
                    _focus={{ borderColor: C.borderFocus, boxShadow: '0 0 0 2px rgba(101,163,13,0.1)' }}
                  />
                </VStack>
              </MotionBox>
            )}
          </AnimatePresence>

          {/* ── Province ── */}
          <Select
            placeholder={t.selectProvince}
            value={province}
            onChange={e => setProvince(e.target.value)}
            size="sm" borderRadius="lg"
            fontSize="sm" color={C.text}
            borderColor={C.border}
            _focus={{ borderColor: C.borderFocus, boxShadow: '0 0 0 2px rgba(101,163,13,0.1)' }}
          >
            {PROVINCES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>

          {/* ── File attachments ── */}
          <Box>
            <Text fontSize="xs" fontWeight="700" color={C.text} mb={1}>{t.attachments}</Text>
            <Text fontSize="xs" color={C.textMuted} mb={3}>{t.attachDesc}</Text>

            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file" multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <input
              ref={audioInputRef}
              type="file" multiple
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <input
              ref={fileInputRef}
              type="file" multiple
              accept=".pdf,.doc,.docx,.txt,.odt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Upload buttons */}
            <HStack spacing={2} flexWrap="wrap" gap={2}>
              <Box
                as="button"
                px={3} py={2}
                borderRadius="lg"
                border={`1.5px dashed ${C.border}`}
                bg={C.card}
                color={C.textMuted}
                fontSize="xs" fontWeight="600"
                cursor="pointer"
                _hover={{ borderColor: C.accent, color: C.accent, bg: C.accentSoft }}
                onClick={() => imageInputRef.current?.click()}
                display="flex" alignItems="center" gap="6px"
                transition="all 0.2s"
              >
                <FiImage size={12} />
                {t.addPhoto}
              </Box>

              <Box
                as="button"
                px={3} py={2}
                borderRadius="lg"
                border={`1.5px dashed ${C.border}`}
                bg={C.card}
                color={C.textMuted}
                fontSize="xs" fontWeight="600"
                cursor="pointer"
                _hover={{ borderColor: C.accent, color: C.accent, bg: C.accentSoft }}
                onClick={() => audioInputRef.current?.click()}
                display="flex" alignItems="center" gap="6px"
                transition="all 0.2s"
              >
                <FiMusic size={12} />
                {t.addAudio}
              </Box>

              <Box
                as="button"
                px={3} py={2}
                borderRadius="lg"
                border={`1.5px dashed ${C.border}`}
                bg={C.card}
                color={C.textMuted}
                fontSize="xs" fontWeight="600"
                cursor="pointer"
                _hover={{ borderColor: C.accent, color: C.accent, bg: C.accentSoft }}
                onClick={() => fileInputRef.current?.click()}
                display="flex" alignItems="center" gap="6px"
                transition="all 0.2s"
              >
                <FiFileText size={12} />
                {t.addDoc}
              </Box>
            </HStack>

            {/* Attachment previews */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <MotionBox
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  mt={3}
                >
                  <Text fontSize="10px" fontWeight="700" color={C.textMuted} mb={2} textTransform="uppercase" letterSpacing="0.05em">
                    {t.attachedFiles} ({attachments.length})
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {attachments.map(att => (
                      <HStack
                        key={att.id}
                        bg={C.card}
                        border={`1.5px solid ${C.border}`}
                        borderRadius="xl"
                        p={2.5}
                        spacing={3}
                        align="center"
                      >
                        {/* Preview / icon */}
                        {att.type === 'image' && att.url ? (
                          <Box
                            w="44px" h="44px" borderRadius="lg"
                            overflow="hidden" flexShrink={0}
                            border={`1px solid ${C.border}`}
                          >
                            <Image
                              src={att.url}
                              alt={att.name}
                              w="full" h="full"
                              objectFit="cover"
                            />
                          </Box>
                        ) : att.type === 'audio' ? (
                          <Box
                            w="44px" h="44px" borderRadius="lg"
                            bg="rgba(139,92,246,0.08)"
                            border="1.5px solid rgba(139,92,246,0.2)"
                            display="flex" alignItems="center" justifyContent="center"
                            flexShrink={0}
                          >
                            <FiMusic size={18} color="#8b5cf6" />
                          </Box>
                        ) : (
                          <Box
                            w="44px" h="44px" borderRadius="lg"
                            bg="rgba(59,130,246,0.08)"
                            border="1.5px solid rgba(59,130,246,0.2)"
                            display="flex" alignItems="center" justifyContent="center"
                            flexShrink={0}
                          >
                            <FiFile size={18} color="#3b82f6" />
                          </Box>
                        )}

                        {/* File info */}
                        <VStack spacing={0} align="flex-start" flex={1} minW={0}>
                          <Text fontSize="xs" fontWeight="600" color={C.text} noOfLines={1}>
                            {att.name}
                          </Text>
                          <HStack spacing={2}>
                            <Badge
                              fontSize="9px"
                              colorScheme={att.type === 'image' ? 'green' : att.type === 'audio' ? 'purple' : 'blue'}
                              borderRadius="full" px={1.5}
                            >
                              {att.type}
                            </Badge>
                            <Text fontSize="10px" color={C.textMuted}>
                              {formatFileSize(att.size)}
                            </Text>
                          </HStack>
                        </VStack>

                        {/* Audio player inline */}
                        {att.type === 'audio' && att.url && (
                          <Box flexShrink={0}>
                            <audio
                              controls
                              src={att.url}
                              style={{ height: '28px', maxWidth: '120px' }}
                            />
                          </Box>
                        )}

                        {/* Remove button */}
                        <Box
                          as="button"
                          w="24px" h="24px"
                          borderRadius="full"
                          display="flex" alignItems="center" justifyContent="center"
                          color={C.textMuted}
                          _hover={{ bg: C.redSoft, color: C.red }}
                          onClick={() => removeAttachment(att.id)}
                          cursor="pointer"
                          flexShrink={0}
                          transition="all 0.15s"
                        >
                          <FiX size={12} />
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>

          {/* ── Submit ── */}
          <Button
            size="md"
            bg={description.trim() ? C.accent : C.border}
            color={description.trim() ? '#ffffff' : C.textMuted}
            borderRadius="xl"
            leftIcon={<FiSend size={14} />}
            _hover={description.trim() ? { bg: C.accentHover } : {}}
            cursor={description.trim() ? 'pointer' : 'not-allowed'}
            isLoading={isSubmitting}
            loadingText={t.submitting}
            onClick={description.trim() ? handleSubmit : undefined}
            boxShadow={description.trim() ? '0 2px 10px rgba(101,163,13,0.3)' : 'none'}
            transition="all 0.2s"
          >
            {t.submit}
          </Button>

        </VStack>
      </Box>
    </VStack>
  )
}
