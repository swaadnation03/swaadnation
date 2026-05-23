"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ReviewSection from "@/components/ReviewSection";
import NotifyMe from "@/components/NotifyMe";
import SEO from "@/components/SEO";
import { trackViewProduct } from "@/lib/analytics";
import RelatedProducts from "@/components/RelatedProducts";
import { API_URL } from '@/lib/api';

type Product = {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  description: string;
  longDescription: string;
  imageFront: string;
  imageBack: string;
  category: string;
  stock: number;
  weight: string;
  ingredients: string;
  fssaiLicense: string;
  manufacturer: {
    name: string;
    address: string;
    email: string;
  };
  isActive: boolean;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      trackViewProduct(product);
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/products/${params.id}`,
      );
      const data = await res.json();
      console.log("Product data:", data);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.imageFront,
        });
      }
      alert(`${quantity}x ${product.name} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please login to place order");
      router.push("/login");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <Link href="/" className="text-green-600 mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        image={
          product.imageFront
            ? `${API_URL}${product.imageFront}`
            : undefined
        }
        type="product"
        product={product}
      />

      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb - Responsive */}
          <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span> / </span>
            <Link href="/#products" className="hover:text-green-600">
              Products
            </Link>
            <span> / </span>
            <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Product Info Grid - Responsive */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
              
              {/* Product Images Section - Responsive */}
              <div className="w-full md:w-1/2">
                <div
                  className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setShowFront(!showFront)}
                >
                  {showFront ? (
                    product.imageFront ? (
                      <img
                        src={`${API_URL}${product.imageFront}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          console.error("Failed to load front image");
                          (e.target as HTMLImageElement).src =
                            `${API_URL}/placeholder.jpg`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🍪
                      </div>
                    )
                  ) : product.imageBack ? (
                    <img
                      src={`${API_URL}${product.imageBack}`}
                      alt={`${product.name} - Back`}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        console.error("Failed to load back image");
                        (e.target as HTMLImageElement).src =
                          `${API_URL}/placeholder.jpg`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      📦
                    </div>
                  )}
                </div>
                
                {/* View Toggle Buttons - Responsive */}
                <div className="flex gap-2 mt-4 justify-center">
                  <button
                    onClick={() => setShowFront(true)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
                      showFront
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setShowFront(false)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all ${
                      !showFront
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Back View
                  </button>
                </div>
                <p className="text-center text-xs sm:text-sm text-gray-500 mt-2">
                  Click image to flip
                </p>
              </div>

              {/* Product Info Section - Responsive */}
              <div className="w-full md:w-1/2">
                <div className="mb-2">
                  <span className="text-xs sm:text-sm text-green-600 font-semibold bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                  COCONUT SUGAR MASTI
                </p>

                {/* Price Section - Responsive */}
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <>
                      <span className="text-base sm:text-lg text-gray-400 line-through">
                        ₹{product.mrp}
                      </span>
                      <span className="text-xs sm:text-sm text-green-600 font-semibold">
                        Save ₹{product.mrp - product.price}
                      </span>
                    </>
                  )}
                </div>

                {/* Weight */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">Weight:</span>
                  <span className="font-semibold text-gray-700">{product.weight}</span>
                </div>

                {/* Feature Badges - Responsive */}
                <div className="border-t border-b py-3 sm:py-4 my-4">
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm sm:text-base">✓</span>
                      <span className="text-xs sm:text-sm text-gray-600">AUTHENTIC TASTE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm sm:text-base">✓</span>
                      <span className="text-xs sm:text-sm text-gray-600">HYGIENIC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm sm:text-base">✓</span>
                      <span className="text-xs sm:text-sm text-gray-600">NO ADDED PRESERVATIVES</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Quantity Selector - Responsive */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                  <span className="text-gray-700 text-sm sm:text-base">Quantity:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 text-black bg-gray-200 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-10 sm:w-12 text-center text-black font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 text-black bg-gray-200 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {product.stock > 0
                      ? `${product.stock}+ in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {/* Action Buttons - Responsive */}
                {product.stock > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all text-sm sm:text-base"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-all text-sm sm:text-base"
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <NotifyMe productId={product._id} productName={product.name} />
                )}
              </div>
            </div>

            {/* Product Details Tabs - Responsive */}
            <div className="border-t border-gray-200">
              <div className="p-4 sm:p-6 md:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Product Details
                </h2>

                {/* Description - Responsive */}
                {product.longDescription && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                      {product.longDescription}
                    </p>
                  </div>
                )}

                {/* Ingredients - Responsive */}
                {product.ingredients && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">
                      Ingredients
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {/* Storage Instructions - Responsive */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">
                    Storage Instructions
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    STORE IN COLD AND DRY PLACE, KEEP AWAY FROM DIRECT SUN
                    LIGHT. KEEP IT IN AIRTIGHT CONTAINER AFTER OPENING.
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base mt-2">
                    Best before: 45 days
                  </p>
                </div>

                {/* Manufacturer Details - Responsive */}
                {product.manufacturer && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">
                      Manufacturer Details
                    </h3>
                    <div className="text-gray-600 text-sm sm:text-base space-y-1">
                      <p>{product.manufacturer.name}</p>
                      <p>{product.manufacturer.address}</p>
                      <p>Email: {product.manufacturer.email}</p>
                      {product.fssaiLicense && (
                        <p className="mt-2">FSSAI License: {product.fssaiLicense}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                <div className="mb-6">
                  <a
                    href="https://instagram.com/swaadnation03"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 text-sm sm:text-base"
                  >
                    <span>📷</span> Instagram: @swaadnation03
                  </a>
                </div>

                {/* Review Section */}
                <ReviewSection productId={product._id} />
                
                {/* Related Products */}
                <RelatedProducts productId={product._id} category={product.category} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}