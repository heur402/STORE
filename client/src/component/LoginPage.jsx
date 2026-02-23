// src/page/LoginPage.jsx
import React from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [state, setState] = React.useState("login");
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md text-center bg-white/5 border border-white/10 rounded-2xl px-8 py-10 backdrop-blur-xl shadow-xl"
      >
        <h1 className="text-white text-3xl font-semibold">
          {state === "login" ? "Login" : "Sign up"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Please sign in to continue
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
            placeholder="Email id"
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
          {state === "login" ? "Login" : "Sign up"}
        </button>

        {/* Toggle Login/Register */}
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
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
    </div>
  );
};

export default LoginPage;