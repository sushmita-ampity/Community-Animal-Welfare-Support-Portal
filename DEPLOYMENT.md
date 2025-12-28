# Deployment Guide

## GitHub Pages Deployment

Your app is configured for automatic deployment to GitHub Pages.

### Live URL
Once deployed, your app will be available at:
**https://sushmita-ampity.github.io/Community-Animal-Welfare-Support-Portal/**

### Setup Steps

1. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/sushmita-ampity/Community-Animal-Welfare-Support-Portal
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Automatic Deployment:**
   - The workflow will automatically run when you push to `main` branch
   - Check the **Actions** tab to see deployment progress
   - First deployment takes 2-3 minutes

3. **Access Your Live Site:**
   - After deployment completes, visit the URL above
   - The site will automatically update on every push to `main`

### Manual Deployment

If you need to trigger deployment manually:
- Go to **Actions** tab
- Select **Deploy to GitHub Pages** workflow
- Click **Run workflow**

### Troubleshooting

- If the site doesn't load, check the **Actions** tab for errors
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes after enabling Pages for the first deployment

### Notes

- The app uses localStorage for data storage (client-side only)
- All data is stored in the user's browser
- For production, consider integrating with a backend API

