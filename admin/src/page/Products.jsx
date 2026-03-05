// src/page/Products.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  dashboardStats as staticDashboardStats,
  stockStatus as staticStockStatus,
  recentProducts,
  tasks,
  activities,
} from "../assets/assets";
import { dashboardAPI } from "../services/api"; // Import only dashboardAPI

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
    
    // State for real data
    const [dashboardStats, setDashboardStats] = useState([]);
    const [stockStatus, setStockStatus] = useState([]);
    
    const navigate = useNavigate();

    // Fetch dashboard stats and stock status from database
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                navigate("/login");
                return;
            }
            try {
                setIsLoading(true);
                
                // Fetch dashboard stats
                const stats = await dashboardAPI.getStats();
                setDashboardStats(stats);
                
                // Fetch stock status
                const stock = await dashboardAPI.getStockStatus();
                setStockStatus(stock);
                
            } catch (err) {
                console.error(err);
                // Use static data as fallback
                setDashboardStats(staticDashboardStats);
                setStockStatus(staticStockStatus);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const processedSalesData = useMemo(() => processSalesData(), []);
    const styles = useMemo(() => getStyles(darkMode), [darkMode]);

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
                        Loading products...
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
            className={`mb-20 p-4 sm:p-6 w-full h-full overflow-auto scrollbar-none transition-colors duration-300 space-y-4 sm:space-y-6
                ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        >
            {/* StatsGrid uses real data from database */}
            <StatsGrid
                stats={dashboardStats}
                darkMode={darkMode}
                styles={styles}
                setHoveredCard={setHoveredCard}
            />

            <motion.div variants={container} className="space-y-5 grid grid-cols-1 gap-4 sm:gap-6">
                <ProductTable />
                <div className="space-x-3 space-y-3 bg-transparent grid lg:grid-cols-2 grid-cols-1">
                    {/* StockPieChart now uses real data from database */}
                    <StockPieChart data={stockStatus} darkMode={darkMode} styles={styles} />
                    <div className="space-y-3 p-1">
                        <TasksCard tasks={tasks} styles={styles} />
                        <ActivityFeed activities={activities} styles={styles} />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default Products;