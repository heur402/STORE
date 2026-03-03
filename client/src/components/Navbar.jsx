// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Flame,
  ShoppingBag,
  Menu,
  X,
  User,
  ChevronDown,
  Store,
} from "lucide-react";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const profileRef = useRef();

  /* Scroll effect */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  /* Close profile when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/90 backdrop-blur-lg shadow-md py-3"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Store className={`h-8 w-8 ${isScrolled ? 'text-orange-500' : 'text-gray-700'}  group-hover:scale-110 transition-transform duration-300`} />
            <span className={`font-extrabold text-xl  ${isScrolled ? 'bg-gradient-to-r from-orange-600 to-orange-500 ' : 'bg-gray-700'} bg-clip-text text-transparent tracking-wide`}>
              STORE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-medium transition-all duration-300 ${isActive
                    ? "text-orange-500"
                    : "text-gray-700 hover:text-orange-500"
                    }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 transform transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"
                      } origin-left`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
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


            {/* Profile */}
            <div className="relative block" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {user ? (
                    <span className="text-white font-bold text-lg uppercase">
                      {user.name.charAt(0)}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                {user ? (
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.name}</span>
                ) : null}
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 animate-fadeIn">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                      >
                        Orders
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                        >
                          Login
                        </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

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
          <div className="md:hidden mt-6 space-y-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 px-4 rounded-lg font-medium transition ${isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;