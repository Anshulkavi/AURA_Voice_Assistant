"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../contexts/AuthContext"

const API_URL = "/api"

// Helper function to create AbortSignal with timeout
const createTimeoutSignal = (timeoutMs) => {
  if (typeof AbortSignal !== "undefined" && AbortSignal.timeout) {
    return AbortSignal.timeout(timeoutMs)
  } else {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeoutMs)
    return controller.signal
  }
}

// Helper function to detect if response is HTML (React app) instead of JSON
const isHtmlResponse = (text) => {
  const trimmed = text.trim().toLowerCase()
  return (
    trimmed.startsWith("<!doctype html") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("__className_") ||
    trimmed.includes("__variable_") ||
    trimmed.includes("react") ||
    trimmed.includes("vite") ||
    trimmed.includes("_app")
  )
}

// Simple backend health check
const checkBackendHealth = async () => {
  try {
    console.log("🔍 Checking if Flask backend is running...")

    const response = await fetch("/health", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      signal: createTimeoutSignal(3000), // Short timeout
    })

    const contentType = response.headers.get("content-type") || ""
    const responseText = await response.text()

    console.log(`📊 Health response status: ${response.status}`)
    console.log(`📊 Content-Type: ${contentType}`)
    console.log(`📊 Response preview: ${responseText.substring(0, 100)}...`)

    // Check if we're getting HTML (React app) instead of JSON (Flask)
    if (!contentType.includes("application/json") || isHtmlResponse(responseText)) {
      console.error("❌ Flask backend is NOT running - getting React app instead")
      return {
        running: false,
        error: "Flask backend is not running",
        isFlaskMissing: true,
        responseType: "html",
      }
    }

    if (response.ok) {
      try {
        const data = JSON.parse(responseText)
        console.log("✅ Flask backend is running correctly!")
        return {
          running: true,
          data,
          responseType: "json",
        }
      } catch (parseError) {
        return {
          running: false,
          error: "Flask returned invalid JSON",
          responseType: "invalid-json",
        }
      }
    } else {
      return {
        running: false,
        error: `Flask returned status ${response.status}`,
        responseType: "error",
      }
    }
  } catch (error) {
    console.error("❌ Cannot connect to Flask backend:", error.message)

    if (error.name === "AbortError") {
      return {
        running: false,
        error: "Connection to Flask timed out",
        isTimeout: true,
      }
    } else {
      return {
        running: false,
        error: "Cannot connect to Flask backend",
        isConnectionError: true,
      }
    }
  }
}

// Default backend status to prevent undefined errors
const DEFAULT_BACKEND_STATUS = {
  running: false,
  checked: false,
  checking: true,
  error: null,
  isFlaskMissing: false,
  isTimeout: false,
  isConnectionError: false,
  responseType: null,
}

// Generate unique chat ID
const generateChatId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate chat title from messages
const generateChatTitle = (messages) => {
  if (!messages || messages.length === 0) {
    const now = new Date()
    return `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  }

  // Find first user message
  const firstUserMessage = messages.find((msg) => msg.sender === "user")
  if (firstUserMessage && firstUserMessage.text) {
    const text = firstUserMessage.text.trim()
    return text.length > 30 ? text.substring(0, 30) + "..." : text
  }

  const now = new Date()
  return `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
}

export function useChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState({
    running: false,
    checked: false,
    checking: true,
    error: null,
  })

  // Check backend status
  const checkBackendStatus = useCallback(async () => {
    try {
      setBackendStatus((prev) => ({ ...prev, checking: true }))

      const response = await fetch("/api/health", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setBackendStatus({
          running: true,
          checked: true,
          checking: false,
          error: null,
        })
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Backend status check failed:", error)
      setBackendStatus({
        running: false,
        checked: true,
        checking: false,
        error: error.message,
      })
    }
  }, [])

  // Load messages when user is authenticated
  const loadMessages = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch("/api/chat/messages", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        console.error("Failed to load messages")
      }
    } catch (error) {
      console.error("Load messages error:", error)
    }
  }, [user])

  // Send message
  const sendMessage = useCallback(
    async (text, imageBase64 = null) => {
      if (!user || !text.trim()) return

      const userMessage = {
        id: `user_${Date.now()}`,
        text: text.trim(),
        sender: "user",
        timestamp: new Date().toISOString(),
      }

      if (imageBase64) {
        userMessage.image = imageBase64
      }

      // Add user message immediately
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: text.trim(),
            image: imageBase64,
          }),
        })

        if (response.ok) {
          const data = await response.json()

          const aiMessage = {
            id: data.message_id || `ai_${Date.now()}`,
            text: data.response,
            sender: "model",
            timestamp: new Date().toISOString(),
          }

          setMessages((prev) => [...prev, aiMessage])
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to send message")
        }
      } catch (error) {
        console.error("Send message error:", error)

        const errorMessage = {
          id: `error_${Date.now()}`,
          text: `Sorry, I encountered an error: ${error.message}`,
          sender: "system",
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [user],
  )

  // Clear chat
  const clearChat = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch("/api/chat/clear", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setMessages([])
      } else {
        console.error("Failed to clear chat")
      }
    } catch (error) {
      console.error("Clear chat error:", error)
    }
  }, [user])

  // Retry backend connection
  const retryBackendConnection = useCallback(async () => {
    await checkBackendStatus()
    if (user) {
      await loadMessages()
    }
  }, [checkBackendStatus, loadMessages, user])

  // Initialize
  useEffect(() => {
    checkBackendStatus()
  }, [checkBackendStatus])

  useEffect(() => {
    if (user && backendStatus.running) {
      loadMessages()
    }
  }, [user, backendStatus.running, loadMessages])

  // Legacy compatibility - these are simplified for the multi-user version
  const history = messages
  const chatSessions = [{ id: "current", title: "Current Chat", messages }]
  const currentChatId = "current"

  const createNewChat = useCallback(() => {
    clearChat()
  }, [clearChat])

  const selectChat = useCallback(() => {
    // In this simplified version, we only have one chat per user
    loadMessages()
  }, [loadMessages])

  const deleteChat = useCallback(() => {
    clearChat()
  }, [clearChat])

  const renameChat = useCallback(() => {
    // Not implemented in this version
    console.log("Rename chat not implemented in multi-user version")
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    backendStatus,
    retryBackendConnection,
    // Legacy compatibility
    history,
    chatSessions,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
  }
}
