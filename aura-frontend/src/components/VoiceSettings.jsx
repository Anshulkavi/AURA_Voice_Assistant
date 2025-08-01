"use client"
import { Settings, Volume2, X } from "lucide-react"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"

function VoiceSettings({ isOpen, onClose }) {
  const { voices, selectedVoice, changeVoice } = useSpeechSynthesis()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-96 max-w-[90vw] shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            Voice Settings
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Select Voice</label>
            <select
              value={selectedVoice?.name || ""}
              onChange={(e) => {
                const voice = voices.find((v) => v.name === e.target.value)
                if (voice) changeVoice(voice)
              }}
              className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name} className="bg-gray-800">
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Volume2 className="w-4 h-4" />
            <span>{voices.length} voices available</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default VoiceSettings
