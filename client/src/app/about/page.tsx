'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="py-16 px-4 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About Swaad Nation</h1>
          <p className="text-lg text-orange-100">
            Bringing authentic flavors to your table
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 space-y-12">
        {/* Mission */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">🎯 Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We're building an exciting platform to connect food lovers with authentic flavors. 
            This page is under development as we craft our brand story and values.
          </p>
        </section>

        {/* Vision */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-4">🌟 Our Vision</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We envision a world where culinary excellence is accessible to everyone. 
            More details coming as we expand this section.
          </p>
        </section>

        {/* Values */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">💡 Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <h3 className="font-semibold text-gray-800 mb-2">🍴 Quality</h3>
              <p className="text-gray-600">Committed to premium quality products</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <h3 className="font-semibold text-gray-800 mb-2">🤝 Integrity</h3>
              <p className="text-gray-600">Honest and transparent in all dealings</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <h3 className="font-semibold text-gray-800 mb-2">🚀 Innovation</h3>
              <p className="text-gray-600">Continuously improving our services</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
              <h3 className="font-semibold text-gray-800 mb-2">❤️ Customer First</h3>
              <p className="text-gray-600">Your satisfaction is our priority</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">👥 Our Team</h2>
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <p className="text-gray-600 mb-2">
                We're a passionate team of food enthusiasts and tech innovators.
              </p>
              <p className="text-sm text-gray-500">
                Full team profiles and bios coming soon!
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-orange-600 mb-6">📅 Our Journey</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1 bg-orange-600 rounded"></div>
              <div>
                <h4 className="font-semibold text-gray-800">2024: The Beginning</h4>
                <p className="text-gray-600">Swaad Nation was founded with a vision to revolutionize food delivery</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-orange-400 rounded"></div>
              <div>
                <h4 className="font-semibold text-gray-800">2025-2026: Growth Phase</h4>
                <p className="text-gray-600">Expanding our platform and building our community</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-orange-300 rounded"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Future: Scale & Impact</h4>
                <p className="text-gray-600">More exciting announcements coming your way!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="mb-6">
            Be part of the Swaad Nation community and experience authentic flavors like never before.
          </p>
          <a
            href="/"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Exploring
          </a>
        </section>
      </div>
    </div>
  );
}
