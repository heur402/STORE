import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '../services/api';
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const backendStatusToUI = (status) => {
    switch (status) {
      case 'Pending': return 'processing';
      case 'Confirmed': return 'confirmed';
      case 'Out for Delivery': return 'shipped';
      case 'Delivered': return 'delivered';
      case 'Cancelled': return 'cancelled';
      default: return 'processing';
    }
  };

  const tabs = [
    { id: 'all', label: 'All Orders', icon: '📦', count: orders.length },
    { id: 'processing', label: 'Processing', icon: '⚙️', count: orders.filter(o => ['Pending', 'Confirmed'].includes(o.orderStatus)).length },
    { id: 'shipped', label: 'In Transit', icon: '🚚', count: orders.filter(o => o.orderStatus === 'Out for Delivery').length },
    { id: 'delivered', label: 'Delivered', icon: '✅', count: orders.filter(o => o.orderStatus === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', icon: '❌', count: orders.filter(o => o.orderStatus === 'Cancelled').length }
  ];

  const statusConfig = {
    confirmed: { color: 'bg-indigo-100 text-indigo-800', icon: <Package className="w-5 h-5" />, label: 'Confirmed' },
    processing: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-5 h-5" />, label: 'Processing' },
    shipped: { color: 'bg-orange-100 text-orange-800', icon: <Truck className="w-5 h-5" />, label: 'Out for Delivery' },
    delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-5 h-5" />, label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-5 h-5" />, label: 'Cancelled' }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders
    : orders.filter(order => {
      const uiStatus = backendStatusToUI(order.orderStatus);
        if (activeTab === 'processing') {
          return uiStatus === 'processing' || uiStatus === 'confirmed';
        }
      return uiStatus === activeTab;
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

  if (loading) return (
    <div className="pt-40 text-center min-h-screen bg-gray-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-600 font-bold text-lg tracking-tight">Fetching your orders...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <motion.h1 
                className="text-4xl font-extrabold text-gray-900 flex items-center tracking-tight"
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
                className="text-gray-500 mt-2 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Track, manage, and review your recent purchases
              </motion.p>
            </div>
            
            {/* Quick Stats */}
            <motion.div 
              className="flex space-x-3 mt-6 md:mt-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: 'Delivered', val: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'green' },
                { label: 'In Transit', val: orders.filter(o => o.orderStatus === 'Out for Delivery').length, color: 'orange' },
                { label: 'Confirmed', val: orders.filter(o => o.orderStatus === 'Confirmed').length, color: 'blue' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className={`bg-${stat.color}-50 px-5 py-3 rounded-2xl border border-${stat.color}-100`}
                >
                  <p className={`text-xs font-bold text-${stat.color}-600 uppercase tracking-wider`}>{stat.label}</p>
                  <p className={`text-2xl font-black text-${stat.color}-700 mt-1`}>
                    {stat.val}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex space-x-1 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto scroller-hide"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2.5 px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-100'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-bold">{tab.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeTab === tab.id
                ? 'bg-orange-400 text-white'
                : 'bg-gray-100 text-gray-500'
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
              className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl mb-6 grayscale opacity-40"
              >
                🛍️
              </motion.div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto font-medium">You haven't placed any orders in this category yet. Start shopping to fill this space!</p>
              <Link
                to="/products"
                className="inline-flex items-center space-x-2 bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
              >
                <span>🚀</span>
                <span>Explored Products</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
                className="space-y-6"
            >
                {filteredOrders.map((order) => {
                  const uiStatus = backendStatusToUI(order.orderStatus);
                  const config = statusConfig[uiStatus];

                  return (
                    <motion.div
                    key={order._id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    {/* Order Header */}
                    <div className="p-8 border-b border-gray-50">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center space-x-6">
                          <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.color}`}
                          >
                            {config.icon}
                          </motion.div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="font-black text-xl text-gray-900">{order.orderNumber || `#${order._id.slice(-8)}`}</p>
                              <motion.span 
                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.color}`}
                                whileHover={{ scale: 1.05 }}
                              >
                                {order.orderStatus}
                              </motion.span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1 font-medium">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end space-x-8 pt-4 lg:pt-0 border-t lg:border-none border-gray-50">
                          <div className="lg:text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grant Total</p>
                            <p className="text-2xl font-black text-orange-600">UGX {order.totalPrice.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/orders/${order._id}`}
                              className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                              <span>Tracking</span>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedOrder === order._id ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                            >
                              <Search className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex items-center flex-wrap gap-4 mt-8">
                        {order.orderItems.slice(0, 4).map((item, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-100 group relative"
                          >
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                              {item.quantity}
                            </span>
                          </motion.div>
                        ))}
                        {order.orderItems.length > 4 && (
                          <div className="text-xs font-black text-gray-400 tracking-widest ml-2">
                            +{order.orderItems.length - 4} MORE
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    <AnimatePresence>
                      {selectedOrder === order._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-50 bg-gray-50/50"
                        >
                          <div className="p-8 space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Package className="w-5 h-5" /></div>
                                  <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Order Info</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between"><span className="text-gray-400">Items:</span> <span className="font-bold">{order.orderItems.length}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-400">Payment:</span> <span className="font-bold">{order.paymentMethod}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-400">Paid:</span> <span className={`font-bold ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>{order.isPaid ? 'Yes' : 'No'}</span></div>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Truck className="w-5 h-5" /></div>
                                  <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Delivery</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                  <p className="text-gray-900 font-bold line-clamp-2">{order.deliveryAddress?.street || 'No address provided'}</p>
                                  <p className="text-gray-400 text-xs">{order.deliveryAddress?.city}, {order.deliveryAddress?.country}</p>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><ShoppingBag className="w-5 h-5" /></div>
                                  <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">Financials</h4>
                                  </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between"><span className="text-gray-400">Subtotal:</span> <span className="font-bold">UGX {order.itemsPrice.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-400">Delivery:</span> <span className="font-bold">UGX {order.shippingPrice.toLocaleString()}</span></div>
                                  <div className="flex justify-between border-t border-gray-50 pt-2"><span className="font-black text-gray-900 uppercase text-[10px]">Total:</span> <span className="font-black text-orange-600">UGX {order.totalPrice.toLocaleString()}</span></div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3">
                              <Link
                                to={`/orders/${order._id}`}
                                className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all"
                              >
                                Full Order Details
                              </Link>
                              {order.orderStatus === 'Delivered' && (
                                <button className="px-8 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                                  Review Products
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
