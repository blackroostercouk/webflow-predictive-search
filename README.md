# Webflow Predictive Search

A Next.js application that provides real-time predictive search functionality for Webflow CMS collections. This application allows users to search through Webflow CMS content with instant results.

## Features

- Real-time predictive search as you type
- Fetches data directly from Webflow CMS
- Responsive design that works on all devices
- Client-side caching for better performance
- Built with Next.js 15+ and TypeScript
- Optimized for Webflow Cloud deployment

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Webflow account with API access

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```bash
NEXT_PUBLIC_WEBFLOW_API_TOKEN=your_webflow_api_token
NEXT_PUBLIC_WEBFLOW_SITE_ID=your_webflow_site_id
NEXT_PUBLIC_WEBFLOW_COLLECTION_ID=your_webflow_collection_id
```

You can obtain these credentials by following the instructions in the [Webflow Developer Documentation](https://developers.webflow.com/).

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables (see above)
4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will create a static export in the `.cf-pages` directory, optimized for Webflow Cloud deployment.

## Webflow Cloud Deployment

To deploy to Webflow Cloud:

1. Push your code to a GitHub repository
2. In Webflow, go to your project settings
3. Navigate to the "Hosting" tab
4. Connect your GitHub repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.cf-pages`
6. Save and deploy

## Customizing the Search

You can customize the search functionality by modifying the following files:

- `app/page.tsx` - Main search interface
- `components/Search.tsx` - Search component logic
- `lib/webflow.ts` - Webflow API integration

## Troubleshooting

### Build Issues
- Make sure all environment variables are set
- Ensure you're using Node.js 18 or later
- Clear the `.next` and `node_modules` directories and reinstall dependencies if needed

### Search Not Working
- Verify your Webflow API token has the correct permissions
- Check that the site ID and collection ID are correct
- Ensure the collection has published items

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js 13+ app directory with page and layout components
- `src/components/` - Reusable React components
- `src/services/` - API services and data fetching logic
- `src/config/` - Application configuration
- `public/` - Static assets

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwebflow-predictive-search&env=NEXT_PUBLIC_WEBFLOW_API_TOKEN,NEXT_PUBLIC_WEBFLOW_SITE_ID,NEXT_PUBLIC_WEBFLOW_COLLECTION_ID&envDescription=Required%20environment%20variables%20for%20Webflow%20API%20access)

### Webflow Cloud

This application is configured to be deployed to Webflow Cloud. Follow these steps:

1. Push your code to a GitHub repository
2. Connect the repository to your Webflow site
3. Set up the required environment variables in your Webflow project settings

## License

MIT
