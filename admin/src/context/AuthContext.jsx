import React, { createContext, useContext, useState, useEffect } from "react";
import { userAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          // You might need a specific "get admin profile" endpoint
          // For now, we use getMe which should return the user if the token is valid
          const userData = await userAPI.getMe();
          if (userData.role === 'admin') {
            setUser(userData);
          } else {
            // Not an admin, logout
            logout();
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("adminToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      // Use raw fetch for login because it returns the token
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.role !== 'admin') {
        throw new Error("Access denied. Admin only.");
      }

      localStorage.setItem("adminToken", data.token);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

