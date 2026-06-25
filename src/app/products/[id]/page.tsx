"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShoppingCart,
  Zap,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  formatPrice,
  calculateDiscountedPrice,
  calculateSavings,
} from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import { ProductCard, ProductCardSkeleton, Product } from "@/components/ProductCard";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string };
}

interface ProductDetail extends Product {
  description: string;
  stock: number;
  reviews: Review[];
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          router.push("/products");
          return;
        }
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 skeleton rounded w-3/4" />
            <div className="h-4 skeleton rounded w-1/2" />
            <div className="h-8 skeleton rounded w-1/3" />
            <div className="h-20 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const savings = calculateSavings(product.price, product.discount);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!session) { router.push("/auth/login"); return; }
    await addToCart(product.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!session) { router.push("/auth/login"); return; }
    setBuyLoading(true);
    await addToCart(product.id, quantity);
    setBuyLoading(false);
    router.push("/checkout");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { toast.error("Please login to submit a review"); return; }
    if (!userRating) { toast.error("Please select a rating"); return; }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating: userRating, comment: reviewComment }),
      });
      if (res.ok) {
        toast.success("Review submitted!");
        setUserRating(0);
        setReviewComment("");
        // Refresh product
        const refresh = await fetch(`/api/products/${id}`);
        const data = await refresh.json();
        setProduct(data.product);
      } else {
        toast.error("Failed to submit review");
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight size={14} />
        <Link href={`/products?category=${product.category}`} className="hover:text-blue-600">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
              <Image
                src={product.images[selectedImage] || "https://placehold.co/600x600?text=No+Image"}
                alt={product.title}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Wishlist & Share */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={18} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-blue-50 transition-colors"
                  aria-label="Share product"
                >
                  <Share2 size={18} className="text-gray-400" />
                </button>
              </div>
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-blue-500" : "border-gray-200"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.brand && (
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-1">{product.brand}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{product.title}</h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-green-600 text-white text-sm px-2.5 py-1 rounded">
                <span className="font-bold">{product.rating.toFixed(1)}</span>
                <Star size={13} className="fill-white" />
              </div>
              <span className="text-gray-500 text-sm">{product.ratingCount.toLocaleString("en-IN")} ratings</span>
              <span className="text-gray-300">|</span>
              <span className="text-blue-600 text-sm font-medium">{product.reviews.length} reviews</span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-gray-900">{formatPrice(discountedPrice)}</span>
                {product.discount > 0 && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                )}
              </div>
              {product.discount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">You save {formatPrice(savings)}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">{product.discount}% off</span>
                </div>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-red-500 text-sm mt-1 font-medium">Only {product.stock} left in stock!</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-bold text-gray-900 min-w-[3rem] text-center border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                id="add-to-cart-btn"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0 || buyLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#ff9f00" }}
                id="buy-now-btn"
              >
                <Zap size={18} />
                {buyLoading ? "Processing..." : "Buy Now"}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2.5 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck size={18} className="text-blue-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">Free Delivery</span>
                  <span className="text-gray-500"> on orders above ₹499</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw size={18} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><span className="font-semibold">7-day</span> easy returns & exchange</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={18} className="text-purple-600 flex-shrink-0" />
                <span className="text-gray-700"><span className="font-semibold">100%</span> secure & encrypted payments</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check size={18} className="text-amber-600 flex-shrink-0" />
                <span className="text-gray-700"><span className="font-semibold">Genuine</span> product guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Product Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Customer Reviews</h2>

        {/* Review Summary */}
        <div className="flex items-start gap-8 mb-6 pb-6 border-b border-gray-100">
          <div className="text-center">
            <div className="text-5xl font-black text-gray-900">{product.rating.toFixed(1)}</div>
            <StarRating rating={product.rating} size={20} className="my-1 justify-center" />
            <p className="text-sm text-gray-500">{product.ratingCount} ratings</p>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = product.reviews.filter((rev) => rev.rating === r).length;
              const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
              return (
                <div key={r} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 w-3">{r}</span>
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review */}
        {session && (
          <form onSubmit={handleSubmitReview} className="mb-6 pb-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3">Write a Review</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Your Rating</p>
              <StarRating rating={userRating} size={28} interactive onRate={setUserRating} />
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:border-blue-400 mb-3"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={submittingReview || !userRating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-sm text-gray-800">{review.user.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs px-1.5 py-0.5 rounded">
                        <span>{review.rating}</span>
                        <Star size={9} className="fill-white" />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
