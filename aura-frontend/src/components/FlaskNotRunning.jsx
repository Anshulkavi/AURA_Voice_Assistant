"use client"

import { useState } from "react"
import { AlertTriangle, Play, RefreshCw, Terminal, CheckCircle, ExternalLink } from "lucide-react"

function FlaskNotRunning({ onRetry, isRetrying }) {
  const [showDetailedSteps, setShowDetailedSteps] = useState(false)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main Alert */}
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h2 className="text-xl font-bold text-red-400">Flask Backend Not Running</h2>
            <p className="text-red-300 text-sm">Your React app is working, but the Flask server needs to be started</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Checking..." : "Retry Connection"}</span>
          </button>

          <button
            onClick={() => setShowDetailedSteps(!showDetailedSteps)}
            className="text-red-400 hover:text-red-300 text-sm underline"
          >
            {showDetailedSteps ? "Hide" : "Show"} Detailed Steps
          </button>
        </div>
      </div>

      {/* Quick Start Instructions */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Play className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-green-400">Quick Start Flask Backend</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-black/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">Open terminal and run:</span>
            </div>
            <div className="bg-black/50 rounded-lg p-3 font-mono text-green-400 text-lg">python app.py</div>
          </div>

          <div className="bg-black/30 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Wait for this message:</span>
            </div>
            <div className="bg-black/50 rounded-lg p-3 font-mono text-sm text-green-400">
              🚀 Starting server on port 5000
              <br />✅ Firebase initialized
              <br />✅ Gemini AI configured
              <br />* Running on http://127.0.0.1:5000
            </div>
          </div>

          <div className="text-center">
            <div className="text-white/70 text-sm mb-2">Then click:</div>
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl hover:bg-green-500/30 transition-all font-medium disabled:opacity-50"
            >
              {isRetrying ? "Checking..." : "🔄 Retry Connection"}
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Troubleshooting */}
      {showDetailedSteps && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Detailed Troubleshooting</h3>

          <div className="space-y-4">
            <div className="bg-black/20 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">1️⃣ Check if you're in the right directory</h4>
              <div className="text-white/70 text-sm space-y-1">
                <div>
                  • Make sure you can see <code className="bg-black/40 px-1 rounded">app.py</code> file
                </div>
                <div>
                  • Run: <code className="bg-black/40 px-1 rounded">ls</code> (Mac/Linux) or{" "}
                  <code className="bg-black/40 px-1 rounded">dir</code> (Windows)
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">2️⃣ Install Python dependencies</h4>
              <div className="text-white/70 text-sm space-y-1">
                <div>
                  • Run: <code className="bg-black/40 px-1 rounded">pip install -r requirements.txt</code>
                </div>
                <div>
                  • Or: <code className="bg-black/40 px-1 rounded">python -m pip install -r requirements.txt</code>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">3️⃣ Check environment variables</h4>
              <div className="text-white/70 text-sm space-y-1">
                <div>
                  • Make sure you have a <code className="bg-black/40 px-1 rounded">.env</code> file
                </div>
                <div>• It should contain your API keys (GEMINI_API_KEY, etc.)</div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">4️⃣ Check if port 5000 is free</h4>
              <div className="text-white/70 text-sm space-y-1">
                <div>
                  • Mac/Linux: <code className="bg-black/40 px-1 rounded">lsof -i :5000</code>
                </div>
                <div>
                  • Windows: <code className="bg-black/40 px-1 rounded">netstat -an | findstr :5000</code>
                </div>
                <div>• If something is using port 5000, kill it or use a different port</div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <h4 className="font-medium text-white mb-2">5️⃣ Common Flask startup errors</h4>
              <div className="text-white/70 text-sm space-y-1">
                <div>
                  • <strong>ModuleNotFoundError:</strong> Run{" "}
                  <code className="bg-black/40 px-1 rounded">pip install [missing-module]</code>
                </div>
                <div>
                  • <strong>Port already in use:</strong> Kill the process or change port
                </div>
                <div>
                  • <strong>Environment variables missing:</strong> Check your .env file
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <ExternalLink className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Still having issues?</span>
            </div>
            <div className="text-white/70 text-sm">
              Check the terminal where you ran <code className="bg-black/40 px-1 rounded">python app.py</code> for error
              messages. The error messages will tell you exactly what's wrong.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlaskNotRunning
