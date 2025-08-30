// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Check if user is authenticated on app load
//   useEffect(() => {
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch("/api/auth/me", {
//         credentials: "include",
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.user)
//       } else {
//         setUser(null)
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error)
//       setUser(null)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (username, password) => {
//     try {
//       setError(null)
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setUser(data.user)
//         return { success: true, user: data.user }
//       } else {
//         setError(data.error || "Login failed")
//         return { success: false, error: data.error || "Login failed" }
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       const errorMessage = "Network error. Please try again."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const register = async (userData) => {
//     try {
//       setError(null)
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         setUser(data.user)
//         return { success: true, user: data.user }
//       } else {
//         setError(data.error || "Registration failed")
//         return { success: false, error: data.error || "Registration failed" }
//       }
//     } catch (error) {
//       console.error("Registration error:", error)
//       const errorMessage = "Network error. Please try again."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const logout = async () => {
//     try {
//       await fetch("/api/auth/logout", {
//         method: "POST",
//         credentials: "include",
//       })
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       setUser(null)
//     }
//   }

//   const updateProfile = async (profileData) => {
//     try {
//       setError(null)
//       const response = await fetch("/api/auth/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(profileData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         // Refresh user data
//         await checkAuthStatus()
//         return { success: true }
//       } else {
//         setError(data.error || "Profile update failed")
//         return { success: false, error: data.error || "Profile update failed" }
//       }
//     } catch (error) {
//       console.error("Profile update error:", error)
//       const errorMessage = "Network error. Please try again."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     updateProfile,
//     checkAuthStatus,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Get backend URL
//   const getBackendUrl = () => {
//     const url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
//     console.log("Using backend URL:", url);
//     return url;
//   };

//   // Check if user is authenticated on app load
//   useEffect(() => {
//     console.log("AuthProvider: Checking initial auth status...");
//     checkAuthStatus()
//   }, [])

//   const checkAuthStatus = async () => {
//     try {
//       console.log("AuthProvider: Making auth check request...");
//       const backendUrl = getBackendUrl();
//       const response = await fetch(`${backendUrl}/api/auth/me`, {
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })

//       console.log("Auth check response status:", response.status);

//       if (response.ok) {
//         const data = await response.json()
//         console.log("Auth check success - user:", data.user?.username);
//         setUser(data.user)
//       } else {
//         console.log("Auth check failed - no user authenticated");
//         setUser(null)
//       }
//     } catch (error) {
//       console.error("Auth check failed with error:", error)
//       setUser(null)
//     } finally {
//       setLoading(false)
//       console.log("Auth check completed");
//     }
//   }

//   const login = async (username, password) => {
//     try {
//       console.log("Attempting login for user:", username);
//       setError(null)
//       const backendUrl = getBackendUrl();
//       const response = await fetch(`${backendUrl}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       })

//       const data = await response.json()
//       console.log("Login response:", response.status, data);

//       if (response.ok) {
//         console.log("Login successful for user:", data.user?.username);
//         setUser(data.user)
//         return { success: true, user: data.user }
//       } else {
//         console.log("Login failed:", data.error);
//         setError(data.error || "Login failed")
//         return { success: false, error: data.error || "Login failed" }
//       }
//     } catch (error) {
//       console.error("Login network error:", error)
//       const errorMessage = "Network error. Please check if the backend is running."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const register = async (userData) => {
//     try {
//       console.log("Attempting registration for user:", userData.username);
//       setError(null)
//       const backendUrl = getBackendUrl();
//       const response = await fetch(`${backendUrl}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(userData),
//       })

//       const data = await response.json()
//       console.log("Registration response:", response.status, data);

//       if (response.ok) {
//         console.log("Registration successful for user:", data.user?.username);
//         setUser(data.user)
//         return { success: true, user: data.user }
//       } else {
//         console.log("Registration failed:", data.error);
//         setError(data.error || "Registration failed")
//         return { success: false, error: data.error || "Registration failed" }
//       }
//     } catch (error) {
//       console.error("Registration network error:", error)
//       const errorMessage = "Network error. Please check if the backend is running."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const logout = async () => {
//     try {
//       console.log("Logging out user:", user?.username);
//       const backendUrl = getBackendUrl();
//       await fetch(`${backendUrl}/api/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       })
//       console.log("Logout successful");
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       setUser(null)
//     }
//   }

//   const updateProfile = async (profileData) => {
//     try {
//       console.log("Updating profile for user:", user?.username);
//       setError(null)
//       const backendUrl = getBackendUrl();
//       const response = await fetch(`${backendUrl}/api/auth/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(profileData),
//       })

//       const data = await response.json()

//       if (response.ok) {
//         console.log("Profile update successful");
//         // Refresh user data
//         await checkAuthStatus()
//         return { success: true }
//       } else {
//         console.log("Profile update failed:", data.error);
//         setError(data.error || "Profile update failed")
//         return { success: false, error: data.error || "Profile update failed" }
//       }
//     } catch (error) {
//       console.error("Profile update error:", error)
//       const errorMessage = "Network error. Please try again."
//       setError(errorMessage)
//       return { success: false, error: errorMessage }
//     }
//   }

//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     updateProfile,
//     checkAuthStatus,
//   }

//   console.log("AuthProvider state:", { user: user?.username, loading, error });

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBackendUrl = () =>
    import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

  const getAccessToken = () => localStorage.getItem("access");
  const getRefreshToken = () => localStorage.getItem("refresh");

  const setTokens = (access, refresh) => {
    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
  };

  const clearTokens = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  // --- Refresh access token ---
  const refreshAccessToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token available");

    try {
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      const data = await res.json();
      if (!res.ok || !data.access) throw new Error("Refresh failed");

      localStorage.setItem("access", data.access);
      return data.access;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      throw err;
    }
  };

  // --- Auth check ---
  const checkAuthStatus = async () => {
    let token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const backendUrl = getBackendUrl();
      let res = await fetch(`${backendUrl}/api/auth/me`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      // If access token expired, try refreshing
      if (res.status === 401) {
        token = await refreshAccessToken();
        res = await fetch(`${backendUrl}/api/auth/me`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
      }

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      clearTokens();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // --- Login ---
  const login = async (username, password) => {
    try {
      setError(null);
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      if (!data.access || !data.refresh) throw new Error("No tokens returned from backend");

      setTokens(data.access, data.refresh);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
      clearTokens();
      setUser(null);
      return { success: false, error: err.message };
    }
  };

  // --- Register ---
  const register = async (userData) => {
    try {
      setError(null);
      const backendUrl = getBackendUrl();
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");
      if (!data.access || !data.refresh) throw new Error("No tokens returned from backend");

      setTokens(data.access, data.refresh);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message);
      clearTokens();
      setUser(null);
      return { success: false, error: err.message };
    }
  };

  // --- Logout ---
  const logout = () => {
    clearTokens();
    setUser(null);
  };

  // --- Update Profile ---
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      let token = getAccessToken();
      if (!token) throw new Error("No access token");

      const backendUrl = getBackendUrl();
      let res = await fetch(`${backendUrl}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });

      if (res.status === 401) {
        token = await refreshAccessToken();
        res = await fetch(`${backendUrl}/api/auth/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(profileData),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile update failed");

      await checkAuthStatus();
      return { success: true };
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
  user,
  loading,
  error,
  login,
  register,
  logout,
  updateProfile,
  checkAuthStatus,
  getAccessToken,     // ✅ add this
  refreshAccessToken, // ✅ add this
};


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
