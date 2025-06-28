#!/bin/bash

echo "🚀 Starting Sundevil Cafeteria Frontend Build..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Build successful! index.html found in build directory."
    ls -la build/
else
    echo "❌ Build failed! index.html not found."
    exit 1
fi

echo "🎉 Build completed successfully!" 