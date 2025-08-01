"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const currentUtteranceRef = useRef(null)
  const lastSpokenTextRef = useRef(null)

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)

      // Try to find a good default voice (English, preferably Indian English)
      const preferredVoice =
        availableVoices.find((voice) => voice.lang === "en-IN") ||
        availableVoices.find((voice) => voice.lang.startsWith("en")) ||
        availableVoices[0]

      setSelectedVoice(preferredVoice)
    }

    // Load voices immediately if available
    loadVoices()

    // Also load when voices change (some browsers load them asynchronously)
    speechSynthesis.addEventListener("voiceschanged", loadVoices)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }
  }, [])

  // Enhanced speak function with loop prevention
  const speak = useCallback(
    (textToSpeak) => {
      if (typeof textToSpeak !== "string" || !textToSpeak) return

      // Prevent speaking the same text multiple times
      if (lastSpokenTextRef.current === textToSpeak && isSpeaking) {
        console.log("🔇 Preventing duplicate speech:", textToSpeak.substring(0, 50))
        return
      }

      // Cancel any ongoing speech first
      if (speechSynthesis.speaking || currentUtteranceRef.current) {
        console.log("🛑 Stopping previous speech")
        speechSynthesis.cancel()
        setIsSpeaking(false)
        currentUtteranceRef.current = null
      }

      // Clean text (keeping your existing cleaning logic)
      const cleanText = textToSpeak
        .replace(/```[\s\S]*?```/g, "Code block.")
        .replace(/[*_#`]/g, "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim()

      if (cleanText.length > 0) {
        console.log("🔊 Starting speech:", cleanText.substring(0, 50))

        const utterance = new SpeechSynthesisUtterance(cleanText)

        // Use selected voice or fallback
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
        utterance.lang = selectedVoice?.lang || "en-IN"
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8

        // Event handlers
        utterance.onstart = () => {
          console.log("🎤 Speech started")
          setIsSpeaking(true)
          lastSpokenTextRef.current = textToSpeak
          currentUtteranceRef.current = utterance
        }

        utterance.onend = () => {
          console.log("🎤 Speech ended")
          setIsSpeaking(false)
          currentUtteranceRef.current = null
          lastSpokenTextRef.current = null
        }

        utterance.onerror = (event) => {
          console.warn("🚨 Speech synthesis error:", event.error)
          setIsSpeaking(false)
          currentUtteranceRef.current = null
          lastSpokenTextRef.current = null
        }

        utterance.onpause = () => {
          console.log("⏸️ Speech paused")
        }

        utterance.onresume = () => {
          console.log("▶️ Speech resumed")
        }

        // Start speaking
        speechSynthesis.speak(utterance)
      }
    },
    [selectedVoice, isSpeaking],
  )

  // Stop speaking
  const stop = useCallback(() => {
    console.log("🛑 Manually stopping speech")
    speechSynthesis.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
    lastSpokenTextRef.current = null
  }, [])

  // Change voice
  const changeVoice = useCallback((voice) => {
    setSelectedVoice(voice)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    speak,
    stop,
    isSpeaking,
    voices,
    selectedVoice,
    changeVoice,
  }
  
}
