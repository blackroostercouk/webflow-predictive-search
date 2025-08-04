# Setting Up GitHub Repository

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com/new)
2. Name your repository (e.g., "webflow-predictive-search")
3. Choose public or private visibility
4. **Do not** initialize with a README, .gitignore, or license
5. Click "Create repository"

## Step 2: Connect Your Local Repository to GitHub

Run these commands in your terminal (replace `YOUR_USERNAME` and `REPO_NAME` with your GitHub username and repository name):

```bash
# Navigate to your project directory if you're not already there
cd /Users/kenan/Desktop/pswebflow/predictive-search

# Add the GitHub repository as a remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename the default branch to 'main' if needed
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Set Up GitHub Actions for Deployment

1. Create a new file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to Webflow

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for Webflow
        run: npm run build:webflow
        
      - name: Deploy to Webflow
        run: |
          # This is where you would add deployment steps
          # For example, using Webflow's API or a deployment service
          echo "Deployment steps would go here"
```

## Step 4: Set Up Webflow Cloud Deployment

1. Go to your Webflow project settings
2. Navigate to the "Hosting" tab
3. Connect your GitHub repository
4. Configure the build settings:
   - Build command: `npm run build:webflow`
   - Publish directory: `webflow/build`

## Step 5: Deploy Your Site

1. Commit and push any changes to your GitHub repository
2. Webflow Cloud will automatically detect the changes and deploy your site
3. Monitor the deployment status in the Webflow dashboard

## Important Notes

- Make sure your `.env` file is not committed to the repository
- Set up environment variables in your Webflow Cloud project settings
- The first deployment might take a few minutes to complete
