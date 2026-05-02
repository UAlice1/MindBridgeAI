import { useState } from 'react'
import { Box, HStack } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import HomeScreen from './components/HomeScreen'
import ChatScreen from './components/ChatScreen'
import ProfessionalDashboard from './components/ProfessionalDashboard'
import DashboardLogin from './components/DashboardLogin'
import SubmissionReport from './components/SubmissionReport'

type Screen = 'home' | 'chat' | 'dashboard' | 'submission-report'

export default function App() {
  const [screen, setScreen]             = useState<Screen>('home')
  const [language, setLanguage]         = useState<'en' | 'rw'>('en')
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [sessionCount, setSessionCount] = useState(1)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()
  const [showLogin, setShowLogin]       = useState(false)

  const handleStartChat = (text: string) => {
    setInitialMessage(text)
    setScreen('chat')
    setSidebarOpen(false)
  }

  const handleNewChat = () => {
    setSessionCount((prev) => prev + 1)
    setInitialMessage(undefined)
    setScreen('home')
    setSidebarOpen(false)
  }

  // Called when user clicks "Professional Dashboard" — show login first
  const handleOpenDashboard = () => {
    setSidebarOpen(false)
    setShowLogin(true)
  }

  // Called after successful login
  const handleLoginSuccess = () => {
    setShowLogin(false)
    setScreen('dashboard')
  }

  const handleCloseDashboard = () => {
    setScreen('home')
  }

  const handleOpenSubmissionReport = () => {
    setSidebarOpen(false)
    setScreen('submission-report')
  }

  const handleCloseSubmissionReport = () => {
    setScreen('home')
  }

  return (
    <HStack spacing={0} h="100vh" w="100vw" bg="#ffffff" overflow="hidden" align="stretch">

      {/* Sidebar — hidden on dashboard and submission report screens */}
      {screen !== 'dashboard' && screen !== 'submission-report' && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onOpenDashboard={handleOpenDashboard}
          onOpenSubmissionReport={handleOpenSubmissionReport}
          language={language}
        />
      )}

      {/* Main content */}
      <Box flex={1} h="100%" overflow="hidden">
        <AnimatePresence mode="wait">
          {screen === 'home' ? (
            <HomeScreen
              key="home"
              language={language}
              onLanguageChange={setLanguage}
              onSend={handleStartChat}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onOpenDashboard={handleOpenDashboard}
              onOpenSubmissionReport={handleOpenSubmissionReport}
            />
          ) : screen === 'chat' ? (
            <ChatScreen
              key={`chat-${sessionCount}`}
              language={language}
              initialMessage={initialMessage}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onNewChat={handleNewChat}
            />
          ) : screen === 'submission-report' ? (
            <SubmissionReport
              key="submission-report"
              language={language}
              onBack={handleCloseSubmissionReport}
            />
          ) : (
            <ProfessionalDashboard
              key="dashboard"
              language={language}
              onBack={handleCloseDashboard}
            />
          )}
        </AnimatePresence>
      </Box>

      {/* Login gate — shown before dashboard is revealed */}
      <DashboardLogin
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={handleLoginSuccess}
        language={language}
      />

    </HStack>
  )
}
