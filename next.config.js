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
  // Performance optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for better build performance
    if (!dev) {
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }
    return config
  },
}

module.exports = nextConfig