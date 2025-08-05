import { webflowConfig, WebflowItem } from '../config/webflow';

// Re-export WebflowItem type for use in other files
export type { WebflowItem };

// Cache for storing fetched items
let cachedItems: WebflowItem[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Request queue to prevent duplicate concurrent requests
let isFetching = false;
type QueueItem = {
  resolve: (value: WebflowItem[] | PromiseLike<WebflowItem[]>) => void;
  reject: (reason?: Error) => void;
};
let fetchQueue: QueueItem[] = [];

// Helper function to process the queue
const processQueue = (error: Error | null, items?: WebflowItem[]) => {
  fetchQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (items) {
      promise.resolve(items);
    } else {
      promise.reject(new Error('No items provided to processQueue'));
    }
  });
  fetchQueue = [];
  isFetching = false;
};

/**
 * Fetches items from Webflow CMS with caching and request queuing
 */
export const getItems = async (forceRefresh = false): Promise<WebflowItem[]> => {
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
        headers: {
          'Authorization': `Bearer ${webflowConfig.apiToken}`,
          'accept-version': '1.0.0',
          'Content-Type': 'application/json'
        },
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as { items: WebflowItem[] };
    
    if (data.items) {
      cachedItems = data.items;
      lastFetchTime = Date.now();
      processQueue(null, cachedItems);
      return cachedItems;
    }
    
    throw new Error('No items found in response');
  } catch (error) {
    console.error('Error fetching items from Webflow:', error);
    const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
    processQueue(errorObj);
    
    // If we have cached items, return them even if there was an error
    if (cachedItems.length > 0) {
      console.warn('Using cached items due to error:', error);
      return cachedItems;
    }
    
    throw error;
  }
};

/**
 * Searches items based on query with fuzzy matching
 */
export const searchItems = async (query: string): Promise<WebflowItem[]> => {
  if (!query.trim()) {
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
    throw error;
  }
};

/**
 * Force refresh the cache
 */
export const refreshCache = async (): Promise<WebflowItem[]> => {
  return getItems(true);
};

/**
 * Get a single item by ID
 */
export const getItemById = async (id: string): Promise<WebflowItem | undefined> => {
  try {
    const items = await getItems();
    return items.find(item => item._id === id);
  } catch (error) {
    console.error(`Error getting item with ID ${id}:`, error);
    throw error;
  }
};
