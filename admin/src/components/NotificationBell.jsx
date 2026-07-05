// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCheck, Trash2, Package, ShoppingBag,
  AlertTriangle, Info, X,
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const TYPE_META = {
  out_of_stock: { icon: Package,     color: "text-red-500",    bg: "bg-red-100 dark:bg-red-900/30",    label: "Out of Stock" },
  low_stock:    { icon: AlertTriangle,color: "text-amber-500",  bg: "bg-amber-100 dark:bg-amber-900/30",label: "Low Stock"    },
  order_created:{ icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30",label: "New Order"  },
  order_status: { icon: ShoppingBag, color: "text-blue-500",   bg: "bg-blue-100 dark:bg-blue-900/30",  label: "Order Update"},
  general:      { icon: Info,         color: "text-gray-500",   bg: "bg-gray-100 dark:bg-gray-800",     label: "Notice"     },
};

const relativeTime = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
};

const NotificationBell = ({ darkMode }) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => setOpen((v) => !v);

  const handleClickNotification = (n) => {
    if (!n.read) markAsRead(n._id);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className={`relative p-2 rounded-xl transition-colors ${
          darkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-600"
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl overflow-hidden z-50 border ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                darkMode ? "border-gray-700" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-2">
                  <Bell size={16} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  <span className={`font-semibold text-sm ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                      darkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
                    }`}
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className={`py-10 text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    <Bell size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const meta = TYPE_META[n.type] || TYPE_META.general;
                    const Icon = meta.icon;
                    return (
                      <div
                        key={n._id}
                        onClick={() => handleClickNotification(n)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b last:border-0 transition-colors ${
                          !n.read
                            ? darkMode ? "bg-indigo-900/10" : "bg-indigo-50/60"
                            : ""
                        } ${darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50"}`}
                      >
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${meta.bg}`}>
                          <Icon size={14} className={meta.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${
                            darkMode ? (n.read ? "text-gray-400" : "text-gray-200") : (n.read ? "text-gray-500" : "text-gray-800")
                          }`}>
                            {n.message}
                          </p>
                          <p className={`text-[10px] mt-1 ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            {relativeTime(n.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {!n.read && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}
                            className={`p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                              darkMode ? "hover:bg-gray-600 text-gray-500" : "hover:bg-gray-100 text-gray-400"
                            }`}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
