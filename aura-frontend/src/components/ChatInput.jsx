// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Send, Mic, MicOff, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
// import { useSpeechRecognition } from "../hooks/useSpeechRecognition"

// function ChatInput({ onSendMessage, isLoading, disabled = false }) {
//   const { isListening, startListening, stopListening, transcript, resetTranscript } = useSpeechRecognition()
//   const [input, setInput] = useState("")
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [imagePreview, setImagePreview] = useState(null)
//   const fileInputRef = useRef(null)
//   const textareaRef = useRef(null)

//   // Update input with speech transcript
//   useEffect(() => {
//     if (transcript) {
//       setInput(transcript)
//     }
//   }, [transcript])

//   const clearInputs = () => {
//     console.log("🧹 Clearing all inputs")
//     setInput("")
//     setSelectedImage(null)
//     setImagePreview(null)
//     resetTranscript() // Clear speech transcript
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//     // Focus back to textarea after clearing
//     if (textareaRef.current) {
//       textareaRef.current.focus()
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     // Prevent submission if no content or if loading/disabled
//     if ((!input.trim() && !selectedImage) || isLoading || disabled) {
//       console.log("🚫 Submit prevented:", {
//         hasInput: !!input.trim(),
//         hasImage: !!selectedImage,
//         isLoading,
//         disabled,
//       })
//       return
//     }

//     console.log("📤 Submitting message:", {
//       text: input.trim(),
//       hasImage: !!selectedImage,
//     })

//     let imageBase64 = null
//     if (selectedImage) {
//       try {
//         // Convert image to base64
//         const reader = new FileReader()
//         imageBase64 = await new Promise((resolve, reject) => {
//           reader.onload = (e) => {
//             const base64 = e.target.result.split(",")[1] // Remove data:image/...;base64, prefix
//             resolve(base64)
//           }
//           reader.onerror = reject
//           reader.readAsDataURL(selectedImage)
//         })
//         console.log("🖼️ Image converted to base64")
//       } catch (error) {
//         console.error("❌ Error converting image:", error)
//         return
//       }
//     }

//     // Clear inputs BEFORE sending to prevent double submission
//     const messageText = input.trim()
//     clearInputs()

//     try {
//       // Send message with optional image
//       await onSendMessage(messageText, imageBase64)
//       console.log("✅ Message sent successfully")
//     } catch (error) {
//       console.error("❌ Error sending message:", error)
//       // If sending failed, restore the input
//       setInput(messageText)
//     }
//   }

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]
//     if (file && file.type.startsWith("image/")) {
//       console.log("🖼️ Image selected:", file.name)
//       setSelectedImage(file)

//       // Create preview
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setImagePreview(e.target.result)
//       }
//       reader.readAsDataURL(file)
//     } else {
//       console.log("❌ Invalid file selected")
//     }
//   }

//   // Remove selected image
//   const removeImage = () => {
//     console.log("🗑️ Removing selected image")
//     setSelectedImage(null)
//     setImagePreview(null)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }

