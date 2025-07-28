export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-11-02%20at%2019.54.34-diOqMEnj7Ys4fyNcliWGp5om5ZGSh3.jpeg"
          alt="AURA+ Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="text-xl font-semibold">AURA+</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="#features" className="hover:text-purple-400 transition">Features</a>
        <a href="#use-cases" className="hover:text-purple-400 transition">Use Cases</a>
        <a href="#how-it-works" className="hover:text-purple-400 transition">How It Works</a>
        <a href="#download" className="hover:text-purple-400 transition">Download</a>
      </nav>
      <div className="space-x-4">
        <button className="bg-transparent border border-purple-500 text-purple-500 px-4 py-2 rounded hover:bg-purple-500 hover:text-white transition">Login</button>
        <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition">Sign up</button>
      </div>
    </header>
  );
}