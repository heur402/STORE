import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productAPI.getById(id);
        setProduct(data);
        if (user && data.likes) {
          setIsLiked(data.likes.includes(user._id));
        }
        setError(null);
      } catch (err) {
        setError("Product not found");
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchProduct();
  }, [id]);



  const incrementQuantity = () => setQuantity(prev => {
    if (prev >= (product?.stock || 0)) {
      alert("Maximum available stock reached");
      return prev;
    }
    return prev + 1;
  });
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleToggleLike = async () => {
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

  if (loading)
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/products" className="hover:text-orange-500">Products</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">name</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div
                className={`bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl aspect-square flex 
                  items-center justify-center overflow-hidden border-4 border-white shadow-xl`}
              >Product Image</div>
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
                    type
                </span>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Star /><Star /><Star /><Star /><Star />
                  </div>
                  <span className="ml-2 text-gray-600">

                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold">Title</h1>

              {/* Price */}
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-orange-600">
                  RWF
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed"></p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                <ul className="space-y-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-gray-600">feature</span>
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

                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <span className="text-gray-500">
                    Total: RWF
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleToggleLike}
                  className="p-4 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders over RWF 50,000</p>
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
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Cylinder Size</span>
                    <span className="w-2/3 font-medium"> size </span>
                  </div>
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Type</span>
                    <span className="w-2/3 font-medium"> type </span>
                  </div>
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Availability</span>
                    <span className="w-2/3 font-medium"> availability </span>
                  </div>
                  <div className="flex py-2 border-b border-gray-200 last:border-0">
                    <span className="w-1/3 text-gray-600">key</span>
                    <span className="w-2/3 font-medium">value</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  if (error || !product) return <div className="pt-40 text-center text-xl text-red-500">{error || "Product not found"}</div>;

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
            <div className={`bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl aspect-square flex items-center justify-center overflow-hidden border-4 border-white shadow-xl`}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]?.startsWith('http') ? product.images[selectedImage] : `http://localhost:5000${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl filter drop-shadow-2xl">⛽</span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`bg-white rounded-xl aspect-square flex items-center justify-center transition-all overflow-hidden border-2 ${selectedImage === i ? 'border-orange-500 scale-95 shadow-inner' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img
                      src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                      alt={`${product.name} ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                      className={`h-5 w-5 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviewsCount || 0} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-orange-600">
                RWF {(product.discountPrice || product.price).toLocaleString()}
              </span>
              {product.discountPrice > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    RWF {(product.price).toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Save RWF {(product.price - product.discountPrice).toLocaleString()}
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
            {product.features && product.features.length > 0 && (
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
            )}

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
                  Total: RWF {((product.discountPrice || product.price) * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => addToCart({ ...product, quantity })}
                className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleToggleLike}
                className="p-4 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders over RWF 50,000</p>
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
                {product.cylinderSize && (
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Cylinder Size</span>
                    <span className="w-2/3 font-medium">{product.cylinderSize}</span>
                  </div>
                )}
                {product.purchaseType && (
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Type</span>
                    <span className="w-2/3 font-medium">{product.purchaseType}</span>
                  </div>
                )}
                {product.availabilityStatus && (
                  <div className="flex py-2 border-b border-gray-200">
                    <span className="w-1/3 text-gray-600">Availability</span>
                    <span className="w-2/3 font-medium">{product.availabilityStatus}</span>
                  </div>
                )}
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b border-gray-200 last:border-0">
                    <span className="w-1/3 text-gray-600">{key}</span>
                    <span className="w-2/3 font-medium">{value}</span>
                  </div>
                ))}
                {!product.cylinderSize && !product.purchaseType && !product.specifications && (
                  <p className="text-gray-500 italic text-sm text-center py-2">No specifications available for this product.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;