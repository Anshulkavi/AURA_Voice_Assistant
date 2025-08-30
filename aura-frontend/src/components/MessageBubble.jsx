// "use client"
// import { Volume2, Square, AlertTriangle } from "lucide-react"
// import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"
// import { useRef } from "react"

// function MessageBubble({ message, isLoading = false, isSystem = false }) {
//   const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
//   const lastSpokenRef = useRef(null)

//   // Handle text-to-speech for individual messages with duplicate prevention
//   const handleSpeak = () => {
//     if (!message?.text) return

//     // If currently speaking this exact message, stop it
//     if (isSpeaking && lastSpokenRef.current === message.text) {
//       console.log("🛑 Stopping current speech")
//       stopSpeaking()
//       lastSpokenRef.current = null
//       return
//     }

//     // If speaking something else, stop it first
//     if (isSpeaking) {
//       console.log("🛑 Stopping other speech to start new one")
//       stopSpeaking()
//     }

//     // Start speaking this message
//     console.log("🔊 Speaking message:", message.text.substring(0, 50))
//     lastSpokenRef.current = message.text
//     speak(message.text)
//   }

//   const isUser = message.sender === "user"
//   const isBot = message.sender === "bot" || message.sender === "model"

//   // System messages (errors, warnings)
//   if (isSystem) {
//     return (
//       <div className="flex justify-center mb-4">
//         <div className="max-w-md px-4 py-3 rounded-2xl shadow-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
//           <div className="flex items-start space-x-2">
//             <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
//             <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       <div
//         className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-lg ${
//           isUser
//             ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
//             : "bg-black/30 backdrop-blur-lg border border-white/20 text-white"
//         }`}
//       >
//         {isLoading ? (
//           <div className="flex items-center space-x-2">
//             <div className="flex space-x-1">
//               <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//               <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//             </div>
//             <span className="text-sm text-white/80">AURA+ is thinking...</span>
//           </div>
//         ) : (
//           <>
//             <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>

//             {/* Speak button for bot messages */}
//             {isBot && (
//               <button
//                 onClick={handleSpeak}
//                 className="mt-2 text-xs text-white/60 hover:text-white/80 flex items-center space-x-1 transition-colors"
//               >
//                 {isSpeaking && lastSpokenRef.current === message.text ? (
//                   <>
//                     <Square className="w-3 h-3" />
//                     <span>Stop</span>
//                   </>
//                 ) : (
//                   <>
//                     <Volume2 className="w-3 h-3" />
//                     <span>Speak</span>
//                   </>
//                 )}
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default MessageBubble


// "use client"
// import { Volume2, Square, AlertTriangle, Copy, Check, Code2, Download } from "lucide-react"
// import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"
// import { useRef, useState } from "react"

// // Enhanced CodeBlock component with better styling
// function CodeBlock({ children, language = "javascript" }) {
//   const [copied, setCopied] = useState(false)
//   const codeRef = useRef(null)

//   const codeContent = children || ''

//   const handleCopy = async () => {
//     if (codeRef.current) {
//       try {
//         const textToCopy = codeRef.current.textContent || codeContent
//         await navigator.clipboard.writeText(textToCopy)
//         setCopied(true)
//         setTimeout(() => setCopied(false), 2000)
//       } catch (err) {
//         console.error('Failed to copy:', err)
//       }
//     }
//   }

//   const handleDownload = () => {
//     const blob = new Blob([codeContent], { type: 'text/plain' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `code.${getFileExtension(language)}`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   const getFileExtension = (lang) => {
//     const extensions = {
//       javascript: 'js',
//       typescript: 'ts',
//       python: 'py',
//       java: 'java',
//       cpp: 'cpp',
//       c: 'c',
//       html: 'html',
//       css: 'css',
//       json: 'json',
//       sql: 'sql',
//       bash: 'sh',
//       shell: 'sh'
//     }
//     return extensions[lang.toLowerCase()] || 'txt'
//   }

