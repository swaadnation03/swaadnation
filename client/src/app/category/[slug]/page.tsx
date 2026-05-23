"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import StarRating from "@/components/StarRating";
import { API_URL } from '@/lib/api';


type Product = {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  imageFront: string;
  category: string;
  stock: number;
  averageRating?: number;
  totalReviews?: number;
  description: string;
};

export default function CategoryPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");

  const categoryName = decodeURIComponent(params.slug as string);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryName, sortBy]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      const filtered = data.filter((p: Product) => p.category === categoryName);
      
      // Sort products
      let sorted = [...filtered];
      if (sortBy === "price_low") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price_high") {
        sorted.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      }
      
      setProducts(sorted);
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.imageFront,
    });
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {categoryName}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {products.length} {products.length === 1 ? 'product' : 'products'} found in this category
          </p>
        </div>

        {/* Sort Options - Responsive */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 sm:p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white text-gray-700"
          >
            <option value="newest">Newest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Products Grid - Responsive */}
        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-base sm:text-lg">No products found in this category.</p>
            <Link
              href="/#products"
              className="inline-block mt-4 text-green-600 hover:text-green-700 text-sm sm:text-base"
            >
              Browse All Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image - Responsive height */}
                <div className="h-36 xs:h-40 sm:h-44 md:h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
                  {product.imageFront ? (
                    <img
                      src={`${API_URL}${product.imageFront}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-5xl sm:text-6xl">
                      {product.category === "Snacks" && "🍪"}
                      {product.category === "Main Course" && "🍛"}
                      {product.category === "Sweets" && "🍰"}
                      {product.category === "Beverages" && "🥤"}
                    </div>
                  )}
                </div>
                
                {/* Product Info - Responsive padding */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating - Responsive */}
                  {product.averageRating && product.averageRating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating rating={product.averageRating} readonly size={12} />
                      <span className="text-xs text-gray-500">({product.totalReviews})</span>
                    </div>
                  )}
                  
                  {/* Price */}
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                    <span className="text-base sm:text-lg md:text-xl font-bold text-green-600">
                      ₹{product.price}
                    </span>
                    {product.mrp && product.mrp > product.price && (
                      <span className="text-xs sm:text-sm text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>
                  
                  {/* Description - Hidden on very small screens */}
                  <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2 hidden xs:block">
                    {product.description}
                  </p>
                  
                  {/* Add to Cart Button - Responsive */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full mt-3 bg-green-600 text-white py-1.5 sm:py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-xs sm:text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}