/** @type {import('next').NextConfig} */
const nextConfig = {
  // Other config options...
  experimental: {
    // Other experimental options...
  },
  // External packages that should be excluded from the Edge runtime
  serverExternalPackages: [
    '@prisma/client', 
    'prisma'
  ],
  // Disable Edge runtime for specific routes to reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Force specific modules to be excluded from Edge runtime
      config.optimization.moduleIds = 'named';
    }
    return config;
  }
};

module.exports = nextConfig; 