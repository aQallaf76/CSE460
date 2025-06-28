#!/bin/bash

echo "🚀 Starting Sundevil Cafeteria Online Ordering System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

echo ""
echo "🌐 Starting the application..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting frontend server..."
cd frontend
npm start

# Cleanup when frontend stops
kill $BACKEND_PID 2>/dev/null
echo ""
echo "👋 Application stopped." 