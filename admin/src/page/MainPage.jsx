// src/pages/MainPage.jsx
import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import Display from "../components/Display";

const MainPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <section className="flex h-screen w-full overflow-hidden">
      {/* Sidebar receives darkMode state */}
      <SideBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Display also receives darkMode state */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Outlet context={{ darkMode }} />
      </div>
    </section>
  );
};

export default MainPage;