// Webflow Cloud requires this specific configuration
// to properly build and deploy Next.js applications

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Webflow Cloud
  output: 'standalone',
  
  // Ensure static export compatibility
  reactStrictMode: true,
  trailingSlash: true,
  
  // Disable features not needed for static export
  images: {
    unoptimized: true,
    domains: [],
  },
  
  // Disable build-time checks
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Webpack configuration for Webflow compatibility
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
  
  // Disable server components for static export
  experimental: {
    serverComponents: false,
  },
};

module.exports = nextConfig;
