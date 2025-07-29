import React, { useState, useEffect } from 'react';
import '../App.css';


function Chatbot() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm AURA+. How can I assist you today?", sender: 'bot' },
  ]);

  const addMessage = (text, sender) => {
    setMessages(prevMessages => [...prevMessages, { text, sender }]);
    if (sender === 'bot') {
      speak(text);
    }
  };

  const getAuraResponse = async (message) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: message }),
      });

      const text = await response.text(); // Get raw response
      console.log('Response Text:', text); // Log it to check if it's valid JSON

      try {
        const data = JSON.parse(text); // Attempt to parse manually
        return response.ok ? data.response : 'Something went wrong.';
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        return 'Something went wrong.';
      }
    } catch (error) {
      console.error("Error:", error);
      return 'Something went wrong.';
    }
  };

  const handleUserInput = async (inputMessage = userMessage) => {
    if (inputMessage.trim()) {
      addMessage(inputMessage, 'user');
      try {
        const response = await getAuraResponse(inputMessage);
        addMessage(response, 'bot');
      } catch (error) {
        addMessage('There was an error processing your request. Please try again.', 'bot');
      }
      setUserMessage('');
    }
  };

  const speak = (text) => {
    try {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  };

  const startVoiceRecognition = () => {
    // Stop ongoing speech
    window.speechSynthesis.cancel();
  
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserInput(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      addMessage('Could not understand the speech. Please try again.', 'bot');
    };
  
    recognition.start();
  };

  return (
    <div className="container">
      <header>
        <h1 className="logo">
          AURA<span className="plus">+</span>
        </h1>
        <p>Your Futuristic AI Assistant</p>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap" rel="stylesheet"></link>
      </header>
      <main>
        <div id="chat-container">
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        <div id="input-container">
          <input
            type="text"
            id="user-input"
            placeholder="Type your message..."
            aria-label="Type your message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
          />
          <button id="voice-btn" className="btn" aria-label="Voice input" onClick={startVoiceRecognition}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </button>
          <button id="send-btn" className="btn" aria-label="Send message" onClick={() => handleUserInput()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" x2="11" y1="2" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </main>
      <footer>
        <p>© 2024 AURA+ AI Assistant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Chatbot;

// import React, { useState, useEffect } from 'react';

// function Chatbot() {
//   const [userMessage, setUserMessage] = useState('');
//   const [messages, setMessages] = useState([
//     { text: "Hello! I'm AURA+. How can I assist you today?", sender: 'bot' },
//   ]);

//   const addMessage = (text, sender) => {
//     setMessages(prevMessages => [...prevMessages, { text, sender }]);
//     if (sender === 'bot') {
//       speak(text);
//     }
//   };

//   const getAuraResponse = async (message) => {
//     try {
//       const response = await fetch('/command', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ command: message }),
//       });

//       const text = await response.text();
//       console.log('Response Text:', text);

//       try {
//         const data = JSON.parse(text);
//         return response.ok ? data.response : 'Something went wrong.';
//       } catch (error) {
//         console.error('Failed to parse JSON:', error);
//         return 'Something went wrong.';
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return 'Something went wrong.';
//     }
//   };

//   const handleUserInput = async (inputMessage = userMessage) => {
//     if (inputMessage.trim()) {
//       addMessage(inputMessage, 'user');
//       try {
//         const response = await getAuraResponse(inputMessage);
//         addMessage(response, 'bot');
//       } catch (error) {
//         addMessage('There was an error processing your request. Please try again.', 'bot');
//       }
//       setUserMessage('');
//     }
//   };

//   const speak = (text) => {
//     try {
//       // Remove code blocks and markdown from speech
//       const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block provided')
//                            .replace(/`([^`]+)`/g, '$1')
//                            .replace(/\*\*(.*?)\*\*/g, '$1')
//                            .replace(/\*(.*?)\*/g, '$1');
      
//       const speech = new SpeechSynthesisUtterance(cleanText);
//       speech.lang = 'en-US';
//       window.speechSynthesis.speak(speech);
//     } catch (error) {
//       console.error('Speech synthesis error:', error);
//     }
//   };

//   const startVoiceRecognition = () => {
//     window.speechSynthesis.cancel();
  
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
  
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       handleUserInput(transcript);
//     };
  
//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       addMessage('Could not understand the speech. Please try again.', 'bot');
//     };
  
//     recognition.start();
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text).then(() => {
//       // Could add a toast notification here
//     }).catch(err => {
//       console.error('Failed to copy: ', err);
//     });
//   };

//   const formatMessage = (text) => {
//     // Split text by code blocks
//     const parts = text.split(/(```[\s\S]*?```)/g);
    
//     return parts.map((part, index) => {
//       if (part.startsWith('```') && part.endsWith('```')) {
//         // Extract language and code
//         const lines = part.slice(3, -3).split('\n');
//         const language = lines[0].trim() || 'plaintext';
//         const code = lines.slice(1).join('\n');
        
//         return (
//           <div key={index} className="code-block-container">
//             <div className="code-header">
//               <span className="code-language">{language}</span>
//               <button 
//                 className="copy-btn"
//                 onClick={() => copyToClipboard(code)}
//                 title="Copy code"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                   <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                 </svg>
//               </button>
//             </div>
//             <pre className="code-block">
//               <code className={`language-${language}`}>{code}</code>
//             </pre>
//           </div>
//         );
//       } else {
//         // Handle inline code and regular text
//         return (
//           <span key={index}>
//             {part.split(/(`[^`]+`)/g).map((segment, segIndex) => {
//               if (segment.startsWith('`') && segment.endsWith('`')) {
//                 return (
//                   <code key={segIndex} className="inline-code">
//                     {segment.slice(1, -1)}
//                   </code>
//                 );
//               }
//               return segment;
//             })}
//           </span>
//         );
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white font-sans">
//       <style jsx>{`
//         .code-block-container {
//           margin: 12px 0;
//           border-radius: 12px;
//           overflow: hidden;
//           background: #1a1a1a;
//           border: 1px solid #333;
//         }
        
//         .code-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 8px 16px;
//           background: #2d2d2d;
//           border-bottom: 1px solid #333;
//           font-size: 12px;
//         }
        
//         .code-language {
//           color: #00d4ff;
//           font-weight: 600;
//           text-transform: uppercase;
//         }
        
//         .copy-btn {
//           background: transparent;
//           border: none;
//           color: #888;
//           cursor: pointer;
//           padding: 4px;
//           border-radius: 4px;
//           transition: all 0.2s;
//         }
        
//         .copy-btn:hover {
//           color: #00d4ff;
//           background: rgba(0, 212, 255, 0.1);
//         }
        
//         .code-block {
//           margin: 0;
//           padding: 16px;
//           background: #1a1a1a;
//           color: #e0e0e0;
//           font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
//           font-size: 14px;
//           line-height: 1.5;
//           overflow-x: auto;
//           white-space: pre-wrap;
//         }
        
//         .inline-code {
//           background: rgba(0, 212, 255, 0.1);
//           color: #00d4ff;
//           padding: 2px 6px;
//           border-radius: 4px;
//           font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
//           font-size: 0.9em;
//         }
        
//         .message {
//           margin: 16px 0;
//           padding: 16px 20px;
//           border-radius: 18px;
//           max-width: 80%;
//           word-wrap: break-word;
//           line-height: 1.6;
//         }
        
//         .user-message {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           margin-left: auto;
//           color: white;
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
//         }
        
//         .bot-message {
//           background: rgba(255, 255, 255, 0.05);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           margin-right: auto;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//         }
        
//         .container {
//           display: flex;
//           flex-direction: column;
//           min-height: 100vh;
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//         }
        
//         header {
//           text-align: center;
//           padding: 40px 0 20px;
//         }
        
//         .logo {
//           font-size: 3.5rem;
//           font-weight: 700;
//           margin: 0;
//           background: linear-gradient(135deg, #00d4ff, #00ff88);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           text-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
//         }
        
//         .plus {
//           color: #ff6b6b;
//           text-shadow: 0 0 20px rgba(255, 107, 107, 0.7);
//         }
        
//         header p {
//           color: rgba(255, 255, 255, 0.7);
//           font-size: 1.2rem;
//           margin-top: 10px;
//         }
        
//         main {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//         }
        
//         #chat-container {
//           flex: 1;
//           background: rgba(255, 255, 255, 0.02);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 20px;
//           padding: 30px;
//           margin-bottom: 20px;
//           min-height: 400px;
//           overflow-y: auto;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
//         }
        
//         #messages {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }
        
//         #input-container {
//           display: flex;
//           gap: 12px;
//           padding: 20px;
//           background: rgba(255, 255, 255, 0.05);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 20px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
//         }
        
//         #user-input {
//           flex: 1;
//           padding: 16px 20px;
//           border: none;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.1);
//           color: white;
//           font-size: 16px;
//           outline: none;
//           transition: all 0.3s ease;
//         }
        
//         #user-input::placeholder {
//           color: rgba(255, 255, 255, 0.5);
//         }
        
//         #user-input:focus {
//           background: rgba(255, 255, 255, 0.15);
//           box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.5);
//         }
        
//         .btn {
//           padding: 16px;
//           border: none;
//           border-radius: 12px;
//           background: linear-gradient(135deg, #00d4ff, #00ff88);
//           color: white;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
//         }
        
//         .btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
//         }
        
//         .btn:active {
//           transform: translateY(0);
//         }
        
//         footer {
//           text-align: center;
//           padding: 20px 0;
//           color: rgba(255, 255, 255, 0.5);
//           font-size: 0.9rem;
//         }
        
//         @media (max-width: 768px) {
//           .container {
//             padding: 0 15px;
//           }
          
//           .logo {
//             font-size: 2.5rem;
//           }
          
//           .message {
//             max-width: 95%;
//           }
          
//           #input-container {
//             padding: 15px;
//           }
//         }
//       `}</style>
      
//       <header>
//         <h1 className="logo">
//           AURA<span className="plus">+</span>
//         </h1>
//         <p>Your Futuristic AI Assistant</p>
//       </header>
      
//       <main>
//         <div id="chat-container">
//           <div id="messages">
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.sender}-message`}>
//                 {formatMessage(msg.text)}
//               </div>
//             ))}
//           </div>
//         </div>
        
//         <div id="input-container">
//           <input
//             type="text"
//             id="user-input"
//             placeholder="Type your message or ask me to write some code..."
//             aria-label="Type your message"
//             value={userMessage}
//             onChange={(e) => setUserMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
//           />
//           <button 
//             id="voice-btn" 
//             className="btn" 
//             aria-label="Voice input" 
//             onClick={startVoiceRecognition}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
//               <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
//               <line x1="12" x2="12" y1="19" y2="22"></line>
//             </svg>
//           </button>
//           <button 
//             id="send-btn" 
//             className="btn" 
//             aria-label="Send message" 
//             onClick={() => handleUserInput()}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="22" x2="11" y1="2" y2="13"></line>
//               <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//             </svg>
//           </button>
//         </div>
//       </main>
      
//       <footer>
//         <p>© 2024 AURA+ AI Assistant. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default Chatbot;

// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Mic, Copy, Check } from 'lucide-react';

// function Chatbot() {
//   const [userMessage, setUserMessage] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const [messages, setMessages] = useState([
//     { text: "Hello! I'm AURA+. How can I assist you today?", sender: 'bot' },
//   ]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const addMessage = (text, sender, isStreaming = false) => {
//     if (isStreaming) {
//       // Add empty message that will be filled with streaming text
//       setMessages(prevMessages => [...prevMessages, { text: '', sender, isStreaming: true }]);
//       return messages.length; // Return index for streaming updates
//     } else {
//       setMessages(prevMessages => [...prevMessages, { text, sender }]);
//       if (sender === 'bot') {
//         speak(text);
//       }
//     }
//   };

//   const updateStreamingMessage = (index, text) => {
//     setMessages(prevMessages => 
//       prevMessages.map((msg, i) => 
//         i === index ? { ...msg, text, isStreaming: true } : msg
//       )
//     );
//   };

//   const finishStreamingMessage = (index, finalText) => {
//     setMessages(prevMessages => 
//       prevMessages.map((msg, i) => 
//         i === index ? { ...msg, text: finalText, isStreaming: false } : msg
//       )
//     );
//     speak(finalText);
//   };

//   const getAuraResponse = async (message) => {
//     try {
//       const response = await fetch('/command', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ command: message }),
//       });

//       const text = await response.text();
//       console.log('Response Text:', text);

//       try {
//         const data = JSON.parse(text);
//         return response.ok ? data.response : 'Something went wrong.';
//       } catch (error) {
//         console.error('Failed to parse JSON:', error);
//         return 'Something went wrong.';
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       return 'Something went wrong.';
//     }
//   };


//   const simulateTyping = (text, messageIndex) => {
//     let currentText = '';
//     let i = 0;
    
//     const typingInterval = setInterval(() => {
//       if (i < text.length) {
//         currentText += text[i];
//         updateStreamingMessage(messageIndex, currentText);
//         i++;
//       } else {
//         clearInterval(typingInterval);
//         finishStreamingMessage(messageIndex, text);
//         setIsTyping(false);
//       }
//     }, 20); // Adjust speed here (lower = faster)
//   };

//   const handleUserInput = async (inputMessage = userMessage) => {
//     if (inputMessage.trim()) {
//       addMessage(inputMessage, 'user');
//       setIsTyping(true);
      
//       try {
//         const response = await getAuraResponse(inputMessage);
//         const messageIndex = addMessage('', 'bot', true);
//         simulateTyping(response, messageIndex);
//       } catch (error) {
//         const errorMessage = 'There was an error processing your request. Please try again.';
//         const messageIndex = addMessage('', 'bot', true);
//         simulateTyping(errorMessage, messageIndex);
//       }
//       setUserMessage('');
//     }
//   };

//   const speak = (text) => {
//     try {
//       const cleanText = text
//         .replace(/```[\s\S]*?```/g, 'Code block provided')
//         .replace(/`([^`]+)`/g, '$1')
//         .replace(/\*\*(.*?)\*\*/g, '$1')
//         .replace(/\*(.*?)\*/g, '$1')
//         .replace(/\*/g, '');
      
//       const speech = new SpeechSynthesisUtterance(cleanText);
//       speech.lang = 'en-US';
//       window.speechSynthesis.speak(speech);
//     } catch (error) {
//       console.error('Speech synthesis error:', error);
//     }
//   };

//   const startVoiceRecognition = () => {
//     window.speechSynthesis.cancel();
//     setIsListening(true);
  
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.interimResults = false;
//     recognition.lang = 'en-US';
  
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setIsListening(false);
//       handleUserInput(transcript);
//     };
  
//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       setIsListening(false);
//       addMessage('Could not understand the speech. Please try again.', 'bot');
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };
  
//     recognition.start();
//   };

//   const copyToClipboard = async (text, index) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedIndex(index);
//       setTimeout(() => setCopiedIndex(null), 2000);
//     } catch (err) {
//       console.error('Failed to copy: ', err);
//     }
//   };

//   const formatMessage = (text, messageIndex) => {
//     const parts = text.split(/(```[\s\S]*?```)/g);
    
//     return parts.map((part, index) => {
//       if (part.startsWith('```') && part.endsWith('```')) {
//         const lines = part.slice(3, -3).split('\n');
//         const language = lines[0].trim() || 'plaintext';
//         const code = lines.slice(1).join('\n');
//         const codeBlockIndex = `${messageIndex}-${index}`;
        
//         return (
//           <div key={index} className="my-4 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
//             <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
//               <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
//                 {language}
//               </span>
//               <button 
//                 className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
//                 onClick={() => copyToClipboard(code, codeBlockIndex)}
//               >
//                 {copiedIndex === codeBlockIndex ? (
//                   <>
//                     <Check size={12} />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy size={12} />
//                     Copy
//                   </>
//                 )}
//               </button>
//             </div>
//             <pre className="p-4 overflow-x-auto text-sm text-gray-100 bg-gray-900">
//               <code className={`language-${language}`}>{code}</code>
//             </pre>
//           </div>
//         );
//       } else {
//         // Handle inline code first, then format the rest
//         const segments = part.split(/(`[^`]+`)/g);
        
//         return (
//           <span key={index}>
//             {segments.map((segment, segIndex) => {
//               if (segment.startsWith('`') && segment.endsWith('`')) {
//                 return (
//                   <code 
//                     key={segIndex} 
//                     className="px-1.5 py-0.5 mx-0.5 text-sm bg-gray-100 text-gray-800 rounded font-mono"
//                   >
//                     {segment.slice(1, -1)}
//                   </code>
//                 );
//               } else {
//                 // Process markdown formatting and remove asterisks
//                 let formattedText = segment
//                   .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
//                   .replace(/\*(.*?)\*/g, '<em>$1</em>')              // Italic
//                   .replace(/\*/g, '')                                // Remove any remaining asterisks
//                   .replace(/\n/g, '<br>');                          // Line breaks
                
//                 return (
//                   <span 
//                     key={segIndex} 
//                     dangerouslySetInnerHTML={{ __html: formattedText }}
//                   />
//                 );
//               }
//             })}
//           </span>
//         );
//       }
//     });
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
//       {/* Header */}
//       <div className="flex-shrink-0 border-b border-gray-200 bg-white w-full">
//         <div className="w-full px-4 py-4">
//           <div className="flex items-center justify-center">
//             <h1 className="text-2xl font-bold">
//               <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                 AURA
//               </span>
//               <span className="text-red-500">+</span>
//             </h1>
//           </div>
//           <p className="text-center text-sm text-gray-600 mt-1">
//             Your AI Assistant
//           </p>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto w-full">
//   <div className="w-full px-4 py-6 max-w-4xl mx-auto">
//     <div className="space-y-6">
//       {messages.map((msg, index) => (
//         <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//           <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
//             {/* Avatar */}
//             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//               msg.sender === 'user' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-green-500 text-white'
//             }`}>
//               {msg.sender === 'user' ? 'U' : 'AI'}
//             </div>
            
//             {/* Message Content */}
//             <div className={`rounded-2xl px-4 py-3 ${
//               msg.sender === 'user'
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-gray-100 text-gray-900'
//             }`}>
//               <div className="text-sm leading-relaxed">
//                 {msg.text}
//                 {msg.isStreaming && (
//                   <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>

//     <div ref={messagesEndRef} />
//   </div>
// </div>


//       {/* Input Container */}
//       <div className="flex-shrink-0 border-t border-gray-200 bg-white w-full">
//         <div className="w-full px-4 py-4 max-w-4xl mx-auto">
//           <div className="flex items-end gap-3">
//             <div className="flex-1 relative">
//               <textarea
//                 value={userMessage}
//                 onChange={(e) => setUserMessage(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
//                     e.preventDefault();
//                     handleUserInput();
//                   }
//                 }}
//                 placeholder="Message AURA+..."
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 text-gray-900 placeholder-gray-500"
//                 rows="1"
//                 style={{
//                   minHeight: '50px',
//                   height: 'auto',
//                 }}
//                 onInput={(e) => {
//                   e.target.style.height = 'auto';
//                   e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
//                 }}
//               />
//             </div>
            
//             {/* Voice Button */}
//             <button
//               onClick={startVoiceRecognition}
//               disabled={isListening}
//               className={`p-3 rounded-full transition-all duration-200 ${
//                 isListening
//                   ? 'bg-red-500 text-white animate-pulse'
//                   : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
//               }`}
//               title="Voice input"
//             >
//               <Mic size={20} />
//             </button>
            
//             {/* Send Button */}
//             <button
//               onClick={() => handleUserInput()}
//               disabled={!userMessage.trim() || isTyping}
//               className={`p-3 rounded-full transition-all duration-200 ${
//                 userMessage.trim() && !isTyping
//                   ? 'bg-blue-500 text-white hover:bg-blue-600'
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               }`}
//               title="Send message"
//             >
//               <Send size={20} />
//             </button>
//           </div>
          
//           {/* Footer */}
//           <div className="text-center mt-3">
//             <p className="text-xs text-gray-500">
//               AURA+ can make mistakes. Consider checking important information.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chatbot;

