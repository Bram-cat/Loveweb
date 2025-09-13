/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.clerk.com'],
  },
  outputFileTracingRoot: __dirname,
}

module.exports = nextConfig