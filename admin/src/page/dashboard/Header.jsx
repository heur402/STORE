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

    </motion.div>
  );
};

export default Header;