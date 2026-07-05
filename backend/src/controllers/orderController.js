// controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create a new order — works for both authenticated users and guests
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promotions,
      guestName,
      guestPhone,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Check stock availability for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
    }

    const order = new Order({
      // attach user if authenticated, otherwise leave null (guest order)
      user: req.user?._id || null,
      guestName: guestName || "",
      guestPhone: guestPhone || "",
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promotions: promotions || [],
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    const createdOrder = await order.save();

    // Reduce stock immediately to prevent over-ordering
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid (Simulated Payment Verification)
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Simulate payment verification delay (e.g., waiting for MTN/Airtel API response)
    console.log(`Verifying ${order.paymentMethod} payment for order ${order._id}...`);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = "Completed";
    order.paymentResult = {
      id: req.body.id || `SIM-${Date.now()}`,
      status: "COMPLETED",
      email: req.body.email || "customer@example.com",
      reference: req.body.reference || `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
    };

    const updatedOrder = await order.save();
    console.log(`Payment verified for order ${order._id}`);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to delivered
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow if user is admin OR the owner of the order
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.orderStatus = "Delivered";
    order.status = "delivered"; // Legacy support
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, carrier, cancellationReason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      const isNewlyCancelled = (status === "Cancelled" || status.toLowerCase() === "cancelled") && order.orderStatus !== "Cancelled";
      
      order.orderStatus = status;
      // map to legacy status field (simplified flow: Pending → Out for Delivery → Delivered)
      const statusMapping = {
        "Pending":          "processing",
        "Out for Delivery": "shipped",
        "Delivered":        "delivered",
        "Cancelled":        "cancelled",
        // Keep Confirmed for backwards compat with any existing orders
        "Confirmed":        "confirmed",
      };
      order.status = statusMapping[status] || "processing";
      
      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (isNewlyCancelled) {
        // Restore stock
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
          });
        }
      }
    }
    
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "Completed") {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (cancellationReason) order.cancellationReason = cancellationReason;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation of confirmed or processing orders
    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        message: "Cannot cancel order that has been shipped or delivered",
      });
    }

    if (order.status !== "cancelled") {
      // Restore stock
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.status = "cancelled";
    order.orderStatus = "Cancelled";
    order.cancellationReason = req.body.cancellationReason || "Cancelled by user";

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order (Admin - hard delete)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats (Admin)
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
    const processingOrders = await Order.countDocuments({ status: "processing" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      totalOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
