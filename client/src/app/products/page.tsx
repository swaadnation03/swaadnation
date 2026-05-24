"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { API_URL } from '@/lib/api';


type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart(); // ✅ cart hook added

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Our Products 🍪</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="border rounded-2xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={p.image ? `${API_URL}${p.image}` : "https://via.placeholder.com/300x200?text=No+Image"}
              alt={p.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="text-lg font-semibold mt-3">{p.name}</h2>

            <p className="text-orange-600 font-bold text-xl">₹{p.price}</p>

            <button
              
              onClick={() => 
                {console.log("CLICKED", p);
                addToCart(p)}} // ✅ main logic added
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}