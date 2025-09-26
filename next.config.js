/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.clerk.com', 'images.clerk.dev'],
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
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // Allow mobile app deep linking
        source: '/pay',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'lovelock://',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/pricing/:plan',
        destination: '/pricing?plan=:plan',
        permanent: false,
      },
      {
        source: '/subscribe/:plan',
        destination: '/pay?plan=:plan',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig