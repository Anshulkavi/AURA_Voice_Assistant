// "use client"
// import { useState, useEffect, useCallback } from "react"
// import { useAuth } from "../contexts/AuthContext"

// const generateChatId = () =>
//   `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

// export function useChat() {
//   const { user } = useAuth()
//   const [chatSessions, setChatSessions] = useState({})
//   const [currentChatId, setCurrentChatId] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [backendStatus, setBackendStatus] = useState({ running: true, checked: true })

//   useEffect(() => {
//     if (!user) return
//     try {
//       const storedSessions = localStorage.getItem(`chatSessions_${user.id}`)
//       const storedCurrentId = localStorage.getItem(`currentChatId_${user.id}`)
//       if (storedSessions) setChatSessions(JSON.parse(storedSessions))
//       if (storedCurrentId) setCurrentChatId(storedCurrentId)
//     } catch (err) {
//       console.error("Failed to load chat sessions:", err)
//     }
//   }, [user])

//   useEffect(() => {
//     if (!user) return
//     try {
//       if (Object.keys(chatSessions).length > 0) {
//         localStorage.setItem(`chatSessions_${user.id}`, JSON.stringify(chatSessions))
//       }
//       if (currentChatId) {
//         localStorage.setItem(`currentChatId_${user.id}`, currentChatId)
//       }
//     } catch (err) {
//       console.error("Failed to save chat sessions:", err)
//     }
//   }, [chatSessions, currentChatId, user])

//   const createNewChat = useCallback(() => {
//     const newChatId = generateChatId()
//     const newChatSession = { 
//       id: newChatId, 
//       title: "New Chat", 
//       messages: [], 
//       timestamp: Date.now(),
//       isNewChat: true // Flag to indicate this is a new chat without messages
//     }
//     setChatSessions((prev) => ({ ...prev, [newChatId]: newChatSession }))
//     setCurrentChatId(newChatId)
//   }, [])

//   const selectChat = useCallback((chatId) => {
//     if (chatSessions[chatId]) setCurrentChatId(chatId)
//   }, [chatSessions])

//   const deleteChat = useCallback((chatId) => {
//     setChatSessions((prev) => {
//       const newSessions = { ...prev }
//       delete newSessions[chatId]
//       return newSessions
//     })
//     if (currentChatId === chatId) {
//       const remainingIds = Object.keys(chatSessions).filter((id) => id !== chatId)
//       if (remainingIds.length > 0) {
//         const mostRecentId = remainingIds.reduce((a, b) =>
//           chatSessions[a].timestamp > chatSessions[b].timestamp ? a : b
//         )
//         setCurrentChatId(mostRecentId)
//       } else {
//         setCurrentChatId(null)
//       }
//     }
//   }, [currentChatId, chatSessions])

//   const renameChat = useCallback((chatId, newTitle) => {
//     setChatSessions((prev) => ({ ...prev, [chatId]: { ...prev[chatId], title: newTitle } }))
//   }, [])

//   const sendMessage = useCallback(async (text, imageBase64 = null) => {
//     if (!text?.trim() && !imageBase64) return
//     let activeChatId = currentChatId
//     let shouldUpdateTitle = false
    
//     if (!activeChatId) {
//       activeChatId = generateChatId()
//       const newChatSession = {
//         id: activeChatId,
//         title: text?.substring(0, 30) + (text?.length > 30 ? "..." : "") || "New Chat",
//         messages: [],
//         timestamp: Date.now(),
//       }
//       setChatSessions((prev) => ({ ...prev, [activeChatId]: newChatSession }))
//       setCurrentChatId(activeChatId)
//     } else {
//       // Check if current chat is new (has no messages) or is flagged as new
//       const currentChat = chatSessions[activeChatId]
//       if (currentChat && (currentChat.messages.length === 0 || currentChat.isNewChat)) {
//         shouldUpdateTitle = true
//       }
//     }

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       text,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//       image: imageBase64,
//     }

