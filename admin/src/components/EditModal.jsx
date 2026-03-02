import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EditModal = ({ product, onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState(product);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? Number(value) : value,
    }));
  };

  const handleArrayChange = (index, newValue) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages[index] = newValue;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ""] }));
  };

  const removeImageField = (index) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSave = () => {
    // Convert text inputs to numbers before saving
    const price = parseFloat(formData.price) || 0;
    const discountPrice = parseFloat(formData.discountPrice) || 0;
    const stock = parseInt(formData.stock, 10) || 0;

    const updatedData = {
      ...formData,
      price: price,
      discountPrice: discountPrice,
      stock: stock,
    };

    onSave(updatedData);   // update product
    onClose();          // close modal after save
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
          Edit Product
        </h2>

        <div className="space-y-4">
          {/* Basic Info */}
          <input
            name="name"
            placeholder="Name"
            value={formData?.name ?? ""}
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
            value={formData?.description ?? ""}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="category"
            placeholder="Category"
            value={formData?.category ?? ""}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />

          {/* Numbers */}
          <input
            name="price"
            type="text"
            placeholder="Price"
            value={formData?.price ?? ""}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="discountPrice"
            type="text"
            placeholder="Discount Price"
            value={formData?.discountPrice ?? ""}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <input
            name="stock"
            type="text"
            placeholder="Stock"
            value={formData?.stock ?? ""}
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
            {(formData.images || []).map((img, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleArrayChange(idx, e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg transition-colors duration-300 ${
                    darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                />
                <button
                  onClick={() => removeImageField(idx)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addImageField}
              className="px-4 py-2 bg-green-500 text-white rounded-lg mt-1 hover:bg-green-600 transition-colors"
            >
              Add Image
            </button>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditModal;