//src/component/ProductTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import StatsGrid from "../page/dashboard/StatsGrid";
import StockPieChart from "../page/dashboard/StockPieChart";
import { dashboardStats, stockStatus, recentProducts } from "../assets/assets";
import { container, item } from "../page/dashboard/utils";

const ProductTable = () => {

      const [products, setProducts] = useState(recentProducts);
      const [editingProduct, setEditingProduct] = useState(null);
    
      const darkMode = document.documentElement.classList.contains("dark");
    
      const styles = {
        card:
          "bg-white dark:bg-gray-800 rounded-2xl shadow p-6 transition-colors duration-300",
        text: {
          primary: "text-gray-800 dark:text-white",
          secondary: "text-gray-500 dark:text-gray-400",
        },
      };
    
      /* DELETE PRODUCT*/
    
      const handleDelete = (id) => {
        if (!window.confirm("Delete this product?")) return;
        setProducts(products.filter((p) => p.id !== id));
      };
    
      /*SAVE EDIT*/
    
      const handleSave = (updatedProduct) => {
        setProducts(
          products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          )
        );
        setEditingProduct(null);
      };

  return (
      <div>
          {/* ================= TABLE ================= */}
          <motion.div variants={item} className="lg:col-span-2">
            <h3 className={`text-lg font-semibold mb-4 ${styles.text.primary}`}>
              Product List
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t dark:border-gray-700"
                    >
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3">${product.price}</td>
                      <td className="p-3">{product.status}</td>
                      <td className="p-2 space-x-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-500 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ===================== EDIT MODAL ===================== */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

const EditModal = ({ product, onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState(product);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-6 dark:text-white">
          Edit Product
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 text-sm dark:text-gray-300">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm dark:text-gray-300">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm dark:text-gray-300">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option>Active</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable