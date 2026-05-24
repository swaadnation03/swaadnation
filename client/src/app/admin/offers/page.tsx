"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type Offer = {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  startDate: string;
  endDate: string;
  order: number;
  discount: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    startDate: "",
    endDate: "",
    order: "0",
    discount: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // useEffect(() => {
  //   fetchOffers();
  // }, []);

  useEffect(() => {
    if (user?.token) {
      fetchOffers();
    }
  }, [user?.token]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/offers/admin/all`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("link", formData.link);
    submitData.append("startDate", formData.startDate);
    submitData.append("endDate", formData.endDate);
    submitData.append("order", formData.order);
    submitData.append("discount", formData.discount);
    submitData.append("isActive", String(formData.isActive));

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    try {
      let url = `${API_URL}/api/offers/admin/create`;
      let method = "POST";

      if (editingOffer) {
        url = `${API_URL}/api/offers/admin/${editingOffer._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: submitData,
      });

      if (res.ok) {
        alert(editingOffer ? "Offer updated!" : "Offer created!");
        fetchOffers();
        setShowModal(false);
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save offer");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving offer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const res = await fetch(`${API_URL}/api/offers/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (res.ok) {
        alert("Offer deleted!");
        fetchOffers();
      } else {
        alert("Failed to delete offer");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting offer");
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      link: offer.link || "",
      startDate: offer.startDate.split("T")[0],
      endDate: offer.endDate.split("T")[0],
      order: offer.order.toString(),
      discount: offer.discount || "",
      isActive: offer.isActive,
    });
    setImagePreview(offer.image);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      startDate: "",
      endDate: "",
      order: "0",
      discount: "",
      isActive: true,
    });
    setImagePreview(null);
    setImageFile(null);
    setEditingOffer(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading offers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Offer Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Create and manage festival offers & banners
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/admin"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-center text-sm sm:text-base"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
              >
                + Add New Offer
              </button>
            </div>
          </div>

          {/* Offers Grid - Responsive */}
          {offers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-gray-500 text-base sm:text-lg">
                No offers created yet
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-orange-600 hover:text-orange-700 text-sm sm:text-base"
              >
                Create your first offer →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-36 sm:h-40 md:h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=Offer";
                    }}
                  />
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2">
                        {offer.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                          offer.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                      {offer.description}
                    </p>
                    {offer.discount && (
                      <p className="text-orange-600 font-semibold text-xs sm:text-sm mt-2">
                        🔥 {offer.discount}
                      </p>
                    )}
                    <div className="mt-2 sm:mt-3 text-xs text-gray-500">
                      <p>
                        Valid: {formatDate(offer.startDate)} -{" "}
                        {formatDate(offer.endDate)}
                      </p>
                      <p>Order: {offer.order}</p>
                    </div>
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="flex-1 bg-blue-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="flex-1 bg-red-600 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Modal - Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-orange-500 p-4 rounded-t-lg">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {editingOffer ? "Edit Offer" : "Create New Offer"}
                </h2>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Offer Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-500 px-4 py-2 rounded-lg transition-colors text-sm w-full sm:w-auto text-center">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-14 w-14 sm:h-16 sm:w-16 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-500 text-sm sm:text-base"
                    placeholder="e.g., Chhath Puja Special Offer"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-500 text-sm sm:text-base"
                    placeholder="Describe the offer"
                  />
                </div>

                {/* Start & End Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-500 text-sm"
                    />
                  </div>
                </div>

                {/* Link & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) =>
                        setFormData({ ...formData, link: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-500 text-sm"
                      placeholder="/products"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Tag
                    </label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-500 text-sm"
                      placeholder="e.g., 20% OFF"
                    />
                  </div>
                </div>

                {/* Order & Active */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({ ...formData, order: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-900 text-sm"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-500">Active</span>
                    </label>
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    {editingOffer ? "Update Offer" : "Create Offer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base order-1 sm:order-2"
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
