// src/component/ProductTable.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { recentProducts } from "../assets/assets";

const ProductTable = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState(recentProducts);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortType, setSortType] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  /* ================= FILTER + SORT ================= */

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    let updated = [...products];

    if (categoryFilter !== "all") {
      updated = updated.filter((p) => p.category === categoryFilter);
    }

    if (sortType === "latest") {
      updated.sort((a, b) => b.id - a.id);
    } else {
      updated.sort((a, b) => a.id - b.id);
    }

    return updated;
  }, [products, sortType, categoryFilter]);

  /* ================= DELETE ================= */

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400";
      case "Out of Stock":
        return "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Products
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort */}
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* Category */}
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Add Product */}
          <button
            onClick={() => navigate("/addproduct")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
              >
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>

                <td className="p-4 font-medium dark:text-white">
                  {product.name}
                </td>

                <td className="p-4 text-gray-600 dark:text-gray-300">
                  {product.category}
                </td>

                <td className="p-4 dark:text-gray-300">{product.stock}</td>

                <td className="p-4 font-medium dark:text-gray-300">
                  ${product.price}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                      product.status,
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg dark:bg-red-900/30 dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER BUTTON ================= */}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/allproduct")}
          className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg hover:opacity-80"
        >
          View All Products →
        </button>
      </div>

      {/* ================= EDIT MODAL ================= */}

      <AnimatePresence>
        {editingProduct && (
          <EditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={(updatedProduct) => {
              setProducts(
                products.map((p) =>
                  p.id === updatedProduct.id ? updatedProduct : p,
                ),
              );
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================= EDIT MODAL ================= */

const EditModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Edit Product
        </h2>

        <div className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />

          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductTable;