//   // Handle Enter key submission
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && !disabled) {
//       e.preventDefault()
//       handleSubmit(e)
//     }
//   }

//   // Auto-resize textarea
//   const handleInputChange = (e) => {
//     const value = e.target.value
//     setInput(value)

//     // Auto-resize textarea
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
//     }
//   }

//   return (
//     <div className="mt-4 space-y-3">
//       {/* Backend Disabled Warning */}
//       {disabled && (
//         <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
//           <div className="flex items-center space-x-2 text-red-400">
//             <AlertCircle className="w-4 h-4" />
//             <span className="text-sm">Chat disabled - Flask backend not running</span>
//           </div>
//         </div>
//       )}

//       {/* Image Preview */}
//       {imagePreview && (
//         <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-3">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-white/80 flex items-center">
//               <ImageIcon className="w-4 h-4 mr-2" />
//               Image attached
//             </span>
//             <button onClick={removeImage} className="text-white/60 hover:text-white/80 transition-colors">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//           <img
//             src={imagePreview || "/placeholder.svg"}
//             alt="Upload preview"
//             className="max-h-32 rounded-lg border border-white/10"
//           />
//         </div>
//       )}

//       {/* Input Form */}
//       <form onSubmit={handleSubmit} className="relative">
//         <div className="flex items-end space-x-2">
//           {/* Hidden file input */}
//           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

//           {/* Image Upload Button */}
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             disabled={disabled}
//             className={`flex-shrink-0 p-3 rounded-xl transition-all border ${
//               disabled
//                 ? "text-white/30 border-white/10 cursor-not-allowed"
//                 : "text-white/70 hover:text-white hover:bg-white/10 border-white/20"
//             }`}
//             title="Upload Image"
//           >
//             <Upload className="w-5 h-5" />
//           </button>

//           {/* Voice Input Button */}
//           <button
//             type="button"
//             onClick={isListening ? stopListening : startListening}
//             disabled={disabled}
//             className={`flex-shrink-0 p-3 rounded-xl transition-all border ${
//               disabled
//                 ? "text-white/30 border-white/10 cursor-not-allowed"
//                 : isListening
//                   ? "bg-red-500/20 text-red-400 border-red-400/50 animate-pulse"
//                   : "text-white/70 hover:text-white hover:bg-white/10 border-white/20"
//             }`}
//             title={isListening ? "Stop Listening" : "Start Voice Input"}
//           >
//             {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
//           </button>

//           {/* Text Input */}
//           <div className="flex-1">
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={handleInputChange}
//               onKeyDown={handleKeyDown}
//               placeholder={
//                 disabled ? "Start Flask backend to enable chat..." : "Type your message or use voice input..."
//               }
//               disabled={disabled}
//               className={`w-full px-4 py-3 bg-black/20 backdrop-blur-lg border rounded-xl text-white placeholder-white/50 resize-none transition-all ${
//                 disabled
//                   ? "border-white/10 cursor-not-allowed opacity-50"
//                   : "border-white/20 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
//               }`}
//               rows="1"
//               style={{ minHeight: "48px", maxHeight: "120px" }}
//             />
//           </div>

//           {/* Send Button */}
//           <button
//             type="submit"
//             disabled={(!input.trim() && !selectedImage) || isLoading || disabled}
//             className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Voice Recognition Status */}
//         {isListening && !disabled && (
//           <div className="mt-2 text-sm text-blue-400 flex items-center">
//             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
//             Listening... Speak now
//           </div>
//         )}

//         {/* Loading Status */}
//         {isLoading && (
//           <div className="mt-2 text-sm text-blue-400 flex items-center">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
//             Sending message...
//           </div>
//         )}
//       </form>
//     </div>
//   )
// }

// export default ChatInput


"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import { useSpeechRecognition } from "../hooks/useSpeechRecognition"

function ChatInput({ onSendMessage, isLoading, disabled = false }) {
  const { isListening, startListening, stopListening, transcript, resetTranscript } = useSpeechRecognition()
  const [input, setInput] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (transcript) {
      setInput(transcript)
    }
  }, [transcript])

  const clearInputs = () => {
    setInput("")
    setSelectedImage(null)
    setImagePreview(null)
    resetTranscript()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if ((!input.trim() && !selectedImage) || isLoading || disabled) {
      return
    }

    const messageText = input.trim()
    let imageBase64 = null

    if (selectedImage) {
      try {
        const reader = new FileReader()
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result.split(",")[1])
          reader.onerror = reject
          reader.readAsDataURL(selectedImage)
        })
      } catch (error) {
        console.error("❌ Error converting image:", error)
        return
      }
    }

    try {
      // DEBUGGING LOG ADDED HERE
      console.log("1. ChatInput: Sending this text ->", messageText);
      
      await onSendMessage(messageText, imageBase64)
      console.log("✅ Message sent successfully")
      clearInputs()
    } catch (error) {
      console.error("❌ Error sending message in ChatInput:", error)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {disabled && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Chat disabled - Backend not running</span>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image attached
            </span>
            <button onClick={removeImage} className="text-white/60 hover:text-white/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <img
            src={imagePreview || "/placeholder.svg"}
            alt="Upload preview"
            className="max-h-32 rounded-lg border border-white/10"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-2">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={disabled} className={`flex-shrink-0 p-3 rounded-xl transition-all border ${ disabled ? "text-white/30 border-white/10 cursor-not-allowed" : "text-white/70 hover:text-white hover:bg-white/10 border-white/20" }`} title="Upload Image" >
            <Upload className="w-5 h-5" />
          </button>

          <button type="button" onClick={isListening ? stopListening : startListening} disabled={disabled} className={`flex-shrink-0 p-3 rounded-xl transition-all border ${ disabled ? "text-white/30 border-white/10 cursor-not-allowed" : isListening ? "bg-red-500/20 text-red-400 border-red-400/50 animate-pulse" : "text-white/70 hover:text-white hover:bg-white/10 border-white/20"}`} title={isListening ? "Stop Listening" : "Start Voice Input"} >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <div className="flex-1">
            <textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={ disabled ? "Start backend to enable chat..." : "Type your message..." } disabled={disabled} className={`w-full px-4 py-3 bg-black/20 backdrop-blur-lg border rounded-xl text-white placeholder-white/50 resize-none transition-all ${ disabled ? "border-white/10 cursor-not-allowed opacity-50" : "border-white/20 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50" }`} rows="1" style={{ minHeight: "48px", maxHeight: "120px" }} />
          </div>

          <button type="submit" disabled={(!input.trim() && !selectedImage) || isLoading || disabled} className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg" >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isListening && !disabled && ( <div className="mt-2 text-sm text-blue-400 flex items-center"> <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div> Listening... Speak now </div> )}
        {isLoading && ( <div className="mt-2 text-sm text-blue-400 flex items-center"> <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div> Sending message... </div> )}
      </form>
    </div>
  )
}

export default ChatInput