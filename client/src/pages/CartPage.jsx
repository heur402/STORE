import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones',
      image: '🎧',
      price: 199.99,
      originalPrice: 249.99,
      quantity: 1,
      color: 'Black',
      inStock: true,
      seller: 'AudioTech Store',
      shipping: 'Free Shipping',
      estimatedDelivery: 'Mar 20 - Mar 22',
      selected: true
    },
    {
      id: 2,
      name: 'Premium Phone Case - Silicone',
      image: '📱',
      price: 25.99,
      originalPrice: 34.99,
      quantity: 2,
      color: 'Midnight Blue',
      inStock: true,
      seller: 'GadgetGear',
      shipping: '$3.99 shipping',
      estimatedDelivery: 'Mar 18 - Mar 20',
      selected: true
    },
    {
      id: 3,
      name: 'Smart Watch Series 5',
      image: '⌚',
      price: 299.99,
      originalPrice: 349.99,
      quantity: 1,
      color: 'Space Gray',
      inStock: true,
      seller: 'TechWorld',
      shipping: 'Free Shipping',
      estimatedDelivery: 'Mar 21 - Mar 23',
      selected: false
    },
    {
      id: 4,
      name: 'Minimalist Backpack - 15L',
      image: '🎒',
      price: 79.99,
      originalPrice: 99.99,
      quantity: 1,
      color: 'Olive Green',
      inStock: false,
      seller: 'UrbanGear',
      shipping: 'Free Shipping',
      estimatedDelivery: 'Out of stock',
      selected: false
    },
    {
      id: 5,
      name: 'Wireless Charging Pad',
      image: '⚡',
      price: 39.99,
      originalPrice: 49.99,
      quantity: 1,
      color: 'White',
      inStock: true,
      seller: 'ChargeMaster',
      shipping: '$4.99 shipping',
      estimatedDelivery: 'Mar 19 - Mar 21',
      selected: true
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [saveForLater, setSaveForLater] = useState([]);

  // Calculate cart totals
  const selectedItems = cartItems.filter(item => item.selected && item.inStock);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = selectedItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;

  const shippingCost = selectedItems.reduce((sum, item) => {
    if (item.shipping === 'Free Shipping') return sum;
    return sum + 3.99; // Simplified shipping cost calculation
  }, 0);

  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const giftWrapCost = giftWrap ? 4.99 : 0;
  const tax = (subtotal - discount + shippingCost + giftWrapCost) * 0.08; // 8% tax
  const total = subtotal - discount + shippingCost + giftWrapCost + tax;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSaveForLater = (item) => {
    setSaveForLater(prev => [...prev, item]);
    handleRemoveItem(item.id);
  };

  const handleSelectItem = (itemId) => {
    setCartItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected || !item.inStock);
    setCartItems(prev => prev.map(item =>
      item.inStock ? { ...item, selected: !allSelected } : item
    ));
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </motion.div>
                  <span className={`ml-2 text-sm ${index === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
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
            {/* Cart Controls */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSelectAll}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span className={`w-5 h-5 rounded border flex items-center justify-center ${cartItems.every(item => !item.inStock || item.selected)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                    }`}>
                    {cartItems.every(item => !item.inStock || item.selected) && '✓'}
                  </span>
                  <span>Select All</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete Selected
                </motion.button>
              </div>

              <p className="text-gray-600 text-sm">
                {selectedItems.length} items selected
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
                    key={item.id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -100 }}
                    className={`bg-white rounded-xl shadow-sm p-6 ${!item.inStock ? 'opacity-60' : ''
                      }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Select Checkbox */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSelectItem(item.id)}
                        disabled={!item.inStock}
                        className={`w-6 h-6 rounded border flex items-center justify-center ${item.selected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300'
                          } ${!item.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {item.selected && '✓'}
                      </motion.button>

                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center text-4xl"
                      >
                        {item.image}
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div>
                            <motion.h3
                              className="font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                              whileHover={{ x: 2 }}
                            >
                              {item.name}
                            </motion.h3>

                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <span className="text-gray-600">Seller: {item.seller}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-gray-600">Color: {item.color}</span>
                            </div>

                            {/* Stock Status */}
                            <motion.p
                              className={`text-sm mt-1 ${item.inStock ? 'text-green-600' : 'text-red-600'
                                }`}
                              animate={!item.inStock ? { opacity: [1, 0.5, 1] } : {}}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {item.inStock ? '✓ In Stock' : '❌ Out of Stock'}
                            </motion.p>

                            {/* Shipping Info */}
                            <div className="flex items-center space-x-2 mt-2">
                              <span className="text-xs text-gray-500">🚚 {item.shipping}</span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500">📅 {item.estimatedDelivery}</span>
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
                              {item.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">
                                  ${(item.originalPrice * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            {item.inStock && (
                              <div className="flex items-center border border-gray-200 rounded-lg">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
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
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg"
                                >
                                  +
                                </motion.button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </motion.button>
                          <span className="text-gray-300">|</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSaveForLater(item)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                          >
                            Save for later
                          </motion.button>
                          <span className="text-gray-300">|</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            View similar
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
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {savings > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Savings</span>
                    <span>-${savings.toFixed(2)}</span>
                  </motion.div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>

                {promoApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-green-600"
                  >
                    <span>Promo Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </motion.div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-blue-600"
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg"
                  >
                    Apply
                  </motion.button>
                </div>
                {promoError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm mt-1"
                  >
                    {promoError}
                  </motion.p>
                )}
                {promoApplied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm mt-1"
                  >
                    ✓ Promo code applied successfully!
                  </motion.p>
                )}
              </div>

              {/* Shipping Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Method
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'standard', label: 'Standard Shipping', time: '5-7 business days', cost: 0 },
                    { id: 'express', label: 'Express Shipping', time: '2-3 business days', cost: 9.99 },
                    { id: 'overnight', label: 'Overnight Shipping', time: '1 business day', cost: 19.99 }
                  ].map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${shippingMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                        }`}
                      onClick={() => setShippingMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border ${shippingMethod === method.id
                            ? 'border-4 border-blue-500'
                            : 'border-gray-300'
                          }`} />
                        <div>
                          <p className="font-medium text-gray-800">{method.label}</p>
                          <p className="text-xs text-gray-500">{method.time}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-800">
                        {method.cost === 0 ? 'Free' : `$${method.cost}`}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gift Options */}
              <div className="mb-6">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <p className="font-medium text-gray-800">Gift Wrap</p>
                      <p className="text-xs text-gray-500">$4.99 per order</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setGiftWrap(!giftWrap)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${giftWrap ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <motion.span
                      layout
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${giftWrap ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </motion.button>
                </motion.div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg shadow-lg mb-3"
                disabled={selectedItems.length === 0}
              >
                Proceed to Checkout
              </motion.button>

              {/* Payment Icons */}
              <div className="flex justify-center space-x-2">
                {['💳', '💰', '🅿️', '🔷'].map((icon, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="text-xl"
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>

              {/* Secure Checkout Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-center text-gray-500 mt-4"
              >
                🔒 Secure checkout. Your information is protected.
              </motion.p>
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
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🛒
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CartPage;