import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Sample customer orders data
  const myOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-03-15',
      estimatedDelivery: '2024-03-18',
      status: 'delivered',
      items: [
        { 
          id: 1,
          name: 'Wireless Noise-Cancelling Headphones',
          image: '🎧',
          quantity: 1,
          price: 199.99,
          color: 'Black',
          seller: 'AudioTech Store'
        },
        { 
          id: 2,
          name: 'Premium Phone Case - Silicone',
          image: '📱',
          quantity: 2,
          price: 25.99,
          color: 'Midnight Blue',
          seller: 'GadgetGear'
        }
      ],
      subtotal: 251.97,
      shipping: 0,
      tax: 20.16,
      total: 272.13,
      paymentMethod: 'Visa •••• 4242',
      shippingAddress: '123 Main St, Apt 4B, Kigali,  KG 778 st',
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
      promotions: [
        { code: 'WELCOME10', discount: 25.20 }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: '2024-03-10',
      estimatedDelivery: '2024-03-14',
      status: 'shipped',
      items: [
        { 
          id: 3,
          name: 'Smart Watch Series 5',
          image: '⌚',
          quantity: 1,
          price: 299.99,
          color: 'Space Gray',
          seller: 'TechWorld'
        },
        { 
          id: 4,
          name: 'Smart Watch Screen Protector (2-pack)',
          image: '🛡️',
          quantity: 1,
          price: 15.99,
          seller: 'TechWorld'
        }
      ],
      subtotal: 315.98,
      shipping: 5.99,
      tax: 25.28,
      total: 347.25,
      paymentMethod: 'PayPal',
      shippingAddress: '123 Main St, Apt 4B, Kigali,  KG 778 st',
      trackingNumber: '9205590164917312759482',
      carrier: 'USPS'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-03-05',
      estimatedDelivery: '2024-03-09',
      status: 'processing',
      items: [
        { 
          id: 5,
          name: 'Minimalist Backpack - 15L',
          image: '🎒',
          quantity: 1,
          price: 79.99,
          color: 'Olive Green',
          seller: 'UrbanGear'
        },
        { 
          id: 6,
          name: 'Water Bottle - Stainless Steel',
          image: '🍶',
          quantity: 2,
          price: 24.99,
          color: 'Matte Black',
          seller: 'EcoLife'
        },
        { 
          id: 7,
          name: 'Laptop Sleeve - 13 inch',
          image: '💻',
          quantity: 1,
          price: 34.99,
          color: 'Gray',
          seller: 'UrbanGear'
        }
      ],
      subtotal: 164.96,
      shipping: 0,
      tax: 13.20,
      total: 178.16,
      paymentMethod: 'Mastercard •••• 1234',
      shippingAddress: '123 Main St, Apt 4B, Kigali,  KG 778 st'
    },
    {
      id: 'ORD-2024-004',
      date: '2024-02-28',
      estimatedDelivery: '2024-03-03',
      status: 'cancelled',
      items: [
        { 
          id: 8,
          name: 'Mechanical Keyboard - RGB',
          image: '⌨️',
          quantity: 1,
          price: 149.99,
          color: 'White',
          seller: 'KeyMaster'
        }
      ],
      subtotal: 149.99,
      shipping: 7.99,
      tax: 12.00,
      total: 169.98,
      paymentMethod: 'PayPal',
      shippingAddress: '123 Main St, Apt 4B, Kigali,  KG 778 st',
      cancellationReason: 'Changed mind - ordered different model'
    },
    {
      id: 'ORD-2024-005',
      date: '2024-03-12',
      estimatedDelivery: '2024-03-19',
      status: 'confirmed',
      items: [
        { 
          id: 9,
          name: 'Fitness Tracker Band',
          image: '🏃',
          quantity: 1,
          price: 89.99,
          color: 'Rose Gold',
          seller: 'FitLife'
        },
        { 
          id: 10,
          name: 'Replacement Bands (3-pack)',
          image: '📿',
          quantity: 1,
          price: 19.99,
          color: 'Mixed',
          seller: 'FitLife'
        }
      ],
      subtotal: 109.98,
      shipping: 0,
      tax: 8.80,
      total: 118.78,
      paymentMethod: 'Visa •••• 4242',
      shippingAddress: '123 Main St, Apt 4B, Kigali,  KG 778 st'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', icon: '📦', count: myOrders.length },
    { id: 'processing', label: 'Processing', icon: '⚙️', count: myOrders.filter(o => o.status === 'processing' || o.status === 'confirmed').length },
    { id: 'shipped', label: 'Shipped', icon: '🚚', count: myOrders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Delivered', icon: '✅', count: myOrders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', icon: '❌', count: myOrders.filter(o => o.status === 'cancelled').length }
  ];

  const statusConfig = {
    confirmed: { color: 'bg-blue-100 text-blue-800', icon: '✓', label: 'Confirmed' },
    processing: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'Processing' },
    shipped: { color: 'bg-purple-100 text-purple-800', icon: '🚚', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', icon: '✕', label: 'Cancelled' }
  };

  const filteredOrders = activeTab === 'all' 
    ? myOrders 
    : myOrders.filter(order => {
        if (activeTab === 'processing') {
          return order.status === 'processing' || order.status === 'confirmed';
        }
        return order.status === activeTab;
      });

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
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
                  📦
                </motion.span>
                My Orders
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Track, manage, and review your orders
              </motion.p>
            </div>
            
            {/* Quick Stats */}
            <motion.div 
              className="flex space-x-3 mt-4 md:mt-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-green-50 px-4 py-2 rounded-lg"
              >
                <p className="text-sm text-green-600">Delivered</p>
                <p className="text-xl font-semibold text-green-700">
                  {myOrders.filter(o => o.status === 'delivered').length}
                </p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="bg-blue-50 px-4 py-2 rounded-lg"
              >
                <p className="text-sm text-blue-600">In Transit</p>
                <p className="text-xl font-semibold text-blue-700">
                  {myOrders.filter(o => o.status === 'shipped').length}
                </p>
              </motion.div>
              <motion.div 
                variants={itemVariants}
                className="bg-purple-50 px-4 py-2 rounded-lg"
              >
                <p className="text-sm text-purple-600">Processing</p>
                <p className="text-xl font-semibold text-purple-700">
                  {myOrders.filter(o => o.status === 'processing' || o.status === 'confirmed').length}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-6 overflow-x-auto"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Orders List */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-sm p-12 text-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                📭
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders in this category yet.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
              >
                <span>🛍️</span>
                <span>Start Shopping</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  layout
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: 15 }}
                          className="text-3xl"
                        >
                          {statusConfig[order.status].icon}
                        </motion.div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <p className="font-semibold text-gray-800">{order.id}</p>
                            <motion.span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {statusConfig[order.status].label}
                            </motion.span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-gray-800">${order.total.toFixed(2)}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          {selectedOrder?.id === order.id ? 'Show Less' : 'View Details'}
                        </motion.button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center space-x-4 mt-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -5 }}
                          className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          <span className="text-2xl">{item.image}</span>
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                        </motion.div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Tracking Info for Shipped Orders */}
                    {order.status === 'shipped' && order.trackingNumber && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-purple-50 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-purple-600">🚚</span>
                          <div>
                            <p className="text-sm font-medium text-purple-800">On its way!</p>
                            <p className="text-xs text-purple-600">
                              {order.carrier} • Tracking: {order.trackingNumber}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="text-sm text-purple-700 font-medium"
                        >
                          Track Package →
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {selectedOrder?.id === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <div className="p-6 space-y-6">
                          {/* Order Items */}
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                            <div className="space-y-4">
                              {order.items.map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center justify-between bg-white p-4 rounded-xl"
                                >
                                  <div className="flex items-center space-x-4">
                                    <span className="text-3xl">{item.image}</span>
                                    <div>
                                      <p className="font-medium text-gray-800">{item.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {item.color && `Color: ${item.color} • `}
                                        Seller: {item.seller} • Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="font-semibold text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Shipping Info */}
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-white p-4 rounded-xl"
                            >
                              <h4 className="font-medium text-gray-800 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                              
                              {order.trackingNumber && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                                  <p className="text-sm text-gray-600">{order.trackingNumber}</p>
                                </div>
                              )}
                            </motion.div>

                            {/* Payment Info */}
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="bg-white p-4 rounded-xl"
                            >
                              <h4 className="font-medium text-gray-800 mb-2">Payment Method</h4>
                              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600">Subtotal</span>
                                  <span className="text-gray-800">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600">Shipping</span>
                                  <span className="text-gray-800">
                                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-gray-600">Tax</span>
                                  <span className="text-gray-800">${order.tax.toFixed(2)}</span>
                                </div>
                                {order.promotions && (
                                  <div className="flex justify-between text-sm mb-2 text-green-600">
                                    <span>Promo: {order.promotions[0].code}</span>
                                    <span>-${order.promotions[0].discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200">
                                  <span className="text-gray-800">Total</span>
                                  <span className="text-blue-600">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </motion.div>
                          </div>

                          {/* Cancellation Reason */}
                          {order.status === 'cancelled' && order.cancellationReason && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="bg-red-50 p-4 rounded-xl"
                            >
                              <p className="text-sm text-red-800">
                                <span className="font-medium">Cancellation reason:</span> {order.cancellationReason}
                              </p>
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            {order.status === 'delivered' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                                >
                                  Buy Again
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium"
                                >
                                  Write a Review
                                </motion.button>
                              </>
                            )}
                            {order.status === 'shipped' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium"
                              >
                                Track Package
                              </motion.button>
                            )}
                            {order.status === 'processing' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
                              >
                                Cancel Order
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium"
                            >
                              Need Help?
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;