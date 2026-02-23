// src/page/dashboard/StockPieChart.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { item, COLORS } from "./utils";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  darkMode,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill={darkMode ? "#fff" : "#374151"}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StockPieChart = ({ data, darkMode, styles }) => {
  return (
    <motion.div variants={item} className={`${styles.card}`}>
      <div className="mb-6">
        <h3 className={`font-semibold text-lg ${styles.text.primary}`}>
          Stock Distribution
        </h3>
      </div>

      {/* Chart + Side Legend */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Pie Chart */}
        <div className="w-full lg:w-2/3 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                label={(props) =>
                  renderCustomizedLabel({ ...props, darkMode })
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={Object.values(COLORS)[index]}
                    stroke={darkMode ? "#1f2937" : "#fff"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Side Legend */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {data.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: Object.values(COLORS)[index] }}
                />
                <span
                  className={`text-sm font-medium capitalize ${styles.text.primary}`}
                >
                  {entry.name}
                </span>
              </div>

              {/* Display value (range number) */}
              <span
                className={`text-sm font-semibold ${styles.text.secondary}`}
              >
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StockPieChart;