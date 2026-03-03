// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (err) {
          // Token is invalid, remove it
          removeAuthToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      setAuthToken(response.token);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register
  const register = async (name, email, password, phone) => {
    setError(null);
    try {
      const response = await authAPI.register({ name, email, password, phone });
      setAuthToken(response.token);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  // Update profile
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.updateProfile(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
