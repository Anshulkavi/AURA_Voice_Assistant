// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { useAuth } from "../contexts/AuthContext"

// // Helper function to generate a unique ID for new chats
// const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// export function useChat() {
//   const { user } = useAuth();

//   // STATE MANAGEMENT FOR MULTIPLE SESSIONS
//   // ------------------------------------------
//   // All chat sessions are stored in an object, with chat ID as the key.
//   const [chatSessions, setChatSessions] = useState({});
//   // The ID of the currently active chat.
//   const [currentChatId, setCurrentChatId] = useState(null);
//   // ------------------------------------------

//   const [isLoading, setIsLoading] = useState(false);
//   const [backendStatus, setBackendStatus] = useState({ running: true, checked: true });

//   // Load sessions from localStorage when the component mounts or user changes
//   useEffect(() => {
//     if (user) {
//       const storedSessions = localStorage.getItem(`chatSessions_${user.id}`);
//       if (storedSessions) {
//         setChatSessions(JSON.parse(storedSessions));
//       }
//       const storedCurrentId = localStorage.getItem(`currentChatId_${user.id}`);
//       if (storedCurrentId) {
//         setCurrentChatId(storedCurrentId);
//       }
//     }
//   }, [user]);

//   // Save sessions to localStorage whenever they change
//   useEffect(() => {
//     if (user && Object.keys(chatSessions).length > 0) {
//       localStorage.setItem(`chatSessions_${user.id}`, JSON.stringify(chatSessions));
//     }
//     if (user && currentChatId) {
//       localStorage.setItem(`currentChatId_${user.id}`, currentChatId);
//     }
//   }, [chatSessions, currentChatId, user]);


//   // CORE CHAT FUNCTIONS REWRITTEN FOR MULTI-SESSION
//   // -------------------------------------------------

//   const createNewChat = useCallback(() => {
//     const newChatId = generateChatId();
//     const newChatSession = {
//       id: newChatId,
//       title: "New Chat",
//       messages: [],
//       timestamp: Date.now(),
//     };

//     setChatSessions(prev => ({ ...prev, [newChatId]: newChatSession }));
//     setCurrentChatId(newChatId);
//   }, []);

//   const selectChat = useCallback((chatId) => {
//     if (chatSessions[chatId]) {
//       setCurrentChatId(chatId);
//     }
//   }, [chatSessions]);

//   const deleteChat = useCallback((chatId) => {
//     setChatSessions(prev => {
//       const newSessions = { ...prev };
//       delete newSessions[chatId];
//       return newSessions;
//     });

//     // If the deleted chat was the active one, select the most recent remaining chat
//     if (currentChatId === chatId) {
//       const remainingIds = Object.keys(chatSessions).filter(id => id !== chatId);
//       if (remainingIds.length > 0) {
//         // Find the most recent chat to select next
//         const mostRecentId = remainingIds.reduce((a, b) => chatSessions[a].timestamp > chatSessions[b].timestamp ? a : b);
//         setCurrentChatId(mostRecentId);
//       } else {
//         setCurrentChatId(null);
//       }
//     }
//   }, [currentChatId, chatSessions]);

//   const renameChat = useCallback((chatId, newTitle) => {
//     setChatSessions(prev => ({
//       ...prev,
//       [chatId]: { ...prev[chatId], title: newTitle },
//     }));
//   }, []);

//   const sendMessage = useCallback(async (text, imageBase64 = null) => {
//     let activeChatId = currentChatId;

//     // If there's no active chat, create a new one first
//     if (!activeChatId) {
//       activeChatId = generateChatId();
//       const newChatSession = {
//         id: activeChatId,
//         title: text.substring(0, 30) + (text.length > 30 ? "..." : ""), // Title from first message
//         messages: [],
//         timestamp: Date.now(),
//       };
//       setChatSessions(prev => ({ ...prev, [activeChatId]: newChatSession }));
//       setCurrentChatId(activeChatId);
//     }

