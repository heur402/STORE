// pages/CartPage.jsx — guest checkout via WhatsApp, no auth required
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import WhatsAppModal from "../components/WhatsAppModal";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } },
    exit: { opacity: 0, x: -80 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500">
                {cartItems.length === 0
                  ? "No items yet"
                  : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 transition"
            >
              Clear cart
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {cartItems.length === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Browse our products and add something you like</p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Cart Items ── */}
            <div className="flex-1 space-y-3">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id || item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-orange-50 shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">⛽</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 capitalize mb-2">{item.category}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-orange-500">
                          RWF {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                        </span>
                        {item.discountPrice > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            RWF {(item.price * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="text-gray-300 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-gray-50 transition"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="px-3 text-sm font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-gray-50 transition"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4 text-sm">
                  {cartItems.map((item) => (
                    <div key={item._id || item.id} className="flex justify-between text-gray-600">
                      <span className="line-clamp-1 flex-1 mr-2">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        RWF {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-orange-500">RWF {totalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Delivery fee discussed on WhatsApp</p>
                </div>

                {/* WhatsApp Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-green-100"
                >
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </motion.button>

                <p className="text-xs text-center text-gray-400 mt-3">
                  No account needed — just your name &amp; number
                </p>

                <Link
                  to="/products"
                  className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-4 transition"
                >
                  ← Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        cartItems={cartItems}
        total={totalPrice}
        onOrderPlaced={() => {
          clearCart();           // empty the cart
          setIsWhatsAppOpen(false);
        }}
      />
    </div>
  );
};

export default CartPage;
