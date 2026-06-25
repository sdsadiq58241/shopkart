"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, calculateDiscountedPrice, truncateText } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  ratingCount: number;
  brand?: string | null;
  featured?: boolean;
  trending?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const inWishlist = isInWishlist(product.id);

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const savings = product.price - discountedPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth/login");
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleWishlist(product.id);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "product-card bg-white rounded-lg overflow-hidden block group",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.images[0] || "https://placehold.co/400x400?text=No+Image"}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              {product.discount}% off
            </span>
          )}
          {product.trending && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Zap size={10} /> Trending
            </span>
          )}
          {product.featured && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
            inWishlist ? "opacity-100" : ""
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={cn(
              "transition-colors",
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-snug">
          {truncateText(product.title, 60)}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
            <span className="font-bold">{product.rating.toFixed(1)}</span>
            <Star size={10} className="fill-white" />
          </div>
          <span className="text-xs text-gray-500">
            ({product.ratingCount.toLocaleString("en-IN")})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap mb-3">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(discountedPrice)}
          </span>
          {product.discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-green-600 font-semibold">
                Save {formatPrice(savings)}
              </span>
            </>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: product.stock === 0 ? "#e0e0e0" : "#2874f0",
            color: product.stock === 0 ? "#666" : "white",
          }}
          aria-label={`Add ${product.title} to cart`}
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}

// Skeleton component
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-4 skeleton rounded w-1/4" />
        <div className="h-5 skeleton rounded w-1/2" />
        <div className="h-9 skeleton rounded w-full mt-3" />
      </div>
    </div>
  );
}
