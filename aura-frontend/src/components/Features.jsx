// components/Features.jsx
export default function Features() {
  return (
    <section id="features" className="px-6 py-16 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-12">Unleash the Power of AURA+</h2>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-microphone-alt text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Advanced Voice Recognition</h3>
          <p>Unparalleled accuracy in transcribing spoken words, adapting to various accents and dialects for seamless communication.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-brain text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Natural Language Understanding</h3>
          <p>Sophisticated AI that comprehends context and meaning, enabling more intuitive and conversational interactions.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-sliders-h text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Customizable Commands</h3>
          <p>Tailor AURA+ to your needs with personalized voice commands, streamlining your daily tasks effortlessly.</p>
        </div>
      </div>
    </section>
  );
}