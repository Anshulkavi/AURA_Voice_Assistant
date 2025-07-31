

// // import {
// //   BrowserRouter as Router,
// //   Routes,
// //   Route,
// //   useLocation,
// // } from "react-router-dom";
// // import Header from "./components/Header";
// // import Footer from "./components/Footer";
// // import Hero from "./components/Hero";
// // import Features from "./components/Features";
// // import UseCases from "./components/UseCases";
// // import HowItWorks from "./components/HowItWorks";
// // import Download from "./components/Download";
// // import Chatbot from "./components/Chatbot";

// // // ✅ Layout component that conditionally hides footer
// // function Layout({ children }) {
// //   const location = useLocation();
// //   const hideFooterRoutes = ['/chatbot'];
// //   const isChatbot = location.pathname === '/chatbot';

// //   return (
// //     <div className={`flex flex-col ${isChatbot ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
// //       <Header />
// //       <main className={`flex-1 ${isChatbot ? 'overflow-hidden pt-16' : 'pt-16'}`}>
// //         {children}
// //       </main>
// //       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
// //     </div>
// //   );
// // }


// // // ✅ Home page content
// // function HomePageContent() {
// //   return (
// //     <>
// //       <Hero />
// //       <Features />
// //       <UseCases />
// //       <HowItWorks />
// //       <Download />
// //     </>
// //   );
// // }

// // // ✅ Chatbot page content
// // function ChatbotPageContent() {
// //   return <Chatbot />;
// // }

// // // ✅ App
// // export default function App() {
// //   return (
// //     <div className="min-h-screen flex flex-col">
// //       <Router>
// //         <Routes>
// //           <Route
// //             path="/"
// //             element={
// //               <Layout>
// //                 <HomePageContent />
// //               </Layout>
// //             }
// //           />
// //           <Route
// //             path="/chatbot"
// //             element={
// //               <Layout>
// //                 <ChatbotPageContent />
// //               </Layout>
// //             }
// //           />
// //         </Routes>
// //       </Router>
// //     </div>
// //   );
// // }

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Hero from "./components/Hero";
// import Features from "./components/Features";
// import UseCases from "./components/UseCases";
// import HowItWorks from "./components/HowItWorks";
// import Download from "./components/Download";
// import Chatbot from "./components/Chatbot";

// // Layout component that conditionally handles header/footer
// function Layout({ children }) {
//   const location = useLocation();
//   const isChatbot = location.pathname === '/chatbot';
//   const hideFooterRoutes = ['/chatbot'];

//   if (isChatbot) {
//     // For chatbot page, no header/footer, full height
//     return (
//       <div className="h-screen overflow-hidden">
//         {children}
//       </div>
//     );
//   }

//   // For other pages, normal layout with header/footer
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 pt-16">
//         {children}
//       </main>
//       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
//     </div>
//   );
// }

// // Home page content
// function HomePageContent() {
//   return (
//     <>
//       <Hero />
//       <Features />
//       <UseCases />
//       <HowItWorks />
//       <Download />
//     </>
//   );
// }

// // Chatbot page content (no extra wrapper needed)
// function ChatbotPageContent() {
//   return <Chatbot />;
// }

// // Main App component
// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Layout>
//               <HomePageContent />
//             </Layout>
//           }
//         />
//         <Route
//           path="/chatbot"
//           element={
//             <Layout>
//               <ChatbotPageContent />
//             </Layout>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import HowItWorks from "./components/HowItWorks";
import Download from "./components/Download";
import Chatbot from "./components/Chatbot";

// Layout component that conditionally handles header/footer
function Layout({ children }) {
  const location = useLocation();
  const isChatbot = location.pathname === '/chatbot';
  const hideFooterRoutes = ['/chatbot'];

  if (isChatbot) {
    // For chatbot page, no header/footer, full height
    return (
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    );
  }

  // For other pages, normal layout with header/footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

// Home page content
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

// Chatbot page content (no extra wrapper needed)
function ChatbotPageContent() {
  return <Chatbot />;
}

// 404 Not Found component
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <div className="space-x-4">
        <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
          Go Home
        </a>
        <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
          Go to Chatbot
        </a>
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  return (
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
        {/* Catch all other routes and redirect to home or show 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
}