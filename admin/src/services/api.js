// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api";

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("adminToken");
  
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

// Product APIs
export const productAPI = {
  getAll: () => fetchAPI("/products"),
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (productData) => fetchAPI("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  }),
  update: (id, productData) => fetchAPI(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  }),
  delete: (id) => fetchAPI(`/products/${id}`, {
    method: "DELETE",
  }),
  uploadImage: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      // No Content-Type header needed for FormData; browser sets it with boundary
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }
    return response.text(); // multer returns the URL as text
  },
};

// User APIs (for dashboard)
export const userAPI = {
  getMe: () => fetchAPI("/users/me"),
  updateProfile: (userData) => fetchAPI("/users/profile", {
    method: "PUT",
    body: JSON.stringify(userData),
  }),
};

// Dashboard Stats APIs (you need to create these endpoints in backend)
export const dashboardAPI = {
  getStats: () => fetchAPI("/products/dashboard/stats"),
  getSalesData: () => fetchAPI("/products/dashboard/sales"),
  getStockStatus: () => fetchAPI("/products/dashboard/stock-status"),
  getRecentProducts: () => fetchAPI("/products/dashboard/recent-products"),
  getTasks: () => fetchAPI("/dashboard/tasks"), // If you want dynamic tasks
  getActivities: () => fetchAPI("/dashboard/activities"), // If you want dynamic activities
};