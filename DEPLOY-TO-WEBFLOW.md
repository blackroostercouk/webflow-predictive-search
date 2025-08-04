# Deploying to Webflow Cloud

Follow these steps to deploy the Predictive Search component to your Webflow site.

## Prerequisites

- Webflow account with a published site
- Node.js and npm installed on your computer
- Webflow API token with access to your site
- Collection ID of the collection you want to search

## Step 1: Build the Component

1. Open a terminal in the project directory
2. Install dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Build the component for Webflow:
   ```bash
   npm run build:webflow
   ```

This will create a `webflow` directory with all necessary files.

## Step 2: Upload Files to Webflow

### Option A: Using Webflow's Asset Manager (Recommended)

1. In your Webflow Designer, go to the **Assets** panel
2. Create a new folder called `predictive-search`
3. Upload all files from the `webflow/build/static` directory to this folder
4. Note the URLs of the uploaded files (you'll need them in the next step)

### Option B: Using Custom Code

1. In your Webflow Designer, go to **Project Settings** > **Custom Code**
2. In the **Head Code** section, add:
   ```html
   <script src="/uploads/your-site/predictive-search/webflow-config.js"></script>
   ```
3. In the **Before </body> Tag** section, add:
   ```html
   <div id="predictive-search-root"></div>
   <script src="/uploads/your-site/predictive-search/static/js/main.js" defer></script>
   <link href="/uploads/your-site/predictive-search/static/css/main.css" rel="stylesheet">
   ```
   Replace the paths with your actual file paths from the Asset Manager.

## Step 3: Configure the Component

1. In Webflow Designer, add an **Embed** component where you want the search to appear
2. Paste the following code, updating the placeholders with your actual values:
   ```html
   <script>
     window.updatePredictiveSearchConfig({
       // Required
       apiToken: 'YOUR_WEBFLOW_API_TOKEN',
       siteId: 'YOUR_SITE_ID',
       collectionId: 'YOUR_COLLECTION_ID',
       
       // Optional - customize the search fields
       searchFields: ['name', 'description', 'category'],
       
       // Optional - customize appearance
       placeholder: 'Search products...',
       theme: {
         primaryColor: '#6e8efb',
         secondaryColor: '#a777e3'
       }
     });
   </script>
   ```

## Step 4: Publish Your Site

1. Click **Publish** in the top-right corner of the Webflow Designer
2. Select the domains where you want to publish the changes
3. Click **Publish to Selected Domains**

## Step 5: Test the Search

1. Visit your published site
2. Try searching for items in your collection
3. Verify that results appear as expected

## Troubleshooting

### Search Not Working
- Verify your API token has the correct permissions
- Check the browser's console for any error messages (right-click > Inspect > Console)
- Ensure your collection has published items

### Styling Issues
- Check for CSS conflicts with your Webflow site's styles
- Make sure all CSS files are loading correctly

### CORS Errors
- Ensure your API token has the correct CORS settings in Webflow
- Verify your site URL is whitelisted in your Webflow API settings

## Security Notes

- Never expose your API token in client-side code in production
- Consider using environment variables or a backend service to handle API calls
- Use a read-only API token with minimal required permissions

## Updating the Component

1. Make your changes to the React components
2. Run `npm run build:webflow` again
3. Re-upload the updated files to Webflow
4. Publish your site
