import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must accept terms";
      }
    }

    return newErrors;
  };

  const { login, register, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial mode based on path
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const userData = await login(formData.email, formData.password);

        // Ensure only clients can log in here
        if (userData.role !== 'client') {
          logout();
          setErrors({ submit: "This page is for clients only. Admins please use the Admin Dashboard." });
          setIsLoading(false);
          return;
        }
      } else {
        await register(formData.fullName, formData.email, formData.password, formData.phone);
      }
      navigate("/");
    } catch (err) {
      setErrors({ submit: err.message || "Authentication failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            STORE
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${isLogin
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${!isLogin
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center font-medium"
            >
              {errors.submit}
            </motion.div>
          )}

          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <label className="text-sm text-gray-400">Full Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    name="fullName"
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                className="w-full pl-9 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-400">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Terms */}
          {!isLogin && (
            <label className="flex items-center text-sm text-gray-400 space-x-2">
              <input
                type="checkbox"
                name="agreeToTerms"
                onChange={handleChange}
              />
              <span>I agree to Terms & Privacy</span>
            </label>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white font-medium"
          >
            {isLoading
              ? "Processing..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-800" />

        {/* Social */}
        <div className="space-y-3">
          <button className="w-full py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition">
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;