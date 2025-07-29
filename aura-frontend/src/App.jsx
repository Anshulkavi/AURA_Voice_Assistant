// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Hero from './components/Hero';
// import Features from './components/Features';
// import UseCases from './components/UseCases';
// import HowItWorks from './components/HowItWorks';
// import Download from './components/Download';
// import Footer from './components/Footer';
// import Header from './components/Header';
// import Chatbot from './components/Chatbot';

// function HomePage() {
//   return (
//     <>
//       <Header />
//       <main className="relative z-10 mt-16 flex-1">
//         <Hero />
//         <Features />
//         <UseCases />
//         <HowItWorks />
//         <Download />
//       </main>
//       <Footer />
//     </>
//   );
// }


// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">

    
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/chatbot" element={<Chatbot />} />
//         </Routes>
//       </Router>
//     </div>
    
//   );
// }

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import Download from './components/Download';
import Chatbot from './components/Chatbot';

function HomePage() {
  return (
    <>
      <Header />
      <main className="mt-16 flex-1">
        <Hero />
        <Features />
        <UseCases />
        <HowItWorks />
        <Download />
      </main>
      <Footer />
    </>
  );
}

function ChatbotPage() {
  return (
    <>
      <Header />
      <main className="mt-16 flex-1">
        <Chatbot />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </Router>
    </div>
  );
}
