// src/page/dashboard/StatsCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { item } from "./utils";

const StatsCard = ({ stat, index, darkMode, styles, setHoveredCard }) => {
  // Add a check for stat
  if (!stat) {
    return null;
  }

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.03, y: -4 }}
      onHoverStart={() => setHoveredCard(stat.id)}
      onHoverEnd={() => setHoveredCard(null)}
      className={`${styles.card} cursor-pointer relative overflow-hidden group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${
          darkMode
            ? "from-blue-600/10 to-purple-600/10"
            : "from-blue-500/5 to-purple-500/5"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div className="absolute top-4 right-4 opacity-10">
        <div
          className={`w-12 h-12 rounded-full ${
            darkMode ? "bg-gray-600" : "bg-gray-300"
          }`}
        />
      </div>
      <p className={`text-sm uppercase tracking-wider ${styles.text.secondary}`}>
        {stat.title}
      </p>
      <h2 className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {stat.value}
      </h2>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            index % 2 === 0
              ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {index % 2 === 0 ? "↑ 12.5%" : "↑ 8.2%"}
        </span>
        <span className={`text-xs ${styles.text.muted}`}>vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatsCard;