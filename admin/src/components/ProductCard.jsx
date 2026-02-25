// src/components/ProductCard.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Eye } from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete, darkMode }) => {
  const [showDesc, setShowDesc] = useState(false);

  const isOutOfStock = product.stock === 0;

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const formattedPrice = new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
  }).format(product.price);

  const formattedDiscountPrice = hasDiscount
    ? new Intl.NumberFormat("en-RW", {
        style: "currency",
        currency: "RWF",
      }).format(product.discountPrice)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <div className={`relative rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}>

        {/* STOCK BADGE */}
        <div
          className={`absolute top-4 left-4 z-20 text-xs font-semibold px-3 py-1 rounded-full ${
            isOutOfStock
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : `In Stock: ${product.stock}`}
        </div>

        {/* IMAGE */}
        <div className="relative w-full h-60 overflow-hidden">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />

          <AnimatePresence>
            {showDesc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowDesc(false)}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 cursor-pointer"
              >
                <p className="text-white text-center text-lg">
                  {product.description || "No description available."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">

          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold text-lg line-clamp-1 ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}>
                {product.name}
              </h3>
              <p className={`text-sm capitalize ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                {product.category}
              </p>
            </div>

            <div className="text-right whitespace-nowrap">
              {hasDiscount ? (
                <div className="flex flex-col items-end">
                  <span className={`text-sm line-through ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {formattedPrice}
                  </span>
                  <span className="text-lg font-bold text-red-500">
                    {formattedDiscountPrice}
                  </span>
                </div>
              ) : (
                <span className={`text-lg font-bold ${
                  darkMode ? "text-gray-200" : "text-gray-900"
                }`}>
                  {formattedPrice}
                </span>
              )}
            </div>
          </div>

          {/* DESCRIPTION BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowDesc(!showDesc)}
              className={`p-2 rounded-full transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Eye
                className={`w-5 h-5 ${
                  showDesc 
                    ? "text-blue-500" 
                    : darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* ADMIN ACTIONS */}
          <div className={`flex gap-3 pt-3 border-t ${
            darkMode ? "border-gray-700" : "border-gray-100"
          }`}>
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                         rounded-lg bg-blue-600 text-white text-sm font-medium 
                         hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 
                         rounded-lg bg-red-600 text-white text-sm font-medium 
                         hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;