// Webflow API Configuration
type WebflowConfig = {
  apiToken: string;
  siteId: string;
  collectionId: string;
  apiBaseUrl: string;
  searchFields: string[];
};

// Get configuration from environment variables with fallbacks
export const webflowConfig: WebflowConfig = {
  apiToken: process.env.NEXT_PUBLIC_WEBFLOW_API_TOKEN || '',
  siteId: process.env.NEXT_PUBLIC_WEBFLOW_SITE_ID || '',
  collectionId: process.env.NEXT_PUBLIC_WEBFLOW_COLLECTION_ID || '',
  apiBaseUrl: 'https://api.webflow.com',
  searchFields: ['name', 'description', 'category']
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['NEXT_PUBLIC_WEBFLOW_API_TOKEN', 'NEXT_PUBLIC_WEBFLOW_SITE_ID', 'NEXT_PUBLIC_WEBFLOW_COLLECTION_ID'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// Run validation when the config is imported
validateConfig();

// Helper function to get API headers
export const getApiHeaders = () => ({
  'accept-version': '1.0.0',
  'authorization': `Bearer ${webflowConfig.apiToken}`,
  'content-type': 'application/json',
});

// Type for Webflow collection item
export interface WebflowItem {
  _id: string;
  name: string;
  slug: string;
  [key: string]: string | number | boolean | string[] | number[] | null | undefined;
}
