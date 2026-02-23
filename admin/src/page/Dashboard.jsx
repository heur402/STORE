// src/page/Dashboard.jsx
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

const Dashboard = () => {
  const { darkMode } = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState({ name: "Loading...", role: "" });
  const [selectedMetric, setSelectedMetric] = useState("sales");
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const processedSalesData = useMemo(() => processSalesData(), []);

  // ✅ Fetch admin data like sidebar
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setAdminData({ name: data.name, role: data.role });
      } catch (err) {
        console.error(err);
        localStorage.removeItem("adminToken");
        navigate("/login");
      }
    };
    fetchAdmin();
  }, [navigate]);

  const styles = useMemo(() => getStyles(darkMode), [darkMode]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className={`p-6 w-full h-full flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`p-4 sm:p-6 w-full h-full overflow-auto scrollbar-none transition-colors duration-300 space-y-4 sm:space-y-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header
        adminData={adminData}
        darkMode={darkMode}
        styles={styles}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
      />

      <StatsGrid
        stats={dashboardStats}
        darkMode={darkMode}
        styles={styles}
        setHoveredCard={setHoveredCard}
      />

      <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RevenueChart data={processedSalesData} darkMode={darkMode} styles={styles} />
        <StockPieChart data={stockStatus} darkMode={darkMode} styles={styles} />
      </motion.div>

      <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <RecentProducts products={recentProducts} styles={styles} />
        
        <motion.div variants={container} className="space-y-4 sm:space-y-6">
          <TasksCard tasks={tasks} styles={styles} />
          <ActivityFeed activities={activities} styles={styles} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;