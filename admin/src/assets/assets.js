// src/assets/assets.js

/* ================= DASHBOARD STATS ================= */

export const dashboardStats = [
  { id: 1, title: "Total Products", value: "1,257" },
  { id: 2, title: "Active Products", value: "1,102" },
  { id: 3, title: "Out of Stock", value: "58" },
  { id: 4, title: "Low Stock", value: "142" },
];

/* ================= SALES DATA ================= */

export const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

/* ================= STOCK STATUS ================= */

export const stockStatus = [
  { name: "In Stock", value: 78 },
  { name: "Low Stock", value: 11 },
  { name: "Out of Stock", value: 11 },
];

/* ================= RECENT PRODUCTS ================= */
/* 🔥 Updated with Drinks, Food, Fuel categories */

export const recentProducts = [
  {
    id: 1,
    name: "Coca-Cola Can",
    category: "Drinks",
    status: "Active",
    stock: 150,
    price: 1.5,
    image: "https://images.unsplash.com/photo-1598157924383-ff5f8c58e7a1?w=200",
  },
  {
    id: 2,
    name: "Orange Juice Bottle",
    category: "Drinks",
    status: "Low Stock",
    stock: 8,
    price: 2.0,
    image: "https://images.unsplash.com/photo-1582442844857-97a2f82c63e4?w=200",
  },
  {
    id: 3,
    name: "Cheeseburger Meal",
    category: "Food",
    status: "Active",
    stock: 45,
    price: 5.99,
    image: "https://images.unsplash.com/photo-1604908177524-91c46f49ec14?w=200",
  },
  {
    id: 4,
    name: "Pizza Slice",
    category: "Food",
    status: "Active",
    stock: 60,
    price: 3.5,
    image: "https://images.unsplash.com/photo-1603073428391-07a2f3464f3e?w=200",
  },
  {
    id: 5,
    name: "Petrol 1L",
    category: "Fuel",
    status: "Out of Stock",
    stock: 0,
    price: 1.2,
    image: "https://images.unsplash.com/photo-1571434324457-4b851a4b486d?w=200",
  },
  {
    id: 6,
    name: "Diesel 1L",
    category: "Fuel",
    status: "Active",
    stock: 200,
    price: 1.1,
    image: "https://images.unsplash.com/photo-1575188458623-b272929ea2c6?w=200",
  },
];

/* ================= TASKS ================= */

export const tasks = [
  { id: 1, title: "Restock Low Inventory", count: "3 Pending" },
  { id: 2, title: "Update Product Listings", count: "2 Updates" },
  { id: 3, title: "Review New Orders", count: "5 Orders" },
];

/* ================= ACTIVITIES ================= */

export const activities = [
  { id: 1, text: "New Order #1056 placed by Sarah" },
  { id: 2, text: "Product Updated: Digital Camera details updated" },
  { id: 3, text: "Stock Alert: Gaming Mouse is low in stock" },
];