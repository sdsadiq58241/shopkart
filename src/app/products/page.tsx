"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard, ProductCardSkeleton, Product } from "@/components/ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Grid3X3,
  List,
} from "lucide-react";
import { CATEGORIES } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "ratingCount_desc", label: "Most Popular" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states from URL
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt_desc";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";

  // Local filter state (for price inputs)
  const [priceMin, setPriceMin] = useState(minPrice);
  const [priceMax, setPriceMax] = useState(maxPrice);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page"); // Reset page on filter change
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        if (sort) params.set("sort", sort);
        if (page) params.set("page", page.toString());
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (minRating) params.set("minRating", minRating);
        params.set("limit", "12");

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, page, minPrice, maxPrice, minRating]);

  const handlePriceFilter = () => {
    updateParams({ minPrice: priceMin, maxPrice: priceMax });
  };

  const clearFilters = () => {
    setPriceMin("");
    setPriceMax("");
    router.push("/products");
  };

  const hasActiveFilters = category || minPrice || maxPrice || minRating || search;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {search
              ? `Results for "${search}"`
              : category
              ? category
              : "All Products"}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {total.toLocaleString("en-IN")} products found
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="hidden sm:flex items-center border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="text-sm border border-gray-200 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`
            w-64 flex-shrink-0 bg-white rounded-xl shadow-sm p-4 h-fit sticky top-20
            sm:block
            ${sidebarOpen ? "fixed inset-0 z-50 w-full sm:relative sm:inset-auto" : "hidden sm:block"}
          `}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-4 sm:hidden">
            <h2 className="font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Active Filters
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Category Filter */}
          <FilterSection title="Category">
            <div className="space-y-1">
              <button
                onClick={() => updateParams({ category: null })}
                className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                  !category
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => updateParams({ category: cat.name })}
                  className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors flex items-center gap-2 ${
                    category === cat.name
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                  min="0"
                />
              </div>
              <button
                onClick={handlePriceFilter}
                className="w-full text-sm bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Apply
              </button>
              {/* Quick price presets */}
              <div className="flex flex-wrap gap-1 mt-1">
                {[
                  ["Under ₹1K", "0", "1000"],
                  ["₹1K-₹5K", "1000", "5000"],
                  ["₹5K-₹20K", "5000", "20000"],
                  ["₹20K+", "20000", ""],
                ].map(([label, min, max]) => (
                  <button
                    key={label}
                    onClick={() => {
                      setPriceMin(min);
                      setPriceMax(max);
                      updateParams({ minPrice: min, maxPrice: max });
                    }}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection title="Minimum Rating">
            <div className="space-y-1">
              {[4, 3, 2].map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    updateParams({
                      minRating: minRating === r.toString() ? null : r.toString(),
                    })
                  }
                  className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors flex items-center gap-2 ${
                    minRating === r.toString()
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-amber-400">{"★".repeat(r)}</span>
                  <span>{r}+ Stars</span>
                </button>
              ))}
            </div>
          </FilterSection>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-700 mb-2">
                No Products Found
              </h2>
              <p className="text-gray-500 mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                    : "flex flex-col gap-3"
                }
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => updateParams({ page: (page - 1).toString() })}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p =
                      totalPages <= 7
                        ? i + 1
                        : page <= 4
                        ? i + 1
                        : page >= totalPages - 3
                        ? totalPages - 6 + i
                        : page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => updateParams({ page: p.toString() })}
                        className={`w-9 h-9 text-sm rounded border transition-colors ${
                          p === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => updateParams({ page: (page + 1).toString() })}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
