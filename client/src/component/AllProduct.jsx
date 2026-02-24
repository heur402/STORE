// src/page/AllProduct.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { recentProducts } from "../assets/assets";
import ProductGrid from "../components/ProductGrid";
import { Search, Coffee, Utensils, Fuel, Package } from "lucide-react";

const categories = [
  { name: "All", icon: Package },
  { name: "Drinks", icon: Coffee },
  { name: "Food", icon: Utensils },
  { name: "Fuel", icon: Fuel },
];

const AllProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return recentProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
        
        {/* Header + Search Inline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          {/* Left Side - Title & Description */}
          <div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3"
            >
              All Products
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg"
            >
              Discover our curated collection of premium products
            </motion.p>
          </div>

          {/* Right Side - Search */}
          <motion.div
            className="relative w-full lg:w-[450px]"
            animate={{ scale: isSearchFocused ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white shadow-lg focus:ring-4 focus:ring-black/10 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />

            {searchTerm && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 justify-center md:justify-start mb-8"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;

            return (
              <motion.button
                key={category.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-black/25"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                {category.name}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 mb-6"
        >
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </motion.p>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="product-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductGrid products={filteredProducts} />
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              </motion.div>

              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>

              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="mt-6 px-6 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors shadow-lg"
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AllProduct;