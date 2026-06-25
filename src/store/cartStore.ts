import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    discount: number;
    images: string[];
    stock: number;
    category: string;
  };
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/cart");
          if (res.ok) {
            const data = await res.json();
            set({ items: data.cartItems || [] });
          }
        } catch {
          console.error("Failed to fetch cart");
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          });
          if (res.ok) {
            await get().fetchCart();
            toast.success("Added to cart!");
          } else {
            const data = await res.json();
            toast.error(data.error || "Failed to add to cart");
          }
        } catch {
          toast.error("Failed to add to cart");
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        try {
          const res = await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          });
          if (res.ok) {
            await get().fetchCart();
          }
        } catch {
          toast.error("Failed to update cart");
        }
      },

      removeFromCart: async (productId: string) => {
        try {
          const res = await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          if (res.ok) {
            set((state) => ({
              items: state.items.filter((i) => i.productId !== productId),
            }));
            toast.success("Item removed from cart");
          }
        } catch {
          toast.error("Failed to remove item");
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => {
          const price =
            item.product.discount > 0
              ? Math.round(
                  item.product.price * (1 - item.product.discount / 100)
                )
              : item.product.price;
          return sum + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "shopkart-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
