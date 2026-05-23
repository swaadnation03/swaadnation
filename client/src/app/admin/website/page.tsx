"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';


export default function AdminWebsitePage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    bodyBackgroundColor: "#F9FAFB",
    navbarBackgroundColor: "#FFFFFF",
    navbarTextColor: "#374151",
    navbarHoverColor: "#16A34A",
    footerBackgroundColor: "#111827",
    footerTextColor: "#9CA3AF",
    isActive: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/website/admin/all`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `${API_URL}/api/website/admin/${editing._id}` : `${API_URL}/api/website/admin/create`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        fetchSettings();
        setEditing(null);
        resetForm();
        alert("Saved!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/website/admin/activate/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchSettings();
      alert("Theme activated!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this theme?")) {
      try {
        await fetch(`${API_URL}/api/website/admin/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        fetchSettings();
        alert("Theme deleted!");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const resetForm = () => {
    setForm({
      bodyBackgroundColor: "#F9FAFB",
      navbarBackgroundColor: "#FFFFFF",
      navbarTextColor: "#374151",
      navbarHoverColor: "#16A34A",
      footerBackgroundColor: "#111827",
      footerTextColor: "#9CA3AF",
      isActive: false,
    });
    setEditing(null);
  };

  const editSetting = (setting: any) => {
    setEditing(setting);
    setForm({
      bodyBackgroundColor: setting.bodyBackgroundColor,
      navbarBackgroundColor: setting.navbarBackgroundColor,
      navbarTextColor: setting.navbarTextColor,
      navbarHoverColor: setting.navbarHoverColor,
      footerBackgroundColor: setting.footerBackgroundColor,
      footerTextColor: setting.footerTextColor,
      isActive: setting.isActive,
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm sm:text-base">Loading themes...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
            Website Theme Manager
          </h1>

          {/* Live Preview - Responsive */}
          <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
                Live Preview
              </h2>
            </div>
            
            {/* Navbar Preview */}
            <div className="p-3 sm:p-4" style={{ backgroundColor: form.navbarBackgroundColor }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full"></div>
                  <span className="font-bold text-xs sm:text-sm md:text-base" style={{ color: form.navbarTextColor }}>
                    Swaad Nation
                  </span>
                </div>
                <div className="flex gap-2 sm:gap-3 md:gap-4">
                  <span className="text-xs sm:text-sm" style={{ color: form.navbarTextColor }}>Home</span>
                  <span className="text-xs sm:text-sm" style={{ color: form.navbarHoverColor }}>Products</span>
                  <span className="text-xs sm:text-sm hidden xs:inline" style={{ color: form.navbarTextColor }}>Contact</span>
                </div>
              </div>
            </div>
            
            {/* Body Preview - Responsive */}
            <div className="p-3 sm:p-4" style={{ backgroundColor: form.bodyBackgroundColor }}>
              <div className="text-center py-4 sm:py-6 md:py-8">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  This is how your website background will look
                </p>
                <button className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded text-xs sm:text-sm">
                  Sample Button
                </button>
              </div>
            </div>
            
            {/* Footer Preview - Responsive */}
            <div className="p-3 sm:p-4" style={{ backgroundColor: form.footerBackgroundColor }}>
              <p className="text-center text-xs sm:text-sm" style={{ color: form.footerTextColor }}>
                © 2024 Swaad Nation. All rights reserved.
              </p>
            </div>
          </div>

          {/* Form - Responsive */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              {editing ? "Edit" : "Create"} Website Theme
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Color Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Body Background Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Body Background Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.bodyBackgroundColor} 
                      onChange={(e) => setForm({ ...form, bodyBackgroundColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.bodyBackgroundColor} 
                      onChange={(e) => setForm({ ...form, bodyBackgroundColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Navbar Background Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Navbar Background Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.navbarBackgroundColor} 
                      onChange={(e) => setForm({ ...form, navbarBackgroundColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.navbarBackgroundColor} 
                      onChange={(e) => setForm({ ...form, navbarBackgroundColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Navbar Text Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Navbar Text Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.navbarTextColor} 
                      onChange={(e) => setForm({ ...form, navbarTextColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.navbarTextColor} 
                      onChange={(e) => setForm({ ...form, navbarTextColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Navbar Hover Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Navbar Hover Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.navbarHoverColor} 
                      onChange={(e) => setForm({ ...form, navbarHoverColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.navbarHoverColor} 
                      onChange={(e) => setForm({ ...form, navbarHoverColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Footer Background Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Footer Background Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.footerBackgroundColor} 
                      onChange={(e) => setForm({ ...form, footerBackgroundColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.footerBackgroundColor} 
                      onChange={(e) => setForm({ ...form, footerBackgroundColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>

                {/* Footer Text Color */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">
                    Footer Text Color
                  </label>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.footerTextColor} 
                      onChange={(e) => setForm({ ...form, footerTextColor: e.target.value })} 
                      className="w-10 h-9 sm:w-12 sm:h-10 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.footerTextColor} 
                      onChange={(e) => setForm({ ...form, footerTextColor: e.target.value })} 
                      className="flex-1 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-5 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  {editing ? "Update" : "Create"}
                </button>
                {editing && (
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="bg-gray-300 text-gray-700 px-5 sm:px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-sm sm:text-base order-1 sm:order-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Saved Themes List - Responsive */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Saved Themes</h2>
            
            {settings.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500 text-sm sm:text-base">No themes yet. Create your first theme above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {settings.map((s) => (
                  <div key={s._id} className="border rounded-lg p-3 sm:p-4 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: s.bodyBackgroundColor }}></div>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: s.navbarBackgroundColor }}></div>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded" style={{ backgroundColor: s.footerBackgroundColor }}></div>
                        </div>
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          Theme #{s._id.slice(-6)}
                        </span>
                      </div>
                      <div className="mt-1">
                        {s.isActive ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-xs sm:text-sm font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">Inactive</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!s.isActive && (
                        <button 
                          onClick={() => handleActivate(s._id)} 
                          className="bg-green-100 text-green-700 px-2.5 py-1 rounded text-xs sm:text-sm hover:bg-green-200 transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      <button 
                        onClick={() => editSetting(s)} 
                        className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-xs sm:text-sm hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(s._id)} 
                        className="bg-red-100 text-red-700 px-2.5 py-1 rounded text-xs sm:text-sm hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}