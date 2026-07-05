// src/page/AddOrderPage.jsx
// Admin manually logs a WhatsApp-confirmed order
import React, { useState, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, User, Phone, ShoppingBag,
  ChevronLeft, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { orderAPI } from "../services/api";

const fmt = (v) =>
  new Intl.NumberFormat("en-RW", { style: "currency", currency: "RWF", maximumFractionDigits: 0 }).format(v);

const AddOrderPage = () => {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const { products } = useProducts();

  // ── Form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN");
  const [deliveryStreet, setDeliveryStreet] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [notes, setNotes] = useState("");

  // ── Product picker
  const [productSearch, setProductSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // ── Order items: [{ product, quantity }]
  const [items, setItems] = useState([]);

  // ── Submit state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const availableProducts = useMemo(() =>
    products.filter(
      (p) =>
        !p.isDeleted &&
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    ),
    [products, productSearch]
  );

  const addItem = (product) => {
    const existing = items.find((i) => i.product._id === product._id);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setItems((prev) => [...prev, { product, quantity: 1 }]);
    }
    setShowPicker(false);
    setProductSearch("");
  };

  const removeItem = (productId) => setItems((prev) => prev.filter((i) => i.product._id !== productId));

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.product._id === productId ? { ...i, quantity: qty } : i)));
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) return setError("Customer name is required");
    if (!customerPhone.trim()) return setError("Customer phone is required");
    if (items.length === 0) return setError("Add at least one product");

    setSubmitting(true);
    try {
      await orderAPI.adminCreate({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        paymentMethod,
        deliveryAddress: { street: deliveryStreet, city: deliveryCity },
        notes,
        items: items.map((i) => ({
          productId: i.product._id,
          productName: i.product.name,
          quantity: i.quantity,
          priceAtOrder: i.product.discountPrice || i.product.price,
        })),
      });
      setSuccess(true);
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Input class helper
  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
  }`;

  return (
    <div className={`min-h-screen pb-20 transition-colors ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b px-4 sm:px-6 py-4 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/orders")}
            className={`p-2 rounded-xl transition-colors ${
              darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Log WhatsApp Order
            </h1>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Manually record an order confirmed on WhatsApp
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl"
            >
              <CheckCircle className="text-emerald-500 shrink-0" size={20} />
              <p className="text-sm font-medium text-emerald-700">Order created! Redirecting to orders...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
            >
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Customer Info ── */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h2 className={`font-semibold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            <User size={16} className="text-indigo-500" /> Customer Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Full Name *
              </label>
              <input
                className={inputCls}
                placeholder="e.g. Jean Baptiste"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                WhatsApp Phone *
              </label>
              <div className="relative">
                <Phone size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                <input
                  className={`${inputCls} pl-8`}
                  placeholder="e.g. 0788 123 456"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Street Address
              </label>
              <input className={inputCls} placeholder="e.g. KG 778 St" value={deliveryStreet} onChange={(e) => setDeliveryStreet(e.target.value)} />
            </div>
            <div>
              <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                City / Area
              </label>
              <input className={inputCls} placeholder="e.g. Kigali" value={deliveryCity} onChange={(e) => setDeliveryCity(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={`text-xs font-medium block mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Payment Method
            </label>
            <div className="flex gap-2">
              {["MTN", "Airtel"].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    paymentMethod === m
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-400"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {m} Money
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className={`rounded-2xl border p-5 space-y-4 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`font-semibold flex items-center gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
              <ShoppingBag size={16} className="text-indigo-500" /> Order Items
            </h2>
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              <Plus size={14} />
              Add Product
            </button>
          </div>

          {/* Product picker dropdown */}
          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`rounded-xl border p-3 space-y-2 ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}>
                  <div className="relative">
                    <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                    <input
                      autoFocus
                      className={`${inputCls} pl-8`}
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {availableProducts.length === 0 ? (
                      <p className={`text-sm text-center py-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No products found</p>
                    ) : (
                      availableProducts.map((p) => (
                        <button
                          type="button"
                          key={p._id}
                          onClick={() => addItem(p)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                            darkMode ? "hover:bg-gray-600" : "hover:bg-white"
                          } ${p.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={p.stock === 0}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {p.images?.[0] && (
                              <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className={`font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{p.name}</p>
                              <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                Stock: {p.stock} · {p.category}
                              </p>
                            </div>
                          </div>
                          <span className={`font-semibold shrink-0 ml-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {fmt(p.discountPrice || p.price)}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Items list */}
          {items.length === 0 ? (
            <p className={`text-sm text-center py-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              No items added yet — click "Add Product" above
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    darkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {item.product.images?.[0] && (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {item.product.name}
                    </p>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {fmt(item.product.discountPrice || item.product.price)} each
                    </p>
                  </div>
                  {/* Quantity control */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.product._id, item.quantity - 1)}
                      className={`w-7 h-7 rounded-lg border text-lg leading-none flex items-center justify-center transition-colors ${
                        darkMode ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >−</button>
                    <span className={`w-8 text-center text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.product._id, item.quantity + 1)}
                      className={`w-7 h-7 rounded-lg border text-lg leading-none flex items-center justify-center transition-colors ${
                        darkMode ? "bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >+</button>
                  </div>
                  <p className={`text-sm font-bold w-20 text-right shrink-0 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {fmt((item.product.discountPrice || item.product.price) * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {/* Total */}
              <div className={`flex justify-between font-bold text-sm pt-3 border-t ${
                darkMode ? "border-gray-600 text-white" : "border-gray-200 text-gray-900"
              }`}>
                <span>Total</span>
                <span className="text-indigo-500">{fmt(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Notes ── */}
        <div className={`rounded-2xl border p-5 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <label className={`text-xs font-medium block mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Notes (optional)
          </label>
          <textarea
            rows={2}
            className={`${inputCls} resize-none`}
            placeholder="Any special instructions or delivery notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ── Submit ── */}
        <motion.button
          type="submit"
          disabled={submitting || success}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-md ${
            submitting || success
              ? "bg-indigo-400 cursor-not-allowed"
              : darkMode
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitting ? (
            <><Loader2 size={18} className="animate-spin" /> Creating Order...</>
          ) : success ? (
            <><CheckCircle size={18} /> Order Created!</>
          ) : (
            <><ShoppingBag size={18} /> Log This Order</>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default AddOrderPage;
