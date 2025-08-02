// "use client"

// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useAuth } from "../../contexts/AuthContext"

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     full_name: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const { register } = useAuth()
//   const navigate = useNavigate()

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

//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       setLoading(false)
//       return
//     }

//     // Validate password length
//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters long")
//       setLoading(false)
//       return
//     }

//     const { confirmPassword, ...registrationData } = formData
//     const result = await register(registrationData)

//     if (result.success) {
//       navigate("/chatbot")
//     } else {
//       setError(result.error)
//     }

//     setLoading(false)
//   }

//   return (
//     <div className="w-full max-w-md">
//       <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">Join AURA+</h2>
//           <p className="text-blue-200">Create your account to get started</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
//             <p className="text-red-200 text-sm">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="full_name" className="block text-sm font-medium text-blue-200 mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="full_name"
//               name="full_name"
//               value={formData.full_name}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Enter your full name"
//             />
//           </div>

//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-blue-200 mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Choose a username"
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Enter your email"
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
//               placeholder="Create a password"
//             />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200 mb-2">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
//               placeholder="Confirm your password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-blue-200">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-300 hover:text-white font-semibold transition-colors duration-200">
//               Sign in
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

// export default RegisterForm

"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear messages when user starts typing
    if (error) setError("")
    if (success) setSuccess("")
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long")
      return false
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    const { confirmPassword, ...registrationData } = formData
    const result = await register(registrationData)

    if (result.success) {
      setSuccess("Registration successful! Redirecting to chatbot...")
      setTimeout(() => {
        navigate("/chatbot")
      }, 2000)
    } else {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 px-4 py-8">
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
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/70">Join AURA+ and start your AI conversations</p>
        </div>

        {/* Registration Form */}
        {/* <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{success}</span>
              </div>
            </div>
          )} */}

          {/* <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            {/* <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter your full name"
              />
            </div> */}

            {/* Username Field */}
            {/* <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Choose a username"
              />
            </div> */}

            {/* Email Field */}
            {/* <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="Enter your email address"
              />
            </div> */}

            {/* Password Field */}
            {/* <div>
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
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div> */}

            {/* Confirm Password Field */}
            {/* <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-black/20 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div> */}

            {/* Submit Button */}
            {/* <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form> */}

          {/* Login Link */}
          {/* <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div> */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl w-full max-w-md">
  {error && (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center space-x-2">
      <AlertCircle className="w-4 h-4" />
      <span>{error}</span>
    </div>
  )}
  {success && (
    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center space-x-2">
      <CheckCircle className="w-4 h-4" />
      <span>{success}</span>
    </div>
  )}

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Full Name */}
    <div>
      <label htmlFor="full_name" className="block text-sm text-white/80 mb-1">Full Name</label>
      <input
        type="text"
        id="full_name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        required
        className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-md text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-blue-500/50"
        placeholder="Enter your full name"
      />
    </div>

    {/* Username */}
    <div>
      <label htmlFor="username" className="block text-sm text-white/80 mb-1">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-md text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-blue-500/50"
        placeholder="Choose a username"
      />
    </div>

    {/* Email */}
    <div>
      <label htmlFor="email" className="block text-sm text-white/80 mb-1">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full px-3 py-2.5 bg-black/20 border border-white/20 rounded-md text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-blue-500/50"
        placeholder="Enter your email address"
      />
    </div>

    {/* Password */}
    <div>
      <label htmlFor="password" className="block text-sm text-white/80 mb-1">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 pr-10 bg-black/20 border border-white/20 rounded-md text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-blue-500/50"
          placeholder="Create a password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    {/* Confirm Password */}
    <div>
      <label htmlFor="confirmPassword" className="block text-sm text-white/80 mb-1">Confirm Password</label>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-3 py-2.5 pr-10 bg-black/20 border border-white/20 rounded-md text-white text-sm placeholder-white/50 focus:ring-2 focus:ring-blue-500/50"
          placeholder="Confirm your password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
        >
          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-md hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Create Account</span>
        </>
      )}
    </button>
  </form>

  <div className="mt-4 text-center text-sm text-white/60">
    Already have an account?{" "}
    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
  </div>
</div>

        </div>
      </div>

  )
}

export default RegisterForm
