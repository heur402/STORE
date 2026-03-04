// src/components/ProductGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onEdit, onDelete, view = "grid", darkMode }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  // ----- TABLE VIEW -----
  if (view === "table") {
    return (
      <table className="w-full text-sm text-left">
        <thead className={`uppercase text-xs ${
          darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
        }`}>
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Price</th>
            <th className="p-4">Likes</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className={`border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <td className="p-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </td>
              <td className={`p-4 font-medium ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}>
                {product.name}
              </td>
              <td className={`p-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {product.category}
              </td>
              <td className={`p-4 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                {product.stock}
              </td>
              <td className="p-4">
                {product.discountPrice > 0 ? (
                  <div className="flex flex-col">
                    <span className={`line-through text-xs ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}>
                      {product.price}
                    </span>
                    <span className="text-red-500 font-semibold">
                      {product.discountPrice}
                    </span>
                  </div>
                ) : (
                  <span className={darkMode ? "text-gray-200" : "text-gray-800"}>
                    {product.price}
                  </span>
                )}
              </td>
              <td className={`p-4 ${darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                <div className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span>
                  {product.likes?.length || 0}
                </div>
              </td>
              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="px-3 py-1 md:text-xs text-xl md:bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="px-3 py-1 md:text-xs text-xl md:bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ----- GRID VIEW -----
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
    >
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          variants={itemVariants}
          custom={index}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <ProductCard 
            product={{ ...product }} 
            onEdit={onEdit} 
            onDelete={onDelete}
            darkMode={darkMode}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;