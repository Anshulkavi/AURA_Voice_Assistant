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

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Hero from './components/Hero';
// import Features from './components/Features';
// import UseCases from './components/UseCases';
// import HowItWorks from './components/HowItWorks';
// import Download from './components/Download';
// import Chatbot from './components/Chatbot';
// import { useLocation } from 'react-router-dom'; // or 'next/router' for Next.js

// function Layout({ children }) {
//   const location = useLocation(); // get current path

//   const hideFooterRoutes = ['/chatbot']; // Add more routes if needed

//   return (
//     <>
//       <Header />
//       <main>{children}</main>
//       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
//     </>
//   );
// }

// function HomePage() {
//   return (
//     <>
//       <Header />
//       <main className="mt-16 flex-1">
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

// function ChatbotPage() {
//   return (
//     <>
//       <Header />
//       <main className="mt-16 flex-1">
//         <Chatbot />
//       </main>
//       <Footer />
//     </>
//   );
// }

// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/chatbot" element={<ChatbotPage />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import HowItWorks from "./components/HowItWorks";
import Download from "./components/Download";
import Chatbot from "./components/Chatbot";

// ✅ Layout component that conditionally hides footer
function Layout({ children }) {
  const location = useLocation();
  const hideFooterRoutes = ['/chatbot'];
  const isChatbot = location.pathname === '/chatbot';

  return (
    <div className={`flex flex-col ${isChatbot ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Header />
      <main className={`flex-1 ${isChatbot ? 'overflow-hidden pt-16' : 'pt-16'}`}>
        {children}
      </main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}


// ✅ Home page content
function HomePageContent() {
  return (
    <>
      <Hero />
      <Features />
      <UseCases />
      <HowItWorks />
      <Download />
    </>
  );
}

// ✅ Chatbot page content
function ChatbotPageContent() {
  return <Chatbot />;
}

// ✅ App
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HomePageContent />
              </Layout>
            }
          />
          <Route
            path="/chatbot"
            element={
              <Layout>
                <ChatbotPageContent />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
