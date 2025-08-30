// "use client";

// import { useEffect, useRef, useState } from "react";
// import MessageBubble from "./MessageBubble";
// import ChatInput from "./ChatInput";
// import Sidebar from "./Sidebar";
// import FlaskNotRunning from "./FlaskNotRunning";
// import BackendStatus from "./BackendStatus";
// import { useChat } from "../hooks/useChat";
// import { useSpeech } from "../contexts/SpeechContext";

// function Chatbot({ sidebarOpen, setSidebarOpen }) {
//   const {
//     messages,
//     isLoading,
//     sendMessage,
//     backendStatus,
//     retryBackendConnection,
//     chatSessions,
//     currentChatId,
//     createNewChat,
//     selectChat,
//     deleteChat,
//     renameChat,
//   } = useChat();
//   const {
//     speak,
//     stop: stopSpeaking,
//     isSpeaking,
//     isSpeechEnabled,
//   } = useSpeech();
//   const [sidebarExpanded, setSidebarExpanded] = useState(true);
//   const messagesEndRef = useRef(null);
//   const [isRetrying, setIsRetrying] = useState(false);
//   const lastProcessedMessageRef = useRef(null);

//   const safeBackendStatus = backendStatus || {
//     running: false,
//     checked: false,
//     checking: true,
//     error: null,
//   };

//   useEffect(() => {
//     if (!isSpeechEnabled || !messages || messages.length === 0 || isLoading)
//       return;
//     const lastMessage = messages[messages.length - 1];
//     if (lastMessage.sender !== "model" && lastMessage.sender !== "bot") return;
//     const messageKey = `${lastMessage.id}-${lastMessage.text}`;
//     if (lastProcessedMessageRef.current === messageKey || isSpeaking) return;
//     lastProcessedMessageRef.current = messageKey;
//     const timeoutId = setTimeout(() => speak(lastMessage.text), 500);
//     return () => clearTimeout(timeoutId);
//   }, [messages, isLoading, speak, isSpeaking, isSpeechEnabled]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleNewChat = () => {
//     stopSpeaking();
//     createNewChat();
//     if (setSidebarOpen) setSidebarOpen(false);
//     lastProcessedMessageRef.current = null;
//   };

//   const handleSelectChat = (chatId) => {
//     stopSpeaking();
//     selectChat(chatId);
//     if (setSidebarOpen) setSidebarOpen(false);
//     lastProcessedMessageRef.current = null;
//   };

//   const handleDeleteChat = (chatId) => {
//     stopSpeaking();
//     deleteChat(chatId);
//     lastProcessedMessageRef.current = null;
//   };

//   const handleRenameChat = (chatId, newTitle) => {
//     renameChat(chatId, newTitle);
//   };

//   const handleSendMessage = async (text, imageBase64 = null) => {
//     // DEBUGGING LOG ADDED HERE
//     console.log("2. Chatbot: Received this text ->", text);

//     stopSpeaking();
//     await sendMessage(text, imageBase64);
//   };

//   const handleRetryConnection = async () => {
//     setIsRetrying(true);
//     try {
//       await retryBackendConnection();
//     } catch (error) {
//       console.error("Retry failed:", error);
//     } finally {
//       setIsRetrying(false);
//     }
//   };

//   if (safeBackendStatus.checking && !safeBackendStatus.checked) {
//     return (
//       <div className="flex h-full items-center justify-center text-white">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p className="text-lg">Checking backend status...</p>
//         </div>
//       </div>
//     );
//   }

//   if (safeBackendStatus.checked && !safeBackendStatus.running) {
//     return (
//       <FlaskNotRunning
//         onRetry={handleRetryConnection}
//         isRetrying={isRetrying}
//       />
//     );
//   }

//   return (
//     <div className="flex h-full">
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         isExpanded={sidebarExpanded}
//         onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
//         onNewChat={handleNewChat}
//         chatSessions={chatSessions}
//         onSelectChat={handleSelectChat}
//         onDeleteChat={handleDeleteChat}
//         onRenameChat={handleRenameChat}
//         currentChatId={currentChatId}
//       />

