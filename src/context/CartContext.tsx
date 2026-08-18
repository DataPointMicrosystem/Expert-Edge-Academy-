import { createContext, useContext, useState, type ReactNode } from "react";
import type { Course } from "../data/courses";

interface CartItem extends Course {
  quantity: number;
}

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

  const addToCart = (course: Course) => {
    setItems((prev) =>
      prev.find((i) => i.id === course.id)
        ? prev
        : [...prev, { ...course, quantity: 1 }]
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const count = items.length;
  const isInCart = (id: string) => items.some((i) => i.id === id);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, count, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
