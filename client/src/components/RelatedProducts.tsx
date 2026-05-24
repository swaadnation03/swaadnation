"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
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
};

interface RelatedProductsProps {
  productId: string;
  category: string;
}

export default function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"related" | "frequently">("related");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchRelatedProducts();
    fetchFrequentlyBought();
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/related/${productId}?limit=8`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFrequentlyBought = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/frequently-bought/${productId}`);
      const data = await res.json();
      if (data.success && data.products.length > 0) {
        setFrequentlyBought(data.products);
      }
    } catch (error) {
      console.error("Error fetching frequently bought:", error);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
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
      <div className="mt-8 sm:mt-12">
        <div className="flex justify-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const displayProducts = activeTab === "related" ? products : frequentlyBought;
  
  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12">
      {/* Section Header with Tabs - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">
          {activeTab === "related" ? "You May Also Like" : "Frequently Bought Together"}
        </h2>
        
        {/* Tab Switcher - Responsive */}
        <div className="flex gap-1.5 sm:gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("related")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "related"
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            🛍️ <span className="hidden xs:inline">You May Also Like</span>
            <span className="xs:hidden">Related</span>
          </button>
          {frequentlyBought.length > 0 && (
            <button
              onClick={() => setActiveTab("frequently")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "frequently"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              🔥 <span className="hidden xs:inline">Frequently Bought</span>
              <span className="xs:hidden">Bought</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Grid - Responsive columns */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayProducts.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            {/* Product Image - Responsive height */}
            <div className="h-32 xs:h-36 sm:h-40 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden">
              {product.imageFront ? (
                <img
                  src={product.imageFront || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="text-3xl sm:text-4xl">
                  {product.category === "Snacks" && "🍪"}
                  {product.category === "Main Course" && "🍛"}
                  {product.category === "Sweets" && "🍰"}
                  {product.category === "Beverages" && "🥤"}
                  {!product.category && "🍽️"}
                </div>
              )}
            </div>
            
            {/* Product Info - Responsive padding */}
            <div className="p-2 sm:p-3">
              {/* Category and Rating */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                  {product.category}
                </span>
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={product.averageRating} readonly size={10} />
                    <span className="text-[10px] text-gray-500 hidden xs:inline">
                      ({product.totalReviews})
                    </span>
                  </div>
                )}
              </div>
              
              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-2 group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>
              
              {/* Price */}
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <span className="text-sm sm:text-base md:text-lg font-bold text-green-600">₹{product.price}</span>
                {product.mrp && product.mrp > product.price && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">₹{product.mrp}</span>
                )}
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stock === 0}
                className="w-full mt-2 sm:mt-3 bg-gray-100 text-gray-700 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </Link>
        ))}
      </div>
      
      {/* View All Link - Responsive */}
      {products.length > 4 && (
        <div className="text-center mt-5 sm:mt-6">
          <Link
            href={`/category/${category}`}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
          >
            View All {category}
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}