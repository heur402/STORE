import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldOff,
  Grid,
  List as ListIcon,
  RefreshCw,
  MoreHorizontal
} from "lucide-react";
import { clientAPI } from "../services/api";

const Clients = () => {
  const { darkMode } = useOutletContext();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, suspended
  const [viewMode, setViewMode] = useState("table"); // table, grid
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    newToday: 0
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientAPI.getAll();
      setClients(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (clientList) => {
    const total = clientList.length;
    const active = clientList.filter(c => !c.suspended).length;
    const suspended = clientList.filter(c => c.suspended).length;

    // Simple mock for "new today" based on createdAt
    const today = new Date().toDateString();
    const newToday = clientList.filter(c => new Date(c.createdAt).toDateString() === today).length;

    setStats({ total, active, suspended, newToday });
  };

  const toggleStatus = async (clientId) => {
    try {
      await clientAPI.suspend(clientId);
      const updatedClients = clients.map(c =>
        c._id === clientId ? { ...c, suspended: !c.suspended } : c
      );
      setClients(updatedClients);
      calculateStats(updatedClients);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !client.suspended) ||
      (filter === "suspended" && client.suspended);

    return matchesSearch && matchesFilter;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className={`p-4 sm:p-6 min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Client Management
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Manage and monitor your customer base
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-lg p-1 border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md transition-all ${viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Grid size={18} />
            </button>
          </div>
          <button
            onClick={fetchClients}
            className={`p-3 rounded-lg border transition-all ${darkMode
                ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
                : "bg-white border-gray-200 text-gray-600 hover:text-indigo-600"
              }`}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "Total Clients", value: stats.total, icon: Users, color: "blue" },
          { label: "Active Now", value: stats.active, icon: UserCheck, color: "green" },
          { label: "Suspended", value: stats.suspended, icon: UserX, color: "red" },
          { label: "New Today", value: stats.newToday, icon: Calendar, color: "purple" }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className={`p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {stat.label}
                </p>
                <h3 className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                    stat.color === 'red' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                }`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters Section */}
      <div className={`p-4 rounded-2xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none border transition-all ${darkMode
                ? "bg-gray-900 border-gray-700 text-white focus:border-indigo-500"
                : "bg-gray-50 border-gray-200 text-gray-900 focus:border-indigo-500"
              }`}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {["all", "active", "suspended"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap ${filter === f
                  ? "bg-indigo-600 text-white shadow-lg"
                  : darkMode
                    ? "bg-gray-900 text-gray-400 hover:text-white border border-gray-700"
                    : "bg-gray-50 text-gray-600 hover:text-indigo-600 border border-gray-100"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Loading client records...</p>
        </div>
      ) : filteredClients.length > 0 ? (
        viewMode === "table" ? (
          <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${darkMode ? "bg-gray-900/50" : "bg-gray-50"}`}>
                    <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Client</th>
                    <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Contact</th>
                    <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Joined Date</th>
                    <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Status</th>
                    <th className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  <AnimatePresence>
                    {filteredClients.map((client) => (
                      <motion.tr
                        key={client._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`transition-all hover:bg-black/5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                              {client.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">{client.name}</p>
                              <p className="text-xs text-gray-500">UID: {client._id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2"><Mail size={14} className="text-gray-500" /> {client.email}</p>
                            <p className="text-sm flex items-center gap-2"><Phone size={14} className="text-gray-500" /> {client.phone || "No phone"}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.suspended
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                            }`}>
                            {client.suspended ? "Suspended" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(client._id)}
                            className={`p-2 rounded-lg transition-all ${client.suspended
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                          >
                            {client.suspended ? <Shield size={18} /> : <ShieldOff size={18} />}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client) => (
              <motion.div
                key={client._id}
                variants={item}
                className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold font-serif">
                    {client.name?.charAt(0)}
                  </div>
                  <button onClick={() => toggleStatus(client._id)} className={`p-2 rounded-xl ${client.suspended ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                    {client.suspended ? <Shield size={20} /> : <ShieldOff size={20} />}
                  </button>
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{client.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{client.email}</p>

                  <div className="space-y-2 pt-4 border-t border-gray-700/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Joined:</span>
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{new Date(client.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-bold ${client.suspended ? "text-red-500" : "text-green-500"}`}>
                        {client.suspended ? "Suspended" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>No clients found</h3>
          <p className="text-gray-500">Try refining your search or filter</p>
        </div>
      )}
    </div>
  );
};

export default Clients;