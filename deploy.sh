#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process for AiCodeCalc..."

# Ensure flyctl is in PATH
export FLYCTL_INSTALL="/home/codespace/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Deploy to fly.io
echo "🌐 Deploying to fly.io..."
flyctl deploy --remote-only

echo "✅ Deployment complete! Your app should be live at https://aicodecalc.fly.dev"
