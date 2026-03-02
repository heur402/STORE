import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { userAPI } from "../services/api";

const Setting = () => {
  const { darkMode } = useOutletContext();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // Load current admin data
    const fetchAdmin = async () => {
      try {
        const data = await userAPI.getMe();
        setFormData({ 
          name: data.name || "", 
          email: data.email || "",
          password: "" 
        });
      } catch (err) {
        console.error("Failed to load admin data", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const updatedUser = await userAPI.updateProfile(formData);
      // Update token if it was returned
      if (updatedUser.token) {
        localStorage.setItem("adminToken", updatedUser.token);
      }
      setMessage({ text: "Profile updated successfully!", type: "success" });
      setFormData((prev) => ({ 
        ...prev, 
        password: "" // Clear password field only
      }));
      
      // Refresh admin data to show updated email/name
      const freshData = await userAPI.getMe();
      setFormData({ 
        name: freshData.name || "", 
        email: freshData.email || "",
        password: "" 
      });
      
      setTimeout(() => window.location.reload(), 1500); // Reload to reflect changes in sidebar/header
    } catch (err) {
      setMessage({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 md:p-6 w-full h-full overflow-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-2xl mx-auto rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}>
          Admin Settings
        </h2>

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.type === "success" 
              ? (darkMode ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-800")
              : (darkMode ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-800")
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Admin Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Update your name"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Update your email"
              required
            />
            <p className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              This email will be used for login and notifications
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
              }`}
              placeholder="Leave blank to keep current password"
            />
            <p className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Minimum 8 characters. Leave empty to keep current password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Optional: Add a section to show current email info */}
        <div className={`mt-6 pt-6 border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <p className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <span className="font-medium">Current login email:</span> {formData.email || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setting;