// src/services/notificationService.js
// Handles in-app (DB) + email notifications.
// Each channel is wrapped in try/catch so one failure never blocks others.
import nodemailer from "nodemailer";
import Notification from "../models/Notification.js";

// ── Gmail transporter — created fresh each time so .env changes are picked up
//    without restarting the server.
const getTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ""); // strip any spaces

  if (!user || !pass) {
    console.warn("[Email] GMAIL_USER / GMAIL_APP_PASSWORD not set — email disabled");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

// ── Save in-app notification to DB
const saveInApp = async (data) => {
  try {
    await Notification.create(data);
  } catch (err) {
    console.error("[Notification] Failed to save in-app notification:", err.message);
  }
};

// ── Send email — logs success/failure, never throws
const sendEmail = async ({ subject, html, text }) => {
  const transporter = getTransporter();
  if (!transporter) return;

  const recipient = process.env.ADMIN_EMAIL;
  if (!recipient) {
    console.warn("[Email] ADMIN_EMAIL not set — skipping email");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Store Admin" <${process.env.GMAIL_USER}>`,
      to: recipient,
      subject,
      text,
      html,
    });
    console.log(`[Email] ✓ Sent "${subject}" → ${recipient} (messageId: ${info.messageId})`);
  } catch (err) {
    // Log the full error so you can see exactly what Gmail rejected
    console.error(`[Email] ✗ Failed to send "${subject}":`, err.message);
    if (err.responseCode) console.error(`[Email]   SMTP code: ${err.responseCode} — ${err.response}`);
  }
};

// ── PUBLIC: Verify Gmail credentials on startup (call once from server.js)
export const verifyEmailConfig = async () => {
  const transporter = getTransporter();
  if (!transporter) return;
  try {
    await transporter.verify();
    console.log("[Email] ✓ Gmail connection verified — ready to send");
  } catch (err) {
    console.error("[Email] ✗ Gmail verification failed:", err.message);
    console.error("[Email]   Check GMAIL_USER and GMAIL_APP_PASSWORD in .env");
    if (err.responseCode) console.error(`[Email]   SMTP response: ${err.responseCode} — ${err.response}`);
  }
};

// ── PUBLIC: Notify out-of-stock
export const notifyOutOfStock = async (product) => {
  const msg = `Product "${product.name}" is now OUT OF STOCK.`;

  await saveInApp({
    message: msg,
    type: "out_of_stock",
    productId: product._id,
  });

  await sendEmail({
    subject: `⚠️ Out of Stock: ${product.name}`,
    text: msg,
    html: `
      <div style="font-family:sans-serif;max-width:500px">
        <h2 style="color:#dc2626;">⚠️ Product Out of Stock</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#666">Product</td><td><strong>${product.name}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Category</td><td>${product.category}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Stock</td><td><strong style="color:#dc2626">0</strong></td></tr>
        </table>
        <p style="margin-top:16px">Please restock this item as soon as possible.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <small style="color:#999">Store Admin Panel — automated notification</small>
      </div>
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
    subject: `🟡 Low Stock: ${product.name} (${product.stock} left)`,
    text: msg,
    html: `
      <div style="font-family:sans-serif;max-width:500px">
        <h2 style="color:#d97706;">🟡 Low Stock Alert</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#666">Product</td><td><strong>${product.name}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Category</td><td>${product.category}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Stock left</td><td><strong style="color:#d97706">${product.stock}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Threshold</td><td>${threshold}</td></tr>
        </table>
        <p style="margin-top:16px">Consider restocking soon.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <small style="color:#999">Store Admin Panel — automated notification</small>
      </div>
    `,
  });
};

// ── PUBLIC: Notify new order created (in-app + email)
export const notifyOrderCreated = async (order) => {
  const customerName = order.guestName || "Guest";
  const orderNum     = order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`;
  const itemsList    = (order.orderItems || [])
    .map((i) => `<li>${i.name} × ${i.quantity} — RWF ${(i.price * i.quantity).toLocaleString()}</li>`)
    .join("");
  const msg = `New order ${orderNum} from ${customerName} (${order.guestPhone || "no phone"}) — RWF ${order.totalPrice?.toLocaleString()}`;

  await saveInApp({
    message: msg,
    type: "order_created",
    orderId: order._id,
  });

  await sendEmail({
    subject: `🛍️ New Order ${orderNum} — RWF ${order.totalPrice?.toLocaleString()}`,
    text: msg,
    html: `
      <div style="font-family:sans-serif;max-width:500px">
        <h2 style="color:#4f46e5;">🛍️ New Order Received</h2>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px 0;color:#666">Order ID</td><td><strong>${orderNum}</strong></td></tr>
          <tr><td style="padding:6px 0;color:#666">Customer</td><td>${customerName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Phone</td><td>${order.guestPhone || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Total</td><td><strong>RWF ${order.totalPrice?.toLocaleString()}</strong></td></tr>
        </table>
        <p style="margin-top:12px;font-weight:bold">Items:</p>
        <ul style="margin:0;padding-left:20px">${itemsList}</ul>
        <p style="margin-top:16px">Log in to the admin panel to confirm this order.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <small style="color:#999">Store Admin Panel — automated notification</small>
      </div>
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
