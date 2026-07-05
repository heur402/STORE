// controllers/orderController.js
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  checkAndNotifyStock,
  notifyOrderCreated,
} from "../services/notificationService.js";

// ── Helper: update product stock flags after any stock change
const syncProductStockFlags = async (product) => {
  const isOutOfStock = product.stock <= 0;
  product.outOfStock = isOutOfStock;
  product.availabilityStatus = isOutOfStock ? "Out of Stock" : "In Stock";
  await product.save();
  // Fire notifications (each channel independently try/catches internally)
  await checkAndNotifyStock(product);
};

// ── POST /api/orders — Create a new order (public, WhatsApp-sourced)
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

    // Stock check (informational at creation — stock is only decremented on Confirmed)
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (item.quantity <= 0) return res.status(400).json({ message: `Invalid quantity for ${item.name}` });
    }

    const order = new Order({
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
    // In-app notification for new order (non-blocking)
    notifyOrderCreated(createdOrder).catch(() => {});

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── POST /api/orders/admin — Admin manually logs a WhatsApp order
export const adminCreateOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items, // [{ productId, productName, quantity, priceAtOrder }]
      paymentMethod = "MTN",
      deliveryAddress = {},
      notes = "",
    } = req.body;

    if (!customerName?.trim()) return res.status(400).json({ message: "Customer name is required" });
    if (!customerPhone?.trim()) return res.status(400).json({ message: "Customer phone is required" });
    if (!items || items.length === 0) return res.status(400).json({ message: "At least one item is required" });

    // Validate all products exist (no stock decrement yet — happens on Confirm)
    for (const item of items) {
      if (!item.productId) return res.status(400).json({ message: "Each item needs a productId" });
      if (!item.quantity || item.quantity < 1) return res.status(400).json({ message: `Invalid quantity for ${item.productName}` });
      const product = await Product.findById(item.productId);
      if (!product || product.isDeleted) return res.status(404).json({ message: `Product not found: ${item.productName}` });
    }

    // Build orderItems in the existing schema shape
    const orderItems = items.map((item) => ({
      product: item.productId,
      name: item.productName,
      price: item.priceAtOrder,
      quantity: item.quantity,
    }));

    const totalPrice = items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

    const order = new Order({
      guestName: customerName.trim(),
      guestPhone: customerPhone.trim(),
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice: totalPrice,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice,
      orderStatus: "Pending",
      paymentStatus: "Pending",
      cancellationReason: notes,
    });

    const createdOrder = await order.save();
    notifyOrderCreated(createdOrder).catch(() => {});

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/orders/:id/status — Update order status (Admin only)
// Handles stock decrement (Pending → Confirmed) and restore (→ Cancelled)
export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, paymentStatus, trackingNumber, carrier, cancellationReason } = req.body;
    const order = await Order.findById(req.params.id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    const prevStatus = order.orderStatus;

    // ── STOCK DECREMENT: Pending → Confirmed
    if (status === "Confirmed" && prevStatus === "Pending") {
      const LOW = parseInt(process.env.LOW_STOCK_THRESHOLD || "5", 10);

      // Pre-flight check — ensure ALL items have enough stock before touching anything
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product not found for item: ${item.name}` });
        }
        if (product.stock < item.quantity) {
          await session.abortTransaction();
          return res.status(400).json({
            message: `Not enough stock for "${product.name}" — only ${product.stock} left, need ${item.quantity}`,
            productId: product._id,
            productName: product.name,
            available: product.stock,
            requested: item.quantity,
          });
        }
      }

      // All good — decrement inside the transaction
      const updatedProducts = [];
      for (const item of order.orderItems) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );
        updatedProducts.push(product);
      }

      await session.commitTransaction();
      session.endSession();

      // Update stock flags + notifications OUTSIDE the transaction (non-critical)
      for (const product of updatedProducts) {
        await syncProductStockFlags(product);
      }
    } else {
      // ── STOCK RESTORE: any confirmed/in-flight → Cancelled
      const wasActive = ["Confirmed", "Out for Delivery"].includes(prevStatus);
      if (status === "Cancelled" && wasActive) {
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } },
            { session }
          );
          // Re-sync flags (might go back in stock)
          const product = await Product.findById(item.product);
          if (product) {
            product.outOfStock = product.stock <= 0;
            product.availabilityStatus = product.stock <= 0 ? "Out of Stock" : "In Stock";
            await product.save();
          }
        }
      }

      await session.commitTransaction();
      session.endSession();
    }

    // ── Apply status changes to the order
    const updatedOrder = await Order.findById(req.params.id);

    if (status) {
      updatedOrder.orderStatus = status;
      const legacyMap = {
        Pending: "processing",
        Confirmed: "confirmed",
        "Out for Delivery": "shipped",
        Delivered: "delivered",
        Cancelled: "cancelled",
      };
      updatedOrder.status = legacyMap[status] || "processing";

      if (status === "Delivered") {
        updatedOrder.isDelivered = true;
        updatedOrder.deliveredAt = Date.now();
      }
      if (status === "Cancelled" && cancellationReason) {
        updatedOrder.cancellationReason = cancellationReason;
      }
    }

    if (paymentStatus) {
      updatedOrder.paymentStatus = paymentStatus;
      if (paymentStatus === "Completed") {
        updatedOrder.isPaid = true;
        updatedOrder.paidAt = Date.now();
      }
    }
    if (trackingNumber) updatedOrder.trackingNumber = trackingNumber;
    if (carrier) updatedOrder.carrier = carrier;

    const saved = await updatedOrder.save();
    res.json(saved);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/orders — All orders (Admin)
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

// ── GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentStatus = "Completed";
    order.paymentResult = {
      id: req.body.id || `SIM-${Date.now()}`,
      status: "COMPLETED",
      email: req.body.email || "",
      reference: req.body.reference || `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
    };

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/orders/:id/deliver
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized" });

    order.orderStatus = "Delivered";
    order.status = "delivered";
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["Delivered"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Cannot cancel a delivered order" });
    }

    // Restore stock if order was already confirmed
    if (["Confirmed", "Out for Delivery"].includes(order.orderStatus)) {
      for (const item of order.orderItems) {
        const product = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
        if (product) {
          product.outOfStock = product.stock <= 0;
          product.availabilityStatus = product.stock <= 0 ? "Out of Stock" : "In Stock";
          await product.save();
        }
      }
    }

    order.orderStatus = "Cancelled";
    order.status = "cancelled";
    order.cancellationReason = req.body.cancellationReason || "Cancelled";
    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── DELETE /api/orders/:id (Admin hard delete)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── GET /api/orders/dashboard/stats
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pending = await Order.countDocuments({ orderStatus: "Pending" });
    const confirmed = await Order.countDocuments({ orderStatus: "Confirmed" });
    const outForDelivery = await Order.countDocuments({ orderStatus: "Out for Delivery" });
    const delivered = await Order.countDocuments({ orderStatus: "Delivered" });
    const cancelled = await Order.countDocuments({ orderStatus: "Cancelled" });

    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      totalOrders, pending, confirmed, outForDelivery,
      delivered, cancelled,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
