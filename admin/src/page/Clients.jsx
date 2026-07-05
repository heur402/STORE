// src/page/Clients.jsx
// Repurposed as "Guest Contacts" — shows unique customers who placed orders via WhatsApp
import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  RefreshCw,
  MessageCircle,
  Phone,
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";
import { orderAPI } from "../services/api";

// ── Your store WhatsApp number
const STORE_WHATSAPP = "250792412177";

const Clients = () => {
  const { darkMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderAPI.getAll();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Build unique guest contact list from orders
  // Key by phone (or name if no phone), aggregate their orders
  const contacts = useMemo(() => {
    const map = new Map();

    orders.forEach((order) => {
      const name = order.guestName || order.user?.name || "Unknown";
      const phone = order.guestPhone || order.user?.phone || "";
      const key = phone || name; // deduplicate by phone, fallback name

      if (!map.has(key)) {
        map.set(key, {
          key,
          name,
          phone,
          orders: [],
          totalSpent: 0,
          firstOrderDate: order.createdAt,
          lastOrderDate: order.createdAt,
        });
      }

      const contact = map.get(key);
      contact.orders.push(order);
      contact.totalSpent += order.totalPrice || 0;

      if (new Date(order.createdAt) < new Date(contact.firstOrderDate))
        contact.firstOrderDate = order.createdAt;
      if (new Date(order.createdAt) > new Date(contact.lastOrderDate))
        contact.lastOrderDate = order.createdAt;
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    );
  }, [orders]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const lower = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.toLowerCase().includes(lower)
    );
  }, [contacts, searchTerm]);

  const fmt = (val) =>
    new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
      maximumFractionDigits: 0,
    }).format(val);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-RW", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const whatsappLink = (phone, name) => {
    const clean = phone.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Hello ${name}, thank you for ordering from us! How can we help you today?`
    );
    return `https://wa.me/${clean || STORE_WHATSAPP}?text=${msg}`;
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "out for delivery": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className={`p-4 sm:p-6 min-h-screen mb-20 transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Guest Contacts
          </h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Customers who ordered via WhatsApp — {contacts.length} unique contact{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className={`self-start sm:self-auto p-2.5 rounded-xl border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              : "bg-white border-gray-200 text-gray-500 hover:text-indigo-600"
          }`}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Total Contacts",
            value: contacts.length,
            icon: Users,
            color: "indigo",
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "orange",
          },
          {
            label: "Total Revenue",
            value: fmt(orders.reduce((s, o) => s + (o.totalPrice || 0), 0)),
            icon: Package,
            color: "emerald",
            wide: true,
          },
        ].map((s) => {
          const Icon = s.icon;
          const colors = {
            indigo: darkMode ? "bg-indigo-900/40 text-indigo-300" : "bg-indigo-100 text-indigo-600",
            orange: darkMode ? "bg-orange-900/40 text-orange-300" : "bg-orange-100 text-orange-600",
            emerald: darkMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-600",
          };
          return (
            <div
              key={s.label}
              className={`p-4 rounded-xl shadow-sm border ${s.wide ? "col-span-2 sm:col-span-1" : ""} ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {s.label}
                  </p>
                  <p className={`text-xl font-extrabold mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {s.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${colors[s.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className={`mb-5 relative`}>
        <Search
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
          }`}
        />
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Loading contacts...
          </p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className={`w-16 h-16 mb-3 ${darkMode ? "text-gray-700" : "text-gray-300"}`} />
          <h3 className={`text-lg font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            No contacts found
          </h3>
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            {orders.length === 0 ? "No orders have been placed yet." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredContacts.map((contact, i) => (
              <motion.div
                key={contact.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border shadow-sm overflow-hidden ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                {/* Contact row */}
                <div
                  onClick={() =>
                    setExpandedContact(
                      expandedContact === contact.key ? null : contact.key
                    )
                  }
                  className={`p-4 cursor-pointer flex items-center justify-between gap-4 transition-colors ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {contact.name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {contact.phone ? (
                          <span className={`text-xs flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            <Phone size={11} /> {contact.phone}
                          </span>
                        ) : (
                          <span className={`text-xs italic ${darkMode ? "text-gray-600" : "text-gray-400"}`}>
                            No phone
                          </span>
                        )}
                        <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                          · {contact.orders.length} order{contact.orders.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {fmt(contact.totalSpent)}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        total spent
                      </p>
                    </div>

                    {/* WhatsApp button */}
                    {contact.phone && (
                      <a
                        href={whatsappLink(contact.phone, contact.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-full transition-colors"
                      >
                        <MessageCircle size={13} />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {expandedContact === contact.key ? (
                      <ChevronUp size={18} className={darkMode ? "text-gray-400" : "text-gray-400"} />
                    ) : (
                      <ChevronDown size={18} className={darkMode ? "text-gray-400" : "text-gray-400"} />
                    )}
                  </div>
                </div>

                {/* Expanded order history */}
                <AnimatePresence>
                  {expandedContact === contact.key && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                    >
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className={`text-xs font-bold uppercase tracking-wider ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}>
                            Order History
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                              <Calendar size={11} className="inline mr-1" />
                              First: {formatDate(contact.firstOrderDate)}
                            </span>
                            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                              Last: {formatDate(contact.lastOrderDate)}
                            </span>
                          </div>
                        </div>

                        {contact.orders.map((order) => (
                          <div
                            key={order._id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                              darkMode ? "bg-gray-700/60" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
                              </span>
                              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                              <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {fmt(order.totalPrice)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Clients;
