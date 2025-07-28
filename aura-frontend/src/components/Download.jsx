// components/Download.jsx
export default function Download() {
  return (
    <section id="download" className="px-6 py-16 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-8">Get AURA+ Now</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        <a href="#" className="flex items-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          <i className="fab fa-apple text-2xl"></i>
          <span>Download for iOS</span>
        </a>
        <a href="#" className="flex items-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          <i className="fab fa-android text-2xl"></i>
          <span>Download for Android</span>
        </a>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Quick Setup</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Download AURA+ from your device's app store</li>
          <li>Open the app and create your personalized account</li>
          <li>Follow the intuitive setup wizard to customize your experience</li>
          <li>Start talking to AURA+ and experience the future of AI assistance!</li>
        </ol>
      </div>
    </section>
  );
}
