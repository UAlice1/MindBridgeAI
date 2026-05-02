import { Box, HStack, Text } from '@chakra-ui/react'
import { FiAlertOctagon, FiAlertTriangle, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import type { RiskLevel } from '../types'
import { getRiskColor, getRiskBg, getRiskLabel } from '../service/riskDetection'

const MotionBox = motion.create(Box)

interface RiskBadgeProps {
  level: RiskLevel
  language?: 'en' | 'rw'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
  showIcon?: boolean
}

const icons: Record<RiskLevel, typeof FiAlertOctagon> = {
  urgent: FiAlertOctagon,
  high:   FiAlertTriangle,
  medium: FiAlertCircle,
  low:    FiCheckCircle,
}

export default function RiskBadge({
  level,
  language = 'en',
  size = 'md',
  pulse = false,
  showIcon = true,
}: RiskBadgeProps) {
  const color = getRiskColor(level)
  const bg    = getRiskBg(level)
  const label = getRiskLabel(level, language)
  const Icon  = icons[level]

  const sizes = {
    sm: { px: 2, py: 0.5, fontSize: '10px', iconSize: 10 },
    md: { px: 3, py: 1,   fontSize: '11px', iconSize: 12 },
    lg: { px: 4, py: 1.5, fontSize: '13px', iconSize: 14 },
  }
  const s = sizes[size]

  return (
    <MotionBox
      display="inline-flex"
      animate={pulse && level === 'urgent' ? { scale: [1, 1.04, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <HStack
        spacing={1.5}
        px={s.px} py={s.py}
        borderRadius="full"
        bg={bg}
        border={`1.5px solid ${color}40`}
        display="inline-flex"
      >
        {showIcon && (
          <Box color={color} flexShrink={0}>
            <Icon size={s.iconSize} />
          </Box>
        )}
        <Text
          fontSize={s.fontSize}
          fontWeight="800"
          color={color}
          letterSpacing="0.04em"
          textTransform="uppercase"
          lineHeight="1"
        >
          {label}
        </Text>
      </HStack>
    </MotionBox>
  )
}
