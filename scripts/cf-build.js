const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const isWebflowCloud = process.env.WEBFLOW_BUILD === 'true';
const OUTPUT_DIR = isWebflowCloud ? '.next/standalone' : 'out';

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

// 2. Install dependencies if needed
if (isWebflowCloud) {
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install --production=false', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.error('❌ Dependency installation failed');
    process.exit(1);
  }
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
    NEXT_OUTPUT: isWebflowCloud ? 'standalone' : 'export'
  };

  // Run the appropriate build command
  const buildCommand = isWebflowCloud 
    ? 'npm run build' 
    : 'next build';
    
  execSync(buildCommand, { 
    stdio: 'inherit', 
    env, 
    shell: true 
  });
  
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 4. Finalize output for Webflow
if (!isWebflowCloud) {
  console.log('\n🔍 Verifying output...');
  try {
    // For local development, ensure the output is in the expected location
    if (!fs.existsSync(OUTPUT_DIR) && fs.existsSync('.next/export')) {
      console.log('ℹ️  Moving output to expected location...');
      fs.moveSync('.next/export', OUTPUT_DIR, { overwrite: true });
    }

    // Add SPA redirects for local testing
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, '_redirects'), 
        '/* /index.html 200'
      );
    }

    console.log(`✅ Output verified in: ${path.resolve(OUTPUT_DIR)}`);
  } catch (error) {
    console.error('❌ Output verification failed:', error.message);
    process.exit(1);
  }
}

console.log('\n✨ Build process completed successfully!');
