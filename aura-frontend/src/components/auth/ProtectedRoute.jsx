// "use client"
// import { Navigate, useLocation } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   const { user, loading } = useAuth()
//   const location = useLocation()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />
//   }

//   if (requireAdmin && !user.is_admin) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             <strong className="font-bold">Access Denied!</strong>
//             <span className="block sm:inline"> You need admin privileges to access this page.</span>
//           </div>
//           <Navigate to="/chatbot" replace />
//         </div>
//       </div>
//     )
//   }

//   return children
// }

// export default ProtectedRoute

"use client"

import { useAuth } from "../../contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check admin privileges if required
  if (requireAdmin && !user.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You need admin privileges to access this page.</p>
          <div className="space-x-4">
            <a
              href="/chatbot"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors text-white inline-block"
            >
              Go to Chatbot
            </a>
            <a
              href="/profile"
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors text-white inline-block"
            >
              Go to Profile
            </a>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute