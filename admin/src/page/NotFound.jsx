import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-black text-blue-500">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Go Back Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
