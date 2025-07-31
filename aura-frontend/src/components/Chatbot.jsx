// import React, { useEffect, useRef } from 'react';
// import ChatHeader from './ChatHeader';
// import MessageBubble from './MessageBubble';
// import ChatInput from './ChatInput';
// import { useChat } from '../hooks/useChat'; // Naya hook import karein

// function Chatbot() {
//   // Saara logic ab 'useChat' hook se aa raha hai
//   const { messages, isLoading, sendMessage } = useChat();
//   const messagesEndRef = useRef(null);

// // --- NAYA CODE START ---

//   // 1. Text ko bolne wala function
//   // 1. Text ko bolne wala function (Updated Version)
//   const speak = (textToSpeak) => {
//     // Safety check, agar text nahi hai to kuch na karein
//     if (typeof textToSpeak !== 'string' || !textToSpeak) {
//       return;
//     }

//     // Pehle se kuch bol raha ho to use rokein
//     window.speechSynthesis.cancel();

//     // --- Yahan hum sabhi special characters ko hata rahe hain ---
//     const cleanText = textToSpeak
//       .replace(/```[\s\S]*?```/g, 'Code block.') // Code blocks ko replace karein
//       .replace(/[\*\_#]/g, '')  // Asterisks (*), underscores (_), aur hashtags (#) ko hata dein
//       .replace(/\n/g, ' ');   // New lines (agle line me jaane ko) space se badal dein

//     const utterance = new SpeechSynthesisUtterance(cleanText);
//     utterance.lang = 'en-IN';
//     utterance.rate = 0.9;

//     window.speechSynthesis.speak(utterance);
//   };

//   // 2. Jab bhi naya message aaye, speech trigger karne ke liye
//   useEffect(() => {
//     if (!messages || messages.length === 0) return;

//     // Aakhri message ko get karein
//     const lastMessage = messages[messages.length - 1];

//     // Check karein ki aakhri message AI ka hai ya nahi
//     if (lastMessage.sender === 'model' || lastMessage.sender === 'bot') {
//       speak(lastMessage.text);
//     }
//   }, [messages]);

//   // Messages aane par niche scroll karne ka logic
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Loading state jab tak messages load na ho jaaye
//   if (!messages) {
//     return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading conversation...</div>;
//   }

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

//         {/* 'sendMessage' function ko ChatInput me bhej dein */}
//         <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
//       </main>
//     </div>
//   );
// }

// export default Chatbot;

// import React, { useEffect, useRef, useState } from "react";
// import ChatHeader from "./ChatHeader";
// import MessageBubble from "./MessageBubble";
// import ChatInput from "./ChatInput";
// import Sidebar from "./Sidebar";
// import { Menu } from "lucide-react";
// import { useChat } from "../hooks/useChat";

// function Chatbot() {
//   const { messages, isLoading, sendMessage } = useChat();
//   const messagesEndRef = useRef(null);

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/get_history")
//       .then((res) => res.json())
//       .then((data) => setHistory(data))
//       .catch((err) => console.error("Failed to load history:", err));
//   }, []);

//   const speak = (textToSpeak) => {
//     if (typeof textToSpeak !== "string" || !textToSpeak) return;
//     window.speechSynthesis.cancel();
//     const cleanText = textToSpeak
//       .replace(/```[\s\S]*?```/g, "Code block.")
//       .replace(/[\*\_#]/g, "")
//       .replace(/\n/g, " ");
//     const utterance = new SpeechSynthesisUtterance(cleanText);
//     utterance.lang = "en-IN";
//     utterance.rate = 0.9;
//     window.speechSynthesis.speak(utterance);
//   };

//   useEffect(() => {
//     if (!messages || messages.length === 0) return;
//     const lastMessage = messages[messages.length - 1];
//     if (lastMessage.sender === "model" || lastMessage.sender === "bot") {
//       speak(lastMessage.text);
//     }
//   }, [messages]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleNewChat = () => window.location.reload();

//   const handleSelectChat = (index) => {
//     console.log("Selected chat:", index);
//     // Load chat from DB in future
//   };

//   if (!messages) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
//         Loading conversation...
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden font-sans relative">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         history={history}
//         onNewChat={handleNewChat}
//         onSelectChat={handleSelectChat}
//       />

//       {/* Main Chat UI */}
//       <div className="flex flex-col flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative">
//         {/* Toggle sidebar button (mobile only) */}
//         <button
//           className="md:hidden absolute top-4 left-4 z-50 text-zinc-300 hover:text-white"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           <Menu className="w-6 h-6" />
//         </button>

//         <ChatHeader />

//         <main className="flex-1 overflow-hidden p-4 flex flex-col">
//           <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
//             {messages.map((msg, index) => (
//               <MessageBubble key={index} message={msg} />
//             ))}
//             {isLoading && <MessageBubble isLoading />}
//             <div ref={messagesEndRef} />
//           </div>
//           <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;

// import React, { useEffect, useRef, useState } from "react";
// import ChatHeader from "./ChatHeader";
// import MessageBubble from "./MessageBubble";
// import ChatInput from "./ChatInput";
// import Sidebar from "./Sidebar";
// import { Menu } from "lucide-react";
// import { useChat } from "../hooks/useChat";

