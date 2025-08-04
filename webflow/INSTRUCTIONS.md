# Webflow Deployment Instructions

## Step 1: Upload Files to Webflow

1. Log in to your Webflow account and open your site in the Designer
2. Go to the **Assets** panel (left sidebar)
3. Create a new folder called `predictive-search`
4. Upload the following files from the `webflow/build/static` directory:
   - `js/main.[hash].js`
   - `css/main.[hash].css`
   - Any other files in the static directory

## Step 2: Add the Embed Code

1. In Webflow Designer, go to the page where you want to add the search
2. Add an **Embed** component from the elements panel
3. Paste the following code, replacing the placeholder URLs with your actual file URLs from the Assets panel:

```html
<div id="predictive-search-root"></div>

<script>
  // Configuration - Update with your Webflow API credentials
  window.predictiveSearchConfig = {
    apiToken: '97c989c13e7905ca64ab420e8bb010982d2922bc5f6f299d71f60328592d3f33',
    siteId: '5eb55653d4d4d9014b76407d',
    collectionId: '5ebc1bf96fbf1661a3191aa9',
    searchFields: ['name', 'description', 'category'],
    placeholder: 'Search products...',
    theme: {
      primaryColor: '#6e8efb',
      secondaryColor: '#a777e3'
    }
  };
</script>

<!-- Update these URLs with your actual file paths from Webflow Assets -->
<script src="/uploads/predictive-search/static/js/main.9fad25ec.js" defer></script>
<link href="/uploads/predictive-search/static/css/main.234c3e6b.css" rel="stylesheet">
```

## Step 3: Publish Your Site

1. Click the **Publish** button in the top-right corner
2. Select your domain
3. Click **Publish to Selected Domains**

## Step 4: Test the Search

1. Visit your published site
2. Try searching for items in your collection
3. Verify that results appear as expected

## Troubleshooting

If the search doesn't work:
1. Open your browser's developer tools (F12)
2. Check the Console tab for any error messages
3. Verify that all file URLs in the embed code are correct
4. Make sure your Webflow API token has the correct permissions

## Security Note

The API token in the embed code should be kept private. For production, consider:
1. Using environment variables
2. Creating a read-only API token
3. Or setting up a backend service to handle the API calls
