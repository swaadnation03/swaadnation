'use client';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-orange-600">
          Frequently Asked Questions
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                🚀 Coming Soon!
              </h2>
              <p className="text-gray-600 text-lg">
                We're building an awesome FAQ section for you.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Check back soon for answers to common questions about our products and services.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <p className="text-center text-gray-700">
            Have questions? Contact us at{' '}
            <a href="mailto:support@swaadnation.com" className="text-orange-600 font-semibold hover:underline">
              support@swaadnation.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
