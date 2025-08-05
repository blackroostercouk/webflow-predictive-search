import type { NextConfig } from "next";

// Webflow Cloud requires specific configuration
const isWebflowCloud = process.env.WEBFLOW_BUILD === 'true';

const nextConfig: NextConfig = {
  // Use 'standalone' for Webflow Cloud, 'export' for local development
  output: isWebflowCloud ? 'standalone' : 'export',
  
  // Standard configuration
  reactStrictMode: true,
  trailingSlash: true,
  
  // Image optimization
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
  
  // Webpack configuration
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

// Only enable static export for local development
if (!isWebflowCloud) {
  nextConfig.output = 'export';
  nextConfig.distDir = '.next';
  nextConfig.generateBuildId = async () => 'static-build';
}

export default nextConfig;