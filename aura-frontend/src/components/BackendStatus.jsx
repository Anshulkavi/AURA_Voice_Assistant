// "use client"

// import { useState } from "react"
// import { AlertCircle, CheckCircle, RefreshCw, Play } from "lucide-react"

// function BackendStatus({ backendStatus, onRetry }) {
//   const [showDetails, setShowDetails] = useState(false)
//   const [isRetrying, setIsRetrying] = useState(false)

//   // Provide default values to prevent undefined errors
//   const status = backendStatus || {
//     running: false,
//     checked: false,
//     checking: false,
//     error: null,
//   }

//   const handleRetry = async () => {
//     setIsRetrying(true)
//     try {
//       await onRetry()
//     } catch (error) {
//       console.error("Retry failed:", error)
//     } finally {
//       setIsRetrying(false)
//     }
//   }

//   // Show loading state while checking
//   if (status.checking && !status.checked) {
//     return (
//       <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
//         <div className="flex items-center space-x-2">
//           <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
//           <span className="text-blue-400">Checking Flask backend status...</span>
//         </div>
//       </div>
//     )
//   }

//   // Show success state if backend is running
//   if (status.running) {
//     return (
//       <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <CheckCircle className="w-5 h-5 text-green-400" />
//             <span className="text-green-400">Flask backend is running</span>
//           </div>
//           <button
//             onClick={handleRetry}
//             disabled={isRetrying}
//             className="text-green-400 hover:text-green-300 text-sm underline disabled:opacity-50"
//           >
//             {isRetrying ? "Checking..." : "Recheck"}
//           </button>
//         </div>
//       </div>
//     )
//   }

//   // Show error state if backend is not running
//   return (
//     <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <AlertCircle className="w-5 h-5 text-red-400" />
//           <span className="text-red-400">Flask backend not running</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowDetails(!showDetails)}
//             className="text-red-400 hover:text-red-300 text-sm underline"
//           >
//             {showDetails ? "Hide" : "Show"} Help
//           </button>
//           <button
//             onClick={handleRetry}
//             disabled={isRetrying}
//             className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
//             <span>{isRetrying ? "Checking..." : "Retry"}</span>
//           </button>
//         </div>
//       </div>

//       {showDetails && (
//         <div className="mt-4 space-y-4">
//           {/* Quick Start Instructions */}
//           <div className="bg-black/20 rounded-lg p-4">
//             <div className="flex items-center space-x-2 mb-3">
//               <Play className="w-5 h-5 text-green-400" />
//               <span className="text-green-400 font-medium">Quick Start Flask Backend:</span>
//             </div>
//             <div className="space-y-2">
//               <div className="bg-black/40 rounded p-3 font-mono text-sm">
//                 <div className="text-gray-300 mb-1"># Open terminal and run:</div>
//                 <div className="text-green-400">python app.py</div>
//               </div>
//               <div className="text-white/70 text-sm">
//                 Wait for: <span className="text-green-400 font-mono">"Running on http://127.0.0.1:5000"</span>
//               </div>
//             </div>
//           </div>

//           {/* Error Details */}
//           {status.error && (
//             <div className="bg-black/20 rounded-lg p-3">
//               <div className="text-red-400 font-medium mb-2">Error Details:</div>
//               <div className="text-white/70 text-sm font-mono bg-black/40 p-2 rounded">{status.error}</div>

//               {status.isFlaskMissing && (
//                 <div className="mt-2 text-yellow-400 text-sm">
//                   ⚠️ The React app is responding instead of Flask - this means Flask is definitely not running.
//                 </div>
//               )}

//               {status.isTimeout && (
//                 <div className="mt-2 text-yellow-400 text-sm">
//                   ⏱️ Connection timed out - Flask is likely not started.
//                 </div>
//               )}

