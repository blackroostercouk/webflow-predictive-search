// Webflow API Configuration
export const webflowConfig = {
  // This token should be stored in environment variables in production
  apiToken: process.env.REACT_APP_WEBFLOW_API_TOKEN || 'YOUR_WEBFLOW_API_TOKEN',
  // Your site ID from Webflow
  siteId: process.env.REACT_APP_WEBFLOW_SITE_ID || 'YOUR_SITE_ID',
  // The collection ID you want to search in
  collectionId: process.env.REACT_APP_WEBFLOW_COLLECTION_ID || 'YOUR_COLLECTION_ID',
  // Base URL for Webflow API
  apiBaseUrl: 'https://api.webflow.com',
  // Fields to search in (customize based on your collection fields)
  searchFields: ['name', 'description', 'category']
};

// Helper function to get API headers
export const getApiHeaders = () => ({
  'accept-version': '1.0.0',
  'authorization': `Bearer ${webflowConfig.apiToken}`,
  'content-type': 'application/json',
});
