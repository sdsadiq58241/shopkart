import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard, ProductCardSkeleton, Product } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/utils";
import {
  ArrowRight,
  Zap,
  Star,
  Tag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ShopKart - India's Best Online Shopping Platform",
  description:
    "Shop millions of products at the best prices. Electronics, Fashion, Home, Beauty & more. Fast delivery, easy returns.",
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/products?featured=true&limit=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getTrendingProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/products?trending=true&limit=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

const promoItems = [
  {
    title: "Min. 40% Off",
    subtitle: "Fashion & Clothing",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
    href: "/products?category=Fashion",
    color: "#E91E63",
  },
  {
    title: "Up to 60% Off",
    subtitle: "Electronics & Gadgets",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    href: "/products?category=Electronics",
    color: "#2874F0",
  },
  {
    title: "Best Sellers",
    subtitle: "Books & Education",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    href: "/products?category=Books",
    color: "#388E3C",
  },
];

export default async function HomePage() {
  const [featuredProducts, trendingProducts] = await Promise.all([
    getFeaturedProducts(),
    getTrendingProducts(),
  ]);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* Categories */}
        <section aria-labelledby="categories-heading">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <h2
                id="categories-heading"
                className="text-lg font-bold text-gray-900"
              >
                Shop by Category
              </h2>
              <Link
                href="/products"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.name}`}
                  className="flex flex-col items-center justify-center py-5 px-2 hover:bg-blue-50 transition-colors group"
                  aria-label={`Browse ${cat.name}`}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banners */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promoItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="relative rounded-xl overflow-hidden h-40 group"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                <p
                  className="text-sm font-bold uppercase tracking-wide mb-1"
                  style={{ color: item.color === "#2874F0" ? "#93c5fd" : "#fbbf24" }}
                >
                  {item.subtitle}
                </p>
                <p className="text-xl font-black text-white">{item.title}</p>
                <span
                  className="mt-2 text-xs font-bold px-3 py-1 rounded text-white w-fit"
                  style={{ backgroundColor: item.color }}
                >
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Featured Products */}
        <section aria-labelledby="featured-heading">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-amber-500 fill-amber-500" />
                <h2
                  id="featured-heading"
                  className="text-lg font-bold text-gray-900"
                >
                  Featured Products
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Deal Banner */}
        <section>
          <div
            className="rounded-xl overflow-hidden relative p-8"
            style={{ backgroundColor: "#172337" }}
          >
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Tag size={24} className="text-yellow-400" />
                <span className="text-yellow-400 font-bold text-lg uppercase tracking-wider">
                  Today&apos;s Special Deal
                </span>
                <Tag size={24} className="text-yellow-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">
                Extra 10% Off on Your First Order
              </h2>
              <p className="text-gray-300 mb-6 text-sm">
                Use code{" "}
                <code className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded font-bold text-base">
                  FIRST10
                </code>{" "}
                at checkout
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors text-sm"
              >
                Start Shopping <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Products */}
        <section aria-labelledby="trending-heading">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-orange-500 fill-orange-500" />
                <h2
                  id="trending-heading"
                  className="text-lg font-bold text-gray-900"
                >
                  Trending Now
                </h2>
              </div>
              <Link
                href="/products?trending=true"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              {trendingProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trendingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
