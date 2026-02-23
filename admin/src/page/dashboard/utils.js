// src/page/dashboard/utils.js
import { salesData } from "../../assets/assets";

export const COLORS = {
  inStock: "#10b981",
  lowStock: "#f59e0b",
  outOfStock: "#ef4444",
};

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
};

export const processSalesData = () => {
  // Add a check for salesData
  if (!salesData || !Array.isArray(salesData)) {
    return [];
  }
  
  return salesData.map((item, index, array) => {
    const prevSales = index > 0 ? array[index - 1].sales : item.sales;
    const trend = ((item.sales - prevSales) / prevSales) * 100;
    return {
      ...item,
      trend: trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`,
      trendDirection: trend > 0 ? "up" : trend < 0 ? "down" : "flat",
    };
  });
};

export const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const getStyles = (darkMode) => ({
  card: `p-5 rounded-xl shadow-lg transition-all duration-300 ${
    darkMode
      ? "bg-gray-800/90 backdrop-blur-sm hover:bg-gray-800"
      : "bg-white/90 backdrop-blur-sm hover:bg-white"
  }`,
  text: {
    primary: darkMode ? "text-gray-200" : "text-gray-800",
    secondary: darkMode ? "text-gray-400" : "text-gray-500",
    muted: darkMode ? "text-gray-500" : "text-gray-400",
  },
  border: darkMode ? "border-gray-700" : "border-gray-200",
  chartGrid: darkMode ? "#374151" : "#e5e7eb",
  chartText: darkMode ? "#9ca3af" : "#6b7280",
});