//     setChatSessions((prev) => ({
//       ...prev,
//       [activeChatId]: {
//         ...prev[activeChatId],
//         title: shouldUpdateTitle 
//           ? (text?.substring(0, 30) + (text?.length > 30 ? "..." : "") || "New Chat")
//           : prev[activeChatId].title,
//         messages: [...prev[activeChatId].messages, userMessage],
//         timestamp: Date.now(),
//         isNewChat: false // Remove the flag once first message is sent
//       },
//     }))
//     setIsLoading(true)

//     try {
//       const payload = {}
//       if (text) payload.prompt = text
//       if (imageBase64) payload.image = imageBase64

//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.error || "Server responded with an error")
//       }

//       const data = await response.json()
//       const aiMessage = {
//         id: data.message_id || `ai_${Date.now()}`,
//         text: data.response,
//         sender: "model",
//         timestamp: new Date().toISOString(),
//       }

//       setChatSessions((prev) => ({
//         ...prev,
//         [activeChatId]: { ...prev[activeChatId], messages: [...prev[activeChatId].messages, aiMessage] },
//       }))
//     } catch (error) {
//       console.error("Chat error:", error)
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         text: `Error: ${error.message}`,
//         sender: "system",
//         timestamp: new Date().toISOString(),
//       }
//       setChatSessions((prev) => ({
//         ...prev,
//         [activeChatId]: { ...prev[activeChatId], messages: [...prev[activeChatId].messages, errorMessage] },
//       }))
//     } finally {
//       setIsLoading(false)
//     }
//   }, [currentChatId, chatSessions])

//   const messages = chatSessions[currentChatId]?.messages || []
//   const sessionsForSidebar = Object.values(chatSessions).sort((a, b) => b.timestamp - a.timestamp)

//   return {
//     messages,
//     isLoading,
//     sendMessage,
//     backendStatus,
//     retryBackendConnection: () => {},
//     chatSessions: sessionsForSidebar,
//     currentChatId,
//     createNewChat,
//     selectChat,
//     deleteChat,
//     renameChat,
//   }
// }

import { useState, useCallback, useEffect, useRef } from "react";

export function useChat(userId) {
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  // 🔹 Load user sessions (for sidebar)
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/get_sessions", { method: "GET" });
      const data = await res.json();
      setSessions(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch sessions:", err);
    }
  }, []);

  // 🔹 Load messages for active session
  const fetchMessages = useCallback(async (sessionId) => {
    try {
      const res = await fetch(`/api/get_messages?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  }, []);

  // 🔹 Start a new session
  const startNewSession = useCallback(async () => {
    try {
      const res = await fetch("/api/new_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // backend ignores but safe
      });
      const data = await res.json();
      const newId = data.id;
      setActiveSessionId(newId);
      await fetchSessions();
      setMessages([]);
      return newId;
    } catch (err) {
      console.error("❌ Failed to start session:", err);
    }
  }, [userId, fetchSessions]);

  // 🔹 Send message with streaming
  const sendMessage = useCallback(
    async ({ text, imageBase64 }) => {
      const sessionId = activeSessionId || (await startNewSession());

      // Optimistic user message
      const userMessage = {
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setLoading(true);

      // Abort old stream if running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            prompt: text,
            image: imageBase64 || null,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error("Streaming failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk
            .split("\n")
            .filter((l) => l.trim().startsWith("data:"));

          for (const line of lines) {
            const data = JSON.parse(line.replace("data:", "").trim());

            if (data.delta) {
              assistantBuffer += data.delta;
              setMessages((prev) => {
                const withoutTemp = prev.filter((m) => m.role !== "assistant-temp");
                return [...withoutTemp, { role: "assistant-temp", content: assistantBuffer }];
              });
            }

            if (data.done) {
              setMessages((prev) => {
                const withoutTemp = prev.filter((m) => m.role !== "assistant-temp");
                return [
                  ...withoutTemp,
                  {
                    role: "assistant",
                    content: data.final,
                    timestamp: new Date().toISOString(),
                  },
                ];
              });
            }
          }
        }
      } catch (err) {
        console.error("❌ Streaming error:", err);
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [activeSessionId, startNewSession]
  );

  // 🔹 Load sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    messages,
    sessions,
    activeSessionId,
    setActiveSessionId,
    sendMessage,
    startNewSession,
    fetchMessages,
    loading,
  };
}
