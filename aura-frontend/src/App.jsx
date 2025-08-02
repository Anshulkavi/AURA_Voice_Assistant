// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import { AuthProvider } from "./contexts/AuthContext"
// import ProtectedRoute from "./components/auth/ProtectedRoute"
// import LoginForm from "./components/auth/LoginForm"
// import RegisterForm from "./components/auth/RegisterForm"
// import Navbar from "./components/navigation/Navbar"
// import ProfilePage from "./components/profile/ProfilePage"
// import AdminPanel from "./components/admin/AdminPanel"
// import Chatbot from "./components/Chatbot"
// import Header from "./components/Header"
// import Footer from "./components/Footer"
// import Hero from "./components/Hero"
// import Features from "./components/Features"
// import Pricing from "./components/Pricing"
// import Contact from "./components/Contact"
// import "./App.css"

// // Layout component for marketing pages
// const MarketingLayout = ({ children }) => (
//   <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
//     <Header />
//     <main>{children}</main>
//     <Footer />
//   </div>
// )

// // Layout component for authenticated app pages
// const AppLayout = ({ children }) => (
//   <div className="min-h-screen bg-gray-50">
//     <Navbar />
//     <main className="pt-16">{children}</main>
//   </div>
// )

// // Home page component
// const HomePage = () => (
//   <MarketingLayout>
//     <Hero />
//     <Features />
//     <Pricing />
//     <Contact />
//   </MarketingLayout>
// )

// // Auth layout for login/register pages
// const AuthLayout = ({ children }) => (
//   <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
//     {children}
//   </div>
// )

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public marketing routes */}
//           <Route path="/" element={<HomePage />} />

//           {/* Authentication routes */}
//           <Route
//             path="/login"
//             element={
//               <AuthLayout>
//                 <LoginForm />
//               </AuthLayout>
//             }
//           />
//           <Route
//             path="/register"
//             element={
//               <AuthLayout>
//                 <RegisterForm />
//               </AuthLayout>
//             }
//           />

//           {/* Protected app routes */}
//           <Route
//             path="/chatbot"
//             element={
//               <ProtectedRoute>
//                 <AppLayout>
//                   <Chatbot />
//                 </AppLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <ProtectedRoute>
//                 <AppLayout>
//                   <ProfilePage />
//                 </AppLayout>
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute requireAdmin={true}>
//                 <AppLayout>
//                   <AdminPanel />
//                 </AppLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* Redirect unknown routes to home */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Features from "./components/Features"
import UseCases from "./components/UseCases"
import HowItWorks from "./components/HowItWorks"
import Download from "./components/Download"
import Chatbot from "./components/Chatbot"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import ProfilePage from "./components/profile/ProfilePage"
import AdminPanel from "./components/admin/AdminPanel"
import Navbar from "./components/navigation/Navbar"

// Layout component that conditionally handles header/footer
function Layout({ children }) {
  const location = useLocation()
  const isChatbot = location.pathname === "/chatbot"
  const isProfile = location.pathname === "/profile"
  const isAdmin = location.pathname === "/admin"
  const isAuth = location.pathname === "/login" || location.pathname === "/register"
  const hideFooterRoutes = ["/chatbot", "/profile", "/admin"]

  // For auth pages, no header/footer, full height
  if (isAuth) {
    return <div className="h-screen overflow-hidden">{children}</div>
  }

  // For chatbot, profile, and admin pages, use Navbar instead of Header
  if (isChatbot || isProfile || isAdmin) {
    return (
      <div className="h-screen overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    )
  }

  // For other pages, normal layout with header/footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  )
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
  )
}

// Chatbot page content (no extra wrapper needed)
function ChatbotPageContent() {
  return <Chatbot />
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
  )
}

// Main App component
export default function App() {
  return (
    <AuthProvider>
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
            path="/login"
            element={
              <Layout>
                <LoginForm />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <RegisterForm />
              </Layout>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Layout>
                  <ChatbotPageContent />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Catch all other routes and redirect to home or show 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
