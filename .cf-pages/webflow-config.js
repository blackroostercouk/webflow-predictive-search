// Webflow Configuration
// This file will be loaded by the embed code
// You can update these values in Webflow's custom code editor

// Default configuration
window.predictiveSearchConfig = {
  // Webflow API settings
  apiToken: 'YOUR_WEBFLOW_API_TOKEN',
  siteId: 'YOUR_SITE_ID',
  collectionId: 'YOUR_COLLECTION_ID',
  
  // Search settings
  searchFields: ['name', 'description', 'category'],
  debounceTime: 300,
  
  // UI Text
  placeholder: 'Search products...',
  noResultsText: 'No results found for',
  loadingText: 'Loading...',
  errorText: 'Failed to load search',
  
  // Styling
  theme: {
    primaryColor: '#6e8efb',
    secondaryColor: '#a777e3',
    textColor: '#333',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
};

// Allow configuration to be updated from Webflow
window.updatePredictiveSearchConfig = function(newConfig) {
  window.predictiveSearchConfig = {
    ...window.predictiveSearchConfig,
    ...newConfig
  };
  
  // Dispatch event to notify the app of config changes
  if (window.predictiveSearchInitialized) {
    window.dispatchEvent(new CustomEvent('predictiveSearchConfigUpdate', {
      detail: window.predictiveSearchConfig
    }));
  }
};
