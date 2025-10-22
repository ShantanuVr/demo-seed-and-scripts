#!/bin/bash

# Nuke script - completely clean up the demo environment
set -e

echo "🧨 NUKING DEMO ENVIRONMENT..."
echo "⚠️  This will remove ALL data, volumes, and containers!"
echo ""

read -p "Are you sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🛑 Stopping all services..."
docker compose down

echo "🗑️  Removing volumes..."
docker compose down -v

echo "🧹 Cleaning up Docker system..."
docker system prune -f

echo "📁 Removing generated files..."
rm -f addresses.json
rm -f .env
rm -rf env-templates/*.env

echo "✅ Demo environment completely nuked!"
echo "💡 Run 'make demo' to start fresh"
