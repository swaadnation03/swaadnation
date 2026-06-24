// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { API_URL } from "@/lib/api";

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//     address: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [verificationSent, setVerificationSent] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");

//   const router = useRouter();

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       const { confirmPassword, ...userData } = formData;
//       const res = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       // Show success message and set verification sent state
//       setVerificationSent(true);
//       setRegisteredEmail(formData.email); // ✅ save it before clearing
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         phone: "",
//         address: "",
//       });
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendVerification = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: registeredEmail }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to resend verification");
//       }

//       setSuccess("Verification email sent! Please check your inbox.");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full mx-auto">
//         {/* Logo Section - Responsive */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="flex justify-center mb-3 sm:mb-4">
//             <div className="relative w-20 h-20 sm:w-24 sm:h-24">
//               <Image
//                 src="/logo.png"
//                 alt="Swaad Nation Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
//             Create Account
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
//             Join Swaad Nation today
//           </p>
//         </div>

//         {/* Card - Responsive padding */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//           {/* Verification Sent Message */}
//           {verificationSent ? (
//             <div className="text-center py-6">
//               <div className="mb-4">
//                 <svg
//                   className="w-16 h-16 text-green-600 mx-auto"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Verify Your Email
//               </h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 We've sent a verification link to{" "}
//                 <strong>{formData.email}</strong>. Please check your email and
//                 click the link to activate your account.
//               </p>
//               <p className="text-gray-600 text-xs mb-6">
//                 The link will expire in 24 hours.
//               </p>

//               <div className="space-y-3">
//                 <p className="text-sm text-gray-600">
//                   Didn't receive the email?
//                 </p>
//                 <button
//                   onClick={handleResendVerification}
//                   className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
//                 >
//                   Resend Verification Email
//                 </button>
//               </div>

//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <Link
//                   href="/login"
//                   className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm"
//                 >
//                   Back to Sign In
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               {/* Error Message */}
//               {error && (
//                 <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
//                   <svg
//                     className="w-5 h-5 flex-shrink-0"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <span>{error}</span>
//                 </div>
//               )}

//               {/* Success Message */}
//               {success && (
//                 <div className="bg-green-50 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
//                   <svg
//                     className="w-5 h-5 flex-shrink-0"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <span>{success}</span>
//                 </div>
//               )}

//               {/* Name Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="Enter your full name"
//                 />
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="you@example.com"
//                 />
//               </div>

//               {/* Phone Field - Optional */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="10-digit mobile number"
//                 />
//               </div>

//               {/* Address Field - Optional */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Delivery Address
//                 </label>
//                 <textarea
//                   name="address"
//                   rows={2}
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base resize-vertical"
//                   placeholder="Enter your delivery address"
//                 />
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="••••••••"
//                 />
//               </div>

//               {/* Confirm Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm Password <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   required
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                   placeholder="Confirm your password"
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md disabled:opacity-50 text-sm sm:text-base"
//               >
//                 {loading ? "Creating account..." : "Create Account"}
//               </button>

//               {/* Login Link */}
//               <div className="text-center pt-2">
//                 <Link
//                   href="/login"
//                   className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm sm:text-base"
//                 >
//                   Already have an account?{" "}
//                   <span className="underline">Sign in</span>
//                 </Link>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(""); // ✅ new

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(data.message);
      setRegisteredEmail(formData.email); // ✅ save before clearing form
      setVerificationSent(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }), // ✅ use saved email
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification");
      }

      setSuccess("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
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
            Create Account
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Join Swaad Nation today
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

          {/* Verification Sent Screen */}
          {verificationSent ? (
            <div className="text-center py-6">
              <div className="mb-4">
                <svg className="w-16 h-16 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a verification link to{" "}
                <strong>{registeredEmail}</strong>. {/* ✅ use saved email */}
                Please check your email and click the link to activate your account.
              </p>
              <p className="text-gray-600 text-xs mb-6">
                The link will expire in 24 hours.
              </p>

              {/* Error/Success feedback on resend */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-400 text-green-700 px-3 py-2 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600">Didn't receive the email?</p>
                <button
                  onClick={handleResendVerification}
                  className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Resend Verification Email
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm">
                  Back to Sign In
                </Link>
              </div>
            </div>

          ) : (

            /* Registration Form */
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-sm sm:text-base">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="10-digit mobile number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base resize-vertical"
                  placeholder="Enter your delivery address"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="text-gray-800 w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium transition-colors text-sm sm:text-base">
                  Already have an account? <span className="underline">Sign in</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}