//   const getLanguageColor = (lang) => {
//     const colors = {
//       javascript: 'text-yellow-400',
//       typescript: 'text-blue-400',
//       python: 'text-green-400',
//       java: 'text-orange-400',
//       cpp: 'text-purple-400',
//       c: 'text-gray-400',
//       html: 'text-red-400',
//       css: 'text-pink-400',
//       json: 'text-cyan-400',
//       sql: 'text-indigo-400',
//       bash: 'text-emerald-400',
//       shell: 'text-emerald-400'
//     }
//     return colors[lang.toLowerCase()] || 'text-gray-400'
//   }

//   if (!codeContent || typeof codeContent !== 'string' || !codeContent.trim()) {
//     return null
//   }

//   return (
//     <div className="my-4 rounded-xl bg-[#0d1117] border border-gray-600/30 overflow-hidden shadow-2xl">
//       {/* Enhanced Header */}
//       <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-600/30">
//         <div className="flex items-center space-x-3">
//           <div className="flex space-x-1.5">
//             <div className="w-3 h-3 rounded-full bg-red-500"></div>
//             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//             <div className="w-3 h-3 rounded-full bg-green-500"></div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Code2 className="w-4 h-4 text-gray-400" />
//             <span className={`text-sm font-mono font-semibold ${getLanguageColor(language)}`}>
//               {language}
//             </span>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleDownload}
//             className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-md transition-colors"
//           >
//             <Download className="w-3.5 h-3.5" />
//             <span>Download</span>
//           </button>
//           <button
//             onClick={handleCopy}
//             className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-md transition-colors"
//           >
//             {copied ? (
//               <>
//                 <Check className="w-3.5 h-3.5 text-green-400" />
//                 <span className="text-green-400">Copied!</span>
//               </>
//             ) : (
//               <>
//                 <Copy className="w-3.5 h-3.5" />
//                 <span>Copy</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>
      
//       {/* Enhanced Code Content */}
//       <div className="relative">
//         {/* Line numbers background */}
//         <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-gray-700/50 flex flex-col text-xs text-gray-500 pt-4">
//           {codeContent.split('\n').map((_, index) => (
//             <div key={index} className="px-2 h-6 flex items-center justify-end">
//               {index + 1}
//             </div>
//           ))}
//         </div>
        
//         {/* Code content with padding for line numbers */}
//         <div className="pl-14 pr-4 py-4 overflow-x-auto">
//           <pre className="text-sm leading-6">
//             <code ref={codeRef} className="text-gray-100 font-mono">
//               {codeContent}
//             </code>
//           </pre>
//         </div>
//       </div>
//     </div>
//   )
// }

// function MessageBubble({ message, isLoading = false, isSystem = false }) {
//   const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
//   const lastSpokenRef = useRef(null)

//   const handleSpeak = () => {
//     if (!message?.text) return

//     if (isSpeaking && lastSpokenRef.current === message.text) {
//       stopSpeaking()
//       lastSpokenRef.current = null
//       return
//     }

//     if (isSpeaking) stopSpeaking()
//     lastSpokenRef.current = message.text
//     speak(message.text)
//   }

//   // Enhanced message formatting
//   const formatMessage = (text) => {
//     if (!text || typeof text !== 'string') return text

//     // Split by code blocks
//     const parts = text.split(/(```[\s\S]*?```)/g)
    
//     return parts.map((part, index) => {
//       if (part && part.startsWith('```')) {
//         try {
//           const lines = part.split('\n')
//           const firstLine = lines[0] ? lines[0].replace('```', '') : ''
//           const language = firstLine.trim() || 'text'
//           const code = lines.slice(1, -1).join('\n')
          
