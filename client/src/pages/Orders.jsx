import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { orderAPI } from "../services/api";
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await orderAPI.getMyOrders();
        if (isMounted) setOrders(data);
      } catch (err) {
        if (isMounted && !silent) setError(err.message || "Failed to fetch orders");
      } finally {
        if (isMounted && !silent) setLoading(false);
      }
    };

    fetchOrders();

    // Polling every 10 seconds for real-time delivery tracking
    const intervalId = setInterval(() => fetchOrders(true), 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Delivery steps for the simplified flow
  const DELIVERY_STEPS = ["Pending", "Out for Delivery", "Delivered"];

  const getStepIndex = (orderStatus) =>
    orderStatus === "Cancelled" ? -1 : DELIVERY_STEPS.indexOf(orderStatus);

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    { id: "pending", label: "Pending", count: orders.filter(o => o.orderStatus === "Pending").length },
    { id: "in-transit", label: "In Transit", count: orders.filter(o => o.orderStatus === "Out for Delivery").length },
    { id: "delivered", label: "Delivered", count: orders.filter(o => o.orderStatus === "Delivered").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter(o => o.orderStatus === "Cancelled").length },
  ];

  const statusConfig = {
    "Pending": {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="w-5 h-5" />,
      label: "Pending",
    },
    "Out for Delivery": {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Truck className="w-5 h-5" />,
      label: "Out for Delivery",
    },
    "Delivered": {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Delivered",
    },
    "Cancelled": {
      color: "bg-red-50 text-red-700 border-red-100",
      icon: <XCircle className="w-5 h-5" />,
      label: "Cancelled",
    },
  };

  const getConfig = (orderStatus) =>
    statusConfig[orderStatus] || {
      color: "bg-gray-50 text-gray-600 border-gray-200",
      icon: <ShoppingBag className="w-5 h-5" />,
      label: orderStatus || "Unknown",
    };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
        if (activeTab === "pending") return order.orderStatus === "Pending";
        if (activeTab === "in-transit") return order.orderStatus === "Out for Delivery";
        if (activeTab === "delivered") return order.orderStatus === "Delivered";
        if (activeTab === "cancelled") return order.orderStatus === "Cancelled";
        return false;
      });

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
        />
        <p className="mt-6 text-gray-600 font-medium">
          Loading your orders...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track and manage all your purchases</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/30 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Empty State */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-16 text-center"
            >
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mt-4">No orders found</h3>
              <p className="text-gray-500 mt-2">You haven't placed any orders in this category yet.</p>
              <Link
                to="/products"
                className="inline-flex items-center mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Browse Products
              </Link>
            </motion.div>
          ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, idx) => {
                  const config = getConfig(order.orderStatus);
                  const stepIdx = getStepIndex(order.orderStatus);
                  const isOutForDelivery = order.orderStatus === "Out for Delivery";

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Out for Delivery live banner */}
                    {isOutForDelivery && (
                      <div className="bg-blue-600 px-5 py-2 flex items-center gap-2">
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🚚
                        </motion.span>
                        <p className="text-white text-xs font-bold tracking-wide">Your order is on its way!</p>
                        <Link
                          to={`/orders/${order._id}`}
                          className="ml-auto text-white/80 text-xs hover:text-white font-semibold underline-offset-2 hover:underline"
                        >
                          Confirm Receipt →
                        </Link>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-xl border ${config.color}`}>
                            {config.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`hidden sm:block px-3 py-1 text-xs font-bold rounded-full border ${config.color}`}>
                            {config.label}
                          </span>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-medium">Total</p>
                            <p className="text-base font-extrabold text-orange-600">
                              RWF {order.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <Link
                            to={`/orders/${order._id}`}
                            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
                          >
                            View <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Mini delivery progress (show if not cancelled) */}
                      {order.orderStatus !== 'Cancelled' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-0">
                            {DELIVERY_STEPS.map((step, sIdx) => {
                              const done = sIdx <= stepIdx;
                              const current = sIdx === stepIdx;
                              const stepDotColors = [
                                done ? "bg-amber-500" : "bg-gray-200",
                                done ? "bg-blue-500" : "bg-gray-200",
                                done ? "bg-emerald-500" : "bg-gray-200",
                              ];
                              return (
                                <React.Fragment key={step}>
                                  <div className="flex flex-col items-center">
                                    <motion.div
                                      animate={current ? { scale: [1, 1.3, 1] } : {}}
                                      transition={{ duration: 1.5, repeat: current ? Infinity : 0 }}
                                      className={`w-3 h-3 rounded-full ${stepDotColors[sIdx]}`}
                                    />
                                    <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${done ? "text-gray-700" : "text-gray-400"
                                      }`}>{step}</span>
                                  </div>
                                  {sIdx < DELIVERY_STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mb-3 mx-1 ${sIdx < stepIdx ? "bg-blue-400" : "bg-gray-200"
                                      }`} />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Items summary */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {order.orderItems?.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-600">
                            {item.name} ×{item.quantity}
                          </span>
                        ))}
                        {order.orderItems?.length > 3 && (
                          <span className="text-xs text-gray-400">+{order.orderItems.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;