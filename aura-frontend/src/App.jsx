// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useState, cloneElement } from "react"; // 👈 IMPORT useState & cloneElement
// import { AuthProvider } from "./contexts/AuthContext";
// import { SpeechProvider } from "./contexts/SpeechContext";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Hero from "./components/Hero";
// import Features from "./components/Features";
// import UseCases from "./components/UseCases";
// import HowItWorks from "./components/HowItWorks";
// import Download from "./components/Download";
// import Chatbot from "./components/Chatbot";
// import LoginForm from "./components/auth/LoginForm";
// import RegisterForm from "./components/auth/RegisterForm";
// import ProtectedRoute from "./components/auth/ProtectedRoute";
// import ProfilePage from "./components/profile/ProfilePage";
// import AdminPanel from "./components/admin/AdminPanel";
// import Navbar from "./components/navigation/Navbar";

// // ===================================================================
// //  glavni компонент макета (Layout Component)
// // ===================================================================
// function Layout({ children }) {
//   const location = useLocation();
//   // ✅ State for mobile sidebar is now managed here
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const pagesWithSidebar = ["/chatbot", "/profile", "/admin"];
//   const isSidebarPage = pagesWithSidebar.includes(location.pathname);
//   const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

//   if (isAuthPage) {
//     return <div className="min-h-screen bg-gray-900">{children}</div>;
//   }

//   if (isSidebarPage) {
//     return (
//       <div className="h-screen overflow-hidden flex flex-col bg-gray-900">
//         {/* Pass the function to open the sidebar to the Navbar */}
//         <Navbar onMenuClick={() => setSidebarOpen(true)} />
//         <main className="flex-1 overflow-y-auto">
//           {/* Pass state down to the child page (Chatbot, Profile, etc.) */}
//           {cloneElement(children, { sidebarOpen, setSidebarOpen })}
//         </main>
//       </div>
//     );
//   }

//   // Default layout for other pages
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <main className="flex-1 pt-16">{children}</main>
//       <Footer />
//     </div>
//   );
// }

// // ===================================================================
// // Page Content Components
// // ===================================================================
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

// // Wrap components that need sidebar props
// function ChatbotPageContent(props) { return <Chatbot {...props} />; }
// function ProfilePageContent(props) { return <ProfilePage {...props} />; }
// function AdminPanelContent(props) { return <AdminPanel {...props} />; }

// function NotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
//       <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
//       <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
//       <div className="space-x-4">
//         <a href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">Go Home</a>
//         <a href="/chatbot" className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors">Go to Chatbot</a>
//       </div>
//     </div>
//   );
// }


// // ===================================================================
// // Main App Component
// // ===================================================================
// export default function App() {
//   return (
//     <AuthProvider>
//       <SpeechProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Layout><HomePageContent /></Layout>} />
//             <Route path="/login" element={<Layout><LoginForm /></Layout>} />
//             <Route path="/register" element={<Layout><RegisterForm /></Layout>} />
//             <Route path="/chatbot" element={<ProtectedRoute><Layout><ChatbotPageContent /></Layout></ProtectedRoute>} />
//             <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePageContent /></Layout></ProtectedRoute>} />
//             <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Layout><AdminPanelContent /></Layout></ProtectedRoute>} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </SpeechProvider>
//     </AuthProvider>
//   );
// }

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, cloneElement } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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

// Layout Component
function Layout({ children }) {
  const location = useLocation();
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
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {cloneElement(children, { sidebarOpen, setSidebarOpen })}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

// Page Content Components
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

function ChatbotPageContent(props) { 
  return <Chatbot {...props} />; 
}

function ProfilePageContent(props) { 
  return <ProfilePage {...props} />; 
}

function AdminPanelContent(props) { 
  return <AdminPanel {...props} />; 
}

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

// App routes with authentication
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><HomePageContent /></Layout>} />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/chatbot" replace /> : <Layout><LoginForm /></Layout>} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/chatbot" replace /> : <Layout><RegisterForm /></Layout>} 
      />
      <Route 
        path="/chatbot" 
        element={
          <ProtectedRoute>
            <Layout><ChatbotPageContent /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout><ProfilePageContent /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Layout><AdminPanelContent /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <SpeechProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SpeechProvider>
    </AuthProvider>
  );
}