// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { API_URL } from '@/lib/api';

// type User = {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   role: string;
//   token: string;
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => void;
//   updateProfile: (userData: any) => Promise<void>;
//   isAdmin: boolean;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         // Check if token is expired (optional)
//         setUser(parsedUser);
//       } catch (error) {
//         console.error("Failed to parse user from localStorage:", error);
//         localStorage.removeItem("user");
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Login failed");
//       }

//       // Ensure the user has a token
//       if (!data.token) {
//         throw new Error("No token received from server");
//       }

//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
      
//       // Force a page reload to ensure all components get the new auth state
//       window.location.href = "/";
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (userData: any) => {
//     try {
//       const res = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//       window.location.href = "/";
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   const updateProfile = async (userData: any) => {
//     try {
//       const res = await fetch(`${API_URL}/api/auth/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Update failed");
//       }

//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//     } catch (error) {
//       throw error;
//     }
//   };

//   const isAdmin = user?.role === "admin";

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         register,
//         logout,
//         updateProfile,
//         isAdmin,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };


"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from '@/lib/api';

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Decode JWT and check if expired — no library needed
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token && isTokenExpired(parsedUser.token)) {
          // ✅ Token expired — clear and force re-login
          localStorage.removeItem("user");
        } else {
          setUser(parsedUser);
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (!data.token) {
      throw new Error("No token received from server");
    }

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    window.location.href = "/";
  };

  const register = async (userData: any) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    // ✅ Don't setUser — user must verify email before they can log in
    // Register page handles showing "check your email" message
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const updateProfile = async (userData: any) => {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Update failed");
    }

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};