import { AlertCircle, RefreshCw, Play, Terminal } from "lucide-react";

function FlaskNotRunning({ onRetry, isRetrying, backendStatus }) {
  return (
    <div className="flex h-full items-center justify-center p-4 text-white">
      <div className="max-w-2xl w-full">
        {/* Main Error Card */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <span className="text-xl text-red-400 font-semibold">Flask Backend Not Running</span>
            </div>
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
            </button>
          </div>

          {/* Error Details */}
          {backendStatus?.error && (
            <div className="bg-black/20 rounded-lg p-3 mb-4">
              <div className="text-red-400 font-medium mb-2">Connection Error:</div>
              <div className="text-white/70 text-sm font-mono bg-black/40 p-2 rounded">
                {backendStatus.error}
              </div>
            </div>
          )}
        </div>

        {/* Quick Start Instructions */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Play className="w-6 h-6 text-green-400" />
            <span className="text-xl text-green-400 font-semibold">Quick Start Guide</span>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-white font-medium mb-2">1. Start the Flask Backend</div>
              <div className="bg-black/40 rounded p-3 font-mono text-sm">
                <div className="text-gray-400 mb-1"># Open terminal in your project directory</div>
                <div className="text-green-400">python server.py</div>
              </div>
              <div className="text-white/70 text-sm mt-2">
                Wait for: <span className="text-green-400 font-mono">"Running on http://127.0.0.1:5000"</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-white font-medium mb-2">2. Environment Setup</div>
              <div className="text-white/70 text-sm space-y-2">
                <div>Create <code className="bg-black/40 px-2 py-1 rounded text-xs">.env</code> file in your React project:</div>
                <div className="bg-black/40 rounded p-3 font-mono text-sm">
                  <div className="text-green-400">VITE_BACKEND_URL=http://127.0.0.1:5000</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="text-white font-medium mb-2">3. Backend Dependencies</div>
              <div className="text-white/70 text-sm space-y-2">
                <div>Make sure you have installed all Python dependencies:</div>
                <div className="bg-black/40 rounded p-3 font-mono text-sm">
                  <div className="text-blue-400">pip install -r requirements.txt</div>
                </div>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-blue-400 font-medium mb-3">Troubleshooting Checklist:</div>
            <div className="text-white/70 text-sm space-y-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Check Python version: <code className="bg-black/40 px-2 py-1 rounded text-xs">python --version</code></span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Verify Flask installation: <code className="bg-black/40 px-2 py-1 rounded text-xs">pip show flask</code></span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Check if port 5000 is available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Ensure <code className="bg-black/40 px-2 py-1 rounded text-xs">server.py</code> exists in your project</span>
              </div>
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4" />
                <span>Verify your <code className="bg-black/40 px-2 py-1 rounded text-xs">.env</code> file has required API keys</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlaskNotRunning;