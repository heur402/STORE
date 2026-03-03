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
  Phone,
  User,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ShoppingBag,
  Truck,
  AlertCircle,
  RefreshCw
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
    confirmed: 0,
    delivered: 0,
    outDelivery: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateStats = (ordersList) => {
    const newStats = {
      total: ordersList.length,
      pending: ordersList.filter(o => o.orderStatus?.toLowerCase() === "pending").length,
      confirmed: ordersList.filter(o => o.orderStatus?.toLowerCase() === "confirmed").length,
      outDelivery: ordersList.filter(o => o.orderStatus?.toLowerCase() === "out for delivery").length,
      delivered: ordersList.filter(o => o.orderStatus?.toLowerCase() === "delivered").length,
      cancelled: ordersList.filter(o => o.orderStatus?.toLowerCase() === "cancelled").length,
    };
    setStats(newStats);
  };

  const fetchOrders = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
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
        message: `Order ${order?.orderNumber || '#' + orderId.slice(-6).toUpperCase()} moved to ${newStatus}`,
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
      case "pending": return "bg-yellow-500";
      case "confirmed": return "bg-blue-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "out for delivery": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
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
    <div className={`min-h-screen transition-colors duration-300 ${
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, icon: ShoppingBag, color: "blue" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
            { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "green" },
            { label: "Out for Delivery", value: stats.outDelivery, icon: Truck, color: "orange" },
            { label: "Delivered", value: stats.delivered, icon: Truck, color: "purple" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "red" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              blue: darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600",
              yellow: darkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-600",
              green: darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600",
              orange: darkMode ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-600",
              purple: darkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600",
              red: darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600",
            };
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl shadow-sm ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {stat.label}
                    </p>
                    <p className={`text-xl font-bold mt-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${colors[stat.color]}`}>
                    <Icon size={18} />
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
            {["all", "pending", "confirmed", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === status
                  ? "bg-indigo-600 text-white"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
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
                        transition={{ duration: 0.2 }}
                        className={`border-t ${
                          darkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                Customer & Delivery
                              </h4>
                              <div className="space-y-1">
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  <User size={12} className="inline mr-1" /> {order.user?.email}
                                </p>
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  <MapPin size={12} className="inline mr-1" />
                                  {order.deliveryAddress ?
                                    `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` :
                                    "No address provided"}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                Payment Info
                              </h4>
                              <div className="space-y-1">
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                  <CreditCard size={12} className="inline mr-1" /> {order.paymentMethod} ({order.paymentStatus})
                                </p>
                                {order.isPaid && (
                                  <p className="text-xs text-green-500 font-medium">
                                    Paid successfully on {new Date(order.paidAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className={`text-sm font-semibold mb-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}>
                              Items
                            </h4>
                            <div className="space-y-2">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className={`flex justify-between text-sm p-2 rounded ${
                                  darkMode ? "bg-gray-700" : "bg-gray-50"
                                }`}>
                                  <div>
                                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                                      {item.name}
                                    </span>
                                    <span className={`text-xs ml-2 ${
                                      darkMode ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                      x{item.quantity}
                                    </span>
                                  </div>
                                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className={`flex justify-between text-sm font-semibold pt-2 border-t ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}>
                            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Total Amount</span>
                            <span className={darkMode ? "text-white" : "text-gray-900"}>
                              {formatCurrency(order.totalPrice)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {order.orderStatus === "Pending" && (
                              <>
                                <button
                                  onClick={() => updateOrderStatus(order._id, "Confirmed")}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                >
                                  Confirm Order
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order._id, "Cancelled")}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {order.orderStatus === "Confirmed" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Out for Delivery")}
                                className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                              >
                                Out for Delivery
                              </button>
                            )}
                            {order.orderStatus === "Out for Delivery" && (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Delivered")}
                                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                              >
                                Mark as Delivered
                              </button>
                            )}
                          </div>
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