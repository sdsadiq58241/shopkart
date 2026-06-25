"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, isLoading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/wishlist");
    } else if (session) {
      fetchWishlist();
    }
  }, [session, status, fetchWishlist, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 skeleton rounded w-40 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart size={24} className="text-red-500 fill-red-500" />
        My Wishlist
        <span className="text-lg text-gray-500 font-normal">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto">
          <Heart size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Save items you love by clicking the heart icon on products.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const discountedPrice = calculateDiscountedPrice(
              item.product.price,
              item.product.discount
            );
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm product-card group"
              >
                <Link href={`/products/${item.productId}`}>
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={item.product.images[0] || "https://placehold.co/400x400"}
                      alt={item.product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {item.product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                        {item.product.discount}% off
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(item.productId);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </Link>

                <div className="p-3">
                  <Link href={`/products/${item.productId}`}>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                      {item.product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                      <span className="font-bold">{item.product.rating.toFixed(1)}</span>
                      <Star size={9} className="fill-white" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold text-gray-900">{formatPrice(discountedPrice)}</span>
                    {item.product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(item.product.price)}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(item.productId, 1)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    aria-label={`Add ${item.product.title} to cart`}
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
