// src/page/dashboard/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import { item } from "./utils";

const Header = ({ adminData, darkMode, styles, selectedMetric, setSelectedMetric }) => {
  return (
    <motion.div
      variants={item}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
    >
      <div>
        <h1 className={`text-2xl sm:text-3xl font-bold ${styles.text.primary}`}>
          Welcome Back, {adminData.name}
        </h1>
        <p className={styles.text.secondary}>
          Here's what's happening with your store today.
        </p>
      </div>

      <div className="flex gap-2 p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
        {["sales", "revenue", "orders"].map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
              selectedMetric === metric
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {metric}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Header;