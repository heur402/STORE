// src/context/ProductContext.jsx
import React, { createContext, useContext, useState } from "react";
import { recentProducts } from "../assets/assets";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(recentProducts);

  // Edit product
  const handleEdit = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === updatedProduct._id ? { ...updatedProduct } : p
      )
    );
  };

  // Delete product
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Add new product
  const handleAdd = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  return (
    <ProductContext.Provider
      value={{ products, setProducts, handleEdit, handleDelete, handleAdd }}
    >
      {children}
    </ProductContext.Provider>
  );
};