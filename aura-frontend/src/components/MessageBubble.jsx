// src/components/MessageBubble.jsx
import React from 'react';
import CodeBlock from './CodeBlock';

// Parses message text for code blocks and inline code
const formatMessage = (text) => {
  // --- FIX: Add this line ---
  // If text is not a string or is empty, return null to render nothing.
  if (typeof text !== 'string' || !text) {
    return null;
  }

  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3);
      return <CodeBlock key={index} codeContent={code} />;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-2 py-1 text-sm font-mono bg-cyan-400/20 text-cyan-300 rounded-md">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

function MessageBubble({ message, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 self-start">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex-shrink-0"></div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  const { text, sender } = message;
  const isUser = sender === 'user';

  const bubbleClasses = isUser
    ? "bg-gradient-to-r from-blue-600 to-violet-600 self-end"
    : "bg-white/5 border border-white/10 self-start";

  return (
    <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] break-words shadow-lg ${bubbleClasses}`}>
      {formatMessage(text)}
    </div>
  );
}

export default MessageBubble;