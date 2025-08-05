module.exports = {
  // Use our custom build script
  buildCommand: 'npm run build',
  // Output directory for the build
  outputDirectory: '.next',
  // Copy static assets to the root
  copyStaticAssets: true,
  // Environment variables for the build
  environmentVariables: {
    NODE_ENV: 'production',
    // Disable Vercel integrations
    VERCEL: '0',
    NOW_BUILDER: '0',
    NEXT_TELEMETRY_DISABLED: '1',
    // Use standalone output for Webflow Cloud
    WEBFLOW_BUILD: 'true'
  },
  // Additional build settings
  buildSettings: {
    // Disable image optimization for static export
    images: {
      unoptimized: true,
      domains: []
    },
    // Disable TypeScript and ESLint during build
    eslint: {
      ignoreDuringBuilds: true
    },
    typescript: {
      ignoreBuildErrors: true
    },
    // Enable static optimization
    optimizeFonts: true,
    // Disable server components
    serverComponents: false
  },
  // Custom build hooks
  hooks: {
    // This will be called after the build is complete
    postBuild: async ({ outputDir }) => {
      console.log('Post-build hook running...');
      // Ensure the output directory exists
      const fs = require('fs');
      const path = require('path');
      
      const staticDir = path.join(outputDir, 'static');
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }
      
      // Create a simple _redirects file for SPA routing
      const redirectsPath = path.join(outputDir, 'static/_redirects');
      fs.writeFileSync(redirectsPath, '/* /index.html 200');
      
      console.log('Post-build hook completed');
    }
  }
}
