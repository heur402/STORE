// src/components/Display.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const Display = ({ darkMode }) => {
  return (
    <div
      className={`p-6 w-full h-full overflow-auto transition-colors
        ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}
    >
      <Outlet />
    </div>
  );
};

export default Display;