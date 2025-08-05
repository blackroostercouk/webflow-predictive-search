const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const OUTPUT_DIR = 'out'; // Next.js 13+ uses 'out' with output: 'export'

console.log('🚀 Starting Webflow build process...');

// 1. Clean up
console.log('🧹 Cleaning up...');
try {
  if (fs.existsSync(OUTPUT_DIR)) fs.removeSync(OUTPUT_DIR);
  fs.ensureDirSync('.next');
  console.log('✅ Cleanup complete');
} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}

// 2. Build with Next.js
console.log('\n🔨 Building Next.js app...');
try {
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    VERCEL: '0',
    NOW_BUILDER: '0',
    NEXT_OUTPUT: 'export'
  };

  execSync('next build', { stdio: 'inherit', env, shell: true });
  console.log('✅ Build completed');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 3. Verify output
console.log('\n🔍 Verifying output...');
try {
  if (!fs.existsSync(OUTPUT_DIR)) {
    if (fs.existsSync('.next/export')) {
      console.log('ℹ️  Found output in .next/export, copying to out/...');
      fs.copySync('.next/export', OUTPUT_DIR);
    } else {
      throw new Error(`No build output found in ${OUTPUT_DIR} or .next/export`);
    }
  }

  // Add SPA redirects
  fs.writeFileSync(path.join(OUTPUT_DIR, '_redirects'), '/* /index.html 200');
  
  console.log(`✅ Webflow build ready in: ${path.resolve(OUTPUT_DIR)}`);
  console.log('\n✨ Build process completed!');
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
}
