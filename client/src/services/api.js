// src/services/api.js
// API adapter to connect client frontend to backend

const API_BASE_URL = "http://localhost:5000/api";

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("userToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

// ============ AUTH APIs ============
export const authAPI = {
  // Login user
  login: (credentials) =>
    fetchAPI("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Register new user
  register: (userData) =>
    fetchAPI("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Get current user profile
  getMe: () => fetchAPI("/users/me"),

  // Update user profile
  updateProfile: (userData) =>
    fetchAPI("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// ============ PRODUCT APIs ============
export const productAPI = {
  // Get all products with filters
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return fetchAPI(`/products${params ? `?${params}` : ""}`);
  },

  // Get product by ID
  getById: (id) => fetchAPI(`/products/${id}`),

  // Get featured products
  getFeatured: () => fetchAPI("/products?featured=true"),
};

// ============ ORDER APIs ============
export const orderAPI = {
  // Create new order
  create: (orderData) =>
    fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // Get logged in user's orders
  getMyOrders: () => fetchAPI("/orders/myorders"),

  // Get order by ID
  getById: (id) => fetchAPI(`/orders/${id}`),

  // Pay for order
  pay: (id, paymentData = {}) =>
    fetchAPI(`/orders/${id}/pay`, {
      method: "PUT",
      body: JSON.stringify(paymentData),
    }),

  // Cancel order
  cancel: (id, reason) =>
    fetchAPI(`/orders/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ cancellationReason: reason }),
    }),

  // Mark order as delivered (Client confirm receipt)
  deliver: (id) =>
    fetchAPI(`/orders/${id}/deliver`, {
      method: "PUT"
    }),
};

// ============ UTILITY FUNCTIONS ============

// Store token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem("userToken", token);
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem("userToken");
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem("userToken");
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getAuthToken();
};
