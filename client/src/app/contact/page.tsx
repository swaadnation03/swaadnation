"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Thank you for your message! We're setting up the contact form backend. We'll get back to you soon!",
    );
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-orange-600">
          Get In Touch
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12">
          We'd love to hear from you. Send us a message!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📧</span> Email
                </h3>
                <a
                  href="mailto:
swaadnation03@gmail.com"
                  className="text-orange-600 hover:underline"
                >
                  swaadnation03@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📱</span> Phone
                </h3>
                <a
                  href="tel:+916202540380"
                  className="text-orange-600 hover:underline"
                >
                  +91 62025 40380
                </a>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Address
                </h3>
                <p className="text-gray-600">
                  Motihari, East Champaran
                  <br />
                  Bihar, 845401, India
                </p>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 text-2xl"
                  >
                    🌐
                  </a>
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 text-2xl"
                  >
                    📘
                  </a>
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 text-2xl"
                  >
                    🐦
                  </a>
                  <a
                    href="#"
                    className="text-orange-600 hover:text-orange-700 text-2xl"
                  >
                    📷
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                <p className="text-blue-700 text-sm">
                  ⚙️ <strong>Note:</strong> This form is under development. Your
                  message will be stored when backend is ready.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Related</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
