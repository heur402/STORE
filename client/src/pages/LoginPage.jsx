import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    fullName: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/[0-9]/.test(formData.password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  // Countdown for resend verification
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    } else {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (passwordStrength < 50) {
        newErrors.password = 'Password is too weak';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstError = document.querySelector('.text-red-400');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage(isLogin ? 'Welcome back!' : 'Account created successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setSuccessMessage('');
        if (!isLogin) {
          setFormData({
            email: '',
            password: '',
            rememberMe: false,
            fullName: '',
            confirmPassword: '',
            phone: '',
            agreeToTerms: false,
            newsletter: false
          });
        }
      }, 3000);

      console.log('Form submitted:', formData);
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage(`Connected with ${provider}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: `${provider} login failed` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = () => {
    setCountdown(60);
    // Implement resend logic
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden relative font-sans">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Brand with Professional Design */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-4 shadow-2xl"
            >
              <span className="text-5xl filter drop-shadow-lg">✨</span>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Elevate</h1>
            <p className="text-indigo-200 text-sm tracking-wide">Premium Shopping Experience</p>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            {/* Toggle Buttons with Premium Design */}
            <div className="flex bg-white/5 rounded-2xl p-1.5 mb-8">
              {['Login', 'Sign Up'].map((tab, index) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsLogin(index === 0)}
                  className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    (index === 0 && isLogin) || (index === 1 && !isLogin)
                      ? 'bg-white text-indigo-900 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-green-100 text-sm text-center backdrop-blur-sm"
                >
                  <span className="font-medium">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-100 text-sm text-center"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="fullName"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
                        👤
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('fullName')}
                        className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                          errors.fullName && touched.fullName
                            ? 'border-red-400/50 focus:border-red-400'
                            : 'border-white/10 focus:border-indigo-400 group-hover:border-white/20'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && touched.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1.5 ml-2"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
                    ✉️
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                      errors.email && touched.email
                        ? 'border-red-400/50 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400 group-hover:border-white/20'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 ml-2"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone Field - Signup Only */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="phone"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
                        📱
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full pl-11 pr-4 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                          errors.phone && touched.phone
                            ? 'border-red-400/50 focus:border-red-400'
                            : 'border-white/10 focus:border-indigo-400 group-hover:border-white/20'
                        }`}
                        placeholder="+1 (555) 000-9999"
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1.5 ml-2"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-white/80 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                      errors.password && touched.password
                        ? 'border-red-400/50 focus:border-red-400'
                        : 'border-white/10 focus:border-indigo-400 group-hover:border-white/20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {!isLogin && formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex space-x-1 flex-1 mr-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              level * 25 <= passwordStrength
                                ? getStrengthColor()
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/60">{getStrengthText()}</span>
                    </div>
                    <ul className="text-xs text-white/40 space-y-1 mt-2">
                      <li className="flex items-center">
                        <span className={`mr-2 ${formData.password.length >= 8 ? 'text-green-400' : ''}`}>
                          {formData.password.length >= 8 ? '✓' : '○'}
                        </span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        <span className={`mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                          {/[A-Z]/.test(formData.password) ? '✓' : '○'}
                        </span>
                        One uppercase letter
                      </li>
                      <li className="flex items-center">
                        <span className={`mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-400' : ''}`}>
                          {/[0-9]/.test(formData.password) ? '✓' : '○'}
                        </span>
                        One number
                      </li>
                    </ul>
                  </motion.div>
                )}

                {errors.password && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5 ml-2"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password - Signup Only */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="confirmPassword"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <label className="block text-sm font-medium text-white/80 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 text-lg">
                        🔐
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={`w-full pl-11 pr-12 py-3.5 bg-white/5 border-2 rounded-xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                          errors.confirmPassword && touched.confirmPassword
                            ? 'border-red-400/50 focus:border-red-400'
                            : 'border-white/10 focus:border-indigo-400 group-hover:border-white/20'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1.5 ml-2"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 transition-colors"
                    />
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors"
                  >
                    Forgot password?
                  </motion.button>
                </motion.div>
              )}

              {/* Terms & Newsletter */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        I agree to the{' '}
                        <button type="button" className="text-indigo-300 hover:text-indigo-200 font-medium">
                          Terms
                        </button>
                        {' '}and{' '}
                        <button type="button" className="text-indigo-300 hover:text-indigo-200 font-medium">
                          Privacy Policy
                        </button>
                      </span>
                    </label>
                    {errors.agreeToTerms && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-xs ml-6"
                      >
                        {errors.agreeToTerms}
                      </motion.p>
                    )}

                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                        Send me exclusive offers and updates
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⚡
                    </motion.div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ mixBlendMode: 'overlay' }}
                />
              </motion.button>
            </form>

            {/* Social Login */}
            <motion.div variants={itemVariants} className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/40">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { provider: 'Google', icon: 'G', bg: 'from-red-500/20 to-red-600/20', hover: 'hover:bg-red-500/30' },
                  { provider: 'Facebook', icon: 'f', bg: 'from-blue-500/20 to-blue-600/20', hover: 'hover:bg-blue-500/30' },
                  { provider: 'Apple', icon: '', bg: 'from-gray-500/20 to-gray-600/20', hover: 'hover:bg-gray-500/30' }
                ].map((social, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin(social.provider)}
                    disabled={isLoading}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-br ${social.bg} border border-white/10 rounded-xl text-white hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
                  >
                    <span className="text-lg font-semibold">{social.icon}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Toggle between Login/Signup */}
            <motion.p variants={itemVariants} className="mt-6 text-center text-white/40 text-sm">
              {isLogin ? "New to Elevate? " : "Already have an account? "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setTouched({});
                }}
                className="text-indigo-300 hover:text-indigo-200 font-medium transition-colors"
              >
                {isLogin ? 'Create an account' : 'Sign in'}
              </motion.button>
            </motion.p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-8 mt-8"
          >
            {[
              { icon: '🔒', text: '256-bit SSL' },
              { icon: '🛡️', text: 'Privacy Protected' },
              { icon: '✓', text: 'GDPR Compliant' }
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="flex items-center space-x-1.5 text-white/40 hover:text-white/60 transition-colors"
              >
                <span className="text-sm">{badge.icon}</span>
                <span className="text-xs tracking-wide">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;