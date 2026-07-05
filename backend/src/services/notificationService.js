// src/services/notificationService.js
// Handles in-app (DB) + email notifications.
// Each channel is wrapped in try/catch so one failure never blocks others.
import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";

// ── Gmail transporter (created lazily so missing env vars don't crash startup)
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[Email] GMAIL_USER / GMAIL_APP_PASSWORD not set — email disabled");
    return null;
  }
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return _transporter;
};

// ── Save in-app notification to DB
const saveInApp = async (data) => {
  try {
    await Notification.create(data);
  } catch (err) {
    console.error("[Notification] Failed to save in-app notification:", err.message);
  }
};

// ── Send email (non-blocking — failure is logged, not thrown)
const sendEmail = async ({ subject, html, text }) => {
  const transporter = getTransporter();
  if (!transporter) return;

  const recipient = process.env.ADMIN_EMAIL;
  if (!recipient) {
    console.warn("[Email] ADMIN_EMAIL not set — skipping email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Store Admin" <${process.env.GMAIL_USER}>`,
      to: recipient,
      subject,
      text,
      html,
    });
    console.log(`[Email] Sent: ${subject}`);
  } catch (err) {
    console.error("[Email] Failed to send:", err.message);
  }
};

// ── PUBLIC: Notify out-of-stock
export const notifyOutOfStock = async (product) => {
  const msg = `Product "${product.name}" (ID: ${product._id}) is now OUT OF STOCK.`;

  // 1. In-app
  await saveInApp({
    message: msg,
    type: "out_of_stock",
    productId: product._id,
  });

  // 2. Email
  await sendEmail({
    subject: `Product Out of Stock: ${product.name}`,
    text: msg,
    html: `
      <h2 style="color:#dc2626;">⚠️ Product Out of Stock</h2>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Current Stock:</strong> 0</p>
      <p>Please restock this item as soon as possible.</p>
      <hr/>
      <small>Store Admin Panel — automated notification</small>
    `,
  });
};

// ── PUBLIC: Notify low-stock
export const notifyLowStock = async (product) => {
  const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD || "5", 10);
  const msg = `Product "${product.name}" is running low — only ${product.stock} unit(s) left (threshold: ${threshold}).`;

  await saveInApp({
    message: msg,
    type: "low_stock",
    productId: product._id,
  });

  await sendEmail({
    subject: `Low Stock Alert: ${product.name}`,
    text: msg,
    html: `
      <h2 style="color:#d97706;">⚠️ Low Stock Alert</h2>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Current Stock:</strong> ${product.stock}</p>
      <p><strong>Threshold:</strong> ${threshold}</p>
      <p>Consider restocking soon.</p>
      <hr/>
      <small>Store Admin Panel — automated notification</small>
    `,
  });
};

// ── PUBLIC: Notify new order created (in-app only)
export const notifyOrderCreated = async (order) => {
  const customerName = order.guestName || "Guest";
  const orderNum = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
  const msg = `New order ${orderNum} from ${customerName} (${order.guestPhone || "no phone"}) — RWF ${order.totalPrice?.toLocaleString()}`;

  await saveInApp({
    message: msg,
    type: "order_created",
    orderId: order._id,
  });

  // Also send email to admin for new order
  await sendEmail({
    subject: `New Order: ${orderNum} from ${customerName}`,
    text: msg,
    html: `
      <h2 style="color:#4f46e5;">🛍️ New Order Received</h2>
      <p><strong>Order ID:</strong> ${orderNum}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Phone:</strong> ${order.guestPhone || "—"}</p>
      <p><strong>Total:</strong> RWF ${order.totalPrice?.toLocaleString()}</p>
      <p><strong>Items:</strong> ${order.orderItems?.length || 0}</p>
      <p>Log in to the admin panel to confirm this order.</p>
      <hr/>
      <small>Store Admin Panel — automated notification</small>
    `,
  });
};

// ── PUBLIC: Check stock after decrement and fire alerts as needed
export const checkAndNotifyStock = async (product) => {
  const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD || "5", 10);

  if (product.stock <= 0) {
    await notifyOutOfStock(product);
  } else if (product.stock <= threshold) {
    await notifyLowStock(product);
  }
};
