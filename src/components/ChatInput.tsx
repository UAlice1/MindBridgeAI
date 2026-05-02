import { useState, useRef } from 'react'
import { Box, HStack, Textarea, Text } from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'

const C = {
  bg:          '#ffffff',
  input:       '#ffffff',
  inputBar:    '#f9fafb',
  border:      '#e5e7eb',
  borderFocus: '#65a30d',
  accent:      '#65a30d',
  accentHover: '#4d7c0f',
  text:        '#000000',
  textFaint:   '#9ca3af',
  placeholder: '#9ca3af',
  error:       '#dc2626',
}

interface ChatInputProps {
  onSend:    (message: string) => void
  isLoading: boolean
  language:  'en' | 'rw'
}

export default function ChatInput({ onSend, isLoading, language }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 140)}px` }
  }

  const isOverLimit = value.length > 500
  const canSend     = value.trim().length > 0 && !isOverLimit && !isLoading

  return (
    <Box
      px={{ base: 3, md: 6 }} py={4}
      bg={C.bg}
      borderTop={`1px solid ${C.border}`}
    >
      <Box maxW="760px" mx="auto">
        <Box
          bg={C.input}
          border={`2px solid ${C.border}`}
          borderRadius="2xl" overflow="hidden"
          boxShadow="0 2px 12px rgba(0,0,0,0.06)"
          transition="border-color 0.2s, box-shadow 0.2s"
          _focusWithin={{
            borderColor: C.borderFocus,
            boxShadow:   '0 0 0 3px rgba(101,163,13,0.12)',
          }}
        >
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            onInput={handleInput}
            placeholder={language === 'rw' ? 'Vuga uko wiyumva...' : "Share what's on your mind..."}
            bg="transparent" border="none"
            color={C.text} fontSize="sm" lineHeight="1.7"
            px={5} pt={4} pb={2}
            resize="none" minH="54px" maxH="140px" rows={1}
            _placeholder={{ color: C.placeholder }}
            _focus={{ boxShadow: 'none', border: 'none' }}
            disabled={isLoading}
            className="chat-input"
          />

          <HStack
            px={4} py={2.5} justify="space-between" align="center"
            borderTop={`1.5px solid ${C.border}`}
            bg={C.inputBar}
          >
            <Text fontSize="xs" color={isOverLimit ? C.error : C.textFaint}>
              {isOverLimit
                ? `${value.length}/500 — message too long`
                : language === 'rw'
                ? 'Ibanga ryawe ririnzwe · Enter kohereza'
                : 'Your privacy is protected · Enter to send'}
            </Text>

            <Box
              as="button" w="34px" h="34px" borderRadius="lg"
              display="flex" alignItems="center" justifyContent="center"
              bg={canSend ? C.accent : 'transparent'}
              color={canSend ? '#ffffff' : C.textFaint}
              border={canSend ? 'none' : `1px solid ${C.border}`}
              cursor={canSend ? 'pointer' : 'default'}
              _hover={canSend ? { bg: C.accentHover } : {}}
              onClick={handleSend}
              transition="all 0.2s"
              aria-label="Send message"
              boxShadow={canSend ? '0 2px 6px rgba(101,163,13,0.3)' : 'none'}
            >
              <FiSend size={15} />
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
