// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import ProtectedRoute from "@/components/ProtectedRoute";


// export default function ProfilePage() {
//   const { user, updateProfile, logout } = useAuth();
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//   });

//   const [passwordData, setPasswordData] = useState({
//     newPassword: "",
//     confirmPassword: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         phone: user.phone || "",
//         address: user.address || "",
//       });
//     }
//   }, [user]);

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       await updateProfile(formData);
//       setMessage({ type: "success", text: "Profile updated successfully!" });
//       setIsEditing(false);
//     } catch (error: any) {
//       setMessage({ type: "error", text: error.message || "Failed to update profile" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setMessage({ type: "error", text: "New passwords do not match" });
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setMessage({ type: "error", text: "Password must be at least 6 characters" });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       await updateProfile({ password: passwordData.newPassword });
//       setMessage({ type: "success", text: "Password updated successfully!" });
//       setPasswordData({ newPassword: "", confirmPassword: "" });
//     } catch (error: any) {
//       setMessage({ type: "error", text: error.message || "Failed to update password" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     router.push("/");
//   };

//   if (!user) {
//     return null;
//   }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Header - Responsive */}
//           <div className="mb-6 sm:mb-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
//             <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account information</p>
//           </div>

//           {/* Message - Responsive */}
//           {message && (
//             <div className={`mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 text-sm sm:text-base ${
//               message.type === "success" 
//                 ? "bg-green-50 text-green-700 border border-green-200" 
//                 : "bg-red-50 text-red-700 border border-red-200"
//             }`}>
//               <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {message.type === "success" ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 )}
//               </svg>
//               <span>{message.text}</span>
//             </div>
//           )}

//           {/* Responsive Layout: Stack on mobile, side by side on desktop */}
//           <div className="flex flex-col md:flex-row gap-6">
            
//             {/* Sidebar - Full width on mobile, 1/3 on desktop */}
//             <div className="w-full md:w-1/3">
//               <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center sticky top-24">
//                 {/* Avatar - Responsive size */}
//                 <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg mb-3 sm:mb-4">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{user.name}</h3>
//                 <p className="text-gray-500 text-xs sm:text-sm break-all">{user.email}</p>
                
//                 {/* Logout Button - Full width on mobile */}
//                 <button
//                   onClick={handleLogout}
//                   className="mt-4 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm sm:text-base"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>

//             {/* Main Content - Full width on mobile, 2/3 on desktop */}
//             <div className="w-full md:w-2/3 space-y-5 sm:space-y-6">
              
//               {/* Profile Information Card */}
//               <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-3 sm:py-4">
//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
//                     <h2 className="text-lg sm:text-xl font-bold text-white">Profile Information</h2>
//                     {!isEditing && (
//                       <button
//                         onClick={() => setIsEditing(true)}
//                         className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
//                       >
//                         Edit Profile
//                       </button>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="p-4 sm:p-6">
//                   {isEditing ? (
//                     // Edit Form - Responsive
//                     <form onSubmit={handleProfileUpdate} className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Full Name
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.name}
//                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                           className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                           className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                           placeholder="Not provided"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Delivery Address
//                         </label>
//                         <textarea
//                           rows={2}
//                           value={formData.address}
//                           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                           className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                           placeholder="Not provided"
//                         />
//                       </div>
//                       <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                         <button
//                           type="submit"
//                           disabled={loading}
//                           className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base"
//                         >
//                           {loading ? "Saving..." : "Save Changes"}
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setIsEditing(false)}
//                           className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     // Profile Details View - Responsive
//                     <div className="space-y-3">
//                       <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
//                         <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Full Name</span>
//                         <span className="text-gray-900 font-medium break-words">{user.name || "—"}</span>
//                       </div>
//                       <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
//                         <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Email</span>
//                         <span className="text-gray-900 break-all">{user.email}</span>
//                       </div>
//                       <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
//                         <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Phone</span>
//                         <span className="text-gray-900">{user.phone || "—"}</span>
//                       </div>
//                       <div className="flex flex-col sm:flex-row py-2">
//                         <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Address</span>
//                         <span className="text-gray-900 break-words">{user.address || "—"}</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Change Password Card */}
//               <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 sm:px-6 py-3 sm:py-4">
//                   <h2 className="text-lg sm:text-xl font-bold text-white">Change Password</h2>
//                 </div>
                
//                 <div className="p-4 sm:p-6">
//                   <form onSubmit={handlePasswordUpdate} className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         New Password
//                       </label>
//                       <input
//                         type="password"
//                         value={passwordData.newPassword}
//                         onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
//                         className="text-gray-500 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                         placeholder="Enter new password"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Confirm New Password
//                       </label>
//                       <input
//                         type="password"
//                         value={passwordData.confirmPassword}
//                         onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                         className="text-gray-500 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
//                         placeholder="Confirm new password"
//                         required
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="px-4 sm:px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
//                     >
//                       {loading ? "Updating..." : "Update Password"}
//                     </button>
//                   </form>
//                 </div>
//               </div>

//               {/* Quick Links Card */}
//               <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
//                 <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Quick Links</h3>
//                 <div className="flex flex-wrap gap-2 sm:gap-3">
//                   <Link href="/my-orders" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
//                     📦 My Orders
//                   </Link>
//                   <Link href="/cart" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
//                     🛒 My Cart
//                   </Link>
//                   <Link href="/#products" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
//                     🍪 Continue Shopping
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }



"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "", // ✅ new field
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate current password is provided
    if (!passwordData.currentPassword) {
      setMessage({ type: "error", text: "Please enter your current password" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    // ✅ Don't allow setting same password
    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ✅ Pass currentPassword to updateProfile so backend can verify it
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account information</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 text-sm sm:text-base ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {message.type === "success" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">

            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center sticky top-24">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg mb-3 sm:mb-4">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{user.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm break-all">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm sm:text-base"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 space-y-5 sm:space-y-6">

              {/* Profile Information Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Profile Information</h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base text-gray-900"
                          placeholder="Not provided"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                        <textarea
                          rows={2}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base text-gray-900"
                          placeholder="Not provided"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm sm:text-base disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
                        <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Full Name</span>
                        <span className="text-gray-900 font-medium break-words">{user.name || "—"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
                        <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Email</span>
                        <span className="text-gray-900 break-all">{user.email}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100">
                        <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Phone</span>
                        <span className="text-gray-900">{user.phone || "—"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row py-2">
                        <span className="text-gray-500 w-full sm:w-32 mb-1 sm:mb-0">Address</span>
                        <span className="text-gray-900 break-words">{user.address || "—"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Change Password</h2>
                </div>

                <div className="p-4 sm:p-6">
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">

                    {/* ✅ New field — current password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="text-gray-900 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="text-gray-900 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="text-gray-900 w-full p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base disabled:opacity-50"
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>

              {/* Quick Links Card */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-base sm:text-lg">Quick Links</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link href="/my-orders" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
                    📦 My Orders
                  </Link>
                  <Link href="/cart" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
                    🛒 My Cart
                  </Link>
                  <Link href="/#products" className="text-green-600 hover:text-green-700 text-xs sm:text-sm flex items-center gap-1">
                    🍪 Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}