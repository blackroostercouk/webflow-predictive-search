const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building for Webflow...');

// 1. Create a production build
try {
  console.log('Creating production build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. Create webflow directory
  const webflowDir = path.join(process.cwd(), 'webflow');
  fs.ensureDirSync(webflowDir);
  
  // 3. Copy necessary files
  console.log('Copying files...');
  fs.copySync(path.join(process.cwd(), 'build'), path.join(webflowDir, 'build'));
  
  // 4. Create the embed code file
  const embedCode = `<!-- Webflow Predictive Search Component -->
<div id="predictive-search-root"></div>

<!-- Load the search component -->
<script>
  // Configuration - Update these values in your Webflow project settings
  const searchConfig = {
    containerId: 'predictive-search-root',
    apiToken: 'YOUR_WEBFLOW_API_TOKEN',
    siteId: 'YOUR_SITE_ID',
    collectionId: 'YOUR_COLLECTION_ID'
  };

  // Create and append the script tag
  const script = document.createElement('script');
  script.src = '/build/static/js/main.js';
  script.defer = true;
  script.onload = function() {
    console.log('Predictive Search loaded successfully');
  };
  script.onerror = function() {
    console.error('Failed to load Predictive Search');
  };
  document.head.appendChild(script);

  // Create and append the stylesheet
  const link = document.createElement('link');
  link.href = '/build/static/css/main.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
</script>
`;

  // 5. Save the embed code to a file
  fs.writeFileSync(path.join(webflowDir, 'embed-code.html'), embedCode);
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Files are ready in the /webflow directory');
  console.log('📋 Embed code is in /webflow/embed-code.html');
  console.log('\nNext steps:');
  console.log('1. Upload the contents of /webflow/build to your Webflow site');
  console.log('2. Copy the contents of /webflow/embed-code.html');
  console.log('3. In Webflow, add an Embed component and paste the code');
  
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
