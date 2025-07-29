// // src/Chatbot.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import ChatHeader from './ChatHeader';
// import MessageBubble from './MessageBubble';
// import ChatInput from './ChatInput';

// function Chatbot() {
//   const [messages, setMessages] = useState([
//     { text: "Hello! I'm AURA+. How can I assist you today?", sender: "bot" },
//   ]);
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to the bottom of the messages list when new messages are added
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetches the response from your Flask backend
//   const getAuraResponse = async (message) => {
//     try {
//       const response = await fetch("/command", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ command: message }),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data.response;
//     } catch (error) {
//       console.error("Failed to fetch AI response:", error);
//       return "Sorry, something went wrong on my end. Please try again.";
//     }
//   };

//   // Handles sending a message (from text input or voice)
//   const handleSendMessage = async (messageText) => {
//     if (!messageText.trim()) return;

//     // Add user message to state
//     setMessages((prev) => [...prev, { text: messageText, sender: "user" }]);
//     setIsLoading(true);

//     const auraResponse = await getAuraResponse(messageText);

//     // Add bot response to state
//     setMessages((prev) => [...prev, { text: auraResponse, sender: "bot" }]);
//     setIsLoading(false);
//   };
  
//   return (
//     <div className="flex flex-col h-screen font-sans text-white bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       <ChatHeader />
      
//       <main className="flex-1 overflow-hidden p-4 flex flex-col">
//         <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
//           {messages.map((msg, index) => (
//             <MessageBubble key={index} message={msg} />
//           ))}
//           {isLoading && <MessageBubble isLoading={true} />}
//           <div ref={messagesEndRef} />
//         </div>

//         <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
//       </main>
//     </div>
//   );
// }

// export default Chatbot;

// src/Chatbot.jsx

// src/Chatbot.jsx

import React, { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChat } from '../hooks/useChat'; // Naya hook import karein

function Chatbot() {
  // Saara logic ab 'useChat' hook se aa raha hai
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef(null);

// --- NAYA CODE START ---

  // 1. Text ko bolne wala function
  // 1. Text ko bolne wala function (Updated Version)
  const speak = (textToSpeak) => {
    // Safety check, agar text nahi hai to kuch na karein
    if (typeof textToSpeak !== 'string' || !textToSpeak) {
      return; 
    }

    // Pehle se kuch bol raha ho to use rokein
    window.speechSynthesis.cancel();

    // --- Yahan hum sabhi special characters ko hata rahe hain ---
    const cleanText = textToSpeak
      .replace(/```[\s\S]*?```/g, 'Code block.') // Code blocks ko replace karein
      .replace(/[\*\_#]/g, '')  // Asterisks (*), underscores (_), aur hashtags (#) ko hata dein
      .replace(/\n/g, ' ');   // New lines (agle line me jaane ko) space se badal dein

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };

  // 2. Jab bhi naya message aaye, speech trigger karne ke liye
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    // Aakhri message ko get karein
    const lastMessage = messages[messages.length - 1];

    // Check karein ki aakhri message AI ka hai ya nahi
    if (lastMessage.sender === 'model' || lastMessage.sender === 'bot') {
      speak(lastMessage.text);
    }
  }, [messages]);


  // Messages aane par niche scroll karne ka logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Loading state jab tak messages load na ho jaaye
  if (!messages) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading conversation...</div>;
  }
  
  return (
    <div className="flex flex-col h-screen font-sans text-white bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <ChatHeader />
      
      <main className="flex-1 overflow-hidden p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          {isLoading && <MessageBubble isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>

        {/* 'sendMessage' function ko ChatInput me bhej dein */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default Chatbot;