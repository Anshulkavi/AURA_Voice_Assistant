// "use client"

// import { useState, useEffect } from "react"
// import { useAuth } from "../../contexts/AuthContext"

// const AdminPanel = () => {
//   const { user } = useAuth()
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [message, setMessage] = useState("")

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const fetchUsers = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("/api/admin/users", {
//         credentials: "include",
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUsers(data.users)
//       } else {
//         setError("Failed to fetch users")
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error)
//       setError("Network error. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const toggleUserAdmin = async (userId) => {
//     try {
//       const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
//         method: "POST",
//         credentials: "include",
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setMessage(data.message)
//         fetchUsers() // Refresh the user list
//       } else {
//         setError(data.error || "Failed to update user")
//       }
//     } catch (error) {
//       console.error("Error toggling admin status:", error)
//       setError("Network error. Please try again.")
//     }
//   }

//   const toggleUserActive = async (userId) => {
//     try {
//       const response = await fetch(`/api/admin/users/${userId}/toggle-active`, {
//         method: "POST",
//         credentials: "include",
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setMessage(data.message)
//         fetchUsers() // Refresh the user list
//       } else {
//         setError(data.error || "Failed to update user")
//       }
//     } catch (error) {
//       console.error("Error toggling active status:", error)
//       setError("Network error. Please try again.")
//     }
//   }

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
//         <p className="text-gray-600 mt-2">Manage users and system settings</p>
//       </div>

//       {message && (
//         <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{message}</div>
//       )}

//       {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}

//       <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
//           <p className="text-gray-600 text-sm mt-1">Total users: {users.length}</p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Joined
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((userData) => (
//                 <tr key={userData.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
//                         <span className="text-white text-sm font-semibold">
//                           {userData.full_name?.charAt(0) || userData.username?.charAt(0) || "U"}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{userData.full_name || "No name"}</div>
//                         <div className="text-sm text-gray-500">@{userData.username}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userData.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         userData.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {userData.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         userData.is_admin ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {userData.is_admin ? "Admin" : "User"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {userData.created_at
//                       ? new Date(userData.created_at.seconds * 1000).toLocaleDateString()
//                       : "Unknown"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     {userData.id !== user?.id && (
//                       <>
//                         <button
//                           onClick={() => toggleUserAdmin(userData.id)}
//                           className={`px-3 py-1 rounded text-xs font-medium ${
//                             userData.is_admin
//                               ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
//                               : "bg-blue-100 text-blue-800 hover:bg-blue-200"
//                           }`}
//                         >
//                           {userData.is_admin ? "Remove Admin" : "Make Admin"}
//                         </button>
//                         <button
//                           onClick={() => toggleUserActive(userData.id)}
//                           className={`px-3 py-1 rounded text-xs font-medium ${
//                             userData.is_active
//                               ? "bg-red-100 text-red-800 hover:bg-red-200"
//                               : "bg-green-100 text-green-800 hover:bg-green-200"
//                           }`}
//                         >
//                           {userData.is_active ? "Deactivate" : "Activate"}
//                         </button>
//                       </>
//                     )}
//                     {userData.id === user?.id && <span className="text-gray-400 text-xs">Current User</span>}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminPanel

"use client"

import { useState, useEffect } from "react"
import { Users, Shield, UserCheck, UserX, Search, Filter } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

function AdminPanel() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        setError("Failed to fetch users")
      }
    } catch (error) {
      setError("Error fetching users")
    } finally {
      setLoading(false)
    }
  }

  const toggleUserAdmin = async (userId) => {
    try {
      setActionLoading({ ...actionLoading, [userId]: true })

      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        await fetchUsers() // Refresh the user list
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update admin status")
      }
    } catch (error) {
      setError("Error updating admin status")
    } finally {
      setActionLoading({ ...actionLoading, [userId]: false })
    }
  }

  const toggleUserActive = async (userId) => {
    try {
      setActionLoading({ ...actionLoading, [userId]: true })

      const response = await fetch(`/api/admin/users/${userId}/toggle-active`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        await fetchUsers() // Refresh the user list
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update user status")
      }
    } catch (error) {
      setError("Error updating user status")
    } finally {
      setActionLoading({ ...actionLoading, [userId]: false })
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterType === "all" ||
      (filterType === "admin" && u.is_admin) ||
      (filterType === "user" && !u.is_admin) ||
      (filterType === "active" && u.is_active) ||
      (filterType === "inactive" && !u.is_active)

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.is_admin).length,
    active: users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
  }

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage users and system settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Administrators</p>
                <p className="text-2xl font-bold text-white">{stats.admins}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactive Users</p>
                <p className="text-2xl font-bold text-white">{stats.inactive}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none"
              >
                <option value="all">All Users</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {u.full_name?.charAt(0) || u.username?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{u.full_name}</div>
                            <div className="text-sm text-gray-400">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.is_admin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {u.is_admin ? "Administrator" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {u.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {u.created_at ? new Date(u.created_at.seconds * 1000).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {u.id !== user.id && (
                            <>
                              <button
                                onClick={() => toggleUserAdmin(u.id)}
                                disabled={actionLoading[u.id]}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  u.is_admin
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                } disabled:opacity-50`}
                              >
                                {actionLoading[u.id] ? "..." : u.is_admin ? "Remove Admin" : "Make Admin"}
                              </button>
                              <button
                                onClick={() => toggleUserActive(u.id)}
                                disabled={actionLoading[u.id]}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  u.is_active
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                } disabled:opacity-50`}
                              >
                                {actionLoading[u.id] ? "..." : u.is_active ? "Deactivate" : "Activate"}
                              </button>
                            </>
                          )}
                          {u.id === user.id && <span className="text-gray-400 text-xs">Current User</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-400">No users found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
