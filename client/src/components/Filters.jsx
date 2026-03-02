// components/Filters.jsx
import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Filters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSearch, 
  onSortChange,
  sortBy,
  priceRange,
  onPriceChange,
  onRatingChange,
  selectedRating
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    onSearch(e.target.value);
  };

  const clearFilters = () => {
    onCategoryChange('all');
    onSearch('');
    onSortChange('default');
    onPriceChange({ min: 0, max: 1000 });
    onRatingChange(0);
    setSearchInput('');
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                onSearch('');
              }}
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

        {/* Sort & Filter Buttons */}
        <div className="flex gap-2">
          {/* Sort Dropdown */}
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none group-hover:text-orange-500 transition-colors" />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-xl border transition-all ${
              isFilterOpen 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange.max}
                      onChange={(e) => onPriceChange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full accent-orange-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange.min}</span>
                      <span>${priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Minimum Rating</h4>
                  <div className="flex gap-2">
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => onRatingChange(rating)}
                        className={`flex-1 py-2 rounded-lg border transition-all ${
                          selectedRating === rating
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-orange-500'
                        }`}
                      >
                        {rating}+ ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Availability</h4>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                    <span className="text-gray-600">In Stock Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Filters;