import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import Download from './components/Download';
import Footer from './components/Footer';
import Header from './components/Header';
import Chatbot from './components/Chatbot';

function HomePage() {
  return (
    <>
      <Header />
      <main className="relative z-10">
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

export default function App() {
  return (
    <div>
      

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Router>
    </div>
  );
}