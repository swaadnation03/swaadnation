"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        
        {/* Logo Section - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <Image
                src="/logo.png"
                alt="Swaad Nation Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Card - Responsive padding */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="you@example.com"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center pt-2">
              <Link href="/register" className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm sm:text-base">
                Don't have an account? <span className="underline">Sign up</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          <p>Demo: admin@swaadnation.com / admin123</p>
        </div>
      </div>
    </div>
  );
}