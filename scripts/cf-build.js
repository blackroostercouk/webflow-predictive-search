const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const isWebflowCloud = process.env.WEBFLOW_BUILD === 'true';
const OUTPUT_DIR = isWebflowCloud ? '.next' : 'out';

console.log('🚀 Starting build process...');
console.log(`🌐 Webflow Cloud Build: ${isWebflowCloud ? 'Yes' : 'No'}`);

// 1. Clean up
console.log('🧹 Preparing build environment...');
try {
  // Only clean up in local development
  if (!isWebflowCloud && fs.existsSync(OUTPUT_DIR)) {
    fs.removeSync(OUTPUT_DIR);
  }
  
  // Ensure necessary directories exist
  fs.ensureDirSync('.next');
  console.log('✅ Environment ready');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}

// 2. Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install --production=false', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Dependency installation failed');
  process.exit(1);
}

// 3. Build with Next.js
console.log('\n🔨 Building application...');
try {
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    WEBFLOW_BUILD: isWebflowCloud ? 'true' : 'false',
    NEXT_TELEMETRY_DISABLED: '1',
    VERCEL: '0',
    NOW_BUILDER: '0',
    // Use standalone output for Webflow Cloud
    NEXT_OUTPUT: isWebflowCloud ? 'standalone' : 'export'
  };

  // Run the build
  execSync('next build', { 
    stdio: 'inherit', 
    env, 
    shell: true 
  });
  
  console.log('✅ Build completed successfully');
  
  // For local development, verify the output
  if (!isWebflowCloud) {
    console.log('\n🔍 Verifying output...');
    
    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      throw new Error(`Output directory not found: ${OUTPUT_DIR}`);
    }
    
    // Add SPA redirects for local testing
    const redirectsPath = path.join(OUTPUT_DIR, '_redirects');
    fs.writeFileSync(redirectsPath, '/* /index.html 200');
    
    console.log(`✅ Output verified in: ${path.resolve(OUTPUT_DIR)}`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n✨ Build process completed successfully!');