// function Chatbot() {
//   const { messages, isLoading, sendMessage, history, clearChat } = useChat();
//   const messagesEndRef = useRef(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Text-to-speech function
//   const speak = (textToSpeak) => {
//     if (typeof textToSpeak !== "string" || !textToSpeak) return;
    
//     // Cancel any ongoing speech
//     if (window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel();
//     }

//     const cleanText = textToSpeak
//       .replace(/```[\s\S]*?```/g, "Code block.")
//       .replace(/[\*\_#`]/g, "")
//       .replace(/\n+/g, " ")
//       .replace(/\s+/g, " ")
//       .trim();

//     if (cleanText.length > 0) {
//       const utterance = new SpeechSynthesisUtterance(cleanText);
//       utterance.lang = "en-IN";
//       utterance.rate = 0.9;
//       utterance.pitch = 1;
//       utterance.volume = 0.8;
      
//       // Add error handling
//       utterance.onerror = (event) => {
//         console.warn('Speech synthesis error:', event.error);
//       };
      
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   // Speak the latest bot/model message
//   useEffect(() => {
//     if (!messages || messages.length === 0) return;
    
//     const lastMessage = messages[messages.length - 1];
//     if ((lastMessage.sender === "model" || lastMessage.sender === "bot") && 
//         !isLoading) {
//       // Small delay to ensure message is rendered
//       setTimeout(() => speak(lastMessage.text), 100);
//     }
//   }, [messages, isLoading]);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ 
//         behavior: "smooth", 
//         block: "end" 
//       });
//     }
//   }, [messages, isLoading]);

//   const handleNewChat = () => {
//     // Stop any ongoing speech
//     if (window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel();
//     }
//     clearChat();
//     setSidebarOpen(false);
//   };

//   const handleSelectChat = (chatIndex) => {
//     console.log("Selected chat:", chatIndex);
//     setSidebarOpen(false);
//     // TODO: Implement chat loading from history
//     // For now, just close sidebar
//   };

//   const handleCloseSidebar = () => {
//     setSidebarOpen(false);
//   };

//   // Loading state
//   if (!messages) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-lg">Loading conversation...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden font-sans relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={handleCloseSidebar}
//         history={history}
//         onNewChat={handleNewChat}
//         onSelectChat={handleSelectChat}
//       />

//       {/* Sidebar Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={handleCloseSidebar}
//         />
//       )}

//       {/* Main Chat Container */}
//       <div className="flex flex-col flex-1 text-white relative min-w-0">
//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden absolute top-4 left-4 z-50 text-zinc-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           aria-label="Toggle sidebar"
//         >
//           <Menu className="w-6 h-6" />
//         </button>

//         {/* Chat Header */}
//         <ChatHeader />

//         {/* Chat Messages Area */}
//         <main className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
//           <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
//             {messages.map((msg) => (
//               <MessageBubble key={msg.id || Math.random()} message={msg} />
//             ))}
            
//             {/* Loading indicator */}
//             {isLoading && (
//               <MessageBubble 
//                 message={{ text: "Typing...", sender: "bot" }} 
//                 isLoading={true} 
//               />
//             )}
            
//             {/* Scroll target */}
//             <div ref={messagesEndRef} className="h-1" />
//           </div>
          
//           {/* Chat Input */}
//           <ChatInput 
//             onSendMessage={sendMessage} 
//             isLoading={isLoading} 
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;

import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useChat } from "../hooks/useChat";

function Chatbot() {
  const { messages, isLoading, sendMessage, history, clearChat } = useChat();
  const messagesEndRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Text-to-speech function
  const speak = (textToSpeak) => {
    if (typeof textToSpeak !== "string" || !textToSpeak) return;
    
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const cleanText = textToSpeak
      .replace(/```[\s\S]*?```/g, "Code block.")
      .replace(/[\*\_#`]/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanText.length > 0) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Add error handling
      utterance.onerror = (event) => {
        console.warn('Speech synthesis error:', event.error);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak the latest bot/model message
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    if ((lastMessage.sender === "model" || lastMessage.sender === "bot") && 
        !isLoading) {
      // Small delay to ensure message is rendered
      setTimeout(() => speak(lastMessage.text), 100);
    }
  }, [messages, isLoading]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  }, [messages, isLoading]);

  const handleNewChat = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    clearChat();
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatIndex) => {
    console.log("Selected chat:", chatIndex);
    setSidebarOpen(false);
    // TODO: Implement chat loading from history
    // For now, just close sidebar
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  // Loading state
  if (!messages) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading conversation...</p>
        </div>
      </div>
    );
  }

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
            {messages.map((msg) => (
              <MessageBubble key={msg.id || Math.random()} message={msg} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <MessageBubble 
                message={{ text: "Typing...", sender: "bot" }} 
                isLoading={true} 
              />
            )}
            
            {/* Scroll target */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
          
          {/* Chat Input */}
          <ChatInput 
            onSendMessage={sendMessage} 
            isLoading={isLoading} 
          />
        </main>
      </div>
    </div>
  );
}

export default Chatbot;