//     const userMessage = {
//       id: `user_${Date.now()}`,
//       text,
//       sender: "user",
//       timestamp: new Date().toISOString(),
//       image: imageBase64,
//     };
    
//     // Update the specific chat session with the new user message
//     setChatSessions(prev => ({
//       ...prev,
//       [activeChatId]: {
//         ...prev[activeChatId],
//         messages: [...prev[activeChatId].messages, userMessage],
//         timestamp: Date.now(), // Update timestamp to bring chat to top
//       },
//     }));
//     setIsLoading(true);

//     try {
//       const payload = {};
//       if (text) payload.prompt = text;
//       if (imageBase64) payload.image = imageBase64;

//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || "Server responded with an error");
//       }

//       const data = await response.json();
//       const aiMessage = {
//         id: data.message_id || `ai_${Date.now()}`,
//         text: data.response,
//         sender: "model",
//         timestamp: new Date().toISOString(),
//       };
      
//       // Update the session with the AI's response
//       setChatSessions(prev => ({
//         ...prev,
//         [activeChatId]: {
//           ...prev[activeChatId],
//           messages: [...prev[activeChatId].messages, aiMessage],
//         },
//       }));

//     } catch (error) {
//       const errorMessage = {
//         id: `error_${Date.now()}`,
//         text: `Error: ${error.message}`,
//         sender: "system",
//         timestamp: new Date().toISOString(),
//       };
//       setChatSessions(prev => ({
//         ...prev,
//         [activeChatId]: {
//           ...prev[activeChatId],
//           messages: [...prev[activeChatId].messages, errorMessage],
//         },
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentChatId, user]);


//   // DERIVED STATE & PROPS
//   // ---------------------
//   // The messages to be displayed are now derived from the active chat session.
//   const messages = chatSessions[currentChatId]?.messages || [];
  
//   // The list of sessions for the sidebar is derived from the state object.
//   const sessionsForSidebar = Object.values(chatSessions).sort((a, b) => b.timestamp - a.timestamp);

//   return {
//     messages,
//     isLoading,
//     sendMessage,
//     backendStatus,
//     retryBackendConnection: () => {}, // Can be enhanced later
    
//     // New multi-session props for the Sidebar
//     chatSessions: sessionsForSidebar,
//     currentChatId,
//     createNewChat,
//     selectChat,
//     deleteChat,
//     renameChat,
//   };
// }

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
//     const newChatSession = { id: newChatId, title: "New Chat", messages: [], timestamp: Date.now() }
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
//         messages: [...prev[activeChatId].messages, userMessage],
//         timestamp: Date.now(),
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
//   }, [currentChatId])

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

"use client"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../contexts/AuthContext"

