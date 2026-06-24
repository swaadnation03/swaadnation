"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid verification link. Missing token or email.");
      setLoading(false);
      return;
    }

    verifyEmail();
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email verification failed");
        setLoading(false);
        return;
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUserData(data);
      setSuccess(true);
      setLoading(false);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Logo Section */}
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
            Email Verification
          </h2>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-green-600 mx-auto animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                Verifying your email...
              </p>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-green-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Email Verified! 🎉
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                Welcome, <strong>{userData?.name}</strong>!
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mb-6">
                Your account is now active. You're being redirected to home...
              </p>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="inline-block w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all text-sm sm:text-base"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-red-600 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h3>
              <p className="text-red-600 text-sm sm:text-base mb-6">
                {error}
              </p>

              <div className="space-y-3">
                <Link
                  href="/register"
                  className="inline-block w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all text-sm sm:text-base"
                >
                  Try Again
                </Link>
                <Link
                  href="/login"
                  className="inline-block w-full bg-gray-100 text-gray-900 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
