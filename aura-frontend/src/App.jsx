// // // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// // // import { AuthProvider } from "./contexts/AuthContext"
// // // import ProtectedRoute from "./components/auth/ProtectedRoute"
// // // import LoginForm from "./components/auth/LoginForm"
// // // import RegisterForm from "./components/auth/RegisterForm"
// // // import Navbar from "./components/navigation/Navbar"
// // // import ProfilePage from "./components/profile/ProfilePage"
// // // import AdminPanel from "./components/admin/AdminPanel"
// // // import Chatbot from "./components/Chatbot"
// // // import Header from "./components/Header"
// // // import Footer from "./components/Footer"
// // // import Hero from "./components/Hero"
// // // import Features from "./components/Features"
// // // import Pricing from "./components/Pricing"
// // // import Contact from "./components/Contact"
// // // import "./App.css"

// // // // Layout component for marketing pages
// // // const MarketingLayout = ({ children }) => (
// // //   <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
// // //     <Header />
// // //     <main>{children}</main>
// // //     <Footer />
// // //   </div>
// // // )

// // // // Layout component for authenticated app pages
// // // const AppLayout = ({ children }) => (
// // //   <div className="min-h-screen bg-gray-50">
// // //     <Navbar />
// // //     <main className="pt-16">{children}</main>
// // //   </div>
// // // )

// // // // Home page component
// // // const HomePage = () => (
// // //   <MarketingLayout>
// // //     <Hero />
// // //     <Features />
// // //     <Pricing />
// // //     <Contact />
// // //   </MarketingLayout>
// // // )

// // // // Auth layout for login/register pages
// // // const AuthLayout = ({ children }) => (
// // //   <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
// // //     {children}
// // //   </div>
// // // )

// // // function App() {
// // //   return (
// // //     <AuthProvider>
// // //       <Router>
// // //         <Routes>
// // //           {/* Public marketing routes */}
// // //           <Route path="/" element={<HomePage />} />

// // //           {/* Authentication routes */}
// // //           <Route
// // //             path="/login"
// // //             element={
// // //               <AuthLayout>
// // //                 <LoginForm />
// // //               </AuthLayout>
// // //             }
// // //           />
// // //           <Route
// // //             path="/register"
// // //             element={
// // //               <AuthLayout>
// // //                 <RegisterForm />
// // //               </AuthLayout>
// // //             }
// // //           />

// // //           {/* Protected app routes */}
// // //           <Route
// // //             path="/chatbot"
// // //             element={
// // //               <ProtectedRoute>
// // //                 <AppLayout>
// // //                   <Chatbot />
// // //                 </AppLayout>
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           <Route
// // //             path="/profile"
// // //             element={
// // //               <ProtectedRoute>
// // //                 <AppLayout>
// // //                   <ProfilePage />
// // //                 </AppLayout>
// // //               </ProtectedRoute>
// // //             }
// // //           />
// // //           <Route
// // //             path="/admin"
// // //             element={
// // //               <ProtectedRoute requireAdmin={true}>
// // //                 <AppLayout>
// // //                   <AdminPanel />
// // //                 </AppLayout>
// // //               </ProtectedRoute>
// // //             }
// // //           />

// // //           {/* Redirect unknown routes to home */}
// // //           <Route path="*" element={<Navigate to="/" replace />} />
// // //         </Routes>
// // //       </Router>
// // //     </AuthProvider>
// // //   )
// // // }

// // // export default App

// // import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
// // import { AuthProvider } from "./contexts/AuthContext"
// // import Header from "./components/Header"
// // import Footer from "./components/Footer"
// // import Hero from "./components/Hero"
// // import Features from "./components/Features"
// // import UseCases from "./components/UseCases"
// // import HowItWorks from "./components/HowItWorks"
// // import Download from "./components/Download"
// // import Chatbot from "./components/Chatbot"
// // import LoginForm from "./components/auth/LoginForm"
// // import RegisterForm from "./components/auth/RegisterForm"
// // import ProtectedRoute from "./components/auth/ProtectedRoute"
// // import ProfilePage from "./components/profile/ProfilePage"
// // import AdminPanel from "./components/admin/AdminPanel"
// // import Navbar from "./components/navigation/Navbar"

// // // Layout component that conditionally handles header/footer
// // function Layout({ children }) {
// //   const location = useLocation()
// //   const isChatbot = location.pathname === "/chatbot"
// //   const isProfile = location.pathname === "/profile"
// //   const isAdmin = location.pathname === "/admin"
// //   const isAuth = location.pathname === "/login" || location.pathname === "/register"
// //   const hideFooterRoutes = ["/chatbot", "/profile", "/admin"]

// //   // For auth pages, no header/footer, full height
// //   if (isAuth) {
// //     return <div className="h-screen overflow-hidden">{children}</div>
// //   }

// //   // For chatbot, profile, and admin pages, use Navbar instead of Header
// //   if (isChatbot || isProfile || isAdmin) {
// //     return (
// //       <div className="h-screen overflow-hidden flex flex-col">
// //         <Navbar />
// //         <main className="flex-1 overflow-hidden">{children}</main>
// //       </div>
// //     )
// //   }

