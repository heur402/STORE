import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  User,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingBag,
  Truck,
  AlertCircle,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { orderAPI } from "../services/api";

const Orders = () => {
  const { darkMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    outDelivery: 0,
    delivered: 0,
    cancelled: 0
  });
  const [updatingOrder, setUpdatingOrder] = useState(null); // track which order is being updated

  useEffect(() => {
    fetchOrders();

    // Auto-refresh orders every 10 seconds for real-time tracking
    const intervalId = setInterval(() => {
      fetchOrders(true); // pass true for silent fetching
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const calculateStats = (ordersList) => {
    const newStats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.orderStatus?.toLowerCase() === "pending").length,
      outDelivery: ordersList.filter(o => o.orderStatus?.toLowerCase() === "out for delivery").length,
      delivered: ordersList.filter(o => o.orderStatus?.toLowerCase() === "delivered").length,
      cancelled: ordersList.filter(o => o.orderStatus?.toLowerCase() === "cancelled").length,
    };
    setStats(newStats);
  };

  // Delivery steps for the simplified flow
  const DELIVERY_STEPS = ["Pending", "Out for Delivery", "Delivered"];

  const getStepIndex = (status) => {
    if (status === "Cancelled") return -1;
    return DELIVERY_STEPS.indexOf(status);
  };

  const getStepProgress = (status) => {
    const idx = getStepIndex(status);
    if (idx <= 0) return 0;
    return (idx / (DELIVERY_STEPS.length - 1)) * 100;
  };

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      addNotification({
        id: Date.now(),
        message: "Failed to fetch orders",
        type: "error",
        timestamp: new Date().toISOString()
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await orderAPI.updateStatus(orderId, newStatus);

      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      );

      setOrders(updatedOrders);
      calculateStats(updatedOrders);

      const order = orders.find(o => o._id === orderId);
      addNotification({
        id: Date.now(),
        orderId,
        message: `Order ${order?.orderNumber || '#' + orderId.slice(-6).toUpperCase()} → ${newStatus}`,
        type: 'success',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addNotification({
        id: Date.now(),
        message: `Update failed: ${error.message}`,
        type: 'error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.orderStatus?.toLowerCase() === filter.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-500";
      case "out for delivery": return "bg-blue-500";
      case "delivered": return "bg-emerald-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBg = (status, dark) => {
    switch (status?.toLowerCase()) {
      case "pending": return dark ? "bg-amber-900/30 text-amber-300 border-amber-700" : "bg-amber-50 text-amber-700 border-amber-200";
      case "out for delivery": return dark ? "bg-blue-900/30 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered": return dark ? "bg-emerald-900/30 text-emerald-300 border-emerald-700" : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return dark ? "bg-red-900/30 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200";
      default: return dark ? "bg-gray-700 text-gray-300 border-gray-600" : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return <Clock size={12} />;
      case "out for delivery": return <Truck size={12} />;
      case "delivered": return <CheckCircle size={12} />;
      case "cancelled": return <XCircle size={12} />;
      default: return <Package size={12} />;
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-rw", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`mb-20 min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header with Notifications */}
      <div className={`sticky top-0 z-10 px-4 py-3 sm:px-6 lg:px-8 border-b ${
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Orders Management
            </h1>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? "hover:bg-gray-800 text-gray-300" 
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNotifications(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-xl overflow-hidden z-50 border ${
                        darkMode 
                          ? "bg-gray-800 border-gray-700" 
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className={`px-4 py-3 border-b ${
                        darkMode ? "border-gray-700" : "border-gray-100"
                      }`}>
                        <h3 className={`font-semibold ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}>
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b last:border-0 ${
                                darkMode 
                                  ? "border-gray-700 hover:bg-gray-700" 
                                  : "border-gray-100 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {notification.type === 'success' ? (
                                  <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className={`text-sm ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}>
                                    {notification.message}
                                  </p>
                                  <p className={`text-xs mt-1 ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}>
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => clearNotification(notification.id)}
                                  className={`text-xs ${
                                    darkMode 
                                      ? "text-gray-500 hover:text-gray-300" 
                                      : "text-gray-400 hover:text-gray-600"
                                  }`}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`px-4 py-8 text-center ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            <Bell size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: stats.total, icon: ShoppingBag, colorClass: darkMode ? "bg-indigo-900/40 text-indigo-300" : "bg-indigo-100 text-indigo-600", accent: "border-l-4 border-indigo-500" },
            { label: "Pending",      value: stats.pending, icon: Clock,       colorClass: darkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-600", accent: "border-l-4 border-amber-500" },
            { label: "Out for Delivery", value: stats.outDelivery, icon: Truck, colorClass: darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-600", accent: "border-l-4 border-blue-500" },
            { label: "Delivered",    value: stats.delivered, icon: CheckCircle, colorClass: darkMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-600", accent: "border-l-4 border-emerald-500" },
            { label: "Cancelled",   value: stats.cancelled, icon: XCircle,   colorClass: darkMode ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-600", accent: "border-l-4 border-red-500" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`p-4 rounded-xl shadow-sm ${stat.accent} ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-extrabold mt-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.colorClass}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`} size={18} />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["all", "pending", "out for delivery", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  filter === status
                  ? "bg-indigo-600 text-white shadow"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status !== "all" && getStatusIcon(status)}
                {status === "all" ? "All" : getStatusText(status)}
              </button>
            ))}
          </div>
          
          <button
            onClick={fetchOrders}
            className={`p-2 rounded-lg transition-colors w-9 ${
              darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl shadow-sm overflow-hidden ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(order.orderStatus)}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                            }`}>
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <User size={14} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                            <span className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {order.user?.name || "Unknown Customer"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}>
                            {formatCurrency(order.totalPrice)}
                          </p>
                          <p className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {order.orderItems?.length || 0} items
                          </p>
                        </div>
                        {expandedOrder === order._id ? (
                          <ChevronUp size={20} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        ) : (
                          <ChevronDown size={20} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                      }`}>
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`border-t ${
                          darkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <div className="p-5 space-y-5">

                          {/* --- Delivery Progress Tracker --- */}
                          {order.orderStatus !== 'Cancelled' && (
                            <div className={`rounded-xl p-4 ${
                              darkMode ? "bg-gray-700/50" : "bg-gray-50"
                            }`}>
                              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>Delivery Progress</p>
                              <div className="relative">
                                {/* Track bar */}
                                <div className={`absolute top-4 left-0 w-full h-1 rounded-full ${
                                  darkMode ? "bg-gray-600" : "bg-gray-200"
                                }`} />
                                <motion.div
                                  className="absolute top-4 left-0 h-1 rounded-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getStepProgress(order.orderStatus)}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                                <div className="relative flex justify-between">
                                  {DELIVERY_STEPS.map((step, idx) => {
                                    const currentIdx = getStepIndex(order.orderStatus);
                                    const isDone = idx <= currentIdx;
                                    const isCurrent = idx === currentIdx;
                                    const stepColors = [
                                      "bg-amber-500 border-amber-200 shadow-amber-200",
                                      "bg-blue-500 border-blue-200 shadow-blue-200",
                                      "bg-emerald-500 border-emerald-200 shadow-emerald-200",
                                    ];
                                    return (
                                      <div key={step} className="flex flex-col items-center gap-2">
                                        <motion.div
                                          animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                                          transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 shadow-md transition-all duration-500 ${
                                            isDone
                                              ? `${stepColors[idx]} text-white`
                                              : darkMode
                                              ? "bg-gray-600 border-gray-500 text-gray-400"
                                              : "bg-white border-gray-300 text-gray-400"
                                          }`}
                                        >
                                          {isDone ? <CheckCircle size={14} /> : idx + 1}
                                        </motion.div>
                                        <p className={`text-xs font-semibold text-center max-w-[70px] ${
                                          isDone
                                            ? darkMode ? "text-gray-200" : "text-gray-800"
                                            : darkMode ? "text-gray-500" : "text-gray-400"
                                        }`}>{step}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Cancelled banner */}
                          {order.orderStatus === 'Cancelled' && (
                            <div className={`rounded-xl p-4 flex items-center gap-3 ${
                              darkMode ? "bg-red-900/20 border border-red-800" : "bg-red-50 border border-red-200"
                            }`}>
                              <XCircle size={20} className="text-red-500 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-red-600">Order Cancelled</p>
                                {order.cancellationReason && (
                                  <p className={`text-xs mt-0.5 ${ darkMode ? "text-red-400" : "text-red-500"}`}>
                                    Reason: {order.cancellationReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>Customer & Delivery</h4>
                              <p className={`text-sm flex items-center gap-1.5 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                <User size={13} className="opacity-60" /> {order.user?.name || order.user?.email}
                              </p>
                              <p className={`text-sm flex items-center gap-1.5 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}>
                                <MapPin size={13} className="opacity-60 flex-shrink-0" />
                                {order.deliveryAddress
                                  ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
                                  : "No address provided"}
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}>Payment</h4>
                              <p className={`text-sm flex items-center gap-1.5 ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                <CreditCard size={13} className="opacity-60" />
                                {order.paymentMethod} — {order.paymentStatus}
                              </p>
                              {order.isPaid && (
                                <p className="text-xs text-emerald-500 font-semibold">
                                  ✓ Paid on {new Date(order.paidAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>Order Items</h4>
                            <div className="space-y-1">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className={`flex justify-between items-center text-sm px-3 py-2 rounded-lg ${
                                  darkMode ? "bg-gray-700" : "bg-gray-50"
                                }`}>
                                  <span className={`font-medium ${ darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                    {item.name} <span className={`font-normal text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>×{item.quantity}</span>
                                  </span>
                                  <span className={`font-semibold ${ darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className={`flex justify-between font-bold text-sm pt-3 mt-1 border-t ${
                              darkMode ? "border-gray-700 text-white" : "border-gray-200 text-gray-900"
                            }`}>
                              <span>Total</span>
                              <span>{formatCurrency(order.totalPrice)}</span>
                            </div>
                          </div>

                          {/* --- Action Buttons --- */}
                          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {order.orderStatus === "Pending" && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    disabled={updatingOrder === order._id}
                                    onClick={() => updateOrderStatus(order._id, "Out for Delivery")}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all shadow-sm"
                                  >
                                    {updatingOrder === order._id ? (
                                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Truck size={15} />
                                    )}
                                    Send Out for Delivery
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    disabled={updatingOrder === order._id}
                                    onClick={() => updateOrderStatus(order._id, "Cancelled")}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition-all shadow-sm"
                                  >
                                    <XCircle size={15} />
                                    Cancel Order
                                  </motion.button>
                                </>
                              )}
                              {order.orderStatus === "Out for Delivery" && (
                                <motion.button
                                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                  disabled={updatingOrder === order._id}
                                  onClick={() => updateOrderStatus(order._id, "Delivered")}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-all shadow-sm"
                                >
                                  {updatingOrder === order._id ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <CheckCircle size={15} />
                                  )}
                                  Mark as Delivered
                                </motion.button>
                              )}
                            </div>
                          )}

                          {order.orderStatus === 'Delivered' && (
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                              darkMode ? "bg-emerald-900/20 border border-emerald-800" : "bg-emerald-50 border border-emerald-200"
                            }`}>
                              <CheckCircle size={18} className="text-emerald-500" />
                              <p className="text-sm font-bold text-emerald-600">Order delivered successfully ✓</p>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredOrders.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center py-12 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Package size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium mb-1">No orders found</p>
                  <p className="text-sm">Try adjusting your filters or search term</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;