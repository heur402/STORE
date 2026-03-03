// models/Order.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  color: {
    type: String,
    default: "",
  },
  seller: {
    type: String,
    default: "",
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
  },
  orderItems: [orderItemSchema],
  deliveryAddress: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  paymentMethod: {
    type: String,
    enum: ["MTN", "Airtel"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paymentResult: {
    id: String,
    status: String,
    email: String,
    reference: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  // Legacy status field for compatibility if needed, but we use orderStatus
  status: {
    type: String,
    enum: ["confirmed", "processing", "shipped", "delivered", "cancelled", "Pending", "Confirmed", "Out for Delivery"],
    default: "Pending",
  },
  trackingNumber: {
    type: String,
    default: "",
  },
  carrier: {
    type: String,
    default: "",
  },
  cancellationReason: {
    type: String,
    default: "",
  },
  promotions: [
    {
      code: String,
      discount: Number,
    },
  ],
}, {
  timestamps: true,
});

// Generate order number before saving
orderSchema.pre("save", async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD-${year}${month}-${random}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
