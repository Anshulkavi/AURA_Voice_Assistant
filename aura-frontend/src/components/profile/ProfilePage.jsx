// "use client"

// import { useState } from "react"
// import { useAuth } from "../../contexts/AuthContext"

// const ProfilePage = () => {
//   const { user, updateProfile } = useAuth()
//   const [isEditing, setIsEditing] = useState(false)
//   const [formData, setFormData] = useState({
//     full_name: user?.full_name || "",
//     bio: user?.bio || "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState("")
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError("")
//     setMessage("")

//     const result = await updateProfile(formData)

//     if (result.success) {
//       setMessage("Profile updated successfully!")
//       setIsEditing(false)
//     } else {
//       setError(result.error)
//     }

//     setLoading(false)
//   }

//   const handleCancel = () => {
//     setFormData({
//       full_name: user?.full_name || "",
//       bio: user?.bio || "",
//     })
//     setIsEditing(false)
//     setError("")
//     setMessage("")
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
//           <div className="flex items-center">
//             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-6">
//               <span className="text-white text-2xl font-bold">
//                 {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
//               </span>
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">{user?.full_name || user?.username}</h1>
//               <p className="text-blue-100 mt-1">@{user?.username}</p>
//               {user?.is_admin && (
//                 <span className="inline-block bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold mt-2">
//                   Admin
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-8">
//           {message && (
//             <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{message}</div>
//           )}

//           {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

//               {isEditing ? (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       id="full_name"
//                       name="full_name"
//                       value={formData.full_name}
//                       onChange={handleChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Enter your full name"
//                     />
//                   </div>

//                   <div>
//                     <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
//                       Bio
//                     </label>
//                     <textarea
//                       id="bio"
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       rows={4}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Tell us about yourself..."
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {loading ? "Saving..." : "Save Changes"}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                     <p className="text-gray-900">{user?.full_name || "Not provided"}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                     <p className="text-gray-900">{user?.email}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//                     <p className="text-gray-900">@{user?.username}</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
//                     <p className="text-gray-900">{user?.bio || "No bio provided"}</p>
//                   </div>

//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                   >
//                     Edit Profile
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Details</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
//                   <p className="text-gray-900">{user?.is_admin ? "Administrator" : "Regular User"}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
//                   <p className="text-gray-900">
//                     {user?.created_at ? new Date(user.created_at.seconds * 1000).toLocaleDateString() : "Unknown"}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
//                   <p className="text-gray-900">
//                     {user?.last_login ? new Date(user.last_login.seconds * 1000).toLocaleDateString() : "Unknown"}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
//                   <span
//                     className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
//                       user?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {user?.is_active ? "Active" : "Inactive"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfilePage

"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, Shield, Edit2, Save, X } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } else {
      setMessage(result.error || "Failed to update profile")
    }

    setIsLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      bio: user?.bio || "",
    })
    setIsEditing(false)
    setMessage("")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          {/* Profile Picture */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                message.includes("success")
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white">{user.username}</span>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-white">{user.email}</span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
                  <span className="text-white">{user.full_name}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="p-3 bg-gray-700/50 rounded-xl min-h-[100px]">
                  <span className="text-white">{user.bio || "No bio added yet."}</span>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_admin ? "bg-purple-600 text-white" : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {user.is_admin ? "Administrator" : "User"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-white">
                    {user.created_at ? new Date(user.created_at.seconds * 1000).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
