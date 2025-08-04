import { webflowConfig, getApiHeaders } from '../config/webflow';

// Cache for storing fetched items
let cachedItems = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Request queue to prevent duplicate concurrent requests
let isFetching = false;
let fetchQueue = [];

// Helper function to process the queue
const processQueue = (error, items) => {
  fetchQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(items);
    }
  });
  fetchQueue = [];
  isFetching = false;
};

/**
 * Fetches items from Webflow CMS with caching and request queuing
 */
export const getItems = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Return cached items if they exist and cache is still valid
  if (!forceRefresh && cachedItems.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedItems;
  }

  // If a request is already in progress, queue this one
  if (isFetching) {
    return new Promise((resolve, reject) => {
      fetchQueue.push({ resolve, reject });
    });
  }

  isFetching = true;

  try {
    const response = await fetch(
      `${webflowConfig.apiBaseUrl}/collections/${webflowConfig.collectionId}/items`,
      {
        headers: getApiHeaders(),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Webflow API error (${response.status}): ${errorData.msg || response.statusText}`
      );
    }

    const data = await response.json();
    
    // Transform Webflow items to our format
    const items = data.items.map(item => ({
      id: item._id,
      name: item.name || '',
      category: item.category || '',
      slug: item.slug || '',
      // Add other fields you need from your Webflow collection
      ...item
    }));

    // Update cache
    cachedItems = items;
    lastFetchTime = Date.now();
    
    // Process any queued requests with the new data
    processQueue(null, items);
    
    return items;
  } catch (error) {
    console.error('Error fetching from Webflow:', error);
    // Process any queued requests with the error
    processQueue(error, null);
    
    // If it's a network error, return cached items if available
    if (cachedItems.length > 0 && error.name === 'AbortError') {
      console.warn('Request timed out, using cached data');
      return cachedItems;
    }
    
    throw error;
  }
};

/**
 * Searches items based on query with fuzzy matching
 */
export const searchItems = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const items = await getItems();
    const queryLower = query.toLowerCase().trim();
    const queryTerms = queryLower.split(/\s+/);
    
    return items.filter(item => {
      // Check if all search terms match in any of the search fields
      return queryTerms.every(term => 
        webflowConfig.searchFields.some(field => {
          const fieldValue = String(item[field] || '').toLowerCase();
          return fieldValue.includes(term);
        })
      );
    });
  } catch (error) {
    console.error('Error searching items:', error);
    
    // If there's an error but we have cached items, try to search in the cache
    if (cachedItems.length > 0) {
      console.warn('Using cached items for search due to error');
      const queryLower = query.toLowerCase().trim();
      return cachedItems.filter(item => 
        webflowConfig.searchFields.some(field => 
          item[field] && String(item[field]).toLowerCase().includes(queryLower)
        )
      );
    }
    
    throw error;
  }
};

/**
 * Force refresh the cache
 */
export const refreshCache = async () => {
  return getItems(true);
};

/**
 * Get a single item by ID
 */
export const getItemById = async (id) => {
  try {
    const items = await getItems();
    return items.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error getting item by ID:', error);
    throw error;
  }
};
