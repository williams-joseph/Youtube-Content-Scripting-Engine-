#!/bin/bash
set -e

echo "Cleaning build artifacts..."
rm -rf dist

echo "Building project..."
npm run build

echo "Deploying to Firebase..."
firebase deploy

echo "Done!"
