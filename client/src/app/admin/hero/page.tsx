"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';


type HeroSetting = {
  _id: string;
  backgroundType: string;
  gradientValue: string;
  solidColor: string;
  backgroundImage: string;
  videoUrl: string;
  overlayOpacity: number;
  textColor: string;
  title: string;
  subtitle: string;
  description: string;
  showLogo: boolean;
  isActive: boolean;
};

export default function AdminHeroPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<HeroSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSetting | null>(null);
  const [form, setForm] = useState({
    backgroundType: "gradient",
    gradientValue: "linear-gradient(135deg, #1B5E20, #2E7D32, #F57C00)",
    solidColor: "#2E7D32",
    backgroundImage: "",
    videoUrl: "",
    overlayOpacity: 0.4,
    textColor: "#FFFFFF",
    title: "Swaad Nation",
    subtitle: "Taste of Champaran",
    description: "Authentic Bihari flavors delivered to your doorstep",
    showLogo: true,
    isActive: false,
  });

  // useEffect(() => {
  //   fetchSettings();
  // }, []);

  useEffect(() => {
    if (user?.token) {
      fetchSettings();
    }
  }, [user?.token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hero/admin/all`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `${API_URL}/api/hero/admin/${editing._id}` : `${API_URL}/api/hero/admin/create`;
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
    await fetch(`${API_URL}/api/hero/admin/activate/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    fetchSettings();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this design?")) {
      await fetch(`${API_URL}/api/hero/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchSettings();
    }
  };

  const resetForm = () => {
    setForm({
      backgroundType: "gradient",
      gradientValue: "linear-gradient(135deg, #1B5E20, #2E7D32, #F57C00)",
      solidColor: "#2E7D32",
      backgroundImage: "",
      videoUrl: "",
      overlayOpacity: 0.4,
      textColor: "#FFFFFF",
      title: "Swaad Nation",
      subtitle: "Taste of Champaran",
      description: "Authentic Bihari flavors delivered to your doorstep",
      showLogo: true,
      isActive: false,
    });
    setEditing(null);
  };

  const editSetting = (setting: HeroSetting) => {
    setEditing(setting);
    setForm({
      backgroundType: setting.backgroundType,
      gradientValue: setting.gradientValue,
      solidColor: setting.solidColor,
      backgroundImage: setting.backgroundImage,
      videoUrl: setting.videoUrl || "",
      overlayOpacity: setting.overlayOpacity,
      textColor: setting.textColor,
      title: setting.title,
      subtitle: setting.subtitle,
      description: setting.description,
      showLogo: setting.showLogo,
      isActive: setting.isActive,
    });
  };

  const getPreviewStyle = () => {
    if (form.backgroundType === "solid") {
      return { backgroundColor: form.solidColor };
    } else if (form.backgroundType === "gradient") {
      return { backgroundImage: form.gradientValue };
    } else if (form.backgroundType === "image") {
      return { backgroundImage: `url(${form.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" };
    } else if (form.backgroundType === "video") {
      return { backgroundColor: "#1a1a2e", backgroundImage: "linear-gradient(135deg, #1a1a2e, #16213e)" };
    }
    return {};
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm sm:text-base">Loading...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Hero Section Manager</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Customize gradient, colors, and background</p>
            </div>
            <button
              onClick={() => {
                setEditing(null);
                resetForm();
                // setShowModal?.(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-md text-sm sm:text-base w-full sm:w-auto"
            >
              + Create New Design
            </button>
          </div>

          {/* Live Preview */}
          <div className="mb-6 sm:mb-8 p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Live Preview</h2>
            <div className="relative rounded-lg overflow-hidden" style={{ minHeight: "200px", ...getPreviewStyle() }}>
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${form.overlayOpacity})` }}></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4 sm:p-6" style={{ color: form.textColor }}>
                {form.showLogo && <div className="text-4xl sm:text-5xl mb-2">🍪</div>}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{form.title}</h2>
                <p className="text-base sm:text-lg md:text-xl">{form.subtitle}</p>
                <p className="text-sm sm:text-base mt-2 max-w-md px-2">{form.description}</p>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-green-800 rounded-full text-xs sm:text-sm">Shop Now</button>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-white rounded-full text-xs sm:text-sm">Sign Up</button>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">{editing ? "Edit" : "Create"} Hero Setting</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Background Type */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Background Type</label>
                <select 
                  value={form.backgroundType} 
                  onChange={(e) => setForm({ ...form, backgroundType: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                >
                  <option value="gradient">Gradient</option>
                  <option value="solid">Solid Color</option>
                  <option value="image">Image URL</option>
                  <option value="video">Video (MP4)</option>
                </select>
              </div>

              {/* Gradient Input */}
              {form.backgroundType === "gradient" && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Gradient CSS</label>
                  <input 
                    type="text" 
                    value={form.gradientValue} 
                    onChange={(e) => setForm({ ...form, gradientValue: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                    placeholder="linear-gradient(135deg, #1B5E20, #2E7D32, #F57C00)"
                  />
                </div>
              )}

              {/* Solid Color Input */}
              {form.backgroundType === "solid" && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Solid Color</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <input 
                      type="color" 
                      value={form.solidColor} 
                      onChange={(e) => setForm({ ...form, solidColor: e.target.value })} 
                      className="w-10 h-10 sm:w-12 sm:h-12 border rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={form.solidColor} 
                      onChange={(e) => setForm({ ...form, solidColor: e.target.value })} 
                      className="flex-1 w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {/* Image URL Input */}
              {form.backgroundType === "image" && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Image URL</label>
                  <input 
                    type="text" 
                    value={form.backgroundImage} 
                    onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base" 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Video URL Input */}
              {form.backgroundType === "video" && (
                <div>
                  <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Video URL (MP4)</label>
                  <input 
                    type="text" 
                    value={form.videoUrl} 
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} 
                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base" 
                    placeholder="/videos/your-video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Place MP4 files in: <code className="bg-gray-100 px-1 rounded">client/public/videos/</code>
                  </p>
                </div>
              )}

              {/* Overlay Opacity */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Overlay Opacity (0-1)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={form.overlayOpacity} 
                    onChange={(e) => setForm({ ...form, overlayOpacity: parseFloat(e.target.value) })} 
                    className="flex-1 accent-green-600"
                  />
                  <span className="text-sm text-gray-600 w-12">{form.overlayOpacity}</span>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Text Color</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                  <input 
                    type="color" 
                    value={form.textColor} 
                    onChange={(e) => setForm({ ...form, textColor: e.target.value })} 
                    className="w-10 h-10 sm:w-12 sm:h-12 border rounded cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={form.textColor} 
                    onChange={(e) => setForm({ ...form, textColor: e.target.value })} 
                    className="flex-1 w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Title</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Subtitle</label>
                <input 
                  type="text" 
                  value={form.subtitle} 
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-sm sm:text-base" 
                  rows={2}
                />
              </div>

              {/* Show Logo Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.showLogo} 
                  onChange={(e) => setForm({ ...form, showLogo: e.target.checked })} 
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm sm:text-base text-gray-700">Show Logo</span>
              </label>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base">
                  {editing ? "Update" : "Create"}
                </button>
                {editing && (
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors text-sm sm:text-base">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Saved Designs List */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Saved Designs</h2>
            {settings.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No designs yet. Create your first design above.</p>
            ) : (
              <div className="space-y-3">
                {settings.map((s) => (
                  <div key={s._id} className="border rounded-lg p-3 sm:p-4 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="font-bold text-gray-800 text-sm sm:text-base">{s.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500 capitalize">{s.backgroundType}</div>
                      <div className="mt-1">
                        {s.isActive ? (
                          <span className="text-green-600 text-xs sm:text-sm font-medium">Active</span>
                        ) : (
                          <span className="text-gray-400 text-xs sm:text-sm">Inactive</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
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