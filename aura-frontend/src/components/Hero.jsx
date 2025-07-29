// // components/Hero.jsx
// import {Link} from 'react-router-dom';
// export default function Hero() {

//   return (
//     <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 bg-black text-white">
//       <div className="max-w-2xl space-y-6">
//         <h1 className="text-4xl md:text-6xl font-bold text-purple-400">Welcome to the Future of AI Assistance</h1>
//         <p className="text-lg md:text-xl text-gray-300">Experience AURA+: The cutting-edge voice recognition AI that revolutionizes your daily interactions with technology.</p>
//          <Link
//           to="/chatbot"
//           className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
//           //target="_blank" // Optional: opens in a new tab
//           rel="noopener noreferrer"
//         >
//           <span>Try AURA+</span>
//           <i className="fas fa-chevron-right ml-2"></i>
//         </Link>
//       </div>
//       <div className="mt-10 md:mt-0 md:ml-10 relative w-72 h-72 bg-purple-500 rounded-full animate-pulse shadow-lg"></div>
//     </section>
//   );
// }

import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Zap, Brain } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300">
              <Sparkles size={16} className="mr-2" />
              Introducing the Future of AI
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">Meet </span>
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                AURA+
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience the next generation of AI assistance with advanced voice recognition, 
              natural language understanding, and personalized interactions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
            <Link
                to="/chatbot"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Try AURA+ Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold text-lg hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300">
                <Play size={20} className="mr-2" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">10M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-2xl animate-pulse">
                <div className="absolute inset-4 bg-white/20 rounded-full backdrop-blur-lg flex items-center justify-center">
                  <div className="text-6xl text-white">🤖</div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Brain size={24} className="text-white" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
                <Zap size={24} className="text-white" />
              </div>
              
              <div className="absolute top-1/2 -right-8 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-2000">
                <Sparkles size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}