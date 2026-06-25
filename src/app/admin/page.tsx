"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
}

interface AdminProduct {
  id: string;
  title: string;
  price: number;
  discount: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  featured: boolean;
  trending: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

interface AdminOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { quantity: number; product: { title: string } }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Check admin access
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      if ((session.user as { role?: string })?.role !== "ADMIN") {
        router.push("/");
        toast.error("Admin access required");
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    if ((session?.user as { role?: string })?.role !== "ADMIN") return;
    setLoading(true);

    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ])
      .then(([productsData, usersData, ordersData]) => {
        setStats(productsData.stats);
        setProducts(productsData.products || []);
        setUsers(usersData.users || []);
        setOrders(ordersData.orders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product deleted");
        setDeleteConfirm(null);
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") return null;

  const tabs = [
    { id: "overview", label: "Overview", Icon: LayoutDashboard },
    { id: "products", label: "Products", Icon: Package, count: stats?.totalProducts },
    { id: "orders", label: "Orders", Icon: ShoppingBag, count: stats?.totalOrders },
    { id: "users", label: "Users", Icon: Users, count: stats?.totalUsers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm">Welcome back, {session.user?.name}</p>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Store
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {tabs.map(({ id, label, Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
              activeTab === id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <Icon size={16} />
            {label}
            {count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? "bg-white/20" : "bg-gray-100"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), Icon: DollarSign, color: "#2874F0", bg: "#e8f0fe" },
              { label: "Total Orders", value: stats?.totalOrders || 0, Icon: ShoppingBag, color: "#388E3C", bg: "#e8f5e9" },
              { label: "Total Users", value: stats?.totalUsers || 0, Icon: Users, color: "#9C27B0", bg: "#f3e5f5" },
              { label: "Total Products", value: stats?.totalProducts || 0, Icon: Package, color: "#FF9F00", bg: "#fff8e1" },
            ].map(({ label, value, Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <TrendingUp size={14} className="text-green-500" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">{value}</div>
                <div className="text-xs text-gray-500 font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                Recent Orders
              </h2>
              <button onClick={() => setActiveTab("orders")} className="text-sm text-blue-600 font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-semibold text-gray-800">{order.user.name}</p>
                          <p className="text-xs text-gray-400">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{order.items.length} items</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{formatPrice(order.totalAmount)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${{
                          DELIVERED: "bg-green-100 text-green-700",
                          SHIPPED: "bg-purple-100 text-purple-700",
                          PENDING: "bg-yellow-100 text-yellow-700",
                          CANCELLED: "bg-red-100 text-red-700",
                          CONFIRMED: "bg-blue-100 text-blue-700",
                          PROCESSING: "bg-indigo-100 text-indigo-700",
                          REFUNDED: "bg-gray-100 text-gray-700",
                        }[order.status] || "bg-gray-100 text-gray-700"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Manage Products</h2>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              id="add-product-btn"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images[0] || "https://placehold.co/40x40"}
                            alt=""
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1 max-w-[200px]">{product.title}</p>
                          <div className="flex gap-1 mt-0.5">
                            {product.featured && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Featured</span>}
                            {product.trending && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Trending</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.discount > 0 && (
                        <span className="ml-1 text-xs text-green-600">(-{product.discount}%)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-amber-500" : "text-green-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-amber-500 font-bold">★ {product.rating.toFixed(1)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                          id={`delete-product-${product.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">Manage Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #2874f0, #172337)" }}
                        >
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{user._count.orders}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">All Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-800">{order.user.name}</p>
                      <p className="text-xs text-gray-400">{order.user.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {order.items[0]?.product?.title ? (
                        <span className="line-clamp-1 max-w-[160px] block">{order.items[0].product.title}{order.items.length > 1 ? ` +${order.items.length - 1}` : ""}</span>
                      ) : `${order.items.length} items`}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${{
                        DELIVERED: "bg-green-100 text-green-700",
                        SHIPPED: "bg-purple-100 text-purple-700",
                        PENDING: "bg-yellow-100 text-yellow-700",
                        CANCELLED: "bg-red-100 text-red-700",
                        CONFIRMED: "bg-blue-100 text-blue-700",
                        PROCESSING: "bg-indigo-100 text-indigo-700",
                        REFUNDED: "bg-gray-100 text-gray-700",
                      }[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Delete Product?</h3>
              <button onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex items-start gap-3 mb-5 bg-red-50 rounded-lg p-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">This action cannot be undone. The product will be permanently deleted.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                id="confirm-delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
