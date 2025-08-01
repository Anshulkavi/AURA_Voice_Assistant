"use client"

import { useState, useEffect, useCallback } from "react"

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()

        // Configure recognition
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = true
        recognitionInstance.lang = "en-US"

        // Event handlers
        recognitionInstance.onstart = () => {
          console.log("🎤 Speech recognition started")
          setIsListening(true)
        }

        recognitionInstance.onresult = (event) => {
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }

          if (finalTranscript) {
            console.log("🎤 Speech recognized:", finalTranscript)
            setTranscript(finalTranscript.trim())
          }
        }

        recognitionInstance.onend = () => {
          console.log("🎤 Speech recognition ended")
          setIsListening(false)
        }

        recognitionInstance.onerror = (event) => {
          console.error("🚨 Speech recognition error:", event.error)
          setIsListening(false)

          if (event.error === "not-allowed") {
            alert("Microphone access denied. Please allow microphone access to use voice input.")
          }
        }

        setRecognition(recognitionInstance)
        setIsSupported(true)
      } else {
        console.warn("Speech recognition not supported in this browser")
        setIsSupported(false)
      }
    }
  }, [])

  // Start listening
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      console.log("🎤 Starting speech recognition")
      setTranscript("") // Clear previous transcript
      try {
        recognition.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [recognition, isListening])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      console.log("🎤 Stopping speech recognition")
      recognition.stop()
    }
  }, [recognition, isListening])

  // Reset transcript
  const resetTranscript = useCallback(() => {
    console.log("🧹 Resetting speech transcript")
    setTranscript("")
  }, [])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  }
}
