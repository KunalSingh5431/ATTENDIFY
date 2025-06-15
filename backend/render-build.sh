#!/usr/bin/env bash

set -o errexit

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "⚙️ Building frontend..."
npm run build
cd ../backend

echo "📦 Installing backend Node.js dependencies..."
npm install

echo "🐍 Upgrading pip and setuptools..."
pip install --upgrade pip setuptools wheel

echo "📦 Installing CMake..."
pip install --no-cache-dir cmake

echo "📦 Installing dlib and face-recognition..."
pip install --no-cache-dir dlib==19.24.2
pip install --no-cache-dir face-recognition==1.3.0

echo "📦 Installing backend Python requirements..."
pip install --no-cache-dir -r requirements.txt

echo "📦 Installing recognition system requirements..."
pip install --no-cache-dir -r recognition/requirements.txt

echo "✅ Build completed successfully."
