// src/page/dashboard/RevenueChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { item, CHART_COLORS } from "./utils";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
        } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
            {entry.name === "sales" && entry.payload?.trend && (
              <span
                className={`ml-2 text-sm ${
                  entry.payload.trendDirection === "up"
                    ? "text-green-500"
                    : entry.payload.trendDirection === "down"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                ({entry.payload.trend})
              </span>
            )}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueChart = ({ data, darkMode, styles }) => {
  return (
    <motion.div variants={item} className={`${styles.card} overflow-hidden`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`font-semibold text-lg ${styles.text.primary}`}>
          Revenue Overview
        </h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            This Year
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={styles.chartGrid} vertical={false} />
          <XAxis dataKey="month" stroke={styles.chartText} tick={{ fill: styles.chartText, fontSize: 12 }} />
          <YAxis stroke={styles.chartText} tick={{ fill: styles.chartText, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke={CHART_COLORS.primary}
            strokeWidth={3}
            fill="url(#salesGradient)"
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: darkMode ? "#fff" : "#000", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RevenueChart;