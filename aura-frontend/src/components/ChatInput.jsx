// src/components/ChatInput.jsx
import React, { useState } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/solid';

function ChatInput({ onSendMessage, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    setText('');
  };

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => onSendMessage(event.results[0][0].transcript);
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    
    recognition.start();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask AURA+ anything..."
          disabled={isLoading}
          className="flex-1 w-full p-3 bg-white/5 border-none rounded-lg text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
        />
        <button 
          type="button" 
          onClick={handleVoiceInput} 
          disabled={isLoading} 
          className="p-3 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
          aria-label="Use voice"
        >
          <MicrophoneIcon className="w-6 h-6 text-cyan-300" />
        </button>
        <button 
          type="submit" 
          disabled={isLoading || !text.trim()} 
          className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 disabled:opacity-50 disabled:from-zinc-600 disabled:to-zinc-700 transition-opacity"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-6 h-6 text-white" />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;