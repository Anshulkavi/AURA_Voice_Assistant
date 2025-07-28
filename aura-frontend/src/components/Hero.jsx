// components/Hero.jsx
import {Link} from 'react-router-dom';
export default function Hero() {

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 py-20 bg-black text-white">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-purple-400">Welcome to the Future of AI Assistance</h1>
        <p className="text-lg md:text-xl text-gray-300">Experience AURA+: The cutting-edge voice recognition AI that revolutionizes your daily interactions with technology.</p>
         <Link
          to="/chatbot"
          className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition"
          //target="_blank" // Optional: opens in a new tab
          rel="noopener noreferrer"
        >
          <span>Try AURA+</span>
          <i className="fas fa-chevron-right ml-2"></i>
        </Link>
      </div>
      <div className="mt-10 md:mt-0 md:ml-10 relative w-72 h-72 bg-purple-500 rounded-full animate-pulse shadow-lg"></div>
    </section>
  );
}