const generateChatId = () =>
  `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export function useChat() {
  const { user } = useAuth()
  const [chatSessions, setChatSessions] = useState({})
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState({ running: true, checked: true })

  useEffect(() => {
    if (!user) return
    try {
      const storedSessions = localStorage.getItem(`chatSessions_${user.id}`)
      const storedCurrentId = localStorage.getItem(`currentChatId_${user.id}`)
      if (storedSessions) setChatSessions(JSON.parse(storedSessions))
      if (storedCurrentId) setCurrentChatId(storedCurrentId)
    } catch (err) {
      console.error("Failed to load chat sessions:", err)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    try {
      if (Object.keys(chatSessions).length > 0) {
        localStorage.setItem(`chatSessions_${user.id}`, JSON.stringify(chatSessions))
      }
      if (currentChatId) {
        localStorage.setItem(`currentChatId_${user.id}`, currentChatId)
      }
    } catch (err) {
      console.error("Failed to save chat sessions:", err)
    }
  }, [chatSessions, currentChatId, user])

  const createNewChat = useCallback(() => {
    const newChatId = generateChatId()
    const newChatSession = { 
      id: newChatId, 
      title: "New Chat", 
      messages: [], 
      timestamp: Date.now(),
      isNewChat: true // Flag to indicate this is a new chat without messages
    }
    setChatSessions((prev) => ({ ...prev, [newChatId]: newChatSession }))
    setCurrentChatId(newChatId)
  }, [])

  const selectChat = useCallback((chatId) => {
    if (chatSessions[chatId]) setCurrentChatId(chatId)
  }, [chatSessions])

  const deleteChat = useCallback((chatId) => {
    setChatSessions((prev) => {
      const newSessions = { ...prev }
      delete newSessions[chatId]
      return newSessions
    })
    if (currentChatId === chatId) {
      const remainingIds = Object.keys(chatSessions).filter((id) => id !== chatId)
      if (remainingIds.length > 0) {
        const mostRecentId = remainingIds.reduce((a, b) =>
          chatSessions[a].timestamp > chatSessions[b].timestamp ? a : b
        )
        setCurrentChatId(mostRecentId)
      } else {
        setCurrentChatId(null)
      }
    }
  }, [currentChatId, chatSessions])

  const renameChat = useCallback((chatId, newTitle) => {
    setChatSessions((prev) => ({ ...prev, [chatId]: { ...prev[chatId], title: newTitle } }))
  }, [])

  const sendMessage = useCallback(async (text, imageBase64 = null) => {
    if (!text?.trim() && !imageBase64) return
    let activeChatId = currentChatId
    let shouldUpdateTitle = false
    
    if (!activeChatId) {
      activeChatId = generateChatId()
      const newChatSession = {
        id: activeChatId,
        title: text?.substring(0, 30) + (text?.length > 30 ? "..." : "") || "New Chat",
        messages: [],
        timestamp: Date.now(),
      }
      setChatSessions((prev) => ({ ...prev, [activeChatId]: newChatSession }))
      setCurrentChatId(activeChatId)
    } else {
      // Check if current chat is new (has no messages) or is flagged as new
      const currentChat = chatSessions[activeChatId]
      if (currentChat && (currentChat.messages.length === 0 || currentChat.isNewChat)) {
        shouldUpdateTitle = true
      }
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
      image: imageBase64,
    }

    setChatSessions((prev) => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        title: shouldUpdateTitle 
          ? (text?.substring(0, 30) + (text?.length > 30 ? "..." : "") || "New Chat")
          : prev[activeChatId].title,
        messages: [...prev[activeChatId].messages, userMessage],
        timestamp: Date.now(),
        isNewChat: false // Remove the flag once first message is sent
      },
    }))
    setIsLoading(true)

    try {
      const payload = {}
      if (text) payload.prompt = text
      if (imageBase64) payload.image = imageBase64

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Server responded with an error")
      }

      const data = await response.json()
      const aiMessage = {
        id: data.message_id || `ai_${Date.now()}`,
        text: data.response,
        sender: "model",
        timestamp: new Date().toISOString(),
      }

      setChatSessions((prev) => ({
        ...prev,
        [activeChatId]: { ...prev[activeChatId], messages: [...prev[activeChatId].messages, aiMessage] },
      }))
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: `Error: ${error.message}`,
        sender: "system",
        timestamp: new Date().toISOString(),
      }
      setChatSessions((prev) => ({
        ...prev,
        [activeChatId]: { ...prev[activeChatId], messages: [...prev[activeChatId].messages, errorMessage] },
      }))
    } finally {
      setIsLoading(false)
    }
  }, [currentChatId, chatSessions])

  const messages = chatSessions[currentChatId]?.messages || []
  const sessionsForSidebar = Object.values(chatSessions).sort((a, b) => b.timestamp - a.timestamp)

  return {
    messages,
    isLoading,
    sendMessage,
    backendStatus,
    retryBackendConnection: () => {},
    chatSessions: sessionsForSidebar,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
  }
}