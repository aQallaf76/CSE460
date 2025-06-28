#!/bin/bash

echo "🚀 Sundevil Cafeteria - Deployment Preparation Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm --version)"

echo ""
echo "📦 Preparing Backend..."
echo "======================"

# Navigate to backend directory
cd backend

# Install dependencies
print_status "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Test backend build
print_status "Testing backend..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend health endpoint
if curl -s http://localhost:5001/api/health > /dev/null; then
    print_status "Backend is running successfully on port 5001"
else
    print_error "Backend failed to start or health check failed"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Stop backend
kill $BACKEND_PID 2>/dev/null

echo ""
echo "📦 Preparing Frontend..."
echo "======================="

# Navigate to frontend directory
cd ../frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Test frontend build
print_status "Testing frontend build..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 Deployment Preparation Complete!"
echo "=================================="
print_status "Both backend and frontend are ready for deployment"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Render: https://render.com"
echo "2. Deploy frontend to Netlify: https://netlify.com"
echo "3. Follow the detailed guide in DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Quick Links:"
echo "- Backend deployment: https://render.com"
echo "- Frontend deployment: https://netlify.com"
echo "- Deployment guide: DEPLOYMENT_GUIDE.md"
echo ""
print_warning "Remember to update CORS settings after deployment!" 