import { RouterProvider } from "react-router";
import { router } from "./app/routes.tsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { LearningProvider } from "./context/LearningContext";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LearningProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </LearningProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
