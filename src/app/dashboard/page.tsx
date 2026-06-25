"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/utils";
import Image from "next/image";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { id: string; title: string; images: string[] };
  }[];
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} className="text-yellow-500" />,
  CONFIRMED: <CheckCircle size={14} className="text-blue-500" />,
  PROCESSING: <Settings size={14} className="text-indigo-500" />,
  SHIPPED: <Truck size={14} className="text-purple-500" />,
  DELIVERED: <CheckCircle size={14} className="text-green-600" />,
  CANCELLED: <XCircle size={14} className="text-red-500" />,
};

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (session && (activeTab === "orders" || activeTab === "overview")) {
      setLoadingOrders(true);
      fetch("/api/orders")
        .then((r) => r.json())
        .then((d) => setOrders(d.orders || []))
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [session, activeTab]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const tabs = [
    { id: "overview", label: "Overview", Icon: User },
    { id: "orders", label: "My Orders", Icon: Package },
    { id: "wishlist", label: "Wishlist", Icon: Heart },
    { id: "addresses", label: "Addresses", Icon: MapPin },
    { id: "settings", label: "Settings", Icon: Settings },
  ];

  const setTab = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black"
          style={{ background: "linear-gradient(135deg, #2874f0, #172337)" }}
        >
          {session.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">{session.user?.name}</h1>
          <p className="text-gray-500 text-sm">{session.user?.email}</p>
          {(session.user as { role?: string })?.role === "ADMIN" && (
            <span className="inline-flex items-center gap-1 mt-1 bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          id="dashboard-logout"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={17} />
                {label}
                <ChevronRight size={14} className="ml-auto" />
              </button>
            ))}
          </div>

          {(session.user as { role?: string })?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="mt-3 w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              🛡️ Admin Dashboard <ChevronRight size={14} className="ml-auto" />
            </Link>
          )}
        </aside>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Orders", value: orders.length, color: "#2874F0", icon: "📦" },
                  { label: "Delivered", value: orders.filter((o) => o.status === "DELIVERED").length, color: "#388E3C", icon: "✅" },
                  { label: "In Transit", value: orders.filter((o) => o.status === "SHIPPED").length, color: "#9C27B0", icon: "🚚" },
                  { label: "Cancelled", value: orders.filter((o) => o.status === "CANCELLED").length, color: "#D32F2F", icon: "❌" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Recent Orders</h2>
                  <button onClick={() => setTab("orders")} className="text-sm text-blue-600 font-medium">
                    View All
                  </button>
                </div>
                {loadingOrders ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-16 skeleton rounded-lg" />)}
                  </div>
                ) : recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                      return (
                        <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {order.items[0]?.product?.images[0] ? (
                              <Image src={order.items[0].product.images[0]} alt="" width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {order.items[0]?.product?.title || "Order Item"}
                              {order.items.length > 1 && ` +${order.items.length - 1} more`}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-gray-900">{formatPrice(order.totalAmount)}</p>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo?.color}`}>
                              {STATUS_ICON[order.status]}
                              {statusInfo?.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">My Orders</h2>
              {loadingOrders ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No orders yet</p>
                  <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES];
                    return (
                      <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <div>
                            <span className="text-xs text-gray-500">Order ID: </span>
                            <span className="text-xs font-mono font-bold text-gray-700">{order.id.slice(0, 16)}...</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo?.color}`}>
                              {STATUS_ICON[order.status]}
                              {statusInfo?.label}
                            </span>
                            <span className="font-bold text-sm text-gray-900">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 mb-2 last:mb-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image src={item.product.images[0] || "https://placehold.co/48x48"} alt="" width={48} height={48} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.title}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-gray-400 mt-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                            {" | "}{order.paymentMethod}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="bg-white rounded-xl shadow-sm p-5 text-center py-12">
              <Heart size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">View your saved items</p>
              <Link href="/wishlist" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Go to Wishlist
              </Link>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Saved Addresses</h2>
                <button className="flex items-center gap-1 text-sm text-blue-600 font-medium border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors">
                  + Add New
                </button>
              </div>
              <div className="text-center py-8">
                <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No saved addresses yet.<br />Add one during checkout.</p>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-5">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    defaultValue={session.user?.name || ""}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    defaultValue={session.user?.email || ""}
                    disabled
                    className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
