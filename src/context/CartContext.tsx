import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Course } from "../data/courses";
import { apiRequest, getAccessToken } from "../lib/api";
import { toCourse } from "../lib/coursesApi";

type CartItem = Course & {
  quantity: number;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (course: Course) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isInCart: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = async () => {
    if (!getAccessToken()) {
      setItems([]);
      return;
    }
    const response = await apiRequest<{
      data: { items?: unknown[] } | unknown[];
    }>("/cart");
    const rawItems = Array.isArray(response.data)
      ? response.data
      : response.data?.items || [];
    setItems(
      rawItems.map((item: any) => ({
        ...toCourse(item.course || item),
        quantity: item.quantity || 1,
      })),
    );
  };

  useEffect(() => {
    loadCart().catch(() => setItems([]));
  }, []);

  const addToCart = async (course: Course) => {
    await apiRequest(`/cart/add/${course.id}`, { method: "POST" });
    await loadCart();
  };

  const removeFromCart = async (id: string) => {
    await apiRequest(`/cart/remove/${id}`, { method: "DELETE" });
    await loadCart();
  };

  const clearCart = async () => {
    await apiRequest("/cart/clear", { method: "DELETE" });
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;
  const isInCart = (id: string) => items.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        count,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
