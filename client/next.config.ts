/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'swaadnation-api.onrender.com'],
  },
}

module.exports = nextConfig