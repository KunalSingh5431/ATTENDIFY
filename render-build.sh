#!/usr/bin/env bash

# Exit on error
set -o errexit

# Navigate to frontend and build React app
cd ../frontend
npm install
npm run build

# Navigate back to backend
cd ../backend

# Install Node.js backend dependencies
npm install

# Ensure Python build tools are ready
pip install --upgrade pip setuptools wheel

# Install CMake first (required for dlib)
pip install --no-cache-dir cmake

# Install prebuilt versions of dlib and face-recognition to avoid building from source
pip install --no-cache-dir dlib==19.24.2
pip install --no-cache-dir face-recognition==1.3.0

# Install the rest of Python dependencies
pip install --no-cache-dir -r requirements.txt
