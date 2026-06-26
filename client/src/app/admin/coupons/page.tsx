// "use client";

// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { API_URL } from '@/lib/api';


// type Coupon = {
//   _id: string;
//   code: string;
//   name: string;
//   type: string;
//   value: number;
//   minOrderAmount: number;
//   maxDiscount: number;
//   endDate: string;
//   usageLimit: number;
//   usedCount: number;
//   isActive: boolean;
//   isFirstOrderOnly: boolean;
// };

// export default function AdminCouponsPage() {
//   const { user } = useAuth();
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
//   const [formData, setFormData] = useState({
//     code: "",
//     name: "",
//     type: "percentage",
//     value: "",
//     minOrderAmount: "0",
//     maxDiscount: "",
//     endDate: "",
//     usageLimit: "",
//     perUserLimit: "1",
//     isFirstOrderOnly: false,
//   });

//   // useEffect(() => {
//   //   fetchCoupons();
//   // }, []);

//   useEffect(() => {
//     if (user?.token) {
//       fetchCoupons();
//     }
//   }, [user?.token]);

//   const fetchCoupons = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/coupons/admin/all`, {
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       const data = await res.json();
//       setCoupons(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const url = editingCoupon
//         ? `${API_URL}/api/coupons/admin/${editingCoupon._id}`
//         : `${API_URL}/api/coupons/admin/create`;
      
//       const method = editingCoupon ? "PUT" : "POST";
      
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user?.token}`,
//         },
//         body: JSON.stringify({
//           ...formData,
//           value: parseFloat(formData.value),
//           minOrderAmount: parseFloat(formData.minOrderAmount),
//           maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
//           endDate: new Date(formData.endDate),
//           usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
//           perUserLimit: parseInt(formData.perUserLimit),
//         }),
//       });
      
//       if (res.ok) {
//         fetchCoupons();
//         setShowModal(false);
//         setEditingCoupon(null);
//         resetForm();
//         alert(editingCoupon ? "Coupon updated!" : "Coupon created!");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error saving coupon");
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (confirm("Delete this coupon?")) {
//       const res = await fetch(`${API_URL}/api/coupons/admin/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       if (res.ok) {
//         fetchCoupons();
//         alert("Coupon deleted");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       code: "",
//       name: "",
//       type: "percentage",
//       value: "",
//       minOrderAmount: "0",
//       maxDiscount: "",
//       endDate: "",
//       usageLimit: "",
//       perUserLimit: "1",
//       isFirstOrderOnly: false,
//     });
//   };

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//         <p className="text-gray-500 text-sm sm:text-base">Loading coupons...</p>
//       </div>
//     </div>
//   );

//   return (
//     <ProtectedRoute adminOnly>
//       <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
//           {/* Header - Responsive */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coupon Management</h1>
//               <p className="text-gray-600 text-sm sm:text-base mt-1">Create and manage discount coupons</p>
//             </div>
//             <button
//               onClick={() => {
//                 setEditingCoupon(null);
//                 resetForm();
//                 setShowModal(true);
//               }}
//               className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base w-full sm:w-auto"
//             >
//               + Add Coupon
//             </button>
//           </div>

//           {/* Coupons Table - Responsive with horizontal scroll */}
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gradient-to-r from-green-50 to-orange-50">
//                   <tr>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Code</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Min Order</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Used</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                     <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {coupons.map((coupon) => (
//                     <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 sm:px-6 py-4 font-mono font-bold text-green-600 text-sm">
//                         {coupon.code}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
//                         {coupon.name}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4">
//                         {coupon.type === "percentage" ? (
//                           <span className="text-orange-600 font-semibold text-sm">{coupon.value}% OFF</span>
//                         ) : (
//                           <span className="text-green-600 font-semibold text-sm">₹{coupon.value} OFF</span>
//                         )}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
//                         ₹{coupon.minOrderAmount}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
//                         {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 text-red-500 font-medium text-sm">
//                         {new Date(coupon.endDate).toLocaleDateString()}
//                       </td>
//                       <td className="px-4 sm:px-6 py-4">
//                         <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
//                           {coupon.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4">
//                         <button 
//                           onClick={() => handleDelete(coupon._id)} 
//                           className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Empty State */}
//           {coupons.length === 0 && (
//             <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow mt-4">
//               <div className="text-5xl mb-4">🏷️</div>
//               <p className="text-gray-500 text-sm sm:text-base">No coupons found. Click "Add Coupon" to create one.</p>
//             </div>
//           )}
//         </div>

//         {/* Add/Edit Modal - Responsive */}
//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-25 overflow-y-auto">
//             <div className="bg-white rounded-lg max-w-md w-full mx-4">
              
//               {/* Modal Header */}
//               <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-t-lg">
//                 <h2 className="text-lg sm:text-xl font-bold text-white">
//                   {editingCoupon ? "Edit Coupon" : "Create Coupon"}
//                 </h2>
//               </div>
              
//               {/* Modal Body */}
//               <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
//                 {/* Coupon Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Coupon Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g., SAVE10"
//                     value={formData.code}
//                     onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
//                     className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono transition-all text-sm"
//                     required
//                   />
//                 </div>
                
//                 {/* Coupon Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Coupon Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g., Save 10% on first order"
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     required
//                   />
//                 </div>
                
//                 {/* Discount Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Discount Type <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex flex-wrap gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         value="percentage"
//                         checked={formData.type === "percentage"}
//                         onChange={(e) => setFormData({...formData, type: e.target.value})}
//                         className="w-4 h-4 text-green-600 focus:ring-green-500"
//                       />
//                       <span className="text-gray-700 text-sm">Percentage (%)</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         value="fixed"
//                         checked={formData.type === "fixed"}
//                         onChange={(e) => setFormData({...formData, type: e.target.value})}
//                         className="w-4 h-4 text-green-600 focus:ring-green-500"
//                       />
//                       <span className="text-gray-700 text-sm">Fixed Amount (₹)</span>
//                     </label>
//                   </div>
//                 </div>
                
//                 {/* Discount Value */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {formData.type === "percentage" ? "Discount Percentage *" : "Discount Amount *"}
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="number"
//                       placeholder={formData.type === "percentage" ? "e.g., 10" : "e.g., 100"}
//                       value={formData.value}
//                       onChange={(e) => setFormData({...formData, value: e.target.value})}
//                       className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 transition-all text-sm"
//                       required
//                     />
//                     <span className="absolute right-3 top-2 text-gray-400 text-sm">
//                       {formData.type === "percentage" ? "%" : "₹"}
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Min Order & Max Discount */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Min Order Amount
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="0"
//                       value={formData.minOrderAmount}
//                       onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
//                       className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Max Discount
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="Optional"
//                       value={formData.maxDiscount}
//                       onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
//                       className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Expiry Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expiry Date <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) => setFormData({...formData, endDate: e.target.value})}
//                     className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     required
//                   />
//                 </div>
                
//                 {/* Usage Limit & Per User Limit */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Usage Limit
//                     </label>
//                     <input
//                       type="number"
//                       placeholder="Unlimited"
//                       value={formData.usageLimit}
//                       onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
//                       className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Per User Limit
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.perUserLimit}
//                       onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
//                       className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
//                     />
//                   </div>
//                 </div>
                
