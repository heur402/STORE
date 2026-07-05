// src/components/NiheMartCard.jsx
// Clean product card inspired by NiheMart — image-first, price prominent
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";

const NiheMartCard = ({ product, onEdit, onDelete, darkMode }) => {
  const [hovered, setHovered] = useState(false);

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  const fmt = (val) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      maximumFractionDigits: 0,
    }).format(val);

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-shadow duration-300 ${
        darkMode
          ? "bg-gray-800 border border-gray-700 hover:shadow-lg hover:shadow-black/40"
          : "bg-white border border-gray-100 hover:shadow-md"
      }`}
    >
      {/* ── IMAGE ─────────────────────────────────── */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <motion.img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onError={(e) => {
            e.target.src = "https://placehold.co/300x300?text=No+Image";
          }}
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
          </div>
        )}

        {/* Admin action buttons — appear on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-2 inset-x-2 flex gap-1.5"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── INFO ──────────────────────────────────── */}
      <div className="p-2.5 space-y-1">
        {/* Price */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-sm font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            {fmt(displayPrice)}
          </span>
          {hasDiscount && (
            <span className={`text-xs line-through ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {fmt(product.price)}
            </span>
          )}
        </div>

        {/* Name */}
        <p className={`text-xs leading-snug line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {product.name}
        </p>

        {/* Category + stock count */}
        <div className="flex items-center justify-between pt-0.5">
          <span className={`text-[10px] capitalize px-1.5 py-0.5 rounded-md font-medium ${
            darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"
          }`}>
            {product.category}
          </span>
          {!isOutOfStock && (
            <span className={`text-[10px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NiheMartCard;
