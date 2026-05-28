/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'swaadnation-api.onrender.com',
      },
    ],
  },
  // Ignore build errors for sitemap
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig