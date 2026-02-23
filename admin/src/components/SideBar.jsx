// src/layouts/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  ShoppingCart,
} from "lucide-react";

const navSections = [
  {
    title: "Main",
    icon: LayoutDashboard,
    items: [
      { name: "Dashboard", path: "/", icon: LayoutDashboard },
      { name: "Products", path: "/products", icon: Package },
      { name: "Orders", path: "/orders", icon: ShoppingCart },
    ],
  },
  {
    title: "Finance",
    icon: CreditCard,
    items: [
      { name: "Debtors", path: "/debtors", icon: Users },
      { name: "Active Debts", path: "/debts/active", icon: CreditCard },
    ],
  },
];

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Loading...",
    role: "",
  });

  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("adminToken");
        navigate("/login");
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: collapsed ? 80 : 280 }}
        onAnimationStart={() => setIsTransitioning(true)}
        onAnimationComplete={() => setIsTransitioning(false)}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1.2 }}
        className={`hidden sm:flex h-screen border-r flex-col justify-between shadow-lg relative overflow-hidden transition-colors duration-300
          ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
        style={{ overflowX: "hidden" }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-4 border-b transition-colors ${
            darkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <AnimatePresence>
            {!collapsed && (
              <motion.h1
                key="header"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.35 }}
                className={`${
                  darkMode ? "text-gray-200" : "text-gray-800"
                } text-lg font-semibold ml-1`}
              >
                Admin Panel
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-full transition ${
              darkMode
                ? "text-gray-400 hover:bg-gray-800"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto overflow-x-hidden sidebar-scroll">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <AnimatePresence>
                {!collapsed ? (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`px-2 text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {section.icon && <section.icon size={14} />}
                    {section.title}
                  </motion.div>
                ) : (
                  <div className="h-6 flex justify-center">
                    {section.icon && (
                      <section.icon
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                    )}
                  </div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-1">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      layout
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-3 rounded-lg transition-all ${
                            collapsed ? "justify-center px-3" : "px-4"
                          } ${
                            isActive
                              ? darkMode
                                ? "bg-indigo-900/30 border-l-4 border-indigo-400"
                                : "bg-indigo-50 border-l-4 border-indigo-600"
                              : darkMode
                              ? "hover:bg-gray-800"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <Icon
                          size={20}
                          className={darkMode ? "text-gray-400" : "text-gray-500"}
                        />
                        {!collapsed && (
                          <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                            {item.name}
                          </span>
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Bottom: Dark Mode, User Info, Logout */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 justify-center">
          {/* Dark Mode */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 p-3 rounded-lg w-full transition ${
              collapsed ? "justify-center" : ""
            } ${
              darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
            {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </motion.button>

          {/* User Info */}
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <User size={24} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className={darkMode ? "text-gray-200" : "text-gray-800"}>{adminData.name}</span>
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>{adminData.role}</span>
              </div>
            )}
          </div>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 p-2 rounded-lg w-full text-sm transition hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Bottom Nav (unchanged) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className={`fixed bottom-0 left-0 right-0 sm:hidden z-50 flex justify-around border-t ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } shadow-lg`}
      >
        {navSections.flatMap(section => section.items).map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-4 transition-all ${
                  isActive
                    ? darkMode
                      ? "text-indigo-400"
                      : "text-indigo-600"
                    : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <Icon size={24} />
              <span className="text-xs">{item.name}</span>
            </NavLink>
          );
        })}
      </motion.div>
    </>
  );
};

export default Sidebar;