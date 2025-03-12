#!/bin/bash

echo "Current directory: $(pwd)"
echo "Listing files: $(ls -la)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

npm run build-no-errors
