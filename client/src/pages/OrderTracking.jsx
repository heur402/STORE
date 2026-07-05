// pages/OrderTracking.jsx
// Public page — customer enters their order number to see delivery progress
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, CheckCircle, Clock, Truck,
  XCircle, MapPin, MessageCircle, ArrowLeft, Loader2,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

// ── Delivery steps & their meta
const STEPS = [
  { key: "Pending",          label: "Order Placed",    icon: Clock,        color: "amber"   },
  { key: "Confirmed",        label: "Confirmed",        icon: CheckCircle,  color: "indigo"  },
  { key: "Out for Delivery", label: "Out for Delivery", icon: Truck,        color: "blue"    },
  { key: "Delivered",        label: "Delivered",        icon: CheckCircle,  color: "emerald" },
];

const STEP_COLORS = {
  amber:   { dot: "bg-amber-500",   ring: "ring-amber-200",  text: "text-amber-600",  bg: "bg-amber-50"   },
  indigo:  { dot: "bg-indigo-500",  ring: "ring-indigo-200", text: "text-indigo-600", bg: "bg-indigo-50"  },
  blue:    { dot: "bg-blue-500",    ring: "ring-blue-200",   text: "text-blue-600",   bg: "bg-blue-50"    },
  emerald: { dot: "bg-emerald-500", ring: "ring-emerald-200",text: "text-emerald-600",bg: "bg-emerald-50" },
};

const getStepIndex = (status) => STEPS.findIndex((s) => s.key === status);

const fmt = (v) =>
  new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(v);

const STORE_WHATSAPP = "250785313282";

// ─────────────────────────────────
const OrderTracking = () => {
  const { orderNumber: paramOrderNumber } = useParams();
  const navigate = useNavigate();

  const [input, setInput]     = useState(paramOrderNumber?.toUpperCase() || "");
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Auto-search if order number is in the URL
  useEffect(() => {
    if (paramOrderNumber) {
      searchOrder(paramOrderNumber.toUpperCase());
    }
  }, [paramOrderNumber]);

  const searchOrder = async (num = input) => {
    const clean = num.trim().toUpperCase();
    if (!clean) { setError("Please enter your order number."); return; }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res  = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order not found");
      setOrder(data);
      // Update URL without reloading
      navigate(`/track/${clean}`, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); searchOrder(); };

  const currentIdx = order ? getStepIndex(order.orderStatus) : -1;
  const isCancelled = order?.orderStatus === "Cancelled";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition mb-6"
        >
          <ArrowLeft size={16} /> Back to store
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 mb-4">
            <Package className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter the order number you received on WhatsApp
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="e.g. ORD-202507-042"
              className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition font-mono"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? "Searching..." : "Track"}
          </motion.button>
        </form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6"
            >
              <XCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Card */}
        <AnimatePresence>
          {order && (
            <motion.div
              key={order.orderNumber}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Order header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Order Number</p>
                  <p className="font-bold text-gray-900 text-lg font-mono">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-orange-500 text-lg">{fmt(order.totalPrice)}</p>
                </div>
              </div>

              <div className="p-5 space-y-6">

                {/* ── Cancelled state ── */}
                {isCancelled && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-bold text-red-700">Order Cancelled</p>
                      {order.cancellationReason && (
                        <p className="text-sm text-red-600 mt-0.5">{order.cancellationReason}</p>
                      )}
                      <p className="text-xs text-red-500 mt-1">
                        Contact us on WhatsApp if you have questions.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Progress tracker ── */}
                {!isCancelled && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
                      Delivery Progress
                    </p>

                    {/* Steps */}
                    <div className="relative">
                      {/* Background line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
                      {/* Progress line */}
                      <motion.div
                        className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-amber-400 via-indigo-400 via-blue-400 to-emerald-400"
                        initial={{ width: 0 }}
                        animate={{
                          width: currentIdx <= 0
                            ? 0
                            : `${(currentIdx / (STEPS.length - 1)) * (100 - 10)}%`,
                        }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                      />

                      <div className="relative flex justify-between">
                        {STEPS.map((step, idx) => {
                          const isDone    = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;
                          const c         = STEP_COLORS[step.color];
                          const Icon      = step.icon;

                          return (
                            <div key={step.key} className="flex flex-col items-center gap-2 w-1/4">
                              <motion.div
                                animate={isCurrent ? { scale: [1, 1.12, 1] } : {}}
                                transition={{ duration: 1.6, repeat: isCurrent ? Infinity : 0, ease: "easeInOut" }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                                  isDone
                                    ? `${c.dot} ring-4 ${c.ring} shadow-lg`
                                    : "bg-gray-100 ring-2 ring-gray-200"
                                }`}
                              >
                                <Icon
                                  size={18}
                                  className={isDone ? "text-white" : "text-gray-400"}
                                />
                              </motion.div>
                              <p className={`text-[11px] font-semibold text-center leading-tight ${
                                isDone ? c.text : "text-gray-400"
                              }`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current status pill */}
                    <div className="mt-6 text-center">
                      {(() => {
                        const step = STEPS[currentIdx] || STEPS[0];
                        const c    = STEP_COLORS[step.color];
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}>
                            <step.icon size={14} />
                            {order.orderStatus}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ── Order items ── */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Items Ordered
                  </p>
                  <div className="space-y-2">
                    {order.orderItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm px-3 py-2.5 rounded-xl bg-gray-50"
                      >
                        <span className="font-medium text-gray-800 line-clamp-1 flex-1 mr-2">
                          {item.name}
                          <span className="text-gray-400 font-normal ml-1">×{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-gray-700 shrink-0">
                          {fmt(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Delivery address ── */}
                {(order.deliveryAddress?.street || order.deliveryAddress?.city) && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>
                      {[order.deliveryAddress.street, order.deliveryAddress.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {/* ── Dates ── */}
                <div className="text-xs text-gray-400 space-y-0.5">
                  <p>Placed: {new Date(order.createdAt).toLocaleString()}</p>
                  {order.isDelivered && order.deliveredAt && (
                    <p className="text-emerald-500 font-medium">
                      Delivered: {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* ── WhatsApp support button ── */}
                <a
                  href={`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
                    `Hello, I'm checking on my order ${order.orderNumber}. Current status: ${order.orderStatus}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  <MessageCircle size={16} />
                  Ask about this order on WhatsApp
                </a>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help text when no search done yet */}
        {!order && !loading && !error && (
          <div className="text-center text-gray-400 text-sm mt-4">
            <p>Your order number was sent in your WhatsApp confirmation message.</p>
            <p className="mt-1">It looks like <span className="font-mono font-medium">ORD-202507-042</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
