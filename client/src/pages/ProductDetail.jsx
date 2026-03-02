// pages/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { dispatch } = useCart();

  // Mock product data (in real app, fetch based on id)
  const product = {
    id: 1,
    name: 'Premium Gasoline',
    description: 'High-octane fuel with advanced cleaning agents for optimal engine performance',
    price: 45.99,
    originalPrice: 52.99,
    category: 'fuel',
    rating: 4.5,
    reviews: 128,
    discount: 'Save $7',
    features: [
      'Advanced cleaning agents prevent engine deposits',
      'Improved fuel economy',
      'Better acceleration',
      'Reduced emissions',
      'Protects critical engine parts'
    ],
    specifications: {
      'Octane Rating': '93',
      'Fuel Type': 'Gasoline',
      'Volume': '1 Gallon',
      'Shelf Life': '2 Years',
      'Storage': 'Cool, dry place'
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-orange-500">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl aspect-square flex items-center justify-center">
              <span className="text-9xl filter drop-shadow-2xl">⛽</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl aspect-square flex items-center justify-center transition-all ${
                    selectedImage === i ? 'ring-2 ring-orange-500 ring-offset-2' : 'opacity-70'
                  }`}
                >
                  <span className="text-3xl">⛽</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-orange-600">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <span className="text-gray-500">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
  onClick={() =>
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity },
    })
  }
  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2"
>
  <ShoppingCart className="h-5 w-5" />
  <span>Add to Cart</span>
</button>
              <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">30 days return</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Specifications</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-200 last:border-0">
                    <span className="w-1/3 text-gray-600">{key}</span>
                    <span className="w-2/3 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;