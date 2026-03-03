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
/* 🔥 Updated with Drinks, Food, Gas categories */

export const recentProducts = [
  {
    _id: "1",
    name: "pepsi",
    slug: "pepsi",
    description: "Refreshing 330ml pepsi can. Perfect chilled soft drink.",
    category: "Drinks",
    price: 1500,
    discountPrice: 1.2,
    stock: 150,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "DRK-COC-001",
    rating: 4.5,
    reviewsCount: 120,
    isFeatured: true,
    isDeleted: false,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-01-10T10:00:00Z",
  },
  {
    _id: "2",
    name: "Fresh Orange Juice 1L",
    slug: "fresh-orange-juice-1l",
    description: "Natural orange juice bottle rich in vitamin C.",
    category: "Drinks",
    price: 1000,
    discountPrice: 200,
    stock: 8,
    status: "Low Stock",
    images: [
      "https://images.unsplash.com/photo-1571689936114-b16146d3b7d0?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "DRK-ORG-002",
    rating: 4.2,
    reviewsCount: 75,
    isFeatured: false,
    isDeleted: false,
    createdAt: "2026-01-11T09:00:00Z",
    updatedAt: "2026-01-11T09:00:00Z",
  },
  {
    _id: "3",
    name: "Cheeseburger Meal",
    slug: "cheeseburger-meal",
    description: "Juicy cheeseburger served with fries and drink.",
    category: "Food",
    price: 7000,
    discountPrice: 4.99,
    stock: 45,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "FOD-BUR-003",
    rating: 4.8,
    reviewsCount: 210,
    isFeatured: true,
    isDeleted: false,
    createdAt: "2026-01-12T08:00:00Z",
    updatedAt: "2026-01-12T08:00:00Z",
  },
  {
    _id: "4",
    name: "Pizza Slice",
    slug: "pizza-slice",
    description: "Hot cheesy pizza slice with fresh toppings.",
    category: "Food",
    price: 2000,
    discountPrice: 0,
    stock: 60,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "FOD-PIZ-004",
    rating: 4.3,
    reviewsCount: 98,
    isFeatured: false,
    isDeleted: false,
    createdAt: "2026-01-13T07:00:00Z",
    updatedAt: "2026-01-13T07:00:00Z",
  },
  {
    _id: "5",
    name: "Gas Refill 6kg",
    slug: "gas-refill-6kg",
    description: "High-quality cooking gas refill for standard home cylinders.",
    category: "Gas",
    price: 2400,
    discountPrice: 0,
    stock: 0,
    status: "Out of Stock",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "GAS-REF-005",
    rating: 4.0,
    reviewsCount: 35,
    isFeatured: false,
    isDeleted: false,
    createdAt: "2026-01-14T06:00:00Z",
    updatedAt: "2026-01-14T06:00:00Z",
  },
  {
    _id: "6",
    name: "New Gas Cylinder 12kg",
    slug: "new-gas-cylinder-12kg",
    description: "Premium brand new gas cylinder including first fill.",
    category: "Gas",
    price: 10000,
    discountPrice: 1000,
    stock: 200,
    status: "Active",
    images: [
      "https://images.unsplash.com/photo-1581091870627-3a1c2d2a3e8c?auto=format&fit=crop&w=800&q=80",
    ],
    sku: "GAS-NEW-006",
    rating: 4.4,
    reviewsCount: 64,
    isFeatured: true,
    isDeleted: false,
    createdAt: "2026-01-15T05:00:00Z",
    updatedAt: "2026-01-15T05:00:00Z",
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