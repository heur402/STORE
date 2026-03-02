// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { productAPI } from "../services/api";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit product
  const handleEdit = async (updatedProduct) => {
    try {
      // Filter to only send fields that match the Product model
      const productData = {
        name: updatedProduct.name,
        description: updatedProduct.description,
        category: updatedProduct.category,
        price: Number(updatedProduct.price) || 0,
        discountPrice: Number(updatedProduct.discountPrice) || 0,
        stock: Number(updatedProduct.stock) || 0,
        status: updatedProduct.status || "Active",
        images: updatedProduct.images || [],
      };

      // Update via API
      const savedProduct = await productAPI.update(updatedProduct._id, productData);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === savedProduct._id ? { ...savedProduct } : p
        )
      );
    } catch (err) {
      setError(err.message);
      console.error("Failed to update product:", err);
    }
  };

  // Delete product (soft delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete product:", err);
    }
  };

  // Add new product
  const handleAdd = async (newProduct) => {
    try {
      // Filter to only send fields that match the Product model
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        price: Number(newProduct.price) || 0,
        discountPrice: Number(newProduct.discountPrice) || 0,
        stock: Number(newProduct.stock) || 0,
        status: newProduct.status || "Active",
        images: newProduct.images || [],
      };

      const savedProduct = await productAPI.create(productData);
      setProducts((prev) => [savedProduct, ...prev]);
    } catch (err) {
      setError(err.message);
      console.error("Failed to add product:", err);
      alert(err.message || "Failed to add product");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        setProducts,
        handleEdit,
        handleDelete,
        handleAdd,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};