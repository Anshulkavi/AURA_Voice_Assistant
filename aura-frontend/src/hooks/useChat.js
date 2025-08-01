"use client"

import { useState, useEffect, useCallback } from "react"

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

export function useChat() {
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [connectionError, setConnectionError] = useState(null)
  const [backendStatus, setBackendStatus] = useState(DEFAULT_BACKEND_STATUS)

  // Check backend health
  const checkBackend = useCallback(async (isRetry = false) => {
    console.log(isRetry ? "🔄 Retrying backend check..." : "🔍 Initial backend check...")

    setBackendStatus((prev) => ({
      ...prev,
      checking: true,
      error: null,
    }))

    try {
      const health = await checkBackendHealth()

      setBackendStatus({
        ...DEFAULT_BACKEND_STATUS,
        ...health,
        checked: true,
        checking: false,
      })

      if (!health.running) {
        console.error("❌ Backend check failed:", health.error)
        setConnectionError(health.error)

        // Show clear instructions based on the type of error
        let instructionMessage = "🚨 Flask Backend Not Running!\n\n"

        if (health.isFlaskMissing) {
          instructionMessage += "Your React app is working, but Flask is not started.\n\n"
        }

        instructionMessage += "📋 To start Flask backend:\n\n"
        instructionMessage += "1️⃣ Open a NEW terminal window\n"
        instructionMessage += "2️⃣ Navigate to your project folder\n"
        instructionMessage += "3️⃣ Run this command:\n"
        instructionMessage += "   python app.py\n\n"
        instructionMessage += "4️⃣ Wait for this message:\n"
        instructionMessage += "   '* Running on http://127.0.0.1:5000'\n\n"
        instructionMessage += "5️⃣ Then click 'Retry Connection' below\n\n"

        if (health.isFlaskMissing) {
          instructionMessage += "💡 The React app is responding instead of Flask,\n"
          instructionMessage += "which confirms Flask is not running."
        }

        setMessages([
          {
            id: 0,
            text: instructionMessage,
            sender: "system",
          },
        ])
      } else {
        console.log("✅ Backend is running:", health.data)
        setConnectionError(null)
        // Don't set messages here - let fetchHistory handle it
      }
    } catch (error) {
      console.error("❌ Unexpected error checking backend:", error)
      setBackendStatus({
        ...DEFAULT_BACKEND_STATUS,
        running: false,
        checked: true,
        checking: false,
        error: error.message,
      })
      setConnectionError(error.message)
    }
  }, [])

  // Initial backend check
  useEffect(() => {
    checkBackend()
  }, [checkBackend])

  const fetchHistory = useCallback(async () => {
    // Only fetch if backend is confirmed running
    if (!backendStatus.running || !backendStatus.checked) {
      console.log("⏭️ Skipping history fetch - backend not ready")
      return
    }

    try {
      setConnectionError(null)
      console.log(`📡 Fetching history from: ${API_URL}/get_history`)

      const response = await fetch(`${API_URL}/get_history`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: createTimeoutSignal(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type") || ""
      const responseText = await response.text()

      if (!contentType.includes("application/json") || isHtmlResponse(responseText)) {
        console.error("❌ History endpoint returned HTML - Flask stopped working")
        // Update backend status
        setBackendStatus((prev) => ({
          ...prev,
          running: false,
          error: "Flask stopped responding during operation",
        }))
        throw new Error("Flask backend stopped working during operation")
      }

      const historyData = JSON.parse(responseText)
      console.log(`📜 Retrieved ${historyData.length} history items`)
      setHistory(historyData)

      // Format messages for chat display
      const formattedHistory = historyData.map((msg, index) => {
        const firstPart = msg.parts?.[0]
        return {
          id: index,
          text: typeof firstPart === "string" ? firstPart : "[Image]",
          sender: msg.role === "user" ? "user" : "model",
        }
      })

      setMessages(
        formattedHistory.length > 0
          ? formattedHistory
          : [
              {
                id: 0,
                text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?",
                sender: "bot",
              },
            ],
      )
    } catch (error) {
      console.error("History fetch error:", error)
      setConnectionError(error.message)

      const errorMessage =
        error.message.includes("Flask stopped working") || error.message.includes("HTML")
          ? "🚨 Flask backend stopped working!\n\nPlease restart Flask:\n• Run: python app.py\n• Wait for startup message\n• Click 'Retry Connection'"
          : `Failed to load chat history: ${error.message}`

      setMessages([
        {
          id: 0,
          text: errorMessage,
          sender: "system",
        },
      ])
    }
  }, [backendStatus.running, backendStatus.checked])

  // Fetch history when backend becomes available
  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString())
    }

    if (backendStatus.checked && backendStatus.running) {
      fetchHistory()
    }
  }, [fetchHistory, conversationId, backendStatus.checked, backendStatus.running])

  const sendMessage = useCallback(
    async (prompt, imageBase64 = null) => {
      if (!prompt?.trim() && !imageBase64) return

      // Check if backend is running before sending
      if (!backendStatus.running) {
        setConnectionError("Cannot send message - Flask backend is not running")
        return
      }

      const userMessage = {
        id: Date.now(),
        text: prompt?.trim() || "[Image sent]",
        sender: "user",
      }

      setMessages((prev) => (prev ? [...prev, userMessage] : [userMessage]))
      setIsLoading(true)
      setConnectionError(null)

      try {
        const requestBody = { prompt: prompt?.trim() || "" }
        if (imageBase64) {
          requestBody.image_base64 = imageBase64
        }

        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
          credentials: "include",
          signal: createTimeoutSignal(30000),
        })

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          try {
            const errorText = await response.text()
            if (isHtmlResponse(errorText)) {
              errorMessage = "Flask backend stopped responding"
              setBackendStatus((prev) => ({ ...prev, running: false }))
            } else {
              const errorData = JSON.parse(errorText)
              errorMessage = errorData.error || errorMessage
            }
          } catch (e) {
            // Keep original error
          }
          throw new Error(errorMessage)
        }

        const contentType = response.headers.get("content-type") || ""
        const responseText = await response.text()

        if (!contentType.includes("application/json") || isHtmlResponse(responseText)) {
          setBackendStatus((prev) => ({ ...prev, running: false }))
          throw new Error("Flask backend stopped responding during chat")
        }

        const data = JSON.parse(responseText)
        const responseMessage = {
          id: Date.now() + 1,
          text: data.response || "Sorry, I couldn't process your request.",
          sender: "model",
        }

        setMessages((prev) => [...prev, responseMessage])

        // Refresh history after successful message
        setTimeout(() => fetchHistory(), 1000)
      } catch (error) {
        console.error("Send message error:", error)
        setConnectionError(error.message)

        const isBackendIssue = error.message.includes("Flask backend stopped")

        const errorMessage = {
          id: Date.now() + 1,
          text: isBackendIssue
            ? "🚨 Flask backend stopped working! Please restart it and retry."
            : `Error: ${error.message}`,
          sender: "system",
        }
        setMessages((prev) => [...prev, errorMessage])

        if (isBackendIssue) {
          setBackendStatus((prev) => ({ ...prev, running: false, error: error.message }))
        }
      } finally {
        setIsLoading(false)
      }
    },
    [backendStatus.running, fetchHistory],
  )

  const clearChat = useCallback(async () => {
    if (!backendStatus.running) {
      // Just clear locally if backend not running
      setConversationId(Date.now().toString())
      setMessages([
        {
          id: 0,
          text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?",
          sender: "bot",
        },
      ])
      setHistory([])
      return
    }

    try {
      const response = await fetch(`${API_URL}/clear_chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: createTimeoutSignal(10000),
      })

      // Clear locally regardless of API response
      setConversationId(Date.now().toString())
      setMessages([
        {
          id: 0,
          text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?",
          sender: "bot",
        },
      ])
      setHistory([])
      setConnectionError(null)
    } catch (error) {
      console.error("Error clearing chat:", error)
      // Still clear locally
      setConversationId(Date.now().toString())
      setMessages([
        {
          id: 0,
          text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?",
          sender: "bot",
        },
      ])
      setHistory([])
    }
  }, [backendStatus.running])

  // Retry backend connection
  const retryBackendConnection = useCallback(async () => {
    await checkBackend(true)
  }, [checkBackend])

  return {
    messages,
    isLoading,
    sendMessage,
    history,
    fetchHistory,
    clearChat,
    conversationId,
    connectionError,
    backendStatus: backendStatus || DEFAULT_BACKEND_STATUS, // Ensure it's never undefined
    retryBackendConnection,
  }
}
