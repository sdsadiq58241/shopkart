"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Shield,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import {
  formatPrice,
  calculateDiscountedPrice,
  calculateSavings,
} from "@/lib/utils";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, isLoading, fetchCart, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/cart");
    } else if (session) {
      fetchCart();
    }
  }, [session, status, fetchCart, router]);

  if (status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-40" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalDiscount = items.reduce((sum, item) => {
    return sum + calculateSavings(item.product.price, item.product.discount) * item.quantity;
  }, 0);
  const deliveryCharge = totalPrice > 499 ? 0 : 49;
  const finalTotal = totalPrice + deliveryCharge;

  if (items.length === 0 && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm max-w-md mx-auto">
          <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingCart size={24} className="text-blue-600" />
        My Cart
        <span className="text-lg text-gray-500 font-normal">({totalItems} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            [1, 2].map((i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))
          ) : (
            items.map((item) => {
              const discountedPrice = calculateDiscountedPrice(
                item.product.price,
                item.product.discount
              );
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-start"
                >
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={item.product.images[0] || "https://placehold.co/96x96"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 mb-1">
                        {item.product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(discountedPrice)}
                      </span>
                      {item.product.discount > 0 && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(item.product.price)}
                          </span>
                          <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                            {item.product.discount}% off
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2.5 py-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 font-bold text-sm text-gray-900 border-x border-gray-200 min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2.5 py-1.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors"
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-5 shadow-sm sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <Tag size={18} className="text-green-600" />
              Price Details
            </h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Price ({totalItems} items)</span>
                <span>{formatPrice(items.reduce((s, i) => s + i.product.price * i.quantity, 0))}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
                  {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-3 mb-4">
              <div className="flex justify-between font-bold text-base text-gray-900">
                <span>Total Amount</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  You&apos;ll save {formatPrice(totalDiscount)} on this order
                </p>
              )}
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <div className="flex border border-dashed border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none"
                  id="coupon-input"
                  aria-label="Coupon code"
                />
                <button className="px-3 py-2 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <div className="flex items-center gap-2 mt-4 justify-center text-xs text-gray-500">
              <Shield size={14} className="text-green-600" />
              <span>Safe and Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
