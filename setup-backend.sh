#!/bin/bash

echo "Setting up BMBP-Admin Backend for MongoDB integration..."

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

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install express cors mongodb dotenv nodemon

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete! To start the backend server:"
echo ""
echo "   node server.js"
echo ""
echo "The backend will run on http://localhost:3001"
echo "Your React app will automatically connect to it."
echo ""
echo "Make sure your .env file contains the MongoDB connection string."