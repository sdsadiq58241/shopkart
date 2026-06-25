"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  MapPin,
  CreditCard,
  Truck,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { addressSchema, AddressFormData } from "@/lib/validations";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery", Icon: Truck, desc: "Pay when your order arrives", color: "#388E3C" },
  { id: "CARD", label: "Credit / Debit Card", Icon: CreditCard, desc: "Visa, Mastercard, Rupay", color: "#2874F0" },
  { id: "UPI", label: "UPI Payment", Icon: Smartphone, desc: "GPay, PhonePe, Paytm", color: "#8B5CF6" },
  { id: "NETBANKING", label: "Net Banking", Icon: Building2, desc: "All major banks", color: "#F59E0B" },
  { id: "WALLET", label: "Digital Wallet", Icon: Wallet, desc: "Paytm, Amazon Pay", color: "#EF4444" },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout");
    }
    if (status === "authenticated" && items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [status, items.length, orderPlaced, router]);

  const totalPrice = getTotalPrice();
  const deliveryCharge = totalPrice > 499 ? 0 : 49;
  const finalTotal = totalPrice + deliveryCharge;

  const onSubmit = async (address: AddressFormData) => {
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod,
          items: orderItems,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderPlaced(data.order.id);
        clearCart();
        toast.success("Order placed successfully! 🎉");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to place order");
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Thank you for shopping with ShopKart</p>
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono font-bold text-gray-700">{orderPlaced.slice(0, 12)}...</span>
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/dashboard?tab=orders")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push("/products")}
              className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ChevronRight size={20} className="text-gray-400" />
        Checkout
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Address + Payment */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-name">
                    Full Name *
                  </label>
                  <input
                    {...register("name")}
                    id="checkout-name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-phone">
                    Phone Number *
                  </label>
                  <input
                    {...register("phone")}
                    id="checkout-phone"
                    type="tel"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-pincode">
                    Pincode *
                  </label>
                  <input
                    {...register("pincode")}
                    id="checkout-pincode"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                </div>

                {/* Line 1 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-line1">
                    Address Line 1 *
                  </label>
                  <input
                    {...register("line1")}
                    id="checkout-line1"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="House/Flat No., Building Name, Street"
                  />
                  {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1.message}</p>}
                </div>

                {/* Line 2 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-line2">
                    Address Line 2
                  </label>
                  <input
                    {...register("line2")}
                    id="checkout-line2"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="Landmark, Area (optional)"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-city">
                    City *
                  </label>
                  <input
                    {...register("city")}
                    id="checkout-city"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="checkout-state">
                    State *
                  </label>
                  <input
                    {...register("state")}
                    id="checkout-state"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-gray-800"
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-600" />
                  Payment Method
                </h2>
              </div>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ id, label, Icon, desc, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    id={`payment-${id.toLowerCase()}`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    {paymentMethod === id && (
                      <CheckCircle size={20} className="text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary ({items.length} items)
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const discountedPrice = calculateDiscountedPrice(item.product.price, item.product.discount);
                  return (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-2 font-medium">{item.product.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        {formatPrice(discountedPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "text-gray-600"}>
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 border-t border-dashed pt-2 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-colors disabled:opacity-70 text-base"
                id="place-order-btn"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  `Place Order • ${formatPrice(finalTotal)}`
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                <Plus size={10} /> By placing this order you agree to our Terms & Conditions
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
