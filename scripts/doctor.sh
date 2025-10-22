#!/bin/bash

# Doctor script - preflight checks for demo-seed-and-scripts
set -e

echo "🔍 Running preflight checks..."

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"

# Check Docker resources
echo "🔍 Checking Docker resources..."
DOCKER_INFO=$(docker system info --format "{{.NCPU}} {{.MemTotal}}")
CPU_COUNT=$(echo $DOCKER_INFO | cut -d' ' -f1)
MEMORY_BYTES=$(echo $DOCKER_INFO | cut -d' ' -f2)
MEMORY_GB=$((MEMORY_BYTES / 1024 / 1024 / 1024))

if [ "$CPU_COUNT" -lt 4 ]; then
    echo "⚠️  Warning: Docker has only $CPU_COUNT CPUs. Recommended: 4+ CPUs"
else
    echo "✅ Docker has $CPU_COUNT CPUs"
fi

if [ "$MEMORY_GB" -lt 6 ]; then
    echo "⚠️  Warning: Docker has only ${MEMORY_GB}GB RAM. Recommended: 6-8GB RAM"
else
    echo "✅ Docker has ${MEMORY_GB}GB RAM"
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm: npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm is installed"

# Check if ports are available
echo "🔍 Checking port availability..."
PORTS=(3001 3002 3003 4000 4100 4200 4201 4600 5001 5432 6379 8080 8545 9000 9001)

for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Warning: Port $port is already in use"
    else
        echo "✅ Port $port is available"
    fi
done

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        echo "📋 Creating .env from env.example..."
        cp env.example .env
        echo "✅ Created .env file"
    else
        echo "⚠️  Warning: No .env file found and no env.example to copy from"
    fi
else
    echo "✅ .env file exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies are installed"
fi

echo ""
echo "🎉 Preflight checks completed!"
echo "   You can now run 'make demo' to start the full stack"
