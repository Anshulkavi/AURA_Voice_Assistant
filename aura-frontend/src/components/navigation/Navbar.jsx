// "use client"

// import { useState } from "react"
// import { Link, useLocation, useNavigate } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"

// const Navbar = () => {
//   const { user, logout } = useAuth()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()

//   const handleLogout = async () => {
//     await logout()
//     navigate("/")
//   }

//   const isActive = (path) => location.pathname === path

//   return (
//     <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/chatbot" className="flex-shrink-0">
//               <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 AURA+
//               </span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-8">
//             <Link
//               to="/chatbot"
//               className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                 isActive("/chatbot") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }`}
//             >
//               Chat
//             </Link>
//             <Link
//               to="/profile"
//               className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                 isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }`}
//             >
//               Profile
//             </Link>
//             {user?.is_admin && (
//               <Link
//                 to="/admin"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                   isActive("/admin") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                 }`}
//               >
//                 Admin
//               </Link>
//             )}
//           </div>

//           <div className="hidden md:flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-semibold">
//                   {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
//                 </span>
//               </div>
//               <span className="text-gray-700 text-sm font-medium">{user?.full_name || user?.username}</span>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
//             >
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 {isMenuOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
//             <Link
//               to="/chatbot"
//               className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
//                 isActive("/chatbot") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }`}
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Chat
//             </Link>
//             <Link
//               to="/profile"
//               className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
//                 isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//               }`}
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Profile
//             </Link>
//             {user?.is_admin && (
//               <Link
//                 to="/admin"
//                 className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
//                   isActive("/admin") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                 }`}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Admin
//               </Link>
//             )}
//             <div className="border-t pt-4">
//               <div className="flex items-center px-3 py-2">
//                 <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
//                   <span className="text-white text-sm font-semibold">
//                     {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
//                   </span>
//                 </div>
//                 <span className="text-gray-700 text-sm font-medium">{user?.full_name || user?.username}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }

// export default Navbar

"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { User, Settings, LogOut, Shield, MessageCircle, ChevronDown } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A+</span>
          </div>
          <span className="text-white font-bold text-xl">AURA+</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/chatbot"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActive("/chatbot") ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </Link>

          {user?.is_admin && (
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin") ? "bg-purple-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden md:block">{user?.username}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-white font-medium">{user?.full_name}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  {user?.is_admin && (
                    <span className="inline-block mt-1 px-2 py-1 bg-purple-600 text-white text-xs rounded">Admin</span>
                  )}
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
