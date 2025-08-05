import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Enable static exports for Cloudflare Pages
  output: 'export',
  
  // Optional: Add base path if your app is not served from the root
  // basePath: '/your-base-path',
  
  // Optional: Enable trailing slash for better compatibility
  trailingSlash: true,
  
  // Optional: Configure images if you're using next/image
  images: {
    unoptimized: true, // Required for static exports
  },
};

export default nextConfig;
