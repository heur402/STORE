// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  status: { type: String, default: "Active" },
  images: { type: [String], default: [] },
  // Gas specific fields
  cylinderSize: { 
    type: String, 
    enum: ["6kg", "12kg", "20kg", "25kg", ""], 
    default: "" 
  },
  purchaseType: { 
    type: String, 
    enum: ["Refill", "New", ""], 
    default: "" 
  },
  availabilityStatus: { 
    type: String, 
    enum: ["In Stock", "Out of Stock"], 
    default: "In Stock" 
  },
  // Explicit out-of-stock flag for fast queries / storefront hiding
  outOfStock: {
    type: Boolean,
    default: false,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;