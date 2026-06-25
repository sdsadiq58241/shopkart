import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    discount: number;
    images: string[];
    rating: number;
    category: string;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/wishlist");
          if (res.ok) {
            const data = await res.json();
            set({ items: data.wishlistItems || [] });
          }
        } catch {
          console.error("Failed to fetch wishlist");
        } finally {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (productId: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.added) {
              set((state) => ({
                items: [...state.items, data.wishlistItem],
              }));
              toast.success("Added to wishlist!");
            } else {
              set((state) => ({
                items: state.items.filter((i) => i.productId !== productId),
              }));
              toast.success("Removed from wishlist");
            }
          } else if (res.status === 401) {
            toast.error("Please login to add to wishlist");
          }
        } catch {
          toast.error("Failed to update wishlist");
        } finally {
          set({ isLoading: false });
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((i) => i.productId === productId);
      },
    }),
    {
      name: "shopkart-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
