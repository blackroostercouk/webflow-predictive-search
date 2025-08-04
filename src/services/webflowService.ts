import { webflowConfig, getApiHeaders } from '../config/webflow';

// Cache for storing fetched items
let cachedItems: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Request queue to prevent duplicate concurrent requests
let isFetching = false;
let fetchQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

// Helper function to process the queue
const processQueue = (error: Error | null, items?: any[]) => {
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

export interface WebflowItem {
  _id: string;
  name: string;
  slug: string;
  [key: string]: any;
}

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
        headers: getApiHeaders(),
        next: { revalidate: 300 } // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items) {
      cachedItems = data.items;
      lastFetchTime = Date.now();
      processQueue(null, cachedItems);
      return cachedItems;
    }
    
    throw new Error('No items found in response');
  } catch (error) {
    console.error('Error fetching items from Webflow:', error);
    processQueue(error as Error);
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
    const searchTerm = query.toLowerCase();
    
    return items.filter(item => {
      // Search in name and any other relevant fields
      return (
        (item.name?.toLowerCase().includes(searchTerm)) ||
        (item.description?.toLowerCase().includes(searchTerm)) ||
        (item.content?.toLowerCase().includes(searchTerm))
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
