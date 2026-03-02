// pages/Products.jsx
import React, { useState, useMemo, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { motion } from 'framer-motion';
import { Package, Filter as FilterIcon } from 'lucide-react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample products data with more details
  const products = useMemo(() => [
    // Fuel Products
    { 
      id: 1, 
      name: 'Premium Gasoline', 
      description: 'High-octane fuel with advanced cleaning agents for optimal engine performance', 
      price: 45.99, 
      category: 'fuel', 
      rating: 4.5, 
      reviews: 128, 
      discount: 'Save $5',
      features: ['High octane', 'Engine protection', 'Better mileage']
    },
    { 
      id: 2, 
      name: 'Diesel Plus', 
      description: 'Clean-burning diesel with cetane boosters and anti-gel additives', 
      price: 42.99, 
      category: 'fuel', 
      rating: 4.3, 
      reviews: 89, 
      discount: '10% OFF',
      features: ['Winter formula', 'Engine clean', 'Better ignition']
    },
    { 
      id: 3, 
      name: 'E85 Flex Fuel', 
      description: 'Environmentally friendly ethanol blend for flex-fuel vehicles', 
      price: 38.99, 
      originalPrice: 42.99,
      category: 'fuel', 
      rating: 4.0, 
      reviews: 45,
      features: ['Renewable', 'Lower emissions', 'High octane']
    },
    
    // Food Products
    { 
      id: 4, 
      name: 'Classic Burger', 
      description: 'Juicy beef patty with fresh lettuce, tomatoes, and our special sauce', 
      price: 12.99, 
      originalPrice: 15.99, 
      category: 'food', 
      rating: 4.8, 
      reviews: 256, 
      discount: '20% OFF',
      features: ['100% beef', 'Fresh ingredients', 'Served hot']
    },
    { 
      id: 5, 
      name: 'Chicken Sandwich', 
      description: 'Crispy chicken breast with pickles and signature mayo on brioche bun', 
      price: 10.99, 
      category: 'food', 
      rating: 4.6, 
      reviews: 178,
      features: ['Crispy chicken', 'Brioche bun', 'Signature sauce']
    },
    { 
      id: 6, 
      name: 'Loaded Fries', 
      description: 'Crispy fries topped with cheese sauce, bacon bits, and green onions', 
      price: 8.99, 
      category: 'food', 
      rating: 4.4, 
      reviews: 92,
      features: ['Cheese sauce', 'Bacon bits', 'Shareable size']
    },
    
    // Drinks Products
    { 
      id: 7, 
      name: 'Cola Classic', 
      description: 'Refreshing carbonated beverage with real sugar', 
      price: 2.99, 
      originalPrice: 3.99, 
      category: 'drinks', 
      rating: 4.5, 
      reviews: 345, 
      discount: '25% OFF',
      features: ['Real sugar', 'Caffeine free option', 'Ice cold']
    },
    { 
      id: 8, 
      name: 'Energy Drink', 
      description: 'Zero-sugar energy drink with vitamins B6 and B12', 
      price: 3.99, 
      category: 'drinks', 
      rating: 4.2, 
      reviews: 156,
      features: ['Zero sugar', 'Vitamins B6 & B12', 'Long lasting']
    },
    { 
      id: 9, 
      name: 'Iced Coffee', 
      description: 'Cold brew coffee with a hint of vanilla and almond milk', 
      price: 4.99, 
      category: 'drinks', 
      rating: 4.7, 
      reviews: 112,
      features: ['Cold brew', 'Low calorie', 'Dairy-free option']
    },
  ], []);

  const categories = ['fuel', 'food', 'drinks'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.features?.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }

    // Sort products
    switch(sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sorting by rating
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy, priceRange, selectedRating]);

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
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
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
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
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