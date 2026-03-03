import React, { useState } from "react";
import { motion } from "framer-motion";
import { productAPI } from "../services/api";

const AddProductModal = ({ onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    status: "Active",
    images: [],
    cylinderSize: "",
    purchaseType: "Refill",
    availabilityStatus: "In Stock",
  });
  const [uploading, setUploading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataBody = new FormData();
    formDataBody.append("image", file);
    setUploading(true);

    try {
      const url = await productAPI.uploadImage(formDataBody);
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  const removeImageField = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // Save new product
  const handleSave = () => {
    // Basic validation
    if (!formData.name || !formData.description || !formData.category) {
      alert("Please fill required fields.");
      return;
    }

    // Convert text inputs to numbers before saving
    const price = parseFloat(formData.price) || 0;
    const discountPrice = parseFloat(formData.discountPrice) || 0;
    const stock = parseInt(formData.stock, 10) || 0;

    onSave({
      ...formData,
      price: price,
      discountPrice: discountPrice,
      stock: stock,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className={`p-6 rounded-xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh] transition-colors duration-300 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}>
          Add New Product
        </h2>

        <div className="space-y-4">
          {/* Basic Info */}
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="category"
            placeholder="Category (e.g., Gas, Food, Drink)"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />

          {formData.category.toLowerCase() === 'gas' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cylinder Size</label>
                <input
                  name="cylinderSize"
                  placeholder="e.g., 6kg, 12kg"
                  value={formData.cylinderSize}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purchase Type</label>
                <select
                  name="purchaseType"
                  value={formData.purchaseType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                    }`}
                >
                  <option value="Refill">Refill</option>
                  <option value="New Cylinder">New Cylinder</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Availability Status</label>
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                    }`}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Numbers */}
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="discountPrice"
            type="number"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />

          {/* Images */}
          <div className="space-y-2">
            <label className={`font-semibold ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Images
            </label>
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <img src={`http://localhost:5000${img}`} alt={`Product ${idx}`} className="h-10 w-10 object-cover rounded" />
                <span className={`flex-1 text-sm truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{img}</span>
                <button
                  onClick={() => removeImageField(idx)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <div>
              <input
                type="file"
                id="image-file"
                onChange={uploadFileHandler}
                className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                  }`}
              />
              {uploading && <p className={darkMode ? "text-gray-300 text-sm mt-1" : "text-gray-600 text-sm mt-1"}>Uploading...</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={onClose} 
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              disabled={uploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
            >
              Add Product
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddProductModal;