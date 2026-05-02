import { useState } from 'react'
import {
  Box, VStack, HStack, Text, Input, Button,
  Modal, ModalOverlay, ModalContent, ModalBody,
} from '@chakra-ui/react'
import { FiLock, FiMail, FiX, FiLayout } from 'react-icons/fi'
import { motion } from 'framer-motion'
import BrainLogo from './BrainLogo'

const MotionBox = motion.create(Box)

const C = {
  bg:          '#ffffff',
  card:        '#f9fafb',
  border:      '#e5e7eb',
  borderLime:  '#b5d44a',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  accentSoft:  'rgba(101,163,13,0.08)',
  red:         '#dc2626',
  redSoft:     'rgba(220,38,38,0.06)',
  redBorder:   'rgba(220,38,38,0.25)',
  text:        '#111827',
  textSub:     '#374151',
  textMuted:   '#6b7280',
}

// NGO credentials — single authorised account
const NGO_EMAIL    = 'umubyeyialice7@gmail.com'
const NGO_PASSWORD = '1234'

interface DashboardLoginProps {
  isOpen:    boolean
  onClose:   () => void
  onSuccess: () => void
  language:  'en' | 'rw'
}

const content = {
  en: {
    title:       'Professional Access',
    subtitle:    'This dashboard is restricted to authorised NGO staff only.',
    emailLabel:  'Email address',
    passLabel:   'Password',
    emailPH:     'Enter your email',
    passPH:      'Enter your password',
    submit:      'Sign In',
    error:       'Invalid email or password.',
    cancel:      'Cancel',
  },
  rw: {
    title:       'Kwinjira kw\'Inzobere',
    subtitle:    'Iri kibaho ni iry\'abakozi b\'umuryango bemewe gusa.',
    emailLabel:  'Imeyili',
    passLabel:   'Ijambo ry\'ibanga',
    emailPH:     'Injiza imeyili yawe',
    passPH:      'Injiza ijambo ry\'ibanga',
    submit:      'Injira',
    error:       'Imeyili cyangwa ijambo ry\'ibanga si ryo.',
    cancel:      'Reka',
  },
}

export default function DashboardLogin({ isOpen, onClose, onSuccess, language }: DashboardLoginProps) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(false)
  const [loading, setLoading]   = useState(false)

  const t = content[language]

  const handleSubmit = async () => {
    setError(false)
    setLoading(true)
    // Simulate a brief async check
    await new Promise(r => setTimeout(r, 400))
    setLoading(false)

    if (email.trim().toLowerCase() === NGO_EMAIL && password === NGO_PASSWORD) {
      setEmail('')
      setPassword('')
      onSuccess()
    } else {
      setError(true)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="sm">
      <ModalOverlay bg="rgba(0,0,0,0.5)" backdropFilter="blur(6px)" />
      <ModalContent
        borderRadius="2xl"
        border={`1.5px solid ${C.border}`}
        boxShadow="0 24px 64px rgba(0,0,0,0.18)"
        mx={4}
        overflow="hidden"
      >
        <ModalBody p={0}>
          <MotionBox
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <Box
              px={6} pt={6} pb={5}
              borderBottom={`1.5px solid ${C.border}`}
              bg={C.card}
            >
              <HStack justify="space-between" align="flex-start">
                <HStack spacing={3}>
                  <Box
                    w="44px" h="44px" borderRadius="xl"
                    bg={C.accentSoft}
                    border={`1.5px solid ${C.borderLime}`}
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <BrainLogo size={24} />
                  </Box>
                  <VStack spacing={0} align="flex-start">
                    <HStack spacing={1.5}>
                      <FiLayout size={13} color={C.accent} />
                      <Text fontSize="sm" fontWeight="800" color={C.text}>{t.title}</Text>
                    </HStack>
                    <Text fontSize="xs" color={C.textMuted} maxW="220px" lineHeight="1.5">
                      {t.subtitle}
                    </Text>
                  </VStack>
                </HStack>
                <Box
                  as="button"
                  w="28px" h="28px" borderRadius="lg"
                  display="flex" alignItems="center" justifyContent="center"
                  color={C.textMuted}
                  _hover={{ bg: C.accentSoft, color: C.accent }}
                  onClick={handleClose}
                  flexShrink={0}
                >
                  <FiX size={14} />
                </Box>
              </HStack>
            </Box>

            {/* Form */}
            <VStack spacing={4} px={6} py={6} align="stretch">

              {/* Error banner */}
              {error && (
                <Box
                  bg={C.redSoft}
                  border={`1px solid ${C.redBorder}`}
                  borderRadius="lg" px={3} py={2.5}
                >
                  <Text fontSize="xs" fontWeight="600" color={C.red}>{t.error}</Text>
                </Box>
              )}

              {/* Email */}
              <VStack spacing={1.5} align="stretch">
                <HStack spacing={1.5}>
                  <FiMail size={12} color={C.textMuted} />
                  <Text fontSize="xs" fontWeight="700" color={C.textSub}>{t.emailLabel}</Text>
                </HStack>
                <Input
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(false) }}
                  onKeyDown={handleKey}
                  placeholder={t.emailPH}
                  type="email"
                  size="sm"
                  borderRadius="lg"
                  borderColor={error ? C.red : C.border}
                  fontSize="sm"
                  color={C.text}
                  _placeholder={{ color: C.textMuted }}
                  _focus={{ borderColor: C.accent, boxShadow: '0 0 0 2px rgba(101,163,13,0.15)' }}
                  autoComplete="email"
                />
              </VStack>

              {/* Password */}
              <VStack spacing={1.5} align="stretch">
                <HStack spacing={1.5}>
                  <FiLock size={12} color={C.textMuted} />
                  <Text fontSize="xs" fontWeight="700" color={C.textSub}>{t.passLabel}</Text>
                </HStack>
                <Input
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false) }}
                  onKeyDown={handleKey}
                  placeholder={t.passPH}
                  type="password"
                  size="sm"
                  borderRadius="lg"
                  borderColor={error ? C.red : C.border}
                  fontSize="sm"
                  color={C.text}
                  _placeholder={{ color: C.textMuted }}
                  _focus={{ borderColor: C.accent, boxShadow: '0 0 0 2px rgba(101,163,13,0.15)' }}
                  autoComplete="current-password"
                />
              </VStack>

              {/* Actions */}
              <HStack spacing={2} pt={1}>
                <Button
                  flex={1}
                  size="sm"
                  borderRadius="lg"
                  variant="outline"
                  borderColor={C.border}
                  color={C.textMuted}
                  fontWeight="600"
                  _hover={{ bg: C.card }}
                  onClick={handleClose}
                >
                  {t.cancel}
                </Button>
                <Button
                  flex={2}
                  size="sm"
                  borderRadius="lg"
                  bg={C.accent}
                  color="#ffffff"
                  fontWeight="700"
                  _hover={{ bg: C.accentHover }}
                  isLoading={loading}
                  onClick={handleSubmit}
                  boxShadow="0 2px 8px rgba(101,163,13,0.3)"
                >
                  {t.submit}
                </Button>
              </HStack>

            </VStack>
          </MotionBox>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
