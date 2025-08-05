const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Run the Cloudflare Pages build command
  console.log('Running build with @cloudflare/next-on-pages...');
  execSync('npx @cloudflare/next-on-pages', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
