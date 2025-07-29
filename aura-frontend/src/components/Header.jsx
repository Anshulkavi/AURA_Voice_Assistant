// export default function Header() {
//   return (
//     <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md sticky top-0 z-50">
//       <div className="flex items-center space-x-3">
//         <img
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-11-02%20at%2019.54.34-diOqMEnj7Ys4fyNcliWGp5om5ZGSh3.jpeg"
//           alt="AURA+ Logo"
//           className="h-10 w-10 rounded-full object-cover"
//         />
//         <span className="text-xl font-semibold">AURA+</span>
//       </div>
//       <nav className="hidden md:flex space-x-6">
//         <a href="#features" className="hover:text-purple-400 transition">Features</a>
//         <a href="#use-cases" className="hover:text-purple-400 transition">Use Cases</a>
//         <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
//         <a href="#download" className="hover:text-purple-400 transition">Download</a>
//       </nav>
//       <div className="space-x-4">
//         <button className="bg-transparent border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition">Login</button>
//         <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition">Sign up</button>
//       </div>
//     </header>
//   );
// }


// components/Header.jsx
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AURA+
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
              Features
            </a>
            <a href="#use-cases" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
              Use Cases
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
              How It Works
            </a>
            <a href="#download" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
              Download
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-4 py-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors">
              Login
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
                Features
              </a>
              <a href="#use-cases" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
                Use Cases
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
                How It Works
              </a>
              <a href="#download" className="text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors font-medium">
                Download
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button className="text-left px-4 py-2 text-purple-600 dark:text-purple-400 font-medium">
                  Login
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
