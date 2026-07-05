// src/pages/MainPage.jsx
import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import NotificationBell from "../components/NotificationBell";
import { NotificationProvider } from "../context/NotificationContext";
import { Outlet } from "react-router-dom";

const MainPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((d) => !d);

  return (
    <NotificationProvider>
      <section className="flex min-h-screen w-full">
        {/* Sidebar */}
        <SideBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Content Area */}
        <div className="flex-1 h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {/* Top bar with notification bell */}
          <div className={`flex justify-end items-center px-4 sm:px-6 py-2 border-b shrink-0 ${
            darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <NotificationBell darkMode={darkMode} />
          </div>

          {/* Scrollable page content */}
          <div className="flex-1 overflow-y-auto">
            <Outlet context={{ darkMode }} />
          </div>
        </div>
      </section>
    </NotificationProvider>
  );
};

export default MainPage;
