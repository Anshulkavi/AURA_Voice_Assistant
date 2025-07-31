import React from "react";
import { X, PlusCircle } from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
  history,
  onNewChat,
  onSelectChat,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-full w-72 bg-zinc-900 border-r border-white/10 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Chats</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-500 transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 h-full overflow-hidden flex flex-col">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 w-full py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg mb-4 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <p className="text-zinc-400 text-sm">No history yet.</p>
            ) : (
              (() => {
                // Find the first user message to represent this conversation
                const firstUserMessage = history.find(msg => msg.role === 'user');
                
                if (!firstUserMessage) {
                  return (
                    <p className="text-zinc-400 text-sm">No conversations yet.</p>
                  );
                }

                const conversationTitle = typeof firstUserMessage.parts?.[0] === 'string' 
                  ? firstUserMessage.parts[0] 
                  : 'New Conversation';

                // Count total messages in this conversation
                const messageCount = history.length;
                const userMessageCount = history.filter(msg => msg.role === 'user').length;

                return (
                  <div
                    key="current-conversation"
                    onClick={() => onSelectChat(0)}
                    className="cursor-pointer p-3 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors group border-l-2 border-blue-500"
                  >
                    <div className="space-y-1">
                      <p className="truncate text-blue-300 group-hover:text-blue-200 font-medium">
                        {conversationTitle}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {userMessageCount} message{userMessageCount !== 1 ? 's' : ''} • {Math.floor(messageCount / 2)} exchange{Math.floor(messageCount / 2) !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Current Chat
                      </p>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </>
  );
}