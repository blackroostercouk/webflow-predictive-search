'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PredictiveSearch component with SSR disabled
const PredictiveSearch = dynamic(
  () => import('@/components/PredictiveSearch'),
  { ssr: false } // Disable SSR for this component since it uses browser APIs
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once component mounts on the client side
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Webflow Predictive Search
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Search through your Webflow CMS content in real-time
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Try searching for products
            </h2>
            
            {/* Only render PredictiveSearch on the client side */}
            {isClient && <PredictiveSearch />}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Tips:</h3>
              <ul className="mt-2 text-sm text-gray-500 space-y-1">
                <li>• Start typing to see instant search results</li>
                <li>• Results are fetched from your Webflow CMS collection</li>
                <li>• Click on a result to select it</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
