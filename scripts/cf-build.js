const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Custom build directory to avoid conflicts
const BUILD_DIR = '.cf-pages';

console.log('🚀 Starting Cloudflare Pages build process...');

// 1. Clean up previous builds
console.log('🧹 Cleaning up previous builds...');
try {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  console.log('✅ Cleanup completed');
} catch (error) {
  console.error('❌ Failed to clean up build directory');
  process.exit(1);
}

// 2. Run Next.js build
console.log('\n🔨 Building Next.js application...');
try {
  // Set environment variables to prevent Vercel CLI execution
  const env = {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    VERCEL: '0',
    NOW_BUILDER: '0',
    NODE_ENV: 'production',
    // Custom output directory
    NEXT_OUTPUT: 'standalone',
    // Disable Vercel CLI
    VERCEL_CLI_VERSION: '0.0.0',
  };

  // Run Next.js build with custom output directory
  execSync('next build', { 
    stdio: 'inherit',
    env
  });
  
  console.log('✅ Next.js build completed successfully');
} catch (error) {
  console.error('❌ Next.js build failed');
  process.exit(1);
}

// 3. Prepare for Cloudflare Pages
console.log('\n☁️  Preparing for Cloudflare Pages...');
try {
  // Copy static files to the build directory
  const copyRecursiveSync = (src, dest) => {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      fs.readdirSync(src).forEach(childItemName => {
        copyRecursiveSync(
          path.join(src, childItemName),
          path.join(dest, childItemName)
        );
      });
    } else if (exists) {
      fs.copyFileSync(src, dest);
    }
  };

  // Copy .next/static and public directories
  if (fs.existsSync('.next/static')) {
    copyRecursiveSync('.next/static', `${BUILD_DIR}/_next/static`);
  }
  
  if (fs.existsSync('public')) {
    copyRecursiveSync('public', `${BUILD_DIR}/`);
  }

  console.log('✅ Cloudflare Pages build prepared successfully');
  console.log(`📦 Build output available in: ${path.resolve(BUILD_DIR)}`);
} catch (error) {
  console.error('❌ Failed to prepare Cloudflare Pages build:', error);
  process.exit(1);
}

console.log('\n✨ Build process completed successfully!');
