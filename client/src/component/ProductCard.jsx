import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye, Plus, Minus } from "lucide-react";

const ProductCard = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [liked, setLiked] = useState(false);
    const [showDesc, setShowDesc] = useState(false);
    const [inputValue, setInputValue] = useState("1");

    const isOutOfStock = product.stock === 0;

    const handleQtyChange = (e) => {
        const val = e.target.value;
        
        // Allow empty input for typing
        if (val === "") {
            setInputValue("");
            return;
        }
        
        const numVal = parseInt(val);
        if (!isNaN(numVal)) {
            if (numVal < 1) {
                setInputValue("1");
                setQuantity(1);
            } else if (numVal > product.stock) {
                setInputValue(product.stock.toString());
                setQuantity(product.stock);
            } else {
                setInputValue(val);
                setQuantity(numVal);
            }
        }
    };

    const handleQtyBlur = () => {
        if (inputValue === "" || parseInt(inputValue) < 1) {
            setInputValue("1");
            setQuantity(1);
        }
    };

    const increaseQty = () => {
        if (quantity < product.stock) {
            const newQty = quantity + 1;
            setQuantity(newQty);
            setInputValue(newQty.toString());
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQuantity(newQty);
            setInputValue(newQty.toString());
        }
    };

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(product.price);

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden 
                      hover:shadow-xl transition-all duration-300">

                {/* STOCK BADGE */}
                {isOutOfStock && (
                    <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Out of Stock
                    </div>
                )}

                 {/* IMAGE - Increased height */}
                <div className="relative w-full lg:pb-[190%] pb-100" > {/* Increased from 100% to 125% for taller image */}
                    <motion.img
                        src={product.images[0]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* DESKTOP HOVER CONTENT */}
                <div
                    className="hidden lg:block absolute inset-0 bg-white/95 backdrop-blur-sm p-6 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <div className="h-full flex flex-col justify-between">
                        {/* Top Section */}
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-4">
                                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {product.category}
                                    </p>
                                </div>
                                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                    {formattedPrice}
                                </span>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                                >
                                    <Heart
                                        className={`w-5 h-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-600"
                                            }`}
                                    />
                                </button>

                                <button
                                    onClick={() => setShowDesc(!showDesc)}
                                    className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                                >
                                    <Eye className={`w-5 h-5 ${showDesc ? "text-blue-600" : "text-gray-600"}`} />
                                </button>
                            </div>

                            {/* Description - appears below on eye icon click */}
                            {showDesc && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-gray-50 rounded-lg"
                                >
                                    <p className="text-gray-600 text-sm">
                                        {product.description || "No description available."}<br></br>
                                        In Stock <label className={` ${isOutOfStock ? 'text-red-700' : 'text-green-500'}`}>{product.stock}</label>
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Bottom Section */}
                        <div className="space-y-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={decreaseQty}
                                        disabled={quantity <= 1}
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <input
                                        type="number"
                                        value={inputValue}
                                        onChange={handleQtyChange}
                                        onBlur={handleQtyBlur}
                                        min="1"
                                        max={product.stock}
                                        className="w-16 px-2 py-2 rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                    />

                                    <button
                                        onClick={increaseQty}
                                        disabled={quantity >= product.stock}
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                disabled={isOutOfStock}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition ${isOutOfStock
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-black text-white hover:bg-gray-800"
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE & TABLET CONTENT */}
                <div className="lg:hidden p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
                    </div>

                    {/* Eye Icon for Mobile - shows/hides description */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowDesc(!showDesc)}
                            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                            <Eye className={`w-5 h-5 ${showDesc ? "text-blue-600" : "text-gray-600"}`} />
                        </button>
                    </div>

                    {/* Description for Mobile */}
                    {showDesc && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-gray-50 rounded-lg"
                        >
                            <p className="text-gray-600 text-sm">
                                {product.description || "No description available."}
                            </p>
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {/* Quantity Controls with Input for Mobile */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={decreaseQty}
                                disabled={quantity <= 1}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleQtyChange}
                                onBlur={handleQtyBlur}
                                min="1"
                                max={product.stock}
                                className="w-16 px-2 py-2 border rounded-lg text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <button
                                onClick={increaseQty}
                                disabled={quantity >= product.stock}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            disabled={isOutOfStock}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${isOutOfStock
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800"
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;