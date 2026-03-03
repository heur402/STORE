import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get dashboard statistics
// @route   GET /api/products/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const activeProducts = await Product.countDocuments({
      isDeleted: false,
      stock: { $gt: 0 },
    });
    const outOfStock = await Product.countDocuments({
      stock: 0,
      isDeleted: false,
    });
    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
      isDeleted: false,
    });

    res.json([
      { id: 1, title: "Total Products", value: totalProducts.toString() },
      { id: 2, title: "Active Products", value: activeProducts.toString() },
      { id: 3, title: "Out of Stock", value: outOfStock.toString() },
      { id: 4, title: "Low Stock", value: lowStock.toString() },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get stock distribution
// @route   GET /api/products/dashboard/stock-status
// @access  Private/Admin
export const getStockStatus = async (req, res) => {
  try {
    const inStock = await Product.countDocuments({
      stock: { $gt: 10 },
      isDeleted: false,
    });
    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
      isDeleted: false,
    });
    const outOfStock = await Product.countDocuments({
      stock: 0,
      isDeleted: false,
    });

    res.json([
      { name: "In Stock", value: inStock },
      { name: "Low Stock", value: lowStock },
      { name: "Out of Stock", value: outOfStock },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get recent products
// @route   GET /api/products/dashboard/recent-products
// @access  Private/Admin
export const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get sales data for chart
// @route   GET /api/products/dashboard/sales
// @access  Private/Admin
export const getSalesData = async (req, res) => {
  try {
    // Get sales data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          isPaid: true
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Map numerical months to names and ensure all 6 months are present
    const formattedSales = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthIndex = d.getMonth() + 1;
        const monthName = months[d.getMonth()];
        const monthSales = sales.find(s => s._id === monthIndex);
        formattedSales.push({
            month: monthName,
            sales: monthSales ? monthSales.sales : 0
        });
    }

    res.json(formattedSales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
