// src/components/CodeBlock.jsx
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'; // npm install @heroicons/react

function CodeBlock({ codeContent }) {
  const [isCopied, setIsCopied] = useState(false);

  const lines = codeContent.trim().split('\n');
  const language = lines[0].trim().toLowerCase() || 'plaintext';
  const code = lines.slice(1).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="my-3 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 text-xs">
        <span className="font-semibold uppercase text-cyan-400">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 transition-colors">
          {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto font-mono bg-zinc-900 text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;