// //   // For other pages, normal layout with header/footer
// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <Header />
// //       <main className="flex-1 pt-16">{children}</main>
// //       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
// //     </div>
// //   )
// // }

// // // Home page content
// // function HomePageContent() {
// //   return (
// //     <>
// //       <Hero />
// //       <Features />
// //       <UseCases />
// //       <HowItWorks />
// //       <Download />
// //     </>
// //   )
// // }

// // // Chatbot page content (no extra wrapper needed)
// // function ChatbotPageContent() {
// //   return <Chatbot />
// // }

// // // 404 Not Found component
// // function NotFound() {
// //   return (
// //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
// //       <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
// //       <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
// //       <div className="space-x-4">
// //         <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
// //           Go Home
// //         </a>
// //         <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
// //           Go to Chatbot
// //         </a>
// //       </div>
// //     </div>
// //   )
// // }

// // // Main App component
// // export default function App() {
// //   return (
// //     <AuthProvider>
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
// //             path="/login"
// //             element={
// //               <Layout>
// //                 <LoginForm />
// //               </Layout>
// //             }
// //           />
// //           <Route
// //             path="/register"
// //             element={
// //               <Layout>
// //                 <RegisterForm />
// //               </Layout>
// //             }
// //           />
// //           <Route
// //             path="/chatbot"
// //             element={
// //               <ProtectedRoute>
// //                 <Layout>
// //                   <ChatbotPageContent />
// //                 </Layout>
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/profile"
// //             element={
// //               <ProtectedRoute>
// //                 <Layout>
// //                   <ProfilePage />
// //                 </Layout>
// //               </ProtectedRoute>
// //             }
// //           />
// //           <Route
// //             path="/admin"
// //             element={
// //               <ProtectedRoute requireAdmin={true}>
// //                 <Layout>
// //                   <AdminPanel />
// //                 </Layout>
// //               </ProtectedRoute>
// //             }
// //           />
// //           {/* Catch all other routes and redirect to home or show 404 */}
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </Router>
// //     </AuthProvider>
// //   )
// // }

// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
// import { AuthProvider } from "./contexts/AuthContext"
// import Header from "./components/Header"
// import Footer from "./components/Footer"
// import Hero from "./components/Hero"
// import Features from "./components/Features"
// import UseCases from "./components/UseCases"
// import HowItWorks from "./components/HowItWorks"
// import Download from "./components/Download"
// import Chatbot from "./components/Chatbot"
// import LoginForm from "./components/auth/LoginForm"
// import RegisterForm from "./components/auth/RegisterForm"
// import ProtectedRoute from "./components/auth/ProtectedRoute"
// import ProfilePage from "./components/profile/ProfilePage"
// import AdminPanel from "./components/admin/AdminPanel"
// import Navbar from "./components/navigation/Navbar"

// // Layout component that conditionally handles header/footer
// function Layout({ children }) {
//   const location = useLocation()
//   const isChatbot = location.pathname === "/chatbot"
//   const isProfile = location.pathname === "/profile"
//   const isAdmin = location.pathname === "/admin"
//   const isAuth = location.pathname === "/login" || location.pathname === "/register"
//   const hideFooterRoutes = ["/chatbot", "/profile", "/admin"]

//   // For auth pages, use min-h-screen to allow scrolling on small devices
//   if (isAuth) {
//     // ===== CHANGE #1: Changed this div to be scrollable =====
//     return <div className="min-h-screen bg-gray-900">{children}</div>
//   }

//   // For chatbot, profile, and admin pages, make only the content scrollable
//   if (isChatbot || isProfile || isAdmin) {
//     return (
//       // This parent div keeps Navbar fixed
//       <div className="h-screen overflow-hidden flex flex-col">
//         <Navbar />
//         {/* ===== CHANGE #2: Changed main content to be scrollable ===== */}
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     )
//   }

//   // For other pages, normal layout with header/footer
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 pt-16">{children}</main>
//       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
//     </div>
//   )
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
//   )
// }

// // Chatbot page content (no extra wrapper needed)
// function ChatbotPageContent() {
//   return <Chatbot />
// }

// // 404 Not Found component
// function NotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
//       <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
//       <div className="space-x-4">
//         <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
//           Go Home
//         </a>
//         <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
//           Go to Chatbot
//         </a>
//       </div>
//     </div>
//   )
// }

// // Main App component
// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <Layout>
//                 <HomePageContent />
//               </Layout>
//             }
//           />
//           <Route
//             path="/login"
//             element={
//               <Layout>
//                 <LoginForm />
//               </Layout>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <Layout>
//                 <RegisterForm />
//               </Layout>
//             }
//           />
//           <Route
//             path="/chatbot"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <ChatbotPageContent />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <Layout>
//                   <ProfilePage />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute requireAdmin={true}>
//                 <Layout>
//                   <AdminPanel />
//                 </Layout>
//               </ProtectedRoute>
//             }
//           />
//           {/* Catch all other routes and redirect to home or show 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   )
// }

// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
// import { AuthProvider } from "./contexts/AuthContext"
// import { SpeechProvider } from "./contexts/SpeechContext" // 1. Import SpeechProvider
// import Header from "./components/Header"
// import Footer from "./components/Footer"
// import Hero from "./components/Hero"
// import Features from "./components/Features"
// import UseCases from "./components/UseCases"
// import HowItWorks from "./components/HowItWorks"
// import Download from "./components/Download"
// import Chatbot from "./components/Chatbot"
// import LoginForm from "./components/auth/LoginForm"
// import RegisterForm from "./components/auth/RegisterForm"
// import ProtectedRoute from "./components/auth/ProtectedRoute"
// import ProfilePage from "./components/profile/ProfilePage"
// import AdminPanel from "./components/admin/AdminPanel"
// import Navbar from "./components/navigation/Navbar"

// // Layout component (no changes needed here)
// function Layout({ children }) {
//   // ... (rest of the component is unchanged)
//   const location = useLocation()
//   const isChatbot = location.pathname === "/chatbot"
//   const isProfile = location.pathname === "/profile"
//   const isAdmin = location.pathname === "/admin"
//   const isAuth = location.pathname === "/login" || location.pathname === "/register"
//   const hideFooterRoutes = ["/chatbot", "/profile", "/admin"]

//   if (isAuth) {
//     return <div className="min-h-screen bg-gray-900">{children}</div>
//   }

//   if (isChatbot || isProfile || isAdmin) {
//     return (
//       <div className="h-screen overflow-hidden flex flex-col">
//         <Navbar />
//         <main className="flex-1 overflow-y-auto">{children}</main>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 pt-16">{children}</main>
//       {!hideFooterRoutes.includes(location.pathname) && <Footer />}
//     </div>
//   )
// }

// function HomePageContent() {
//   return (
//     <>
//       <Hero />
//       <Features />
//       <UseCases />
//       <HowItWorks />
//       <Download />
//     </>
//   )
// }

// function ChatbotPageContent() {
//   return <Chatbot />
// }

// function NotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
//       <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
//       <div className="space-x-4">
//         <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
//           Go Home
//         </a>
//         <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">
//           Go to Chatbot
//         </a>
//       </div>
//     </div>
//   )
// }

// // Main App component
// export default function App() {
//   return (
//     <AuthProvider>
//       <SpeechProvider> {/* 2. Wrap Router with SpeechProvider */}
//         <Router>
//           <Routes>
//             {/* ... All your Route components remain the same ... */}
//             <Route
//               path="/"
//               element={
//                 <Layout>
//                   <HomePageContent />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/login"
//               element={
//                 <Layout>
//                   <LoginForm />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/register"
//               element={
//                 <Layout>
//                   <RegisterForm />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/chatbot"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <ChatbotPageContent />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <ProfilePage />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute requireAdmin={true}>
//                   <Layout>
//                     <AdminPanel />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </SpeechProvider>
//     </AuthProvider>
//   )
// }

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, cloneElement } from "react"; // 👈 IMPORT useState & cloneElement
import { AuthProvider } from "./contexts/AuthContext";
import { SpeechProvider } from "./contexts/SpeechContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Features from "./components/Features";
import UseCases from "./components/UseCases";
import HowItWorks from "./components/HowItWorks";
import Download from "./components/Download";
import Chatbot from "./components/Chatbot";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./components/profile/ProfilePage";
import AdminPanel from "./components/admin/AdminPanel";
import Navbar from "./components/navigation/Navbar";

// ===================================================================
//  glavni компонент макета (Layout Component)
// ===================================================================
function Layout({ children }) {
  const location = useLocation();
  // ✅ State for mobile sidebar is now managed here
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pagesWithSidebar = ["/chatbot", "/profile", "/admin"];
  const isSidebarPage = pagesWithSidebar.includes(location.pathname);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-900">{children}</div>;
  }

  if (isSidebarPage) {
    return (
      <div className="h-screen overflow-hidden flex flex-col bg-gray-900">
        {/* Pass the function to open the sidebar to the Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {/* Pass state down to the child page (Chatbot, Profile, etc.) */}
          {cloneElement(children, { sidebarOpen, setSidebarOpen })}
        </main>
      </div>
    );
  }

  // Default layout for other pages
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

// ===================================================================
// Page Content Components
// ===================================================================
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

// Wrap components that need sidebar props
function ChatbotPageContent(props) { return <Chatbot {...props} />; }
function ProfilePageContent(props) { return <ProfilePage {...props} />; }
function AdminPanelContent(props) { return <AdminPanel {...props} />; }

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <div className="space-x-4">
        <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">Go Home</a>
        <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">Go to Chatbot</a>
      </div>
    </div>
  );
}


// ===================================================================
// Main App Component
// ===================================================================
export default function App() {
  return (
    <AuthProvider>
      <SpeechProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><HomePageContent /></Layout>} />
            <Route path="/login" element={<Layout><LoginForm /></Layout>} />
            <Route path="/register" element={<Layout><RegisterForm /></Layout>} />
            <Route path="/chatbot" element={<ProtectedRoute><Layout><ChatbotPageContent /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePageContent /></Layout></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Layout><AdminPanelContent /></Layout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SpeechProvider>
    </AuthProvider>
  );
}