//               {status.isConnectionError && (
//                 <div className="mt-2 text-yellow-400 text-sm">
//                   🔌 Cannot connect to port 5000 - Flask server is not running.
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Troubleshooting Steps */}
//           <div className="bg-black/20 rounded-lg p-3">
//             <div className="text-blue-400 font-medium mb-2">Troubleshooting Steps:</div>
//             <div className="text-white/70 text-sm space-y-2">
//               <div className="flex items-start space-x-2">
//                 <span className="text-blue-400 font-bold">1.</span>
//                 <div>
//                   <div>Check if Python is installed:</div>
//                   <code className="bg-black/40 px-2 py-1 rounded text-xs">python --version</code>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <span className="text-blue-400 font-bold">2.</span>
//                 <div>
//                   <div>Install dependencies:</div>
//                   <code className="bg-black/40 px-2 py-1 rounded text-xs">pip install -r requirements.txt</code>
//                 </div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <span className="text-blue-400 font-bold">3.</span>
//                 <div>Check if app.py exists in your project directory</div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <span className="text-blue-400 font-bold">4.</span>
//                 <div>Verify environment variables (.env file with API keys)</div>
//               </div>
//               <div className="flex items-start space-x-2">
//                 <span className="text-blue-400 font-bold">5.</span>
//                 <div>
//                   <div>Check if port 5000 is free:</div>
//                   <code className="bg-black/40 px-2 py-1 rounded text-xs">lsof -i :5000</code>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Expected Output */}
//           <div className="bg-black/20 rounded-lg p-3">
//             <div className="text-green-400 font-medium mb-2">Expected Flask Startup Output:</div>
//             <div className="bg-black/40 rounded p-2 font-mono text-xs text-green-400">
//               🚀 Starting server on port 5000
//               <br />✅ Firebase initialized
//               <br />✅ Gemini AI configured
//               <br />* Running on http://127.0.0.1:5000
//               <br />* Debug mode: True
//             </div>
//           </div>

//           {/* Response Preview */}
//           {status.responsePreview && (
//             <div className="bg-black/20 rounded-lg p-3">
//               <div className="text-yellow-400 font-medium mb-2">What we're getting instead:</div>
//               <div className="bg-black/40 rounded p-2 font-mono text-xs text-white/60 max-h-20 overflow-y-auto">
//                 {status.responsePreview}...
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default BackendStatus

"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, RefreshCw, Play } from "lucide-react"

function BackendStatus() {
  const [status, setStatus] = useState({
    running: false,
    checked: false,
    checking: true,
    error: null,
    details: null,
    responsePreview: null,
  })

  const fetchHealth = async () => {
    setStatus((prev) => ({ ...prev, checking: true }))
    try {
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
      const res = await fetch(`${backendUrl}/health`)
      const data = await res.json()
      setStatus({
        running: data.status === "healthy",
        checked: true,
        checking: false,
        error: null,
        details: data,
        responsePreview: null,
      })
    } catch (err) {
      setStatus({
        running: false,
        checked: true,
        checking: false,
        error: err.message || "Unknown error",
        details: null,
        responsePreview: null,
      })
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  // --- Loading state ---
  if (status.checking && !status.checked) {
    return (
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-blue-400">Checking Flask backend status...</span>
        </div>
      </div>
    )
  }

  // --- Healthy backend ---
  if (status.running) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Flask backend is running</span>
          </div>
          <button
            onClick={fetchHealth}
            className="text-green-400 hover:text-green-300 text-sm underline"
          >
            Recheck
          </button>
        </div>

        {status.details && (
          <div className="mt-3 space-y-1 text-sm text-gray-300">
            <div>🌍 Environment: {status.details.environment}</div>
            <div>🔥 Firebase: {status.details.firebase_connected ? "Connected ✅" : "❌"}</div>
            <div>🤖 Gemini: {status.details.gemini_connected ? "Connected ✅" : "❌"}</div>
          </div>
        )}
      </div>
    )
  }

  // --- Error / Not running ---
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">Flask backend not running</span>
        </div>
        <button
          onClick={fetchHealth}
          className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {/* Quick Start Instructions */}
        <div className="bg-black/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Play className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Quick Start Flask Backend:</span>
          </div>
          <div className="space-y-2">
            <div className="bg-black/40 rounded p-3 font-mono text-sm">
              <div className="text-gray-300 mb-1"># Open terminal and run:</div>
              <div className="text-green-400">python server.py</div>
            </div>
            <div className="text-white/70 text-sm">
              Wait for: <span className="text-green-400 font-mono">"Running on http://127.0.0.1:5000"</span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        {status.error && (
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-red-400 font-medium mb-2">Error Details:</div>
            <div className="text-white/70 text-sm font-mono bg-black/40 p-2 rounded">
              {status.error}
            </div>
          </div>
        )}

        {/* Troubleshooting Steps */}
        <div className="bg-black/20 rounded-lg p-3">
          <div className="text-blue-400 font-medium mb-2">Troubleshooting Steps:</div>
          <div className="text-white/70 text-sm space-y-2">
            <div>✅ Check if Python is installed: <code className="bg-black/40 px-2 py-1 rounded text-xs">python --version</code></div>
            <div>✅ Install dependencies: <code className="bg-black/40 px-2 py-1 rounded text-xs">pip install -r requirements.txt</code></div>
            <div>✅ Make sure <code className="bg-black/40 px-2 py-1 rounded text-xs">server.py</code> exists</div>
            <div>✅ Verify environment variables (.env with API keys)</div>
            <div>✅ Check port 5000 availability</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackendStatus
