"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, MessageSquare, Trash2, X, Clock, Edit3, AlertTriangle } from "lucide-react"

function Sidebar({
  isOpen,
  onClose,
  history,
  onNewChat,
  onSelectChat,
  currentChatId,
  chatSessions = [],
  onDeleteChat,
  onRenameChat,
}) {
  const [hoveredChat, setHoveredChat] = useState(null)
  const [editingChat, setEditingChat] = useState(null)
  const [editingName, setEditingName] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const editInputRef = useRef(null)

  // Focus input when editing starts
  useEffect(() => {
    if (editingChat && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingChat])

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get preview text from chat
  const getChatPreview = (chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet"
    }

    // Get the first user message
    const firstUserMessage = chat.messages.find((msg) => msg.sender === "user")

    if (firstUserMessage && firstUserMessage.text) {
      return firstUserMessage.text.length > 40 ? firstUserMessage.text.substring(0, 40) + "..." : firstUserMessage.text
    }

    return "New conversation"
  }

  // Start editing chat name
  const startEditing = (e, chat) => {
    e.stopPropagation()
    setEditingChat(chat.id)
    setEditingName(chat.title || getChatPreview(chat))
  }

  // Save edited name
  const saveEdit = (e) => {
    e.stopPropagation()
    if (editingName.trim() && editingChat) {
      onRenameChat(editingChat, editingName.trim())
    }
    setEditingChat(null)
    setEditingName("")
  }

  // Cancel editing
  const cancelEdit = (e) => {
    e.stopPropagation()
    setEditingChat(null)
    setEditingName("")
  }

  // Handle key press in edit input
  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit(e)
    } else if (e.key === "Escape") {
      cancelEdit(e)
    }
  }

  // Show delete confirmation
  const showDeleteConfirm = (e, chatId) => {
    e.stopPropagation()
    setDeleteConfirm(chatId)
  }

  // Confirm chat deletion
  const confirmDelete = (e) => {
    e.stopPropagation()
    if (deleteConfirm) {
      onDeleteChat(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  // Cancel deletion
  const cancelDelete = (e) => {
    e.stopPropagation()
    setDeleteConfirm(null)
  }

  // Generate unique chat title
  const getChatTitle = (chat) => {
    if (chat.title && chat.title !== "New Chat") {
      return chat.title
    }

    // Use first user message or generate based on timestamp
    const preview = getChatPreview(chat)
    if (preview === "No messages yet" || preview === "New conversation") {
      const date = new Date(chat.timestamp)
      return `Chat ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    return preview
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-black/20 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={onClose} className="md:hidden text-white/60 hover:text-white transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={() => {
                console.log("🆕 New chat button clicked")
                onNewChat()
                onClose() // Close sidebar on mobile after creating new chat
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all group"
            >
              <Plus className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
              <span className="text-blue-400 group-hover:text-blue-300 font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {chatSessions && chatSessions.length > 0 ? (
                chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                      currentChatId === chat.id
                        ? "bg-white/10 border border-white/20 ring-1 ring-blue-500/30"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                    onClick={() => {
                      if (!editingChat && !deleteConfirm) {
                        console.log("📱 Chat selected:", chat.id)
                        onSelectChat(chat.id)
                        onClose() // Close sidebar on mobile after selecting chat
                      }
                    }}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                  >
                    {/* Delete Confirmation Overlay */}
                    {deleteConfirm === chat.id && (
                      <div className="absolute inset-0 bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                        <div className="text-center">
                          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                          <p className="text-red-400 text-sm font-medium mb-3">Delete this chat?</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={confirmDelete}
                              className="px-3 py-1 bg-red-500/30 text-red-400 rounded-lg hover:bg-red-500/40 transition-colors text-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="px-3 py-1 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-4 h-4 text-white/60 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {/* Chat Title - Remove the inline edit button */}
                        {editingChat === chat.id ? (
                          <div className="mb-2">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              onBlur={saveEdit}
                              className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                              placeholder="Enter chat name..."
                            />
                          </div>
                        ) : (
                          <div className="mb-1">
                            <h3 className="text-sm font-medium text-white/90 line-clamp-1">{getChatTitle(chat)}</h3>
                          </div>
                        )}

                        {/* Chat Preview */}
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-2">
                          {getChatPreview(chat)}
                        </p>

                        {/* Chat Metadata */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3 text-white/40" />
                            <span className="text-xs text-white/40">{formatDate(chat.timestamp)}</span>
                            {chat.messages && (
                              <span className="text-xs text-white/40">
                                • {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          {/* Current Chat Indicator */}
                          {currentChatId === chat.id && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - show on hover with better spacing */}
                    {hoveredChat === chat.id && !editingChat && !deleteConfirm && (
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm rounded-lg p-1">
                        <button
                          onClick={(e) => startEditing(e, chat)}
                          className="p-1.5 text-white/40 hover:text-blue-400 hover:bg-blue-500/20 rounded transition-all"
                          title="Rename chat"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => showDeleteConfirm(e, chat.id)}
                          className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No chat history yet</p>
                  <p className="text-white/30 text-xs mt-1">Start a conversation to see your chats here</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Session Info */}
          {history && history.length > 0 && (
            <div className="border-t border-white/10 p-4">
              <div className="text-xs text-white/40 mb-2">Current Session</div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/70">
                  {history.length} message{history.length !== 1 ? "s" : ""}
                </span>
                {currentChatId && <span className="text-xs text-white/40">• ID: {currentChatId.slice(-6)}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
