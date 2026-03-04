// src/components/ProductTable.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import EditModal from "./EditModal";
import AddProductModal from "./AddProductModal";
import { useProducts } from "../context/ProductContext";

const ProductTable = () => {
  const navigate = useNavigate();
  const { products, handleEdit, handleDelete, handleAdd } = useProducts(); 
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const { darkMode } = useOutletContext();
  const [sortType, setSortType] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let updated = [...products];
    if (categoryFilter !== "all")
      updated = updated.filter((p) => p.category === categoryFilter);
    updated.sort((a, b) => {
      if (sortType === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortType === "mostLiked") return (b.likes?.length || 0) - (a.likes?.length || 0);
      if (sortType === "leastLiked") return (a.likes?.length || 0) - (b.likes?.length || 0);
      return 0;
    });
    return updated;
  }, [products, sortType, categoryFilter]);

  return (
    <div className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl md:flex hidden font-semibold ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}>
          Products
        </h2>

        <div className="flex gap-3 items-center">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className={`px-3 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLiked">Most Liked ❤️</option>
            <option value="leastLiked">Least Liked</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Add Product button opens modal */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 flex gap-1 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + <span className="md:flex hidden"> Add </span> Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductGrid
          products={filteredProducts.map((p) => ({ ...p }))}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
          view="table"
          darkMode={darkMode}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/allproduct")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors duration-300 ${
            darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          View All Products →
        </button>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEdit}
          darkMode={darkMode}
        />
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newProduct) => {
            handleAdd(newProduct);
            setIsAddModalOpen(false);
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default ProductTable;