// // "use client"

// // import { useState } from "react"
// // import { Link, useNavigate, useLocation } from "react-router-dom"
// // import { User, Settings, LogOut, Shield, MessageCircle, ChevronDown } from "lucide-react"
// // import { useAuth } from "../../contexts/AuthContext"

// // function Navbar() {
// //   const [showUserMenu, setShowUserMenu] = useState(false)
// //   const { user, logout } = useAuth()
// //   const navigate = useNavigate()
// //   const location = useLocation()

// //   const handleLogout = async () => {
// //     await logout()
// //     navigate("/")
// //   }

// //   const isActive = (path) => location.pathname === path

// //   return (
// //     <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
// //       <div className="flex items-center justify-between">
// //         {/* Logo */}
// //         <div className="flex items-center space-x-3">
// //           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
// //             <span className="text-white font-bold text-sm">A+</span>
// //           </div>
// //           <span className="text-white font-bold text-xl">AURA+</span>
// //         </div>

// //         {/* Navigation Links */}
// //         <div className="flex items-center space-x-6">
// //           <Link
// //             to="/chatbot"
// //             className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
// //               isActive("/chatbot") ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
// //             }`}
// //           >
// //             <MessageCircle className="w-4 h-4" />
// //             <span>Chat</span>
// //           </Link>

// //           {user?.is_admin && (
// //             <Link
// //               to="/admin"
// //               className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
// //                 isActive("/admin") ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
// //               }`}
// //             >
// //               <Shield className="w-4 h-4" />
// //               <span>Admin</span>
// //             </Link>
// //           )}
// //         </div>

// //         {/* User Menu */}
// //         <div className="relative">
// //           <button
// //             onClick={() => setShowUserMenu(!showUserMenu)}
// //             className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
// //           >
// //             <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
// //               <User className="w-4 h-4" />
// //             </div>
// //             <span className="hidden md:block">{user?.username}</span>
// //             <ChevronDown className="w-4 h-4" />
// //           </button>

// //           {showUserMenu && (
// //             <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
// //               <div className="py-2">
// //                 <div className="px-4 py-2 border-b border-gray-700">
// //                   <p className="text-white font-medium">{user?.full_name}</p>
// //                   <p className="text-gray-400 text-sm">{user?.email}</p>
// //                   {user?.is_admin && (
// //                     <span className="inline-block mt-1 px-2 py-1 bg-purple-600 text-white text-xs rounded">Admin</span>
// //                   )}
// //                 </div>

// //                 <Link
// //                   to="/profile"
// //                   onClick={() => setShowUserMenu(false)}
// //                   className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
// //                 >
// //                   <Settings className="w-4 h-4" />
// //                   <span>Profile</span>
// //                 </Link>

// //                 <button
// //                   onClick={handleLogout}
// //                   className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
// //                 >
// //                   <LogOut className="w-4 h-4" />
// //                   <span>Logout</span>
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </nav>
// //   )
// // }

// // export default Navbar

// "use client"

// import { useState } from "react"
// import { Link, useNavigate, useLocation } from "react-router-dom"
// import { User, Settings, LogOut, Shield, MessageCircle, ChevronDown, Volume2, VolumeX } from "lucide-react"
// import { useAuth } from "../../contexts/AuthContext"
// import { useSpeech } from "../../contexts/SpeechContext"

// function Navbar() {
//   const [showUserMenu, setShowUserMenu] = useState(false)
//   const { user, logout } = useAuth()
//   const { isSpeechEnabled, toggleSpeechEnabled } = useSpeech()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleLogout = async () => {
//     await logout()
//     navigate("/")
//   }

//   const isActive = (path) => location.pathname === path

//   const handleToggleSpeech = () => {
//     toggleSpeechEnabled()
//     setShowUserMenu(false)
//   }

//   return (
//     <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
//       <div className="flex items-center justify-between">
//         {/* ===== THIS SECTION WAS MISSING ===== */}
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//             <span className="text-white font-bold text-sm">A+</span>
//           </div>
//           <span className="text-white font-bold text-xl">AURA+</span>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex items-center space-x-6">
//           <Link
//             to="/chatbot"
//             className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//               isActive("/chatbot") ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
//             }`}
//           >
//             <MessageCircle className="w-4 h-4" />
//             <span>Chat</span>
//           </Link>

