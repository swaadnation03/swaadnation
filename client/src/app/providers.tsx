"use client";

import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "10px",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4CAF50",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#f44336",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}