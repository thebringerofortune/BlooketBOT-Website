#!/bin/bash
# setup.sh - Automatic setup script for GitHub Codespaces

echo "🚀 Setting up Blooket Bot Manager for GitHub Codespaces..."

# Install backend dependencies
echo ""
echo "📦 Installing Node dependencies..."
cd backend
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Then open http://localhost:3000 in your browser!"
