"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from '@/lib/api';


type Product = {
  _id: string;
  name: string;
  price: number;
  mrp: number;
  description: string;
  longDescription: string;
  category: string;
  stock: number;
  weight: string;
  imageFront: string;
  imageBack: string;
  ingredients: string;
  fssaiLicense: string;
  manufacturer?: {
    name: string;
    address: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    mrp: "",
    description: "",
    longDescription: "",
    category: "Snacks",
    stock: "",
    weight: "250 g",
    imageFront: "",
    imageBack: "",
    ingredients: "",
    fssaiLicense: "",
    manufacturerName: "Swad Nation",
    manufacturerAddress: "Motihari, East Champaran, Bihar, 845401, India",
    manufacturerEmail: "swaadnation03@gmail.com",
    isActive: true,
  });

  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [user?.token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products/admin/all`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, type: "front" | "back") => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (type === "front") {
          setFormData((prev) => ({ ...prev, imageFront: data.imageUrl }));
        } else {
          setFormData((prev) => ({ ...prev, imageBack: data.imageUrl }));
        }
        alert(
          `${type === "front" ? "Front" : "Back"} image uploaded successfully!`,
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, type);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? "PUT" : "POST";

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp) || 0,
        description: formData.description,
        longDescription: formData.longDescription,
        category: formData.category,
        stock: parseInt(formData.stock),
        weight: formData.weight,
        imageFront: formData.imageFront,
        imageBack: formData.imageBack,
        ingredients: formData.ingredients,
        fssaiLicense: formData.fssaiLicense,
        manufacturer: {
          name: formData.manufacturerName,
          address: formData.manufacturerAddress,
          email: formData.manufacturerEmail,
        },
        isActive: formData.isActive,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        fetchProducts();
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        alert(editingProduct ? "Product updated!" : "Product added!");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (res.ok) {
          fetchProducts();
          alert("Product deleted!");
        } else {
          alert("Failed to delete product");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting product");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      mrp: product.mrp?.toString() || "",
      description: product.description || "",
      longDescription: product.longDescription || "",
      category: product.category,
      stock: product.stock.toString(),
      weight: product.weight || "250 g",
      imageFront: product.imageFront || "",
      imageBack: product.imageBack || "",
      ingredients: product.ingredients || "",
      fssaiLicense: product.fssaiLicense || "",
      manufacturerName: product.manufacturer?.name || "Swad Nation",
      manufacturerAddress:
        product.manufacturer?.address ||
        "Motihari, East Champaran, Bihar, 845401, India",
      manufacturerEmail:
        product.manufacturer?.email || "swaadnation03@gmail.com",
      isActive: product.isActive,
    });
    setShowModal(true);
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (res.ok) {
        fetchProducts();
        alert("Stock updated!");
      } else {
        alert("Failed to update stock");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating stock");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      mrp: "",
      description: "",
      longDescription: "",
      category: "Snacks",
      stock: "",
      weight: "250 g",
      imageFront: "",
      imageBack: "",
      ingredients: "",
      fssaiLicense: "",
      manufacturerName: "Swad Nation",
      manufacturerAddress: "Motihari, East Champaran, Bihar, 845401, India",
      manufacturerEmail: "swaadnation03@gmail.com",
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-[#fff2dfbe]">
        {/* Header - Responsive */}
        <div className="bg-[#FFF2DF] shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Add, edit, and manage your products
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Link
                  href="/admin"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm"
                >
                  Back to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setShowModal(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  + Add New Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table - Responsive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product._id.slice(-6)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ₹{product.price}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${product.stock < 10 ? "text-red-600" : "text-gray-900"}`}
                          >
                            {product.stock}
                          </span>
                          <button
                            onClick={() => {
                              const newStock = prompt(
                                "Enter new stock quantity:",
                                product.stock.toString(),
                              );
                              if (newStock && !isNaN(parseInt(newStock))) {
                                handleUpdateStock(
                                  product._id,
                                  parseInt(newStock),
                                );
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Edit
                          </button>
                        </div>
                       </td>

                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex gap-2">
                          {product.imageFront && (
                            <img
                              src={product.imageFront}
                              alt="front"
                              className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded border"
                              onError={(e) => {
                                console.error(
                                  "Failed to load front image:",
                                  product.imageFront,
                                );
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          {product.imageBack && (
                            <img
                              src={product.imageBack}
                              alt="back"
                              className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded border"
                              onError={(e) => {
                                console.error(
                                  "Failed to load back image:",
                                  product.imageBack,
                                );
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          {!product.imageFront && !product.imageBack && (
                            <span className="text-gray-400 text-xs">
                              No image
                            </span>
                          )}
                        </div>
                       </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                       </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
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
        </div>

        {/* Add/Edit Product Modal - Responsive */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body - Responsive Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                {/* Row 1: Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-sm"
                    >
                      <option value="Snacks">Snacks</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Sweets">Sweets</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Spices">Spices</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Price, MRP, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) =>
                        setFormData({ ...formData, mrp: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Row 3: Weight & FSSAI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      placeholder="e.g., 250 g"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      FSSAI License
                    </label>
                    <input
                      type="text"
                      value={formData.fssaiLicense}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fssaiLicense: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Image Upload Section - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Front Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Front Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "front")}
                        className="hidden"
                        id="front-image"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("front-image")?.click()
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full sm:w-auto"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Front Image"}
                      </button>
                      {formData.imageFront && (
                        <div className="relative">
                          <img
                            src={formData.imageFront}
                            alt="Front"
                            className="h-12 w-12 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, imageFront: "" })
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    {formData.imageFront && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                        {formData.imageFront.split("/").pop()}
                      </p>
                    )}
                  </div>

                  {/* Back Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Back Image
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "back")}
                        className="hidden"
                        id="back-image"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("back-image")?.click()
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors w-full sm:w-auto"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Back Image"}
                      </button>
                      {formData.imageBack && (
                        <div className="relative">
                          <img
                            src={formData.imageBack}
                            alt="Back"
                            className="h-12 w-12 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, imageBack: "" })
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                    {formData.imageBack && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                        {formData.imageBack.split("/").pop()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Brief description of the product"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Long Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.longDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longDescription: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Detailed description including history and cultural significance"
                  />
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData({ ...formData, ingredients: e.target.value })
                    }
                    className="w-full p-2 border border-gray-200 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="WHEAT FLOUR, SOOJI, COCONUT, REFINED OIL, DESI GHEE, SUGAR"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Product Active</span>
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm text-sm order-1 sm:order-2"
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
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