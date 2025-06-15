#!/usr/bin/env bash

# Install Frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "⚙️ Building frontend..."
npm run build
cd ..

# Install Backend dependencies (Node)
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install Python dependencies for face recognition
echo "🐍 Installing Python dependencies..."
pip3 install -r recognition/requirements.txt

echo "✅ Build completed successfully."
