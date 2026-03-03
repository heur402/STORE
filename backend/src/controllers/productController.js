// src/controllers/productController.js
import Product from "../models/Product.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, description, category, price, discountPrice, 
      stock, status, images, cylinderSize, purchaseType, availabilityStatus 
    } = req.body;
    
    const product = new Product({
      name, description, category, price, discountPrice,
      stock, status, images, cylinderSize, purchaseType, availabilityStatus
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Create product error:", err);
    // ... rest of error handling
    // Check for specific error types
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ message: messages });
    }
    if (err.code === 11000) {
      // Get the actual duplicate field
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `Duplicate value for field: ${duplicateField}` });
    }
    res.status(400).json({ message: err.message });
  }
};

// Get all products (excluding deleted)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Soft delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};