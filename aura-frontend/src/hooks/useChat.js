// // src/hooks/useChat.js

// import { useState, useEffect, useCallback } from 'react';

// // ✅ FIXED API URL logic
// const getApiUrl = () => {
//   // In production, use same domain with /api prefix
//   if (import.meta.env.PROD) {
//     return '/api'; // Same domain with API prefix
//   }
  
//   // In development, use environment variable or default with /api prefix
//   const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
//   return `${baseUrl}/api`;
// };

// const API_URL = getApiUrl();

// export function useChat() {
//   const [messages, setMessages] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [conversationId, setConversationId] = useState(null);

//   const fetchHistory = useCallback(async () => {
//     try {
//       const url = `${API_URL}/get_history`;
//       console.log(`📡 Fetching history from: ${url}`);
//       console.log(`🔍 Environment check - PROD: ${import.meta.env.PROD}, API_URL: ${API_URL}`);
      
//       const response = await fetch(url, { 
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });
      
//       console.log(`📊 Response status: ${response.status}`);
//       console.log(`📊 Response headers:`, response.headers);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       // Check if response is actually JSON
//       const contentType = response.headers.get('content-type');
//       console.log(`📊 Content-Type: ${contentType}`);
      
//       if (!contentType || !contentType.includes('application/json')) {
//         const textResponse = await response.text();
//         console.error('❌ Expected JSON but got:', textResponse.substring(0, 200));
//         throw new Error('Server returned HTML instead of JSON. Check if API endpoint is working.');
//       }
      
//       const historyData = await response.json();
//       console.log(`📜 Retrieved ${historyData.length} history items`);
      
//       // Store raw history for sidebar
//       setHistory(historyData);
      
//       // Format messages for chat display
//       const formattedHistory = historyData.map((msg, index) => {
//         const firstPart = msg.parts?.[0];
//         return {
//           id: index,
//           text: typeof firstPart === 'string' ? firstPart : '[Image]',
//           sender: msg.role === 'user' ? 'user' : 'model'
//         };
//       });

//       setMessages(formattedHistory.length > 0 ? formattedHistory : [
//         { 
//           id: 0, 
//           text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
//           sender: "bot" 
//         }
//       ]);
      
//     } catch (error) {
//       console.error("History fetch error:", error);
      
//       // Check if we can reach the health endpoint to diagnose the issue
//       try {
//         const healthResponse = await fetch('/health');
//         if (healthResponse.ok) {
//           const healthData = await healthResponse.json();
//           console.log('Health check:', healthData);
//         }
//       } catch (healthError) {
//         console.error('Health check failed:', healthError);
//       }
      
//       setMessages([
//         { 
//           id: 0, 
//           text: "Server se connect nahi ho pa raha. Please check if backend is running.", 
//           sender: "bot" 
//         }
//       ]);
//     }
//   }, []);

//   useEffect(() => {
//     // Set initial conversation ID
//     if (!conversationId) {
//       setConversationId(Date.now().toString());
//     }
//     fetchHistory();
//   }, [fetchHistory, conversationId]);

//   const sendMessage = useCallback(async (prompt) => {
//     if (!prompt?.trim()) return;

//     const userMessage = { 
//       id: Date.now(), 
//       text: prompt.trim(), 
//       sender: 'user' 
//     };
    
//     setMessages(prev => prev ? [...prev, userMessage] : [userMessage]);
//     setIsLoading(true);

//     try {
//       console.log(`📡 Sending message to: ${API_URL}/chat`);
      
//       const response = await fetch(`${API_URL}/chat`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ prompt: prompt.trim() }),
//         credentials: 'include' // This ensures session cookies are sent
//       });

//       console.log(`📊 Chat response status: ${response.status}`);
      
//       if (!response.ok) {
//         let errorMessage = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.error || errorMessage;
//         } catch (e) {
//           // If we can't parse JSON, it might be HTML
//           const textResponse = await response.text();
//           if (textResponse.includes('<!doctype html>')) {
//             errorMessage = 'Server returned HTML instead of JSON. API endpoint may not be working.';
//           }
//         }
//         throw new Error(errorMessage);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const textResponse = await response.text();
//         console.error('❌ Expected JSON but got:', textResponse.substring(0, 200));
//         throw new Error('Server returned HTML instead of JSON for chat endpoint.');
//       }

//       const data = await response.json();
      
//       const responseMessage = {
//         id: Date.now() + 1,
//         text: data.response || 'Sorry, I couldn\'t process your request.',
//         sender: 'model'
//       };
      
//       setMessages(prev => [...prev, responseMessage]);

//       // Refresh history after new message (with a small delay)
//       setTimeout(() => {
//         fetchHistory();
//       }, 1000);

//     } catch (error) {
//       console.error("Send message error:", error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         text: `Error: ${error.message}. Please check if backend is running properly.`,
//         sender: "bot"
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [fetchHistory]);

//   const clearChat = useCallback(async () => {
//     try {
//       console.log(`📡 Clearing chat at: ${API_URL}/clear_chat`);
      
//       // Clear chat history on server
//       const response = await fetch(`${API_URL}/clear_chat`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });

//       if (response.ok) {
//         const contentType = response.headers.get('content-type');
//         if (contentType && contentType.includes('application/json')) {
//           const result = await response.json();
//           console.log('Clear chat result:', result);
//         }
        
//         // Generate new conversation ID
//         setConversationId(Date.now().toString());
        
//         // Reset local state
//         setMessages([
//           { 
//             id: 0, 
//             text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
//             sender: "bot" 
//           }
//         ]);
//         setHistory([]);
//         console.log("✅ Chat cleared successfully");
//       } else {
//         console.warn('Failed to clear chat on server, status:', response.status);
//         // Still clear locally
//         setConversationId(Date.now().toString());
//         setMessages([
//           { 
//             id: 0, 
//             text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
//             sender: "bot" 
//           }
//         ]);
//         setHistory([]);
//       }
//     } catch (error) {
//       console.error('Error clearing chat:', error);
//       // Fallback to local clear
//       setConversationId(Date.now().toString());
//       setMessages([
//         { 
//           id: 0, 
//           text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
//           sender: "bot" 
//         }
//       ]);
//       setHistory([]);
//     }
//   }, []);

//   return { 
//     messages, 
//     isLoading, 
//     sendMessage, 
//     history, 
//     fetchHistory,
//     clearChat,
//     conversationId 
//   };
// }

"use client"

import { useState, useEffect, useCallback } from "react"

// Simplified API URL logic
const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return "/api" // Same domain in production
  }
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"
}

const API_URL = getApiUrl()

export function useChat() {
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [conversationId, setConversationId] = useState(null)

  const fetchHistory = useCallback(async () => {
    try {
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Verify we're getting JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Expected JSON but got:", textResponse.substring(0, 200))
        throw new Error("Server returned non-JSON response. Check API endpoint.")
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

      // Test health endpoint for debugging
      try {
        const healthResponse = await fetch("/health")
        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          console.log("✅ Health check passed:", healthData)
        } else {
          console.log("❌ Health check failed:", healthResponse.status)
        }
      } catch (healthError) {
        console.error("❌ Health check error:", healthError)
      }

      setMessages([
        {
          id: 0,
          text: "Server connection failed. Please check if backend is running.",
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
          let errorMessage = `HTTP error! status: ${response.status}`
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch (e) {
            const textResponse = await response.text()
            if (textResponse.includes("<!doctype html>")) {
              errorMessage = "Server returned HTML instead of JSON. API routing issue."
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
  }
}
