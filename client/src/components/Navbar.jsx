// components/Navbar.jsx — no auth, fully public
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Menu, X, Store, MessageCircle } from "lucide-react";

// ── Your store's WhatsApp number (digits only, with country code)
const STORE_WHATSAPP = "250785313282";

const Navbar = () => {
  const { totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello! I'd like to get more information about your products.");
    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Store
              className={`h-8 w-8 ${
                isScrolled ? "text-orange-500" : "text-gray-700"
              } group-hover:scale-110 transition-transform duration-300`}
            />
            <span
              className={`font-extrabold text-xl ${
                isScrolled ? "bg-gradient-to-r from-orange-600 to-orange-500" : "bg-gray-700"
              } bg-clip-text text-transparent tracking-wide`}
            >
              STORE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-all duration-300 ${
                    isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 transform transition-transform duration-300 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart">
              <button
                aria-label="Shopping Cart"
                className="relative p-2 hover:bg-orange-50 rounded-full transition-colors"
              >
                <ShoppingBag className="h-5 w-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-1 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={handleWhatsApp}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with us on WhatsApp
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
