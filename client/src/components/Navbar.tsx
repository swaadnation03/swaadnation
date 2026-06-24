"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useWebsiteSettings } from "@/context/WebsiteSettingsContext";


export default function Navbar({ websiteSettings }: { websiteSettings?: any }) {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const settings = useWebsiteSettings();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const navbarStyle = {
    backgroundColor: settings.navbarBackgroundColor,
  };
  const textColor = settings.navbarTextColor;
  const hoverColor = settings.navbarHoverColor;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on overlay
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="shadow-md sticky top-0 z-50 border-b border-gray-100" style={navbarStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side - Logo and Navigation Links */}
            <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
              
              {/* Logo with Text - Always visible */}
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                  <Image
                    src="/logo.png"
                    alt="Swaad Nation Logo"
                    fill
                    sizes="(max-width: 640px) 32px, 40px"
                    className="object-contain group-hover:scale-105 transition-transform duration-200"
                    priority
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent leading-tight">
                    Swaad Nation
                  </span>
                  <span className="text-[10px] sm:text-xs text-orange-500 -mt-0.5 font-medium">
                    Taste of Champaran
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
                <Link
                  href="/"
                  className="transition-colors font-medium text-sm whitespace-nowrap"
                  style={{ color: textColor }}
                  onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                >
                  Home
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      href="/admin"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/products"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Products
                    </Link>
                    <Link
                      href="/admin/coupons"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Coupons
                    </Link>
                    <Link
                      href="/admin/reviews"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Reviews
                    </Link>
                    <Link
                      href="/admin/offers"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Offers
                    </Link>
                    <Link
                      href="/admin/hero"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Hero
                    </Link>
                    <Link
                      href="/admin/website"
                      className="transition-colors font-medium text-sm whitespace-nowrap"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      Theme
                    </Link>
                  </>
                )}

                {user && (
                  <Link
                    href="/my-orders"
                    className="transition-colors font-medium text-sm whitespace-nowrap"
                    style={{ color: textColor }}
                    onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                  >
                    My Orders
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Cart and User Menu */}
            <div className="flex items-center space-x-3">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: textColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop User Menu - FIXED with null checks */}
              {user ? (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                    style={{ color: textColor }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-600 transition-all shadow-sm"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: textColor }}
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header with Logo and Text */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="Swaad Nation Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                Swaad Nation
              </span>
              <span className="text-[10px] text-orange-500 -mt-0.5">Taste of Champaran</span>
            </div>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-[calc(100%-60px)]">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg transition-colors"
            style={{ color: textColor }}
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/admin"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              <Link
                href="/admin/coupons"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Coupons
              </Link>
              <Link
                href="/admin/reviews"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Reviews
              </Link>
              <Link
                href="/admin/offers"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Offers
              </Link>
              <Link
                href="/admin/hero"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Hero Settings
              </Link>
              <Link
                href="/admin/website"
                className="px-3 py-2 rounded-lg transition-colors"
                style={{ color: textColor }}
                onClick={closeMobileMenu}
              >
                Website Theme
              </Link>
            </>
          )}

          {user && (
            <Link
              href="/my-orders"
              className="px-3 py-2 rounded-lg transition-colors"
              style={{ color: textColor }}
              onClick={closeMobileMenu}
            >
              My Orders
            </Link>
          )}

          {/* Mobile Menu Footer with User Info - FIXED with null checks */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email || ""}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg text-center font-medium"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}