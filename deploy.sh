#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "📦 Building the project..."
npm run build

echo "🚀 Deploying to gh-pages branch..."
# Push the contents of the dist folder to gh-pages
npx gh-pages -d dist

echo "✅ Deployment complete!"
echo "Your site should be live at: https://MYXXdev.github.io/Pic-Nic-Torremolinos"