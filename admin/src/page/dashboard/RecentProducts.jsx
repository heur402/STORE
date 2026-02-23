// src/page/dashboard/RecentProducts.jsx
import React from "react";
import { motion } from "framer-motion";
import { item } from "./utils";

const RecentProducts = ({ products, styles }) => {
  return (
    <motion.div
      variants={item}
      className={`${styles.card} col-span-2 overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold text-lg ${styles.text.primary}`}>
          Recent Products
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${styles.border}`}>
              <th className={`text-left pb-3 font-medium ${styles.text.secondary}`}>Product</th>
              <th className={`text-left pb-3 font-medium ${styles.text.secondary}`}>Status</th>
              <th className={`text-left pb-3 font-medium ${styles.text.secondary}`}>Stock</th>
              <th className={`text-right pb-3 font-medium ${styles.text.secondary}`}>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: styles.border.includes('gray-700') ? '#374151' : '#f9fafb' }}
                className={`border-b ${styles.border} last:border-0 transition-colors`}
              >
                <td className={`py-3 font-medium ${styles.text.primary}`}>{product.name}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'In Stock'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : product.status === 'Low Stock'
                      ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className={`py-3 ${styles.text.secondary}`}>
                  <div className="flex items-center gap-2">
                    <span>{product.stock}</span>
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (product.stock / 100) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className={`py-3 text-right font-medium ${styles.text.primary}`}>
                  ${product.price}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className={`mt-4 w-full text-sm py-2 rounded-lg border ${styles.border} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${styles.text.secondary}`}>
        View All →
      </button>
    </motion.div>
  );
};

export default RecentProducts;