import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Eye } from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [showDesc, setShowDesc] = useState(false);

  const isOutOfStock = product.stock === 0;

  // ✅ Discount logic
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  // ✅ Format prices (RWF)
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
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">

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
        <div className="relative w-full lg:pb-[120%] pb-96">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4">

          {/* NAME + CATEGORY + PRICE */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {product.category}
              </p>
            </div>

            {/* PRICE WITH DISCOUNT */}
            <div className="text-right whitespace-nowrap">
              {hasDiscount ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-400 line-through">
                    {formattedPrice}
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    {formattedDiscountPrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formattedPrice}
                </span>
              )}
            </div>
          </div>

          {/* DESCRIPTION TOGGLE */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowDesc(!showDesc)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <Eye
                className={`w-5 h-5 ${
                  showDesc ? "text-blue-600" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {showDesc && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <p className="text-gray-600 text-sm">
                {product.description || "No description available."}
              </p>
            </motion.div>
          )}

          {/* ADMIN ACTION BUTTONS */}
          <div className="flex gap-3 pt-3 border-t border-gray-100">
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