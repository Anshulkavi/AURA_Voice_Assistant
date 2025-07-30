// src/hooks/useChat.js

import { useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function useChat() {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/get_history`, { credentials: 'include' });
        const historyData = await response.json();
        
        const formattedHistory = historyData.map(msg => ({
          text: msg.parts[0].text, // Ab '[Image]' placeholder ki zaroorat nahi
          sender: msg.role
        }));
        
        setMessages(formattedHistory.length > 0 ? formattedHistory : [{ text: "Hello! Main AURA+ hoon. Aapki kya madad kar sakta hoon?", sender: "bot" }]);
      } catch (error) {
        console.error("History fetch karne me error:", error);
        setMessages([{ text: "Server se connect nahi ho pa raha.", sender: "bot" }]);
      }
    };
    fetchHistory();
  }, []);

  // sendMessage ab sirf text lega
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt.trim()) return;

    const userMessage = { text: prompt, sender: 'user' };
    setMessages(prev => (prev ? [...prev, userMessage] : [userMessage]));
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt }), // Sirf prompt bhej rahe hain
        credentials: 'include'
      });

      const data = await response.json();
      const responseMessage = {
        text: response.ok ? data.response : `Error: ${data.error}`,
        sender: response.ok ? 'model' : 'bot'
      };
      setMessages(prev => [...prev, responseMessage]);

    } catch (error) {
      console.error("Server se connect karne me error:", error);
      setMessages(prev => [...prev, { text: "Server se connect nahi ho pa raha.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, sendMessage };
}