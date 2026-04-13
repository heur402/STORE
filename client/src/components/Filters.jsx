// components/Filters.jsx
import React, { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Filters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSearch, 
  onSortChange,
  sortBy
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput('');
    onSearch('');
  };

  const sortOptions = [
    { value: 'default', label: 'Recommended' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating-desc', label: 'Top Rated' },
    { value: 'latest', label: 'Newest First' },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(opt => opt.value === sortBy)?.label || 'Recommended';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 
              focus:bg-white transition-all duration-200"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange('all')}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedCategory === category 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full lg:w-auto px-4 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 
              rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 
              flex items-center justify-between gap-2"
          >
            <span>Sort: {getCurrentSortLabel()}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 
                    overflow-hidden z-50"
                >
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 
                        transition-colors duration-150 ${
                        sortBy === option.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSortOpen(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Filters;