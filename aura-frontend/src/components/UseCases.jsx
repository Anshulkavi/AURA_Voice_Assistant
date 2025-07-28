// components/UseCases.jsx
export default function UseCases() {
  return (
    <section id="use-cases" className="px-6 py-16 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-12">AURA+ in Action</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-tasks text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Everyday Productivity</h3>
          <p>Manage schedules, set reminders, send messages, and make calls hands-free, perfect for multitasking professionals.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
          <i className="fas fa-universal-access text-purple-400 text-3xl mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Accessibility Champion</h3>
          <p>Empower users with disabilities through voice-activated technology, making digital interaction more inclusive and effortless.</p>
        </div>
      </div>
    </section>
  );
}
