import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { searchItems } from './services/webflowService';

const PredictiveSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  // Fetch suggestions from Webflow
  const fetchSuggestions = useCallback(debounce(async (searchQuery) => {
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
  }, 300), [isInitialized]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    // You can add navigation or other actions here
    console.log('Selected:', suggestion);
    // Example: window.location.href = `/product/${suggestion.slug}`;
  };

  return (
    <div className="predictive-search">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search products..."
          className="search-input"
          aria-label="Search products"
        />
        {isLoading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
      </div>

      {query && !isLoading && (
        <div className="suggestions-container">
          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((item) => (
                <li 
                  key={item.id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <div className="suggestion-name">{item.name}</div>
                  <div className="suggestion-category">{item.category}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .predictive-search {
          max-width: 500px;
          margin: 2rem auto;
          position: relative;
        }
        .search-container {
          position: relative;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .loading, .error {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.8rem;
          color: #666;
        }
        .error {
          color: #e74c3c;
        }
        .suggestions-container {
          position: absolute;
          width: 100%;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
        }
        
        .suggestions-list {
          max-height: 300px;
          overflow-y: auto;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .suggestion-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .suggestion-item:hover {
          background-color: #f5f5f5;
        }
        .suggestion-name {
          font-weight: 500;
        }
        .suggestion-category {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
        }
        
        .no-results {
          padding: 1rem;
          color: #666;
          text-align: center;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PredictiveSearch;