//           if (code && code.trim()) {
//             return (
//               <CodeBlock key={index} language={language}>
//                 {code}
//               </CodeBlock>
//             )
//           }
//         } catch (error) {
//           console.error('Error parsing code block:', error)
//           return (
//             <div key={index} className="whitespace-pre-wrap">
//               {part}
//             </div>
//           )
//         }
//       }
      
//       // Format regular text with better typography
//       if (part) {
//         return (
//           <div key={index} className="whitespace-pre-wrap text-gray-100 leading-relaxed">
//             {part}
//           </div>
//         )
//       }
      
//       return null
//     }).filter(Boolean)
//   }

//   const isUser = message?.sender === "user"
//   const isBot = message?.sender === "bot" || message?.sender === "model"

//   if (isSystem) {
//     return (
//       <div className="flex justify-center mb-6">
//         <div className="max-w-4xl px-5 py-4 rounded-xl shadow-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
//           <div className="flex items-start space-x-3">
//             <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
//             <p className="text-sm whitespace-pre-wrap leading-relaxed">
//               {message?.text || 'System message'}
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
//       <div
//         className={`max-w-xs md:max-w-3xl lg:max-w-5xl px-0 ${
//           isUser
//             ? "bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-5 py-4 text-white shadow-lg"
//             : "bg-transparent text-white"
//         }`}
//       >
//         {isLoading ? (
//           <div className="flex items-center space-x-3 px-5 py-4 bg-gray-800/50 rounded-2xl border border-gray-600/30">
//             <div className="flex space-x-1">
//               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//               <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//             </div>
//             <span className="text-sm text-gray-300">AURA+ is thinking...</span>
//           </div>
//         ) : (
//           <>
//             {!isUser && (
//               <div className="flex items-center space-x-3 mb-3">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
//                   <span className="text-sm font-bold text-white">AI</span>
//                 </div>
//                 <span className="text-sm font-semibold text-gray-300">AURA+</span>
//               </div>
//             )}
            
//             <div className={`text-sm md:text-base leading-7 ${!isUser ? 'px-0' : ''}`}>
//               {isBot ? formatMessage(message?.text) : (
//                 <div className="whitespace-pre-wrap">{message?.text || ''}</div>
//               )}
//             </div>
            
//             {isBot && (
//               <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600/20">
//                 <button
//                   onClick={handleSpeak}
//                   className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 rounded-lg transition-colors"
//                 >
//                   {isSpeaking && lastSpokenRef.current === message?.text ? (
//                     <>
//                       <Square className="w-3.5 h-3.5" />
//                       <span>Stop speaking</span>
//                     </>
//                   ) : (
//                     <>
//                       <Volume2 className="w-3.5 h-3.5" />
//                       <span>Read aloud</span>
//                     </>
//                   )}
//                 </button>
                
//                 <div className="text-xs text-gray-500">
//                   {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

// export default MessageBubble

"use client"
import { Volume2, Square, AlertTriangle, Copy, Check, Code2, Download } from "lucide-react"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"
import { useRef, useState } from "react"

