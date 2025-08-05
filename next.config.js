/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use static export for local development, standalone for Webflow Cloud
  output: process.env.WEBFLOW_BUILD === 'true' ? 'standalone' : 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Enable static export
  trailingSlash: true,
  
  // Disable TypeScript and ESLint during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable server components for static export
  experimental: {
    serverComponents: false,
  },
};

module.exports = nextConfig;