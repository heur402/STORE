// pages/Products.jsx
import React, { useState, useMemo, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { motion } from 'framer-motion';
import { Package, Filter as FilterIcon } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 }); // Increased max price
  const [selectedRating, setSelectedRating] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getAll();
        console.log("API Response:", response);
        
        // Handle different response formats
        let productsData = [];
        if (Array.isArray(response)) {
          productsData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response && response.products && Array.isArray(response.products)) {
          productsData = response.products;
        } else {
          console.error("Unexpected response format:", response);
        }
        
        console.log("Products data:", productsData);
        setProducts(productsData);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['gas', 'food', 'drinks'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    console.log("Filtering products. Current products:", products);
    console.log("Current filters:", {
      selectedCategory,
      searchTerm,
      priceRange,
      selectedRating
    });
    
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.features?.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price
    filtered = filtered.filter(p => 
      p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    console.log("Filtered products count:", filtered.length);
    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy, priceRange, selectedRating]);

  // Sort products (separate from filtering)
  const sortedAndFilteredProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    
    switch(sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name?.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    
    return sorted;
  }, [filteredProducts, sortBy]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-gray-600">
            Discover our wide range of quality products
          </p>
          {/* Debug info - remove in production */}
          <div className="mt-2 text-sm text-gray-500">
            Total products: {products.length} | Filtered: {sortedAndFilteredProducts.length}
          </div>
        </motion.div>

        {/* Filters */}
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearch={setSearchTerm}
          onSortChange={setSortBy}
          sortBy={sortBy}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onRatingChange={setSelectedRating}
          selectedRating={selectedRating}
        />

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{sortedAndFilteredProducts.length}</span> products
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Search results for: "{searchTerm}"
            </p>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        ) : sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search term
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;