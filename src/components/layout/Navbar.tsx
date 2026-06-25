"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Package,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CATEGORIES } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartItems = useCartStore((s) => s.items);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const wishlistItems = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    if (session) {
      fetchCart();
      fetchWishlist();
    }
  }, [session, fetchCart, fetchWishlist]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const totalCartItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      {/* Top bar */}
      <div
        style={{ backgroundColor: "#172337" }}
        className="text-white text-xs py-1 px-4 text-center hidden sm:block"
      >
        🎉 Free shipping on orders above ₹499 | Use code{" "}
        <span className="text-yellow-400 font-bold">SHOPKART10</span> for 10% off
      </div>

      {/* Main Navbar */}
      <nav style={{ backgroundColor: "#2874f0" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center gap-1"
              aria-label="ShopKart Home"
            >
              <div className="bg-white rounded-sm px-2 py-0.5">
                <span
                  className="font-black text-lg tracking-tight"
                  style={{ color: "#2874f0" }}
                >
                  Shop
                </span>
                <span
                  className="font-black text-lg tracking-tight"
                  style={{ color: "#ff9f00" }}
                >
                  Kart
                </span>
              </div>
              <span className="text-white text-[10px] hidden sm:block italic opacity-90 ml-1">
                India&apos;s Own Store
              </span>
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-2xl hidden sm:flex"
            >
              <div className="flex w-full rounded overflow-hidden shadow-sm">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and more"
                  className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none bg-white"
                  id="navbar-search"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="px-4 bg-white text-blue-600 hover:bg-gray-50 transition-colors"
                  aria-label="Search"
                >
                  <Search size={18} className="text-blue-600" />
                </button>
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Login / User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => {
                    if (!session) {
                      router.push("/auth/login");
                    } else {
                      setUserMenuOpen(!userMenuOpen);
                    }
                  }}
                  className="flex items-center gap-1 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  aria-label="User menu"
                  id="user-menu-button"
                >
                  <User size={18} />
                  <span className="hidden sm:block">
                    {session ? session.user?.name?.split(" ")[0] : "Login"}
                  </span>
                  {session && <ChevronDown size={14} />}
                </button>

                {/* User Dropdown */}
                {session && userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-[fadeIn_0.15s_ease-out]">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-blue-600" />
                      My Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Package size={16} className="text-green-600" />
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={16} className="text-red-500" />
                      Wishlist
                    </Link>
                    <Link
                      href="/dashboard?tab=notifications"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Bell size={16} className="text-orange-500" />
                      Notifications
                    </Link>
                    {(session.user as { role?: string })?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        <ShieldCheck size={16} className="text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative flex items-center gap-1 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                aria-label={`Wishlist (${wishlistItems.length} items)`}
              >
                <Heart size={18} />
                <span className="hidden md:block">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                aria-label={`Cart (${totalCartItems} items)`}
              >
                <ShoppingCart size={18} />
                <span className="hidden md:block">Cart</span>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems > 9 ? "9+" : totalCartItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="sm:hidden text-white p-1.5 hover:bg-blue-700 rounded transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category Nav */}
        <div
          style={{ backgroundColor: "#172337" }}
          className="hidden sm:block"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              <Link
                href="/products"
                className="flex-shrink-0 text-white text-sm px-3 py-2 hover:text-yellow-400 transition-colors whitespace-nowrap"
              >
                All Products
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.name}`}
                  className="flex-shrink-0 text-white text-sm px-3 py-2 hover:text-yellow-400 transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg">
            <form onSubmit={handleSearch} className="p-3">
              <div className="flex rounded overflow-hidden border border-gray-200">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2.5 text-sm text-gray-800 outline-none"
                  aria-label="Mobile search"
                />
                <button
                  type="submit"
                  className="px-3 bg-blue-600 text-white"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
            <nav className="pb-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.name}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 text-sm"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
