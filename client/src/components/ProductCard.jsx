// components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  // Set initial like state if user's ID is in product.likes
  const [isLiked, setIsLiked] = useState(
    user && product.likes ? product.likes.includes(user._id) : false
  );

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Please login to like products");
      return;
    }

    // Optimistic UI update
    setIsLiked(!isLiked);
    try {
      await productAPI.toggleLike(product._id);
    } catch (error) {
      // Revert if failed
      setIsLiked(isLiked);
      console.error("Failed to toggle like:", error);
    }
  };

  const getCategoryIcon = () => {
    switch(product.category) {
      case 'gas': return '🔥';
      case 'food': return '🍔';
      case 'drinks': return '🥤';
      default: return '📦';
    }
  };

  const getCategoryColor = () => {
    switch(product.category) {
      case 'gas': return 'from-blue-500 to-blue-600';
      case 'food': return 'from-orange-500 to-red-500';
      case 'drinks': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 relative group border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Like Button */}
      <button
        onClick={handleToggleLike}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
      </button>

      {/* Quick View Overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl"
        >
          <Link
            to={`/products/${product._id}`}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-orange-500 hover:text-white transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Quick View</span>
          </Link>
        </motion.div>
      )}

      {/* Image Section */}
      <div className={`h-48 bg-gradient-to-br ${getCategoryColor()} flex items-center justify-center overflow-hidden`}>
        {product.images && product.images.length > 0 ? (
          <motion.img
            animate={{ scale: isHovered ? 1.1 : 1 }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.span
            animate={{ scale: isHovered ? 1.2 : 1 }}
            className="text-7xl"
          >
            {getCategoryIcon()}
          </motion.span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
            {product.category}
          </span>

          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 font-medium">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            <span className='text-xs'>FRW</span>  {product.price}
          </span>

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;