// // components/Features.jsx
// export default function Features() {
//   return (
//     <section id="features" className="px-6 py-16 bg-gray-900 text-white">
//       <h2 className="text-3xl font-bold text-center mb-12">Unleash the Power of AURA+</h2>
//       <div className="grid md:grid-cols-3 gap-10">
//         <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
//           <i className="fas fa-microphone-alt text-purple-400 text-3xl mb-4"></i>
//           <h3 className="text-xl font-semibold mb-2">Advanced Voice Recognition</h3>
//           <p>Unparalleled accuracy in transcribing spoken words, adapting to various accents and dialects for seamless communication.</p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
//           <i className="fas fa-brain text-purple-400 text-3xl mb-4"></i>
//           <h3 className="text-xl font-semibold mb-2">Natural Language Understanding</h3>
//           <p>Sophisticated AI that comprehends context and meaning, enabling more intuitive and conversational interactions.</p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
//           <i className="fas fa-sliders-h text-purple-400 text-3xl mb-4"></i>
//           <h3 className="text-xl font-semibold mb-2">Customizable Commands</h3>
//           <p>Tailor AURA+ to your needs with personalized voice commands, streamlining your daily tasks effortlessly.</p>
//         </div>
//       </div>
//     </section>
//   );
// }

import { Mic, Brain, Settings, Shield, Zap, Globe } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Mic,
      title: "Advanced Voice Recognition",
      description: "State-of-the-art speech recognition with 99.9% accuracy across multiple languages and accents.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "Natural Language Understanding",
      description: "Sophisticated AI that comprehends context, nuance, and intent for truly natural conversations.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Settings,
      title: "Customizable Commands",
      description: "Personalize your experience with custom voice commands and automated workflows.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "End-to-end encryption and local processing ensure your data stays private and secure.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time processing with sub-second response times for seamless interactions.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Multi-Platform",
      description: "Available across all your devices with seamless synchronization and continuity.",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Everyone</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the capabilities that make AURA+ the most advanced AI assistant available today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={28} className="text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}