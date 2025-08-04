# How to Get Webflow API Credentials

## 1. Get Your Webflow API Token

1. Log in to your Webflow account
2. Click on your profile picture in the bottom left corner
3. Go to "Account Settings"
4. Navigate to the "Integrations" tab
5. Under "API Access", click "Create New Token"
6. Give your token a descriptive name (e.g., "Predictive Search App")
7. Select the appropriate permissions (you'll need at least "sites:read" and "collections:read")
8. Click "Create Token"
9. Copy the token (you won't be able to see it again!)

## 2. Find Your Site ID

1. Go to your Webflow Dashboard
2. Click on the site you want to use
3. Look at the URL in your browser's address bar
4. The Site ID is the long string of characters after `/sites/`
   - Example: `https://webflow.com/dashboard/sites/5f8d8a9c9d8f7d6c5b4a3d2e`
   - Site ID: `5f8d8a9c9d8f7d6c5b4a3d2e`

## 3. Find Your Collection ID

1. In the Webflow Designer, open your site
2. Click on the CMS (database) icon in the left sidebar
3. Select the collection you want to search
4. Look at the URL in your browser's address bar
5. The Collection ID is the long string of characters after `/collections/`
   - Example: `https://webflow.com/design/your-site/collections/5f8d8a9c9d8f7d6c5b4a3d2e`
   - Collection ID: `5f8d8a9c9d8f7d6c5b4a3d2e`

## 4. Update Your .env File

1. Open the `.env` file in the root of this project
2. Replace the placeholder values with your actual credentials:
   ```
   REACT_APP_WEBFLOW_API_TOKEN=your_webflow_api_token_here
   REACT_APP_WEBFLOW_SITE_ID=your_site_id_here
   REACT_APP_WEBFLOW_COLLECTION_ID=your_collection_id_here
   ```
3. Save the file

## 5. Restart Your Development Server

After updating the `.env` file, restart your development server for the changes to take effect:

```bash
npm start
```

## Troubleshooting

- **Invalid Token**: Make sure you've copied the entire token without any extra spaces
- **403 Forbidden**: Check that your token has the correct permissions
- **404 Not Found**: Verify that your Site ID and Collection ID are correct
- **CORS Errors**: Ensure your token has the correct permissions and you're using HTTPS
