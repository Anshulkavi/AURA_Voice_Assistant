"use client";

import { createContext, useContext, useState, useCallback } from "react";
// ✅ 1. Import your new custom hook
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

const SpeechContext = createContext();

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};

export const SpeechProvider = ({ children }) => {
  // Application-level setting to enable/disable speech
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // ✅ 2. Use your custom hook to get all speech synthesis logic
  const speechApi = useSpeechSynthesis();

  // Create a wrapper for the speak function that respects the isSpeechEnabled toggle
  const speak = useCallback((text) => {
    if (isSpeechEnabled) {
      speechApi.speak(text);
    }
  }, [isSpeechEnabled, speechApi]);

  // Stop function that also respects the toggle
  const stop = useCallback(() => {
    speechApi.stop();
  }, [speechApi]);

  const toggleSpeechEnabled = () => {
    // If turning speech off, stop any current speech
    if (isSpeechEnabled) {
      speechApi.stop();
    }
    setIsSpeechEnabled((prev) => !prev);
  };
  
  // ✅ 3. The value provided by the context now includes everything from your hook
  const value = {
    ...speechApi, // Includes voices, selectedVoice, changeVoice, isSpeaking
    speak,        // The wrapped speak function
    stop,         // The wrapped stop function
    isSpeechEnabled,
    toggleSpeechEnabled,
  };

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};