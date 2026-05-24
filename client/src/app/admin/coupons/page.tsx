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
  maxDiscount: number;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  isFirstOrderOnly: boolean;
};

export default function AdminCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
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
  });

  // useEffect(() => {
  //   fetchCoupons();
  // }, []);

  useEffect(() => {
    if (user?.token) {
      fetchCoupons();
    }
  }, [user?.token]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/admin/all`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          ...formData,
          value: parseFloat(formData.value),
          minOrderAmount: parseFloat(formData.minOrderAmount),
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          endDate: new Date(formData.endDate),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          perUserLimit: parseInt(formData.perUserLimit),
        }),
      });
      
      if (res.ok) {
        fetchCoupons();
        setShowModal(false);
        setEditingCoupon(null);
        resetForm();
        alert(editingCoupon ? "Coupon updated!" : "Coupon created!");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this coupon?")) {
      const res = await fetch(`${API_URL}/api/coupons/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        fetchCoupons();
        alert("Coupon deleted");
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm sm:text-base">Loading coupons...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Create and manage discount coupons</p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon(null);
                resetForm();
                setShowModal(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base w-full sm:w-auto"
            >
              + Add Coupon
            </button>
          </div>

          {/* Coupons Table - Responsive with horizontal scroll */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-green-50 to-orange-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Code</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Discount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Min Order</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Used</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-green-600 text-sm">
                        {coupon.code}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                        {coupon.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {coupon.type === "percentage" ? (
                          <span className="text-orange-600 font-semibold text-sm">{coupon.value}% OFF</span>
                        ) : (
                          <span className="text-green-600 font-semibold text-sm">₹{coupon.value} OFF</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                        ₹{coupon.minOrderAmount}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 text-sm">
                        {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-red-500 font-medium text-sm">
                        {new Date(coupon.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button 
                          onClick={() => handleDelete(coupon._id)} 
                          className="text-red-600 hover:text-red-800 transition-colors font-medium text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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

        {/* Add/Edit Modal - Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 rounded-t-lg">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                </h2>
              </div>
              
              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., SAVE10"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono transition-all text-sm"
                    required
                  />
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 text-sm">Percentage (%)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="fixed"
                        checked={formData.type === "fixed"}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                      placeholder={formData.type === "percentage" ? "e.g., 10" : "e.g., 100"}
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
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
                      placeholder="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount
                    </label>
                    <input
                      type="number"
                      placeholder="Optional"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
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
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                      placeholder="Unlimited"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({...formData, perUserLimit: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
                
                {/* First Order Only */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFirstOrderOnly}
                    onChange={(e) => setFormData({...formData, isFirstOrderOnly: e.target.checked})}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">First Order Only</span>
                </label>
                
                {/* Modal Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm text-sm order-2 sm:order-1"
                  >
                    {editingCoupon ? "Update Coupon" : "Create Coupon"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm order-1 sm:order-2"
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