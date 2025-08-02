// "use client"

// import { useState } from "react"
// import { Link, useNavigate, useLocation } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const from = location.state?.from?.pathname || "/chatbot"

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

//     const result = await login(formData.username, formData.password)

//     if (result.success) {
//       navigate(from, { replace: true })
//     } else {
//       setError(result.error)
//     }

//     setLoading(false)
//   }

//   return (
//     <div className="w-full max-w-md">
//       <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//           <p className="text-blue-200">Sign in to your AURA+ account</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
//             <p className="text-red-200 text-sm">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-blue-200 mb-2">
//               Username or Email
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Enter your username or email"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Signing In..." : "Sign In"}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-blue-200">
//             Don't have an account?{" "}
//             <Link
//               to="/register"
//               className="text-blue-300 hover:text-white font-semibold transition-colors duration-200"
//             >
//               Sign up
//             </Link>
//           </p>
//         </div>

//         <div className="mt-6 text-center">
//           <Link to="/" className="text-blue-300 hover:text-white text-sm transition-colors duration-200">
//             ← Back to Home
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginForm

// "use client"

// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
// import { useAuth } from "../../contexts/AuthContext"

// function LoginForm() {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     })
//     // Clear error when user starts typing
//     if (error) setError("")
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     const result = await login(formData)

//     if (result.success) {
//       navigate("/chatbot")
//     } else {
//       setError(result.error)
//     }

//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center space-x-3 mb-4">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-xl">A+</span>
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">AURA+</h1>
//               <p className="text-white/60">AI Voice Assistant</p>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
//           <p className="text-white/70">Sign in to continue your AI conversations</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
//               <div className="flex items-center space-x-2 text-red-400">
//                 <AlertCircle className="w-5 h-5" />
//                 <span className="text-sm">{error}</span>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username/Email Field */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
//                 Username or Email
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
//                 placeholder="Enter your username or email"
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 pr-12 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
//             >
//               {isLoading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <>
//                   <LogIn className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Register Link */}
//           <div className="mt-6 text-center">
//             <p className="text-white/60">
//               Don't have an account?{" "}
//               <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
//                 Sign up here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginForm

"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/chatbot"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(formData.username, formData.password)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">A+</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AURA+</h1>
              <p className="text-white/60">AI Voice Assistant</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/70">Sign in to continue your AI conversations</p>
        </div>

        {/* Login Card */}
        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter your username or email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-white/60">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign up here
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
