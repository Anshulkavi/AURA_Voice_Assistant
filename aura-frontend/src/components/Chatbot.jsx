"use client"

import { useEffect, useRef, useState } from "react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import Sidebar from "./Sidebar"
import FlaskNotRunning from "./FlaskNotRunning"
import BackendStatus from "./BackendStatus"
import { Menu } from "lucide-react"
import { useChat } from "../hooks/useChat"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"

function Chatbot() {
  const { messages, isLoading, sendMessage, history, clearChat, backendStatus, retryBackendConnection } = useChat()
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
  const messagesEndRef = useRef(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const lastProcessedMessageRef = useRef(null)

  // Provide default values to prevent undefined errors
  const safeBackendStatus = backendStatus || {
    running: false,
    checked: false,
    checking: true,
    error: null,
  }

  // Speak the latest bot/model message - WITH LOOP PREVENTION
  useEffect(() => {
    if (!messages || messages.length === 0 || isLoading) return

    const lastMessage = messages[messages.length - 1]

    // Only speak bot/model messages, not system messages
    if (lastMessage.sender !== "model" && lastMessage.sender !== "bot") return

    // Prevent speaking the same message multiple times
    const messageKey = `${lastMessage.id}-${lastMessage.text}`
    if (lastProcessedMessageRef.current === messageKey) {
      console.log("🔇 Skipping duplicate message:", lastMessage.text.substring(0, 50))
      return
    }

    // Don't speak if already speaking
    if (isSpeaking) {
      console.log("🔇 Already speaking, skipping new message")
      return
    }

    console.log("🎤 Processing new message for speech:", lastMessage.text.substring(0, 50))
    lastProcessedMessageRef.current = messageKey

    // Small delay to ensure message is rendered and avoid rapid-fire speaking
    const timeoutId = setTimeout(() => {
      speak(lastMessage.text)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [messages, isLoading, speak, isSpeaking])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [messages, isLoading])

  const handleNewChat = () => {
    stopSpeaking()
    clearChat()
    setSidebarOpen(false)
    // Reset the last processed message when starting new chat
    lastProcessedMessageRef.current = null
  }

  const handleSelectChat = (chatIndex) => {
    console.log("Selected chat:", chatIndex)
    setSidebarOpen(false)
    // Stop speaking when switching chats
    stopSpeaking()
    lastProcessedMessageRef.current = null
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSendMessage = async (text, imageBase64 = null) => {
    // Stop any ongoing speech when sending a new message
    stopSpeaking()
    await sendMessage(text, imageBase64)
  }

  const handleRetryConnection = async () => {
    setIsRetrying(true)
    try {
      await retryBackendConnection()
    } catch (error) {
      console.error("Retry failed:", error)
    } finally {
      setIsRetrying(false)
    }
  }

  // Show loading state while checking backend
  if (safeBackendStatus.checking && !safeBackendStatus.checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Checking Flask backend...</p>
        </div>
      </div>
    )
  }

  // Show Flask not running screen if backend is not available
  if (safeBackendStatus.checked && !safeBackendStatus.running) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A+</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AURA+</h1>
                <p className="text-white/60">AI Voice Assistant</p>
              </div>
            </div>
          </div>

          {/* Flask Not Running Component */}
          <FlaskNotRunning onRetry={handleRetryConnection} isRetrying={isRetrying} />
        </div>
      </div>
    )
  }

  // Normal chat interface when backend is running
  return (
    <div className="flex h-screen overflow-hidden font-sans relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        history={history}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main Chat Container */}
      <div className="flex flex-col flex-1 text-white relative min-w-0">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden absolute top-4 left-4 z-50 text-zinc-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Chat Header */}
        <ChatHeader />

        {/* Chat Messages Area */}
        <main className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
            {/* Backend Status Warning - Show if backend was checked but not running */}
            {safeBackendStatus.checked && !safeBackendStatus.running && (
              <BackendStatus backendStatus={safeBackendStatus} onRetry={handleRetryConnection} />
            )}

            {messages &&
              messages.map((msg) => (
                <MessageBubble key={msg.id || Math.random()} message={msg} isSystem={msg.sender === "system"} />
              ))}

            {/* Loading indicator */}
            {isLoading && <MessageBubble message={{ text: "Typing...", sender: "bot" }} isLoading={true} />}

            {/* Scroll target */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={!safeBackendStatus.running} />
        </main>
      </div>
    </div>
  )
}

export default Chatbot
