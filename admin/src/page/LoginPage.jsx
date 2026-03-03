// src/page/LoginPage.jsx
import React from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Custom Notification Component
const Notification = ({ message, type = "error", onClose }) => {
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto close after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border ${
        type === "error" ? "border-red-500/50" : "border-green-500/50"
      } rounded-lg shadow-lg`}>
        <div className="px-4 py-3 text-white text-center">
          {message}
        </div>
        {/* Animated bottom line */}
        <div 
          className={`absolute bottom-0 left-0 h-0.5 ${
            type === "error" ? "bg-red-500" : "bg-green-500"
          } animate-slide-right`}
          style={{
            animation: "slideRight 2s linear forwards"
          }}
        />
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [state, setState] = React.useState("login"); // "login" or "register"
  const [showPassword, setShowPassword] = React.useState(false);
  const [notification, setNotification] = React.useState({ message: "", type: "error" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "login") {
        await login(formData.email, formData.password);

        setNotification({
          message: "Admin logged in successfully!",
          type: "success"
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // Registration - direct fetch as it's a one-off for creating admins
        const res = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "admin",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setNotification({ 
          message: "Admin account created! Please login.",
          type: "success"
        });

        setTimeout(() => setState("login"), 1500);
      }
    } catch (error) {
      setNotification({ 
        message: error.message, 
        type: "error" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      {/* Notification */}
      <Notification 
        message={notification.message} 
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "error" })}
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-white/5 border border-white/10 rounded-2xl px-8 py-10 backdrop-blur-xl shadow-xl"
      >
        <h1 className="text-white text-3xl font-semibold">
          {state === "login" ? "Admin Login" : "Admin Sign Up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Please {state === "login" ? "log in" : "sign up"} to continue
        </p>

        {/* Name Field (Only on Register) */}
        {state !== "login" && (
          <div className="flex items-center mt-6 bg-white/5 border border-white/10 focus-within:border-indigo-500 h-12 rounded-full px-5 gap-3 transition-all">
            <User size={18} className="text-white/60" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full bg-transparent text-white placeholder-white/60 outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div className="flex items-center mt-4 bg-white/5 border border-white/10 focus-within:border-indigo-500 h-12 rounded-full px-5 gap-3 transition-all">
          <Mail size={18} className="text-white/60" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center mt-4 bg-white/5 border border-white/10 focus-within:border-indigo-500 h-12 rounded-full px-5 gap-3 transition-all">
          <Lock size={18} className="text-white/60" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-white placeholder-white/60 outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password */}
        {state === "login" && (
          <div className="mt-4 text-left">
            <button
              type="button"
              className="text-sm text-indigo-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

        {/* Toggle Login/Register */}
        <p
          onClick={() => {
            setState((prev) => (prev === "login" ? "register" : "login"));
            // Clear form data when switching
            setFormData({ name: "", email: "", password: "" });
            // Clear any notifications
            setNotification({ message: "", type: "error" });
          }}
          className="text-gray-400 text-sm mt-4 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <span className="text-indigo-400 hover:underline ml-1">
            click here
          </span>
        </p>
      </form>

      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-96 h-60 bg-indigo-700/30 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-10 w-72 h-40 bg-indigo-500/20 rounded-full blur-2xl" />
      </div>

      {/* Add animation keyframes to your global CSS or here using style tag */}
      <style jsx>{`
        @keyframes slideRight {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;