//           {user?.is_admin && (
//             <Link
//               to="/admin"
//               className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//                 isActive("/admin") ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
//               }`}
//             >
//               <Shield className="w-4 h-4" />
//               <span>Admin</span>
//             </Link>
//           )}
//         </div>
//         {/* ===== END OF MISSING SECTION ===== */}

//         {/* User Menu */}
//         <div className="relative">
//           <button
//             onClick={() => setShowUserMenu(!showUserMenu)}
//             className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
//           >
//             <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4" />
//             </div>
//             <span className="hidden md:block">{user?.username}</span>
//             <ChevronDown className="w-4 h-4" />
//           </button>

//           {showUserMenu && (
//             <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
//               <div className="py-2">
//                 <div className="px-4 py-2 border-b border-gray-700">
//                   <p className="text-white font-medium">{user?.full_name}</p>
//                   <p className="text-gray-400 text-sm">{user?.email}</p>
//                   {user?.is_admin && (
//                     <span className="inline-block mt-1 px-2 py-1 bg-purple-600 text-white text-xs rounded">Admin</span>
//                   )}
//                 </div>

//                 <button
//                   onClick={handleToggleSpeech}
//                   className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
//                 >
//                   {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
//                   <span>{isSpeechEnabled ? "Voice On" : "Voice Off"}</span>
//                 </button>
                
//                 <Link
//                   to="/profile"
//                   onClick={() => setShowUserMenu(false)}
//                   className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
//                 >
//                   <Settings className="w-4 h-4" />
//                   <span>Profile</span>
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar

"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Languages, LogOut, Menu, MessageCircle, Settings, Shield, User, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSpeech } from "../../contexts/SpeechContext";

function Navbar({ onMenuClick }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, logout } = useAuth();
  
  // ✅ 1. Get new values from the updated SpeechContext
  const {
    voices,
    selectedVoice,
    changeVoice,
    isSpeechEnabled,
    toggleSpeechEnabled
  } = useSpeech();
  
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 2. Handler now uses `changeVoice` with the full voice object
  const handleSelectVoice = (voice) => {
    changeVoice(voice);
    setShowUserMenu(false);
    setShowLanguageMenu(false);
  };

  return (
    <nav ref={menuRef} className="relative z-30 bg-gray-900/70 backdrop-blur-lg border-b border-white/10 px-4 py-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Section: Menu and Logo */}
        <div className="flex items-center space-x-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden p-1 text-gray-400 hover:text-white mr-2" aria-label="Open sidebar">
              <Menu size={22} />
            </button>
          )}
          <Link to="/" className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
               <span className="text-white font-bold text-sm">A+</span>
             </div>
             <span className="text-white font-bold text-xl hidden sm:block">AURA+</span>
          </Link>
        </div>

        {/* Center Navigation Links (Your existing links go here) */}
        <div className="flex items-center space-x-1 sm:space-x-4">
           {/* ... your <Link> components ... */}
        </div>

        {/* Right Section: User Menu */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"><User className="w-4 h-4" /></div>
            <span className="hidden md:block">{user?.username}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showUserMenu && (
            <div
              onMouseLeave={() => setShowLanguageMenu(false)}
              className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
            >
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-white font-medium truncate">{user?.full_name}</p>
                  <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                </div>
                
                {/* Voice On/Off Toggle */}
                <button onClick={() => { toggleSpeechEnabled(); }} className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">
                    <div className="flex items-center space-x-2">
                        {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                        <span>Voice Output</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isSpeechEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ${isSpeechEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </button>
                
                {/* Language Selector Sub-menu */}
                <div onMouseEnter={() => setShowLanguageMenu(true)} className="relative">
                  <div className="flex items-center justify-between space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Languages className="w-4 h-4" />
                      <span>Language / Voice</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>

                  {showLanguageMenu && (
                    <div className="absolute top-0 right-full -mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {voices.length > 0 ? voices.map(voice => (
                          <button
                            key={voice.name}
                            onClick={() => handleSelectVoice(voice)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              // ✅ 3. Compare selected voice by name
                              selectedVoice?.name === voice.name
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                          >
                            {`${voice.name} (${voice.lang})`}
                          </button>
                        )) : <div className="px-4 py-2 text-sm text-gray-400">Loading voices...</div>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700 my-1"></div>

                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <button onClick={() => {logout(); setShowUserMenu(false);}} className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;