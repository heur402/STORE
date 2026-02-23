// src/page/dashboard/StatsGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import { container } from "./utils";
import StatsCard from "./StatsCard";

const StatsGrid = ({ stats, darkMode, styles, setHoveredCard }) => {
  // Add a check to ensure stats exists and is an array
  if (!stats || !Array.isArray(stats)) {
    return null;
  }

  return (
    <motion.div
      variants={container}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.id}
          stat={stat}
          index={index}
          darkMode={darkMode}
          styles={styles}
          setHoveredCard={setHoveredCard}
        />
      ))}
    </motion.div>
  );
};

export default StatsGrid;