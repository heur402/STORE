import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'Uganda'
  });
  const [paymentMethod, setPaymentMethod] = useState('MTN');
  const [saveForLater, setSaveForLater] = useState([]);

  // Calculate cart totals
  const subtotal = totalPrice;
  const shippingCost = shippingMethod === 'standard' ? 0 : (shippingMethod === 'express' ? 9.99 : 19.99);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount + shippingCost) * 0.05; // 5% tax
  const total = subtotal - discount + shippingCost + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.city) {
      alert("Please provide a delivery address");
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || '⛽',
          price: item.price,
          product: item._id || item.id,
        })),
        deliveryAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: total,
      };

      const response = await orderAPI.create(orderData);
      alert("Order placed successfully!");
      clearCart();
      const orderId = response?._id || response?.order?._id;
      navigate(`/orders/${orderId}`);
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleQuantityChange = (id, newQty) => id && updateQuantity(id, newQty);
  const handleRemoveItem = (id) => id && removeFromCart(id);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-30">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-900 flex items-center"
                whileHover={{ x: 5 }}
              >
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-3"
                >
                  🛒
                </motion.span>
                Shopping Cart
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </motion.p>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center space-x-4">
              {['Cart', 'Checkout', 'Payment', 'Confirmation'].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </motion.div>
                  <span className={`ml-2 text-sm ${index === 0 ? 'text-orange-600 font-medium' : 'text-gray-500'
                    }`}>
                    {step}
                  </span>
                  {index < 3 && <span className="mx-2 text-gray-300">→</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1">
            {/* Cart Header info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between"
            >
              <h2 className="text-xl font-bold text-gray-800">Your Items</h2>
              <p className="text-gray-600 text-sm">
                Review your items before checkout
              </p>
            </motion.div>

            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id || item.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-24 h-24 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center text-4xl"
                      >
                        {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : (item.image || '⛽')}
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <motion.h3
                              className="font-semibold text-gray-800 hover:text-orange-600 cursor-pointer"
                              whileHover={{ x: 2 }}
                            >
                              {item.name}
                            </motion.h3>

                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-gray-600">Category: {item.category}</span>
                              {item.cylinderSize && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <span className="text-gray-600">Size: {item.cylinderSize}</span>
                                </>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-green-600 font-medium">✓ Available for Delivery</span>
                            </div>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex flex-row md:flex-col items-center md:items-end space-x-4 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                            <div className="text-right">
                              <motion.p
                                className="text-2xl font-bold text-gray-800"
                                whileHover={{ scale: 1.05 }}
                              >
                                ${(item.price * item.quantity).toFixed(2)}
                              </motion.p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                              >
                                −
                              </motion.button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="px-3 py-1 text-gray-800 font-medium"
                              >
                                {item.quantity}
                              </motion.span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                              >
                                +
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(item._id || item.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Save for Later Section */}
            {saveForLater.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">⏰</span>
                  Saved for Later ({saveForLater.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {saveForLater.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4"
                    >
                      <span className="text-3xl">{item.image}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600">${item.price}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setCartItems(prev => [...prev, item]);
                          setSaveForLater(prev => prev.filter(i => i.id !== item.id));
                        }}
                        className="text-blue-600"
                      >
                        Move to Cart
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:w-96"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>UGX {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `UGX ${shippingCost.toLocaleString()}`}</span>
                </div>

                {promoApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Promo Discount (10%)</span>
                    <span>-UGX {discount.toLocaleString()}</span>
                  </motion.div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax (5%)</span>
                  <span>UGX {tax.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-orange-600"
                    >
                      UGX {total.toLocaleString()}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6 space-y-3">
                <h3 className="font-medium text-gray-800 border-b pb-2">Delivery Details</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">STREET ADDRESS</label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    placeholder="e.g. Plot 12, Kampala Rd"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">CITY / AREA</label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    placeholder="e.g. Kampala"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['MTN', 'Airtel'].map((method) => (
                    <motion.button
                      key={method}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${paymentMethod === method
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-100 hover:border-gray-200 text-gray-600'
                        }`}
                    >
                      <span className="text-xl mb-1">{method === 'MTN' ? '🟡' : '🔴'}</span>
                      <span className="text-sm font-bold">{method} Money</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckingOut}
                className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg mb-3 flex items-center justify-center space-x-2 ${cartItems.length === 0 || isCheckingOut
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  }`}
              >
                {isCheckingOut ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <span>→</span>
                  </>
                )}
              </motion.button>

              {/* Secure Checkout Note */}
              <p className="text-xs text-center text-gray-500">
                🔒 Secure payment via {paymentMethod} Mobile Money
              </p>
            </div>

            {/* Recommended Products */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6 mt-4"
            >
              <h3 className="font-semibold text-gray-800 mb-4">You might also like</h3>
              <div className="space-y-3">
                {[
                  { name: 'Portable Power Bank', image: '🔋', price: 49.99 },
                  { name: 'Bluetooth Speaker', image: '🔊', price: 89.99 },
                  { name: 'Laptop Sleeve', image: '💼', price: 34.99 }
                ].map((product, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{product.image}</span>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-blue-600">${product.price}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-blue-600"
                    >
                      +
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Empty Cart State */}
      {cartItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage;