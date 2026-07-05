// controllers/orderController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  checkAndNotifyStock,
  notifyOrderCreated,
} from "../services/notificationService.js";

// ── Helper: sync outOfStock flag + fire stock notifications
const syncProductStockFlags = async (product) => {
  const isOut = product.stock <= 0;
  product.outOfStock         = isOut;
  product.availabilityStatus = isOut ? "Out of Stock" : "In Stock";
  await product.save();
  await checkAndNotifyStock(product); // each channel has its own try/catch inside
};

// ─────────────────────────────────────────────────────────────
// POST /api/orders  — public, from client storefront
// ─────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems, deliveryAddress, paymentMethod,
      itemsPrice, shippingPrice, taxPrice, totalPrice,
      promotions, guestName, guestPhone,
    } = req.body;

    if (!orderItems || orderItems.length === 0)
      return res.status(400).json({ message: "No order items" });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (item.quantity <= 0)
        return res.status(400).json({ message: `Invalid quantity for ${item.name}` });
    }

    const order = new Order({
      user:        req.user?._id || null,
      guestName:   guestName  || "",
      guestPhone:  guestPhone || "",
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      promotions:   promotions || [],
      orderStatus:  "Pending",
      paymentStatus:"Pending",
    });

    const created = await order.save();
    notifyOrderCreated(created).catch(() => {}); // non-blocking

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/orders/admin  — admin manually logs a WhatsApp order
// ─────────────────────────────────────────────────────────────
export const adminCreateOrder = async (req, res) => {
  try {
    const {
      customerName, customerPhone,
      items, paymentMethod = "MTN",
      deliveryAddress = {}, notes = "",
    } = req.body;

    if (!customerName?.trim())
      return res.status(400).json({ message: "Customer name is required" });
    if (!customerPhone?.trim())
      return res.status(400).json({ message: "Customer phone is required" });
    if (!items || items.length === 0)
      return res.status(400).json({ message: "At least one item is required" });

    for (const item of items) {
      if (!item.productId)
        return res.status(400).json({ message: "Each item needs a productId" });
      if (!item.quantity || item.quantity < 1)
        return res.status(400).json({ message: `Invalid quantity for ${item.productName}` });
      const product = await Product.findById(item.productId);
      if (!product || product.isDeleted)
        return res.status(404).json({ message: `Product not found: ${item.productName}` });
    }

    const orderItems  = items.map((i) => ({
      product:  i.productId,
      name:     i.productName,
      price:    i.priceAtOrder,
      quantity: i.quantity,
    }));
    const totalPrice  = items.reduce((s, i) => s + i.priceAtOrder * i.quantity, 0);

    const order = new Order({
      guestName:   customerName.trim(),
      guestPhone:  customerPhone.trim(),
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice:   totalPrice,
      shippingPrice:0,
      taxPrice:     0,
      totalPrice,
      orderStatus:  "Pending",
      paymentStatus:"Pending",
      cancellationReason: notes,
    });

    const created = await order.save();
    notifyOrderCreated(created).catch(() => {});

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/orders/:id/status  — admin only
// Pending → Confirmed: decrement stock (transactional)
// Confirmed|Out for Delivery → Cancelled: restore stock
// ─────────────────────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  const { status, paymentStatus, trackingNumber, carrier, cancellationReason } = req.body;

  // ── Find the order first (outside session so we can return early)
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const prevStatus = order.orderStatus;

// ── STOCK DECREMENT: Pending → Confirmed (no transaction — standalone MongoDB)
  if (status === "Confirmed" && prevStatus === "Pending") {

    // Pre-flight: check EVERY item has enough stock before touching anything
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found for item: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.name}" — only ${product.stock} left, need ${item.quantity}`,
          productId:   product._id,
          productName: product.name,
          available:   product.stock,
          requested:   item.quantity,
        });
      }
    }

    // All checks passed — decrement each product
    const updatedProducts = [];
    for (const item of order.orderItems) {
      const p = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (p) updatedProducts.push(p);
    }

    // Sync flags + send notifications (non-critical, outside main flow)
    for (const p of updatedProducts) {
      await syncProductStockFlags(p);
    }
  }

  // ── STOCK RESTORE: Confirmed or Out for Delivery → Cancelled
  if (status === "Cancelled" && ["Confirmed", "Out for Delivery"].includes(prevStatus)) {
    for (const item of order.orderItems) {
      const p = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { new: true }
      );
      if (p) {
        p.outOfStock         = p.stock <= 0;
        p.availabilityStatus = p.stock <= 0 ? "Out of Stock" : "In Stock";
        await p.save();
      }
    }
  }

  // ── Apply status changes to the order document
  const legacyMap = {
    Pending:           "processing",
    Confirmed:         "confirmed",
    "Out for Delivery":"shipped",
    Delivered:         "delivered",
    Cancelled:         "cancelled",
  };

  if (status) {
    order.orderStatus = status;
    order.status      = legacyMap[status] || "processing";
    if (status === "Delivered") {
      order.isDelivered  = true;
      order.deliveredAt  = Date.now();
    }
    if (status === "Cancelled" && cancellationReason) {
      order.cancellationReason = cancellationReason;
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
  if (carrier)        order.carrier        = carrier;

  const saved = await order.save();
  res.json(saved);
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/track/:orderNumber  — public order tracking
// ─────────────────────────────────────────────────────────────
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber.toUpperCase(),
    }).select(
      "orderNumber orderStatus orderItems totalPrice guestName guestPhone deliveryAddress createdAt updatedAt isPaid paymentMethod cancellationReason isDelivered deliveredAt"
    );

    if (!order)
      return res.status(404).json({ message: "Order not found. Check your order number." });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/all  — admin: all orders
// ─────────────────────────────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/:id
// ─────────────────────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/myorders
// ─────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/orders/:id/pay
// ─────────────────────────────────────────────────────────────
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid        = true;
    order.paidAt        = Date.now();
    order.paymentStatus = "Completed";
    order.paymentResult = {
      id:        req.body.id        || `SIM-${Date.now()}`,
      status:    "COMPLETED",
      email:     req.body.email     || "",
      reference: req.body.reference || `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
    };

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/orders/:id/deliver
// ─────────────────────────────────────────────────────────────
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not authorized" });

    order.orderStatus = "Delivered";
    order.status      = "delivered";
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/orders/:id/cancel
// ─────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "Delivered")
      return res.status(400).json({ message: "Cannot cancel a delivered order" });

    if (["Confirmed", "Out for Delivery"].includes(order.orderStatus)) {
      for (const item of order.orderItems) {
        const p = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { new: true }
        );
        if (p) {
          p.outOfStock         = p.stock <= 0;
          p.availabilityStatus = p.stock <= 0 ? "Out of Stock" : "In Stock";
          await p.save();
        }
      }
    }

    order.orderStatus        = "Cancelled";
    order.status             = "cancelled";
    order.cancellationReason = req.body.cancellationReason || "Cancelled";
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/orders/:id  — admin hard delete
// ─────────────────────────────────────────────────────────────
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/dashboard/stats
// ─────────────────────────────────────────────────────────────
export const getOrderStats = async (req, res) => {
  try {
    const [total, pending, confirmed, outForDelivery, delivered, cancelled, revenueAgg] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "Pending" }),
        Order.countDocuments({ orderStatus: "Confirmed" }),
        Order.countDocuments({ orderStatus: "Out for Delivery" }),
        Order.countDocuments({ orderStatus: "Delivered" }),
        Order.countDocuments({ orderStatus: "Cancelled" }),
        Order.aggregate([
          { $match: { isPaid: true } },
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ]),
      ]);

    res.json({
      totalOrders: total,
      pending, confirmed, outForDelivery, delivered, cancelled,
      totalRevenue: revenueAgg[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
