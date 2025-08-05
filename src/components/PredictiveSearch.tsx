"use client";

import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { searchItems, WebflowItem } from '@/services/webflowService';

interface PredictiveSearchProps {
  className?: string;
}

const PredictiveSearch: React.FC<PredictiveSearchProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<WebflowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the component by fetching items
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        // Preload items when component mounts
        await searchItems('');
        setIsInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize search. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
          setSuggestions([]);
          return;
        }

        if (!isInitialized) return;

        setIsLoading(true);
        setError(null);

        try {
          const results = await searchItems(searchQuery);
          setSuggestions(results);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
          setError('Failed to fetch suggestions. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [isInitialized]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: WebflowItem) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    // You can add navigation or other actions here
    console.log('Selected:', suggestion);
    // Example: router.push(`/product/${suggestion.slug}`);
  };

  return (
    <div className={`predictive-search ${className}`}>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="search-input"
          aria-label="Search products"
          aria-busy={isLoading}
          aria-describedby={error ? 'search-error' : undefined}
        />
        {isLoading && <div className="loading">Loading...</div>}
        {error && (
          <div id="search-error" className="error">
            {error}
          </div>
        )}
      </div>

      {query && !isLoading && (
        <div className="suggestions-container">
          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSuggestionClick(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${item.name}`}
                >
                  <div className="suggestion-name">{item.name}</div>
                  {item.category && (
                    <div className="suggestion-category">{item.category as string}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="no-results">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PredictiveSearch;
