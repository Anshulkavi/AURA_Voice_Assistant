"use client"

import { useState, useEffect, useCallback } from "react"

// Simplified API URL logic that works with your setup
const getApiUrl = () => {
  // In development, Vite proxy will handle /api routes
  // In production, same domain
  return "/api"
}

const API_URL = getApiUrl()

export function useChat() {
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [conversationId, setConversationId] = useState(null)
  const [connectionError, setConnectionError] = useState(null)

  const fetchHistory = useCallback(async () => {
    try {
      setConnectionError(null)
      const url = `${API_URL}/get_history`
      console.log(`📡 Fetching history from: ${url}`)

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log(`📊 Response status: ${response.status}`)
      console.log(`📊 Content-Type: ${response.headers.get("content-type")}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Verify we're getting JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Expected JSON but got:", textResponse.substring(0, 200))
        throw new Error("Server returned HTML instead of JSON. Check proxy configuration.")
      }

      const historyData = await response.json()
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

      // Enhanced debugging
      try {
        console.log("🔍 Testing health endpoint for debugging...")
        const healthResponse = await fetch("/health")

        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          console.log("✅ Health check passed:", healthData)
        } else {
          console.log("❌ Health check failed:", healthResponse.status)
          const healthText = await healthResponse.text()
          console.log("Health response:", healthText.substring(0, 200))
        }
      } catch (debugError) {
        console.error("❌ Debug requests failed:", debugError)
      }

      setMessages([
        {
          id: 0,
          text: `Connection failed: ${error.message}. Please check if Flask backend is running on port 5000.`,
          sender: "bot",
        },
      ])
    }
  }, [])

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString())
    }
    fetchHistory()
  }, [fetchHistory, conversationId])

  const sendMessage = useCallback(
    async (prompt) => {
      if (!prompt?.trim()) return

      const userMessage = {
        id: Date.now(),
        text: prompt.trim(),
        sender: "user",
      }

      setMessages((prev) => (prev ? [...prev, userMessage] : [userMessage]))
      setIsLoading(true)
      setConnectionError(null)

      try {
        console.log(`📡 Sending message to: ${API_URL}/chat`)

        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
          credentials: "include",
        })

        console.log(`📊 Chat response status: ${response.status}`)

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch (e) {
            const textResponse = await response.text()
            if (textResponse.includes("<!doctype html>")) {
              errorMessage = "Server returned HTML instead of JSON. Check Flask backend."
            }
          }
          throw new Error(errorMessage)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text()
          console.error("❌ Expected JSON but got:", textResponse.substring(0, 200))
          throw new Error("Server returned HTML instead of JSON for chat endpoint.")
        }

        const data = await response.json()

        const responseMessage = {
          id: Date.now() + 1,
          text: data.response || "Sorry, I couldn't process your request.",
          sender: "model",
        }

        setMessages((prev) => [...prev, responseMessage])

        // Refresh history after new message
        setTimeout(() => {
          fetchHistory()
        }, 1000)
      } catch (error) {
        console.error("Send message error:", error)
        setConnectionError(error.message)

        const errorMessage = {
          id: Date.now() + 1,
          text: `Error: ${error.message}`,
          sender: "bot",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [fetchHistory],
  )

  const clearChat = useCallback(async () => {
    try {
      console.log(`📡 Clearing chat at: ${API_URL}/clear_chat`)

      const response = await fetch(`${API_URL}/clear_chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json()
          console.log("✅ Clear chat result:", result)
        }
      }

      // Reset local state
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
      console.log("✅ Chat cleared successfully")
    } catch (error) {
      console.error("Error clearing chat:", error)
      // Fallback to local clear
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
    }
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    history,
    fetchHistory,
    clearChat,
    conversationId,
    connectionError,
  }
}