//                 {/* First Order Only */}
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFirstOrderOnly}
//                     onChange={(e) => setFormData({...formData, isFirstOrderOnly: e.target.checked})}
//                     className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
//                   />
//                   <span className="text-sm text-gray-700">First Order Only</span>
//                 </label>
                
//                 {/* Modal Footer Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm text-sm order-2 sm:order-1"
//                   >
//                     {editingCoupon ? "Update Coupon" : "Create Coupon"}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm order-1 sm:order-2"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }




"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';

type Coupon = {
  _id: string;
  code: string;
  name: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  isActive: boolean;
  isFirstOrderOnly: boolean;
};

type FormState = {
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: string;
  minOrderAmount: string;
  maxDiscount: string;
  endDate: string;
  usageLimit: string;
  perUserLimit: string;
  isFirstOrderOnly: boolean;
};

const emptyForm: FormState = {
  code: "",
  name: "",
  type: "percentage",
  value: "",
  minOrderAmount: "0",
  maxDiscount: "",
  endDate: "",
  usageLimit: "",
  perUserLimit: "1",
  isFirstOrderOnly: false,
};

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.token) {
      fetchCoupons();
    }
  }, [user?.token]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/admin/all`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to load coupons", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setFormError("");
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormError("");
    setFormData({
      code: coupon.code,
      name: coupon.name,
      type: coupon.type === "fixed" ? "fixed" : "percentage",
      value: String(coupon.value),
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      maxDiscount: coupon.maxDiscount != null ? String(coupon.maxDiscount) : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      usageLimit: coupon.usageLimit != null ? String(coupon.usageLimit) : "",
      perUserLimit: String(coupon.perUserLimit ?? 1),
      isFirstOrderOnly: coupon.isFirstOrderOnly,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.code.trim() || !formData.name.trim() || !formData.value || !formData.endDate) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const url = editingCoupon
        ? `${API_URL}/api/coupons/admin/${editingCoupon._id}`
        : `${API_URL}/api/coupons/admin/create`;

      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          name: formData.name.trim(),
          type: formData.type,
          value: parseFloat(formData.value),
          minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          endDate: new Date(formData.endDate),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          perUserLimit: parseInt(formData.perUserLimit) || 1,
          isFirstOrderOnly: formData.isFirstOrderOnly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }

      await fetchCoupons();
      closeModal();
      setToast({
        message: editingCoupon ? "Coupon updated" : "Coupon created",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/coupons/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        setToast({ message: "Coupon deleted", type: "success" });
      } else {
        setToast({ message: "Failed to delete coupon", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Network error while deleting", type: "error" });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm sm:text-base">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-[#fff2dfbe] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Create and manage discount coupons</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base w-full sm:w-auto"
            >
              + Add Coupon
            </button>
          </div>

          {/* Coupons Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[900px] lg:min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-orange-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Code</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Min Order</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Used</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Limits</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon) => {
                    const expired = isExpired(coupon.endDate);
                    return (
                      <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 font-mono font-bold text-green-600 text-sm">
                          {coupon.code}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm max-w-[180px] truncate">
                          {coupon.name}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          {coupon.type === "percentage" ? (
                            <span className="text-orange-600 font-semibold text-sm">{coupon.value}% OFF</span>
                          ) : (
                            <span className="text-green-600 font-semibold text-sm">₹{coupon.value} OFF</span>
                          )}
                          {coupon.maxDiscount != null && (
                            <p className="text-xs text-gray-400">cap ₹{coupon.maxDiscount}</p>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                          ₹{coupon.minOrderAmount}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                          {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-gray-700 text-xs">
                          <div>{coupon.perUserLimit ?? 1}/user</div>
                          {coupon.isFirstOrderOnly && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                              First order only
                            </span>
                          )}
                        </td>
                        <td className={`px-4 sm:px-6 py-4 font-medium text-sm ${expired ? "text-red-500" : "text-gray-700"}`}>
                          {new Date(coupon.endDate).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              !coupon.isActive
                                ? "bg-gray-100 text-gray-500"
                                : expired
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {!coupon.isActive ? "Inactive" : expired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditModal(coupon)}
                              className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                            >
                              Edit
                            </button>

                            {confirmDeleteId === coupon._id ? (
                              <span className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(coupon._id)}
                                  disabled={deletingId === coupon._id}
                                  className="text-red-600 hover:text-red-800 font-semibold text-sm disabled:opacity-50"
                                >
                                  {deletingId === coupon._id ? "..." : "Confirm"}
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-gray-400 hover:text-gray-600 text-sm"
                                >
                                  Cancel
                                </button>
                              </span>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(coupon._id)}
                                className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {coupons.length === 0 && (
            <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow mt-4">
              <div className="text-5xl mb-4">🏷️</div>
              <p className="text-gray-500 text-sm sm:text-base">No coupons found. Click "Add Coupon" to create one.</p>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 pt-12 sm:pt-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 my-auto">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                    {formError}
                  </div>
                )}

                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SAVE10"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    disabled={!!editingCoupon}
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono transition-all text-sm disabled:bg-gray-100 disabled:text-gray-500"
                    required
                  />
                  {editingCoupon && (
                    <p className="text-xs text-gray-400 mt-1">Coupon codes can't be changed after creation.</p>
                  )}
                </div>

                {/* Coupon Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Save 10% on first order"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="percentage"
                        checked={formData.type === "percentage"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 text-sm">Percentage (%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="fixed"
                        checked={formData.type === "fixed"}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "fixed" })}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 text-sm">Fixed Amount (₹)</span>
                    </label>
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === "percentage" ? "Discount Percentage *" : "Discount Amount *"}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={formData.type === "percentage" ? "e.g., 10" : "e.g., 100"}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 transition-all text-sm"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-400 text-sm">
                      {formData.type === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                </div>

                {/* Min Order & Max Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      disabled={formData.type === "fixed"}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                {/* Usage Limit & Per User Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Unlimited"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* First Order Only */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFirstOrderOnly}
                    onChange={(e) => setFormData({ ...formData, isFirstOrderOnly: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">First Order Only</span>
                </label>

                {/* Modal Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm text-sm order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm order-1 sm:order-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}