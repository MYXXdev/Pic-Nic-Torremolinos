#!/usr/bin/env bash

# Exit on any error
set -e

# Add all changes
git add .

# Commit with timestamp
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# Push to main
echo "📤 Pushing changes to main..."
git push origin main

# Deploy
echo "🚀 Deploying the latest build to GitHub Pages..."
./deploy.sh

echo "✅ Push & deployment complete!"
