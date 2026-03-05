// src/page/AllProduct.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import EditModal from "../components/EditModal";
import AddProductModal from "../components/AddProductModal";
import { Search, Coffee, Utensils, Flame, Package } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const categories = [
  { name: "All", icon: Package },
  { name: "Drinks", icon: Coffee },
  { name: "Food", icon: Utensils },
  { name: "Gas", icon: Flame },
];

const AllProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { darkMode } = useOutletContext();

  const { products, handleEdit, handleDelete, handleAdd } = useProducts();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
      className={`min-h-screen transition-colors duration-300 mb-20 ${
        darkMode 
          ? "bg-gray-900" 
          : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
        {/* Header + Search + Add Button */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <motion.h1
              variants={itemVariants}
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-3 ${
                darkMode
                  ? "from-gray-200 to-gray-400"
                  : "from-gray-900 to-gray-600"
              }`}
            >
              All Products
            </motion.h1>
            <motion.p 
              variants={itemVariants} 
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Discover our curated collection of premium products
            </motion.p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Search input */}
            <motion.div
              className="relative w-full lg:w-[350px]"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`} />
              <input
                type="text"
                placeholder="Search products..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 transition-all duration-300 focus:ring-4 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 placeholder-gray-500 focus:ring-gray-700 shadow-lg shadow-gray-900/30"
                    : "bg-white text-gray-800 placeholder-gray-400 focus:ring-black/10 shadow-lg"
                }`}
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
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    darkMode 
                      ? "text-gray-500 hover:text-gray-300" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ✕
                </motion.button>
              )}
            </motion.div>

            {/* Add Product Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className={`px-6 py-1 lg:py-3 bg-gradient-to-r text-white rounded-xl md:text-sm lg:rounded-2xl cursor-pointer shadow-lg transition-colors ${
                darkMode
                  ? "from-indigo-600 to-purple-600 shadow-indigo-900/30"
                  : "from-black to-gray-800 shadow-black/25"
              }`}
            >
              Add Product
            </motion.button>
          </div>
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
                    ? darkMode
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                      : "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg shadow-black/25"
                    : darkMode
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:shadow-md border border-gray-700"
                    : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected
                      ? "text-white"
                      : darkMode
                      ? "text-gray-400 group-hover:text-gray-300"
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
          className={`text-sm mb-6 ${
            darkMode ? "text-gray-500" : "text-gray-500"
          }`}
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
              <ProductGrid
                products={filteredProducts.map((p) => ({ ...p }))}
                onEdit={setEditingProduct}
                onDelete={handleDelete}
                view="grid"
                darkMode={darkMode}
                key={filteredProducts.map((p) => p._id).join("-")}
              />
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
                <Package className={`w-20 h-20 mx-auto mb-4 ${
                  darkMode ? "text-gray-700" : "text-gray-300"
                }`} />
              </motion.div>

              <h3 className={`text-2xl font-semibold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                No products found
              </h3>
              <p className={`${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}>
                Try adjusting your search or filter criteria
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className={`mt-6 px-6 py-3 text-white rounded-2xl transition-colors shadow-lg ${
                  darkMode
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <EditModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleEdit}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default AllProduct;