"use client"

import { useState } from "react"
import { Square, Settings } from "lucide-react"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"
import VoiceSettings from "./VoiceSettings"

function ChatHeader() {
  const { isSpeaking, stop: stopSpeaking } = useSpeechSynthesis()
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)

  const handleStopSpeaking = () => {
    // console.log("🛑 Stop speaking button clicked")
    stopSpeaking()
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-black/10 backdrop-blur-lg">
        <div className="flex items-center space-x-4 ml-12 md:ml-0">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A+</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AURA+</h1>
            <p className="text-white/60 text-sm">AI Voice Assistant</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Stop Speaking Button - Only show when actually speaking */}
          {isSpeaking && (
            <button
              onClick={handleStopSpeaking}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-400/50 rounded-xl hover:bg-red-500/30 transition-all animate-pulse"
            >
              <Square className="w-4 h-4" />
              <span className="hidden sm:inline">Stop Speaking</span>
            </button>
          )}

          {/* Voice Settings Button */}
          <button
            onClick={() => setShowVoiceSettings(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/20"
            title="Voice Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Voice Settings Modal */}
      <VoiceSettings isOpen={showVoiceSettings} onClose={() => setShowVoiceSettings(false)} />
    </>
  )
}

export default ChatHeader
