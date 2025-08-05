// This is a minimal Next.js config for Webflow Cloud
// It ensures compatibility with Webflow's build system

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  // Disable image optimization as it requires a server
  images: {
    unoptimized: true,
  },
  // Disable TypeScript and ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Custom webpack config to ensure static export works correctly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensures static files are properly handled
      config.resolve.fallback = { fs: false, path: false };
    }
    return config;
  },
  // Disable server components as they're not needed for static export
  experimental: {
    serverComponents: false,
  },
};

module.exports = nextConfig;
