"use client"
import { Volume2, Square, AlertTriangle } from "lucide-react"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"
import { useRef } from "react"

function MessageBubble({ message, isLoading = false, isSystem = false }) {
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()
  const lastSpokenRef = useRef(null)

  // Handle text-to-speech for individual messages with duplicate prevention
  const handleSpeak = () => {
    if (!message?.text) return

    // If currently speaking this exact message, stop it
    if (isSpeaking && lastSpokenRef.current === message.text) {
      console.log("🛑 Stopping current speech")
      stopSpeaking()
      lastSpokenRef.current = null
      return
    }

    // If speaking something else, stop it first
    if (isSpeaking) {
      console.log("🛑 Stopping other speech to start new one")
      stopSpeaking()
    }

    // Start speaking this message
    console.log("🔊 Speaking message:", message.text.substring(0, 50))
    lastSpokenRef.current = message.text
    speak(message.text)
  }

  const isUser = message.sender === "user"
  const isBot = message.sender === "bot" || message.sender === "model"

  // System messages (errors, warnings)
  if (isSystem) {
    return (
      <div className="flex justify-center mb-4">
        <div className="max-w-md px-4 py-3 rounded-2xl shadow-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-lg ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            : "bg-black/30 backdrop-blur-lg border border-white/20 text-white"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
            <span className="text-sm text-white/80">AURA+ is thinking...</span>
          </div>
        ) : (
          <>
            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.text}</p>

            {/* Speak button for bot messages */}
            {isBot && (
              <button
                onClick={handleSpeak}
                className="mt-2 text-xs text-white/60 hover:text-white/80 flex items-center space-x-1 transition-colors"
              >
                {isSpeaking && lastSpokenRef.current === message.text ? (
                  <>
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>Speak</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
