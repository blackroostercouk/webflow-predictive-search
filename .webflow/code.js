module.exports = {
  // Use our custom build script
  buildCommand: 'npm run build',
  // Output to the 'out' directory where next export saves files
  outputDirectory: 'out',
  // Copy static assets to the root
  copyStaticAssets: true,
  // Environment variables for the build
  environmentVariables: {
    NODE_ENV: 'production',
    // Disable Vercel integrations
    VERCEL: '0',
    NOW_BUILDER: '0',
    NEXT_TELEMETRY_DISABLED: '1',
    // Use static export
    NEXT_OUTPUT: 'export'
  },
  // Additional build settings
  buildSettings: {
    // Use static export
    output: 'export',
    // Disable image optimization for static export
    images: {
      unoptimized: true
    },
    // Disable TypeScript and ESLint during build
    eslint: {
      ignoreDuringBuilds: true
    },
    typescript: {
      ignoreBuildErrors: true
    },
    // Enable static optimization
    optimizeFonts: true
  }
}
