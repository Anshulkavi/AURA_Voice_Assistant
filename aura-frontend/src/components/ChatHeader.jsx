// src/components/ChatHeader.jsx
import React from 'react';

function ChatHeader() {
  return (
    <header className="py-4 text-center">
      <h1 className="text-4xl font-bold">
        <span className="bg-gradient-to-r from-cyan-400 to-green-400 text-transparent bg-clip-text">
          AURA
        </span>
        <span className="text-red-400">+</span>
      </h1>
    </header>
  );
}

export default ChatHeader;