// components/HowItWorks.jsx
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-16 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center mb-12">The Science Behind AURA+</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-cogs text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Cutting-Edge AI</h3>
          <p>AURA+ harnesses advanced machine learning algorithms to continuously evolve, learning from each interaction to provide smarter, more personalized assistance.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-shield-alt text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Ironclad Privacy</h3>
          <p>Your data is sacred. AURA+ employs state-of-the-art encryption and stringent data management practices, ensuring your personal information remains confidential and secure.</p>
        </div>
      </div>
    </section>
  );
}