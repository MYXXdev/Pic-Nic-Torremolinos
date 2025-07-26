#!/usr/bin/env bash

# Exit if any command fails
set -e

echo "📦 Staging and committing changes..."
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️ No changes to commit."

echo "📤 Pushing changes to GitHub main branch..."
git push origin main

echo "🚀 Building the site..."
npm run build

echo "🌍 Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "✅ All done! Your site is live."
