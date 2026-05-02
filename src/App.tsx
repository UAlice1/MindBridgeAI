import { useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import HomeScreen from "./components/HomeScreen";

type Screen = "home" | "chat";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [language, setLanguage] = useState<"en" | "rw">("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const handleStartChat = (text: string) => {
    setInitialMessage(text);
    setScreen("chat");
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setSessionCount((prev) => prev + 1);
    setInitialMessage(undefined);
    setScreen("home");
    setSidebarOpen(false);
  };

  return (
    <HStack
      gap={0}
      h="100vh"
      w="100vw"
      bg="#ffffff"
      overflow="hidden"
      align="stretch"
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        language={language}
      />

      {/* Main content */}
      <Box flex={1} h="100%" overflow="hidden">
        <AnimatePresence mode="wait">
          {screen === "home" ? (
            <HomeScreen
              key="home"
              language={language}
              onLanguageChange={setLanguage}
              onSend={handleStartChat}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          ) : (
            <ChatScreen
              key={`chat-${sessionCount}`}
              language={language}
              initialMessage={initialMessage}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onNewChat={handleNewChat}
            />
          )}
        </AnimatePresence>
      </Box>
    </HStack>
  );
}
