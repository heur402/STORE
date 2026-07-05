// src/page/Products.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { Search, Package, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import EditModal from "../components/EditModal";
import AddProductModal from "../components/AddProductModal";
import NiheMartCard from "../components/NiheMartCard";

const ITEMS_PER_PAGE = 20;

const Products = () => {
  const { darkMode } = useOutletContext();
  const { products, loading, handleEdit, handleDelete, handleAdd } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Build category list dynamically
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  // Filter + sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    list.sort((a, b) => {
      if (sortBy === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "price-asc") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === "price-desc") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0;
    });

    return list;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 on filter change
  const handleSearch = (val) => { setSearchTerm(val); setCurrentPage(1); };
  const handleCategory = (cat) => { setSelectedCategory(cat); setCurrentPage(1); };
  const handleSort = (val) => { setSortBy(val); setCurrentPage(1); };

  if (loading) {
    return (
      <div className={`p-6 w-full h-full flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

          {/* Title */}
          <h1 className={`text-2xl font-bold shrink-0 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
            Products
            <span className={`ml-2 text-sm font-normal ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              ({filteredProducts.length})
            </span>
          </h1>

          <div className="flex gap-2 items-center w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full pl-9 pr-8 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-colors ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-indigo-500"
                    : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-black/20"
                }`}
              />
              {searchTerm && (
                <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className={`w-3.5 h-3.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                </button>
              )}
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showFilters
                  ? darkMode ? "bg-indigo-600 border-indigo-600 text-white" : "bg-black border-black text-white"
                  : darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-600"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Add product */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors shrink-0 ${
                darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-black hover:bg-gray-800"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`border-t px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center ${
                darkMode ? "border-gray-700" : "border-gray-100"
              }`}>
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className={`text-sm px-3 py-2 rounded-lg border focus:outline-none transition-colors ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-300"
                      : "bg-white border-gray-200 text-gray-700"
                  }`}
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? darkMode
                            ? "bg-indigo-600 text-white"
                            : "bg-black text-white"
                          : darkMode
                          ? "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PRODUCT GRID ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {paginatedProducts.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchTerm}-${sortBy}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
            >
              {paginatedProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <NiheMartCard
                    product={product}
                    onEdit={setEditingProduct}
                    onDelete={handleDelete}
                    darkMode={darkMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <Package className={`w-16 h-16 mb-4 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
              <h3 className={`text-xl font-semibold mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                No products found
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Try adjusting your filters or search term
              </p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
                  darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-black hover:bg-gray-800"
                }`}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PAGINATION ───────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className={`px-2 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item
                        ? darkMode ? "bg-indigo-600 text-white" : "bg-black text-white"
                        : darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────────── */}
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
    </div>
  );
};

export default Products;
