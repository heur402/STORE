import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

const OrderStatusIcon = ({ status }) => {
  switch (status) {
    case 'Pending': return <Clock className="h-6 w-6 text-yellow-500" />;
    case 'Confirmed': return <Package className="h-6 w-6 text-blue-500" />;
    case 'Out for Delivery': return <Truck className="h-6 w-6 text-orange-500" />;
    case 'Delivered': return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'Cancelled': return <AlertCircle className="h-6 w-6 text-red-500" />;
    default: return <Package className="h-6 w-6 text-gray-500" />;
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getById(id);
        if (isMounted) setOrder(data);
      } catch (err) {
        if (isMounted && !order) setError(err.message || "Could not fetch order details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    // Real-time polling every 10 seconds to detect delivery status changes
    const intervalId = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [id]);

  if (loading) return (
    <div className="pt-40 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-600 font-medium">Loading your order...</p>
    </div>
  );

  if (error || !order) return (
    <div className="pt-40 text-center text-red-500">
      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
      <p className="text-xl font-bold">{error || "Order not found"}</p>
      <Link to="/orders" className="text-orange-500 hover:underline mt-4 inline-block">
        Back to My Orders
      </Link>
    </div>
  );

  const steps = ['Pending', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  const stepColors = [
    { active: 'bg-amber-500 border-amber-200', text: 'text-amber-600' },
    { active: 'bg-blue-500 border-blue-200', text: 'text-blue-600' },
    { active: 'bg-emerald-500 border-emerald-200', text: 'text-emerald-600' },
  ];

  const progressPct = currentStepIndex <= 0 ? 0 : (currentStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="pt-30 min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="flex items-center text-gray-600 hover:text-orange-500 mb-8 w-fit transition-colors">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Order #: {order.orderNumber || order._id}</p>
              <h1 className="text-2xl font-bold text-gray-900">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </h1>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              <OrderStatusIcon status={order.orderStatus} />
              {order.orderStatus}
            </div>
          </div>
        </div>

        {/* Tracking Progress */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-8">Delivery Progress</h2>
            <div className="relative">
              {/* Background track */}
              <div className="absolute top-5 left-0 w-full h-1.5 bg-gray-100 rounded-full" />
              {/* Filled track */}
              <motion.div
                className="absolute top-5 left-0 h-1.5 rounded-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isDone = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <motion.div
                        animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-colors duration-500 shadow-sm ${isDone
                            ? `${stepColors[index]?.active || 'bg-orange-500 border-orange-100'} text-white`
                            : 'bg-white border-gray-200 text-gray-400'
                          }`}
                      >
                        {isDone ? <CheckCircle className="h-5 w-5" /> : index + 1}
                      </motion.div>
                      <p className={`mt-3 text-xs font-bold text-center max-w-[70px] ${isDone ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">RWF {(item.price || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>RWF {(order.itemsPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>RWF {(order.shippingPrice || 0).toLocaleString()}</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>RWF {(order.taxPrice || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-extrabold text-orange-600 pt-2 border-t border-dashed border-gray-200">
                  <span>Total</span>
                  <span>RWF {(order.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Delivery
              </h2>
              <p className="text-sm font-bold text-gray-900 mb-1">{order.user.name}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Payment
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{order.paymentMethod === 'MTN' ? '🟡' : '🔴'}</span>
                <p className="text-sm font-bold text-gray-900">{order.paymentMethod} Money</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className={`text-xs font-bold px-2 py-1 rounded self-start ${
                  order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </p>
                
                {order.paymentStatus === 'Pending' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const updatedOrder = await orderAPI.pay(order._id);
                        setOrder(updatedOrder);
                        alert("Payment successful! (Simulated)");
                      } catch (err) {
                        alert(err.message || "Payment failed");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Pay Now with {order.paymentMethod}
                  </motion.button>
                )}

                {order.orderStatus === 'Out for Delivery' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 bg-blue-50 rounded-2xl border border-blue-100"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        className="text-xl"
                      >🚚</motion.span>
                      <p className="text-sm font-bold text-blue-800">Your order is on the way!</p>
                    </div>
                    <p className="text-xs text-blue-600 mb-3">Once received, please confirm delivery below.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        if (window.confirm("Confirm that you have received your order?")) {
                          setLoading(true);
                          try {
                            const updatedOrder = await orderAPI.deliver(order._id);
                            setOrder(updatedOrder);
                            alert("Thank you for confirming receipt! 🎉");
                          } catch (err) {
                            alert(err.message || "Failed to confirm delivery");
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirm I Received My Order
                    </motion.button>
                  </motion.div>
                )}

                {order.orderStatus === 'Delivered' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Delivery confirmed ✓</p>
                      {order.deliveredAt && (
                        <p className="text-xs text-emerald-600 mt-0.5">
                          on {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
