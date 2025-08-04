# Webflow Predictive Search Component

A responsive, customizable predictive search component that integrates with Webflow CMS collections.

## Features

- Real-time search as you type
- Displays search results from Webflow CMS collections
- Responsive design that works on all devices
- Loading states and error handling
- No results found message
- Easy to customize and style

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Webflow account with API access
- A Webflow collection with items you want to search through

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Webflow API credentials:
   ```
   REACT_APP_WEBFLOW_API_TOKEN=your_webflow_api_token_here
   REACT_APP_WEBFLOW_SITE_ID=your_site_id_here
   REACT_APP_WEBFLOW_COLLECTION_ID=your_collection_id_here
   ```

## Configuration

### Webflow API Setup

1. Get your Webflow API token from [Webflow Account Settings](https://webflow.com/dashboard/account)
2. Find your Site ID in the Webflow dashboard URL when viewing your site settings
3. Find your Collection ID in the URL when viewing your collection in the Webflow Designer

### Customizing Search Fields

Edit `src/config/webflow.js` to specify which fields from your collection should be searchable:

```javascript
export const webflowConfig = {
  // ...
  searchFields: ['name', 'description', 'category'] // Add your collection field names here
};
```

## Running Locally

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

This will create a production build in the `build` folder.

## Deploying to Webflow

### Option 1: Using an iframe (Recommended)

1. Build the project: `npm run build`
2. Host the `build` folder on a static hosting service (Netlify, Vercel, GitHub Pages, etc.)
3. In Webflow, add an Embed component and use an iframe to embed your search component:
   ```html
   <iframe 
     src="YOUR_DEPLOYED_APP_URL" 
     style="width: 100%; min-height: 400px; border: none;"
     title="Search"
   ></iframe>
   ```

### Option 2: Using Webflow Custom Code

1. Build the project: `npm run build`
2. Copy the contents of `build/static/js/main.[hash].js` and `build/static/css/main.[hash].css`
3. In Webflow, go to Project Settings > Custom Code
4. Add the CSS to the `<head>` section
5. Add the JS to the `</body>` section
6. Add a div with id `root` where you want the search to appear:
   ```html
   <div id="root"></div>
   ```

## Customizing the Look and Feel

You can customize the appearance by modifying the styles in `src/PredictiveSearch.js`. The component uses CSS-in-JS with template literals for styling.

## Troubleshooting

- **CORS Issues**: Make sure your Webflow API token has the correct permissions
- **No Results**: Verify your collection ID and that the collection has published items
- **Styling Issues**: Check for CSS conflicts with Webflow's styles

## License

MIT
