// src/components/WhatsAppModal.jsx
// Shows a name + phone form, then redirects to WhatsApp with cart details
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, MessageCircle } from "lucide-react";
import { useGuest } from "../context/GuestContext";

// ── Change this to your store's WhatsApp number (digits only, with country code)
const STORE_WHATSAPP = "250785313282"; // e.g. Rwanda +250

const WhatsAppModal = ({ isOpen, onClose, cartItems = [], total = 0 }) => {
  const { guest, saveGuest } = useGuest();

  const [name, setName] = useState(guest?.name || "");
  const [phone, setPhone] = useState(guest?.phone || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[0-9+\s\-()]{7,15}$/.test(phone.trim()))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  const buildMessage = (guestName, guestPhone) => {
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
      `*Name:* ${guestName}\n` +
      `*Phone:* ${guestPhone}\n\n` +
      `*Order Details:*\n${itemLines}\n\n` +
      `*Total: RWF ${total.toLocaleString()}*\n\n` +
      `Please confirm my order. Thank you!`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const info = saveGuest(name, phone);
    const message = encodeURIComponent(buildMessage(info.name, info.phone));
    const url = `https://wa.me/${STORE_WHATSAPP}?text=${message}`;

    // Open WhatsApp in new tab
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
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
                    <p className="text-green-100 text-xs">We'll confirm your order on WhatsApp</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition p-1 rounded-full hover:bg-white/20"
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
                <p className="text-sm text-gray-500">
                  Just share your name and number — we'll send the order details straight to WhatsApp.
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
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
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
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition ${
                        errors.phone ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Order on WhatsApp
                </motion.button>

                <p className="text-xs text-center text-gray-400">
                  You'll be redirected to WhatsApp with your order pre-filled
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
