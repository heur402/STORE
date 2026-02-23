//src/page/Products.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  dashboardStats,  // Make sure this is correctly imported
  stockStatus,
  recentProducts,
  tasks,
  activities,
} from "../assets/assets";

import Header from "./dashboard/Header";
import StatsGrid from "./dashboard/StatsGrid";
import RevenueChart from "./dashboard/RevenueChart";
import StockPieChart from "./dashboard/StockPieChart";
import RecentProducts from "./dashboard/RecentProducts";
import TasksCard from "./dashboard/TasksCard";
import ActivityFeed from "./dashboard/ActivityFeed";
import { container, getStyles, processSalesData } from "./dashboard/utils";
import ProductTable from "../components/ProductTable";

const Products = () => {
    const { darkMode } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [adminData, setAdminData] = useState({ name: "Loading...", role: "" });
    const [selectedMetric, setSelectedMetric] = useState("sales");
    const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const processedSalesData = useMemo(() => processSalesData(), []);
  
  const styles = useMemo(() => getStyles(darkMode), [darkMode]);

  

  return (
    <div
      variants={container}
      initial="hidden"
      animate="show"
      className={`p-4 sm:p-6 w-full h-full overflow-auto scrollbar-none transition-colors duration-300 space-y-4 sm:space-y-6
        ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <StatsGrid
        stats={dashboardStats}
        darkMode={darkMode}
        styles={styles}
        setHoveredCard={setHoveredCard}
      />

      <motion.div variants={container} className="space-y-5 grid grid-cols-1 gap-4 sm:gap-6">
        <ProductTable />
        <div className="space-x-3 bg-transparent grid grid-cols-2">
          <StockPieChart data={stockStatus} darkMode={darkMode} styles={styles} />
          <div className="space-y-2">
            <TasksCard tasks={tasks} styles={styles} />
            <TasksCard tasks={tasks} styles={styles} />
          </div>
        </div>
        
      </motion.div>
    </div>
  )
}

export default Products