// Enhanced CodeBlock component with better styling
function CodeBlock({ children, language = "javascript" }) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef(null)

  const codeContent = children || ''

  const handleCopy = async () => {
    if (codeRef.current) {
      try {
        const textToCopy = codeRef.current.textContent || codeContent
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        // console.error('Failed to copy:', err)
      }
    }
  }

  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${getFileExtension(language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      json: 'json',
      sql: 'sql',
      bash: 'sh',
      shell: 'sh'
    }
    return extensions[lang.toLowerCase()] || 'txt'
  }

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-orange-400',
      cpp: 'text-purple-400',
      c: 'text-gray-400',
      html: 'text-red-400',
      css: 'text-pink-400',
      json: 'text-cyan-400',
      sql: 'text-indigo-400',
      bash: 'text-emerald-400',
      shell: 'text-emerald-400'
    }
    return colors[lang.toLowerCase()] || 'text-gray-400'
  }

  if (!codeContent || typeof codeContent !== 'string' || !codeContent.trim()) {
    return null
  }

  return (
    <div className="my-4 rounded-xl bg-[#0d1117] border border-gray-600/30 overflow-hidden shadow-2xl">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-600/30">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-mono font-semibold ${getLanguageColor(language)}`}>
              {language}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Enhanced Code Content */}
      <div className="relative">
        {/* Line numbers background */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0d1117] border-r border-gray-700/50 flex flex-col text-xs text-gray-500 pt-4">
          {codeContent.split('\n').map((_, index) => (
            <div key={index} className="px-2 h-6 flex items-center justify-end">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Code content with padding for line numbers */}
        <div className="pl-14 pr-4 py-4 overflow-x-auto">
          <pre className="text-sm leading-6">
            <code ref={codeRef} className="text-gray-100 font-mono">
              {codeContent}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, isLoading = false, isSystem = false }) {
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
  const lastSpokenRef = useRef(null)

  const handleSpeak = () => {
    if (!message?.text) return

    if (isSpeaking && lastSpokenRef.current === message.text) {
      stopSpeaking()
      lastSpokenRef.current = null
      return
    }

    if (isSpeaking) stopSpeaking()
    lastSpokenRef.current = message.text
    speak(message.text)
  }

  // Enhanced message formatting with bold text support
  const formatMessage = (text) => {
    if (!text || typeof text !== 'string') return text

    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      if (part && part.startsWith('```')) {
        try {
          const lines = part.split('\n')
          const firstLine = lines[0] ? lines[0].replace('```', '') : ''
          const language = firstLine.trim() || 'text'
          const code = lines.slice(1, -1).join('\n')
          
          if (code && code.trim()) {
            return (
              <CodeBlock key={index} language={language}>
                {code}
              </CodeBlock>
            )
          }
        } catch (error) {
          // console.error('Error parsing code block:', error)
          return (
            <div key={index} className="whitespace-pre-wrap">
              {part}
            </div>
          )
        }
      }
      
      // Format regular text with bold support
      if (part) {
        return (
          <div key={index} className="whitespace-pre-wrap text-gray-100 leading-relaxed">
            {formatTextWithBold(part)}
          </div>
        )
      }
      
      return null
    }).filter(Boolean)
  }

  // Helper function to format bold text
  const formatTextWithBold = (text) => {
    // Split by **bold** patterns
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        // Remove the ** and make it bold
        const boldText = part.slice(2, -2)
        return (
          <span key={index} className="font-bold text-white">
            {boldText}
          </span>
        )
      }
      return part
    })
  }

  const isUser = message?.sender === "user"
  const isBot = message?.sender === "bot" || message?.sender === "model"

  if (isSystem) {
    return (
      <div className="flex justify-center mb-6">
        <div className="max-w-4xl px-5 py-4 rounded-xl shadow-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message?.text || 'System message'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`max-w-xs md:max-w-3xl lg:max-w-5xl px-0 ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-5 py-4 text-white shadow-lg"
            : "bg-transparent text-white"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-3 px-5 py-4 bg-gray-800/50 rounded-2xl border border-gray-600/30">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-gray-300">AURA+ is thinking...</span>
          </div>
        ) : (
          <>
            {!isUser && (
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">AI</span>
                </div>
                <span className="text-sm font-semibold text-gray-300">AURA+</span>
              </div>
            )}
            
            <div className={`text-sm md:text-base leading-7 ${!isUser ? 'px-0' : ''}`}>
              {isBot ? formatMessage(message?.text) : (
                <div className="whitespace-pre-wrap">{message?.text || ''}</div>
              )}
            </div>
            
            {isBot && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-600/20">
                <button
                  onClick={handleSpeak}
                  className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 rounded-lg transition-colors"
                >
                  {isSpeaking && lastSpokenRef.current === message?.text ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop speaking</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read aloud</span>
                    </>
                  )}
                </button>
                
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MessageBubble