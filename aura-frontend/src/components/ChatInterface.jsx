"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Square, Upload, X, ImageIcon } from "lucide-react"
import { useChat } from "../hooks/useChat"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis"

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, clearChat, connectionError } = useChat()
  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition()
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis()

  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update input with speech transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImage) || isLoading) return

    let imageBase64 = null
    if (selectedImage) {
      // Convert image to base64
      const reader = new FileReader()
      imageBase64 = await new Promise((resolve) => {
        reader.onload = (e) => {
          const base64 = e.target.result.split(",")[1] // Remove data:image/...;base64, prefix
          resolve(base64)
        }
        reader.readAsDataURL(selectedImage)
      })
    }

    // Send message with optional image
    await sendMessage(input.trim(), imageBase64)

    // Clear input and image
    setInput("")
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle text-to-speech for bot messages
  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(text)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-purple-100 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A+</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AURA+</h1>
              <p className="text-sm text-gray-500">AI Voice Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Stop Speaking</span>
              </button>
            )}

            {/* Clear Chat Button */}
            <button
              onClick={clearChat}
              className="px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">Connection Error: {connectionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages?.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white text-gray-800 shadow-sm border border-gray-200"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>

              {/* Speak button for bot messages */}
              {message.sender !== "user" && (
                <button
                  onClick={() => handleSpeak(message.text)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3" />
                      <span>Speak</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">AURA+ is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mx-4 mb-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image attached
                </span>
                <button onClick={removeImage} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <img src={imagePreview || "/placeholder.svg"} alt="Upload preview" className="max-h-32 rounded border" />
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white border-t border-purple-100 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {/* Image Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200"
              title="Upload Image"
            >
              <Upload className="w-5 h-5" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`flex-shrink-0 p-3 rounded-lg transition-colors border ${
                isListening
                  ? "bg-red-500 text-white border-red-500 animate-pulse"
                  : "text-purple-600 hover:bg-purple-50 border-purple-200"
              }`}
              title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message or use voice input..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows="1"
                style={{ minHeight: "48px", maxHeight: "120px" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Voice Recognition Status */}
          {isListening && (
            <div className="mt-2 text-sm text-purple-600 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Listening... Speak now
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
