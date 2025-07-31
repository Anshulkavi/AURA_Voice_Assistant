// src/hooks/useChat.js

import { useState, useEffect, useCallback } from 'react';

// Use /api prefix for development, and the actual backend URL for production
const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')
  : '/api'; // In development, use proxy

export function useChat() {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/get_history`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const historyData = await response.json();
      
      // Store raw history for sidebar
      setHistory(historyData);
      
      // Format messages for chat display
      const formattedHistory = historyData.map((msg, index) => {
        const firstPart = msg.parts?.[0];
        return {
          id: index,
          text: typeof firstPart === 'string' ? firstPart : '[Image]',
          sender: msg.role === 'user' ? 'user' : 'model'
        };
      });

      setMessages(formattedHistory.length > 0 ? formattedHistory : [
        { 
          id: 0, 
          text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
          sender: "bot" 
        }
      ]);
      
    } catch (error) {
      console.error("History fetch error:", error);
      setMessages([
        { 
          id: 0, 
          text: "Server se connect nahi ho pa raha. Please try again later.", 
          sender: "bot" 
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Set initial conversation ID
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
    fetchHistory();
  }, [fetchHistory, conversationId]);

  const sendMessage = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: prompt.trim(), 
      sender: 'user' 
    };
    
    setMessages(prev => prev ? [...prev, userMessage] : [userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
        credentials: 'include' // This ensures session cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const responseMessage = {
        id: Date.now() + 1,
        text: data.response || 'Sorry, I couldn\'t process your request.',
        sender: 'model'
      };
      
      setMessages(prev => [...prev, responseMessage]);

      // Refresh history after new message (with a small delay)
      setTimeout(() => {
        fetchHistory();
      }, 1000);

    } catch (error) {
      console.error("Send message error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message}. Please try again.`,
        sender: "bot"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHistory]);

  const clearChat = useCallback(async () => {
    try {
      // Clear chat history on server
      const response = await fetch(`${API_URL}/clear_chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Generate new conversation ID
        setConversationId(Date.now().toString());
        
        // Reset local state
        setMessages([
          { 
            id: 0, 
            text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
            sender: "bot" 
          }
        ]);
        setHistory([]);
      } else {
        console.warn('Failed to clear chat on server');
        // Still clear locally
        setConversationId(Date.now().toString());
        setMessages([
          { 
            id: 0, 
            text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
            sender: "bot" 
          }
        ]);
        setHistory([]);
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      // Fallback to local clear
      setConversationId(Date.now().toString());
      setMessages([
        { 
          id: 0, 
          text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", 
          sender: "bot" 
        }
      ]);
      setHistory([]);
    }
  }, []);

  return { 
    messages, 
    isLoading, 
    sendMessage, 
    history, 
    fetchHistory,
    clearChat,
    conversationId 
  };
}