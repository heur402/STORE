// src/components/WhatsAppModal.jsx
// 1. Saves the order to the DB and gets an order ID
// 2. Sends WhatsApp message with that order ID included
// 3. Clears the cart on success
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, MessageCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useGuest } from "../context/GuestContext";
import { orderAPI } from "../services/api";

// ── Your store's WhatsApp number (digits only, with country code)
const STORE_WHATSAPP = "250785313282";

const WhatsAppModal = ({ isOpen, onClose, cartItems = [], total = 0, onOrderPlaced }) => {
  const { guest, saveGuest } = useGuest();

  const [name, setName]   = useState(guest?.name  || "");
  const [phone, setPhone] = useState(guest?.phone || "");
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!name.trim())  errs.name  = "Name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[0-9+\s\-()]{7,15}$/.test(phone.trim()))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  // Build the WhatsApp message text, now including the order ID
  const buildMessage = (guestName, guestPhone, orderNumber) => {
    const itemLines = cartItems
      .map(
        (item) =>
          `  • ${item.name} x${item.quantity} — RWF ${(
            (item.discountPrice || item.price) * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    return (
      `Hello! I'd like to place an order.\n\n` +
      `*Order ID:* ${orderNumber}\n` +
      `*Name:* ${guestName}\n` +
      `*Phone:* ${guestPhone}\n\n` +
      `*Order Details:*\n${itemLines}\n\n` +
      `*Total: RWF ${total.toLocaleString()}*\n\n` +
      `Please confirm my order. Thank you!`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setApiError("");
    setLoading(true);

    try {
      // 1. Save the order to the database
      const info = saveGuest(name.trim(), phone.trim());

      const orderPayload = {
        guestName:  info.name,
        guestPhone: info.phone,
        orderItems: cartItems.map((item) => ({
          product:  item._id,
          name:     item.name,
          price:    item.discountPrice || item.price,
          quantity: item.quantity,
          image:    item.images?.[0] || "",
        })),
        deliveryAddress: { street: "", city: "", country: "Rwanda" },
        paymentMethod: "MTN",          // default — admin updates after WhatsApp confirm
        itemsPrice:    total,
        shippingPrice: 0,
        taxPrice:      0,
        totalPrice:    total,
      };

      const createdOrder = await orderAPI.create(orderPayload);
      const orderNumber  = createdOrder.orderNumber || `#${createdOrder._id.slice(-6).toUpperCase()}`;

      // 2. Build & open WhatsApp with the order ID in the message
      const message = encodeURIComponent(buildMessage(info.name, info.phone, orderNumber));
      window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`, "_blank", "noopener,noreferrer");

      // 3. Tell the parent (CartPage) to clear the cart and close
      onOrderPlaced?.(createdOrder);
      onClose();

    } catch (err) {
      setApiError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="bg-green-500 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                  <div>
                    <h2 className="text-white font-bold text-lg leading-tight">Order via WhatsApp</h2>
                    <p className="text-green-100 text-xs">Your order gets an ID — we'll confirm on WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="text-white/80 hover:text-white transition p-1 rounded-full hover:bg-white/20 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart summary */}
              {cartItems.length > 0 && (
                <div className="px-6 pt-4 pb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your order</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item._id || item.id} className="flex justify-between text-sm text-gray-700">
                        <span className="line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                        <span className="font-medium shrink-0">
                          RWF {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 mt-2 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-green-600">RWF {total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">

                {/* API error */}
                <AnimatePresence>
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{apiError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-sm text-gray-500">
                  We'll save your order and send the details to WhatsApp — your order number will be in the message.
                </p>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                      placeholder="e.g. Jean Baptiste"
                      disabled={loading}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-60 ${
                        errors.name ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                      placeholder="e.g. 0788 123 456"
                      disabled={loading}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-60 ${
                        errors.phone ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving order...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Place Order &amp; Open WhatsApp
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-center text-gray-400">
                  Your order will be saved and you'll be redirected to WhatsApp
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppModal;
