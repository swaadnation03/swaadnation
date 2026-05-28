"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SEO from "@/components/SEO";
import OfferSlider from "@/components/OfferSlider";
import ReviewCarousel from "@/components/ReviewCarousel";
import WhatsAppButton from "@/components/WhatsAppButton";
import FounderSection from "@/components/FounderSection";
import Image from "next/image";
import { API_URL } from '@/lib/api';


type Product = {
  _id: string;
  name: string;
  price: number;
  mrp?: number;
  imageFront?: string;
  description?: string;
  category?: string;
  stock?: number;
  averageRating?: number;
  totalReviews?: number;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [hero, setHero] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
    fetchHeroSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        "Failed to load products. Please make sure the backend server is running.",
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeroSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hero/active`);
      const data = await res.json();
      setHero(data);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
    }
  };

  const categories = [
    "all",
    ...new Set(
      products
        .map((p) => p.category)
        .filter((cat): cat is string => Boolean(cat)),
    ),
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Home - Authentic Bihari Snacks"
        description="Buy authentic Bihari snacks online. Thekua, Nimki, Litti Chokha and more traditional Champaran delicacies delivered to your doorstep."
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Logo - FULLY RESPONSIVE */}
        {hero?.backgroundType === "video" && hero?.videoUrl ? (
          // Video Background Hero
          <div className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
            >
              <source src={hero.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0,0,0,${hero?.overlayOpacity || 0.4})`,
              }}
            ></div>
            <div
              className="relative z-10 text-center px-4 max-w-5xl mx-auto"
              style={{ color: hero?.textColor || "#FFFFFF" }}
            >
              {hero?.showLogo && (
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                    <Image
                      src="/logo.png"
                      alt="Swaad Nation Logo"
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                      className="object-contain drop-shadow-2xl"
                      priority
                      loading="eager"
                    />
                  </div>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-lg px-2">
                {hero?.title || "Swaad Nation"}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 sm:mb-4 drop-shadow px-2">
                {hero?.subtitle || "Taste of Champaran"}
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow px-4">
                {hero?.description ||
                  "Authentic Bihari flavors delivered to your doorstep"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="#products"
                  className="bg-white text-green-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg text-sm sm:text-base text-center"
                >
                  Shop Now
                </Link>
                {!user && (
                  <Link
                    href="/register"
                    className="border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-white hover:text-green-700 transition-all text-sm sm:text-base text-center"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Gradient/Solid/Image Background Hero
          <section
            className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
            style={{
              ...(hero?.backgroundType === "gradient" && {
                backgroundImage: hero.gradientValue,
              }),
              ...(hero?.backgroundType === "solid" && {
                backgroundColor: hero.solidColor,
              }),
              ...(hero?.backgroundType === "image" && {
                backgroundImage: `url(${hero.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }),
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: `rgba(0,0,0,${hero?.overlayOpacity || 0.3})`,
              }}
            ></div>
            <div
              className="relative z-10 text-center px-4 max-w-5xl mx-auto"
              style={{ color: hero?.textColor || "#FFFFFF" }}
            >
              {hero?.showLogo && (
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
                    <Image
                      src="/logo.png"
                      alt="Swaad Nation Logo"
                      fill
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                      className="object-contain drop-shadow-2xl"
                      priority
                      loading="eager"
                    />
                  </div>
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 drop-shadow-lg px-2">
                {hero?.title || "Swaad Nation"}
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-3 sm:mb-4 drop-shadow px-2">
                {hero?.subtitle || "Taste of Champaran"}
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow px-4">
                {hero?.description ||
                  "Authentic Bihari flavors delivered to your doorstep"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link
                  href="#products"
                  className="bg-white text-green-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg text-sm sm:text-base text-center"
                >
                  Shop Now
                </Link>
                {!user && (
                  <Link
                    href="/register"
                    className="border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-white hover:text-green-700 transition-all text-sm sm:text-base text-center"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Festival Offers Slider */}
        <OfferSlider />

        {/* About Section - Responsive */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                About Swaad Nation
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-green-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4">
                Swaad Nation is a growing Indian brand built on the values of
                purity, quality, and trust. Every product is made with great
                care and high hygiene standards, so you always get a safe and
                reliable experience. We aim to bring you the comfort of homemade
                taste, with consistent quality in every product. Our goal is to
                offer high-quality products at a reasonable price, so you don't
                have to choose between taste and value. Customer trust is our
                top priority, and we work hard to earn it with everything we
                deliver. As we grow, we plan to introduce a wide range of food
                and beverage products, making Swaad Nation a brand you can
                always rely on.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Our Specialties
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Authentic Champaran flavors made with love ❤️
              </p>
            </div>

            {/* Category Filter - Responsive */}
            {categories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category === "all" ? "All Items" : category}
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid - Responsive */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products available at the moment.
                </p>
                {user?.role === "admin" && (
                  <Link
                    href="/admin/products"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
                  >
                    Add Products
                  </Link>
                )}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-36 xs:h-40 sm:h-44 md:h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
                      {product.imageFront ? (
                        <img
                          src={product.imageFront}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl">
                          {product.category === "Snacks" && "🍪"}
                          {product.category === "Main Course" && "🍛"}
                          {product.category === "Sweets" && "🍰"}
                          {product.category === "Beverages" && "🥤"}
                          {!product.category && "🍽️"}
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      {product.category && (
                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 sm:py-1 rounded-full">
                          {product.category}
                        </span>
                      )}
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mt-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating - Responsive */}
                      {(product.averageRating ?? 0) > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                                viewBox="0 0 24 24"
                                fill={
                                  star <= Math.round(product.averageRating ?? 0)
                                    ? "#FFC107"
                                    : "none"
                                }
                                stroke="#FFC107"
                                strokeWidth="1.5"
                              >
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.totalReviews ?? 0})
                          </span>
                        </div>
                      )}

                      <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2">
                        {product.description ||
                          "Delicious authentic Bihari delicacy"}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div>
                          <span className="text-base sm:text-lg md:text-xl font-bold text-green-600">
                            ₹{product.price}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through ml-1 sm:ml-2">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock === 0}
                          className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <svg
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="hidden xs:inline">Add</span>
                        </button>
                      </div>
                      {product.stock &&
                        product.stock < 10 &&
                        product.stock > 0 && (
                          <p className="text-xs text-orange-600 mt-2">
                            Only {product.stock} left!
                          </p>
                        )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Founder Section */}
        <FounderSection />

        {/* Customer Reviews Carousel */}
        <ReviewCarousel />

        {/* Social Handles Section - Responsive */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Connect With Us
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-green-600 mx-auto mb-6 sm:mb-8"></div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 px-4">
              <a
                href="https://instagram.com/swaadnation03"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                <span className="text-xl sm:text-2xl">📷</span>
                <span className="font-semibold hidden xs:inline">
                  Instagram
                </span>
              </a>
              <a
                href="https://youtube.com/@swaadnation-03"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                <span className="text-xl sm:text-2xl">▶️</span>
                <span className="font-semibold hidden xs:inline">YouTube</span>
              </a>
              <a
                href="https://www.facebook.com/share/182UrPiBG2/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 sm:gap-3 bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
              >
                <span className="text-xl sm:text-2xl">📘</span>
                <span className="font-semibold hidden xs:inline">Facebook</span>
              </a>
            </div>
            <p className="text-gray-600 text-sm sm:text-base px-4">
              Follow us for exclusive offers, recipes, and behind-the-scenes
              content!
            </p>
          </div>
        </section>

        {/* CTA Section - Responsive */}
        {/* CTA Section - Responsive */}
        <section className="bg-linear-to-r from-green-700 to-green-600 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">
              Ready to taste the authentic Champaran?
            </h2>

            {/* Fixed Button - Option 1 (White background with green text) */}
            <Link
              href="#products"
              className="inline-block bg-white text-green-700 px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Shop Now
            </Link>
          </div>
        </section>

        {/* WhatsApp Floating Button */}
        <WhatsAppButton />
      </div>
    </>
  );
}
