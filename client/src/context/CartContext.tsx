// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "./AuthContext";
// import { API_URL } from '@/lib/api';

// type Product = {
//   _id: string;
//   name: string;
//   price: number;
//   image?: string;
//   imageFront?: string;
// };

// type CartItem = {
//   _id: string;
//   name: string;
//   price: number;
//   qty: number;
//   image?: string;
// };

// type CartContextType = {
//   cart: CartItem[];
//   addToCart: (product: Product) => void;
//   increaseQty: (id: string) => void;
//   decreaseQty: (id: string) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
//   cartCount: number;
//   cartTotal: number;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export const CartProvider = ({ children }: { children: React.ReactNode }) => {
//   const { user } = useAuth();
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Get cart key for current user
//   const getCartKey = () => {
//     if (user) {
//       return `cart_${user._id}`;
//     }
//     return "cart_guest";
//   };

//   // Load cart from localStorage when user changes
//   useEffect(() => {
//     const cartKey = getCartKey();
//     const savedCart = localStorage.getItem(cartKey);
//     if (savedCart) {
//       try {
//         setCart(JSON.parse(savedCart));
//       } catch (error) {
//         console.error("Failed to load cart:", error);
//       }
//     } else {
//       setCart([]);
//     }
//   }, [user]);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     const cartKey = getCartKey();
//     localStorage.setItem(cartKey, JSON.stringify(cart));
//   }, [cart, user]);

//   // Helper function to format image URL
//   const formatImageUrl = (imagePath?: string): string | undefined => {
//     if (!imagePath) return undefined;
//     if (imagePath.startsWith('http')) return imagePath;
//     if (imagePath.startsWith('/uploads')) {
//       return `${API_URL}${imagePath}`;
//     }
//     return imagePath;
//   };

//   // Add to cart with proper image URL formatting
//   const addToCart = (product: Product) => {
//     setCart((prev) => {
//       const exist = prev.find((item) => item._id === product._id);
      
//       // Get the best available image
//       let imageUrl = formatImageUrl(product.image);
//       if (!imageUrl) {
//         imageUrl = formatImageUrl(product.imageFront);
//       }
      
//       if (exist) {
//         return prev.map((item) =>
//           item._id === product._id
//             ? { ...item, qty: item.qty + 1 }
//             : item
//         );
//       }
      
//       const newItem: CartItem = {
//         _id: product._id,
//         name: product.name,
//         price: product.price,
//         qty: 1,
//         image: imageUrl,
//       };
      
//       return [...prev, newItem];
//     });
//   };

//   const increaseQty = (id: string) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item._id === id ? { ...item, qty: item.qty + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (id: string) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item._id === id ? { ...item, qty: item.qty - 1 } : item
//         )
//         .filter((item) => item.qty > 0)
//     );
//   };

//   const removeFromCart = (id: string) => {
//     setCart((prev) => prev.filter((item) => item._id !== id));
//   };

//   const clearCart = () => {
//     setCart([]);
//     const cartKey = getCartKey();
//     localStorage.removeItem(cartKey);
//   };

//   const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
//   const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         increaseQty,
//         decreaseQty,
//         removeFromCart,
//         clearCart,
//         cartCount,
//         cartTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// };



"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from '@/lib/api';

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  imageFront?: string;
};

type CartItem = {
  _id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Track whether the cart has been loaded from localStorage for the current user
  // Prevents the save effect from running before the load effect completes
  const initializedRef = useRef(false);

  // ✅ Stable cart key — memoized so it doesn't recreate on every render
  const getCartKey = useCallback(() => {
    return user ? `cart_${user._id}` : "cart_guest";
  }, [user]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    initializedRef.current = false; // reset on user change

    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(cartKey); // ✅ clean up corrupted data
        setCart([]);
      }
    } else {
      setCart([]);
    }

    initializedRef.current = true;
  }, [user, getCartKey]);

  // Save cart to localStorage whenever it changes
  // ✅ Only runs after cart has been loaded — prevents overwriting saved cart with []
  useEffect(() => {
    if (!initializedRef.current) return;
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, getCartKey]);

  // ✅ Clear guest cart on login to avoid stale data from previous guest sessions
  useEffect(() => {
    if (user) {
      localStorage.removeItem("cart_guest");
    }
  }, [user]);

  const formatImageUrl = (imagePath?: string): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${API_URL}${imagePath}`;
    return imagePath;
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item._id === product._id);

      const imageUrl = formatImageUrl(product.image) ?? formatImageUrl(product.imageFront);

      if (exist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, {
        _id: product._id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: imageUrl,
      }];
    });
  };

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((item) => item._id === id ? { ...item, qty: item.qty + 1 } : item)
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) => item._id === id ? { ...item, qty: item.qty - 1 } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(getCartKey());
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      increaseQty,
      decreaseQty,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};