//       <div
//         className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}
//       >
//         <main className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4 min-h-0 text-white">
//           <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
//             {safeBackendStatus.checked && !safeBackendStatus.running && (
//               <BackendStatus
//                 backendStatus={safeBackendStatus}
//                 onRetry={handleRetryConnection}
//               />
//             )}
//             {messages.map((msg, index) => (
//               <MessageBubble
//                 key={msg.id || index}
//                 message={msg}
//                 isSystem={msg.sender === "system"}
//               />
//             ))}
//             {isLoading && (
//               <MessageBubble
//                 message={{ text: "Typing...", sender: "bot" }}
//                 isLoading={true}
//               />
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="flex-shrink-0 pt-4">
//             <ChatInput
//               onSendMessage={handleSendMessage}
//               isLoading={isLoading}
//               disabled={!safeBackendStatus.running}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;


"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import FlaskNotRunning from "./FlaskNotRunning";
import BackendStatus from "./BackendStatus";
import { useChat } from "../hooks/useChat";
import { useSpeech } from "../contexts/SpeechContext";
import { useAuth } from "../contexts/AuthContext";

function Chatbot({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  // console.log("Chatbot: Current user object:", user);

  // ✅ Use useChat without passing userId
  const {
    messages,
    isLoading,
    sendMessage,
    backendStatus,
    retryBackendConnection,
    chatSessions,
    currentChatId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
  } = useChat();  

  const { speak, stop: stopSpeaking, isSpeaking, isSpeechEnabled } = useSpeech();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const messagesEndRef = useRef(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const lastProcessedMessageRef = useRef(null);

  const safeBackendStatus = backendStatus || {
    running: false,
    checked: false,
    checking: true,
    error: null,
  };

  useEffect(() => {
    if (!isSpeechEnabled || !messages?.length || isLoading) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") return;

    const messageKey = `${lastMessage.id}-${lastMessage.content}`;
    if (lastProcessedMessageRef.current === messageKey || isSpeaking) return;

    lastProcessedMessageRef.current = messageKey;
    const timeoutId = setTimeout(() => speak(lastMessage.content), 500);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, speak, isSpeaking, isSpeechEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    stopSpeaking();
    createNewChat();
    if (setSidebarOpen) setSidebarOpen(false);
    lastProcessedMessageRef.current = null;
  };

  const handleSelectChat = (chatId) => {
    stopSpeaking();
    selectChat(chatId);
    if (setSidebarOpen) setSidebarOpen(false);
    lastProcessedMessageRef.current = null;
  };

  const handleDeleteChat = (chatId) => {
    stopSpeaking();
    deleteChat(chatId);
    lastProcessedMessageRef.current = null;
  };

  const handleRenameChat = (chatId, newTitle) => {
    renameChat(chatId, newTitle);
  };

  const handleSendMessage = async (text, imageBase64 = null) => {
    stopSpeaking();
    await sendMessage({ text, imageBase64 });
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      await retryBackendConnection();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  if (safeBackendStatus.checking && !safeBackendStatus.checked) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Checking backend status...</p>
        </div>
      </div>
    );
  }

  if (safeBackendStatus.checked && !safeBackendStatus.running) {
    return (
      <FlaskNotRunning
        onRetry={handleRetryConnection}
        isRetrying={isRetrying}
        backendStatus={safeBackendStatus}
      />
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isExpanded={sidebarExpanded}
        onToggleExpand={() => setSidebarExpanded((prev) => !prev)}
        onNewChat={handleNewChat}
        chatSessions={chatSessions}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        currentChatId={currentChatId}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <main className="flex-1 flex flex-col overflow-hidden p-2 sm:p-4 min-h-0 text-white">
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 space-y-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
            {safeBackendStatus.checked && !safeBackendStatus.running && (
              <BackendStatus />
            )}

            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id || index}
                message={{
                  text: msg.content,
                  sender: msg.role === "user" ? "user" : "bot",
                  timestamp: msg.timestamp,
                }}
                isSystem={msg.role === "system"}
              />
            ))}

            {isLoading && (
              <MessageBubble
                message={{ text: "Thinking...", sender: "bot" }}
                isLoading={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 pt-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              disabled={!safeBackendStatus.running}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Chatbot;
