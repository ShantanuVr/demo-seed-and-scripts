# Demo Seed and Scripts

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/ShantanuVr/demo-seed-and-scripts)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](compose.yaml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Scripts-blue?logo=typescript)](scripts/)

One-Click Orchestration, Seeding & Happy-Path Runner for Option-A Carbon Credit Stack with Buyer Marketplace Integration

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/ShantanuVr/demo-seed-and-scripts.git
cd demo-seed-and-scripts

# One command to rule them all
make demo
```

This will:
- ✅ Run preflight checks
- 🐳 Start all services via Docker Compose
- ⏳ Wait for services to be healthy
- 📜 Deploy smart contracts
- 🔧 Render environment files
- 🌱 Seed realistic demo data
- ✅ Finalize issuance (mint credits)
- 💸 Demo credit transfer
- ♻️ Demo credit retirement
- 📡 Seed IoT data and anchor
- 🧪 Run smoke tests
- 🔗 Print all URLs

## 📋 Prerequisites

- **Docker Desktop** (4+ vCPUs, 6-8GB RAM recommended)
- **pnpm** (`npm install -g pnpm`)
- **Node.js 20+**

## 🎯 What You Get

A fully functional carbon credit stack with:

- **Registry Sim** (API): `http://localhost:4000`
- **Registry Adapter** (Blockchain): `http://localhost:4100`
- **Carbon Explorer** (Public): `http://localhost:3002`
- **Issuer Portal** (Issuers): `http://localhost:3001`
- **Verifier Console** (Verifiers): `http://localhost:3003`
- **Buyer Marketplace** (Buyers): `http://localhost:3004`
- **Evidence Locker** (Storage): `http://localhost:4600`
- **IoT Oracle** (Data): `http://localhost:4201`
- **IoT Solar Sim** (Simulation): `http://localhost:4200`

Plus infrastructure: PostgreSQL, Redis, MinIO, IPFS, and local blockchain.

## ✨ Features

### 🏗️ Complete Stack Orchestration
- **14 Services**: Full carbon credit platform with buyer marketplace
- **Docker Compose**: One-command deployment with health checks
- **Service Dependencies**: Proper startup order and health validation
- **Volume Persistence**: Data persists across restarts

### 🎯 End-to-End Demo Flow
- **Project Registration** → **Evidence Upload** → **Issuance Request**
- **Verification** → **Minting** → **Transfer** → **Retirement** → **Certificate**
- **IoT Anchoring** → **Marketplace Integration** → **Portfolio Management**

### 🛠️ Developer Experience
- **TypeScript Scripts**: Type-safe orchestration and seeding
- **Idempotent Operations**: Safe to run multiple times
- **Comprehensive Logging**: Pretty CLI output with colors and spinners
- **Error Handling**: Graceful failures with helpful error messages

### 🔐 Multi-Role Support
- **Admin**: System administration and oversight
- **Verifier**: Issuance review and approval
- **Issuer**: Project and credit management
- **Buyer**: Marketplace browsing and portfolio management

### 📊 Realistic Demo Data
- **Multi-Organization**: AdminOrg, VerifierOrg, SolarCo, BuyerCo
- **Complete User Roles**: All user types with proper credentials
- **Project with Evidence**: Solar Farm C with baseline and monitoring documents
- **Credit Lifecycle**: Issuance, transfer, and retirement with certificates
- **IoT Integration**: Real-time data collection and blockchain anchoring

## 📊 Demo Data

- **Project**: PRJ001 - Solar Farm C (India)
- **Issuance**: 10,000 credits (2024 vintage)
- **Transfer**: 300 credits to BuyerCo
- **Retirement**: 150 credits with certificate
- **IoT**: Anchored digest for yesterday's data

## 🛠️ Available Commands

```bash
make doctor      # Preflight checks
make up          # Start services
make down        # Stop services
make clean       # Stop and remove volumes (DANGEROUS)
make wait        # Wait for services to be healthy
make contracts   # Deploy smart contracts
make env         # Render environment files
make restart     # Restart services
make seed        # Seed registry and issuance data
make finalize    # Finalize issuance (mint credits)
make transfer    # Demo credit transfer
make retire      # Demo credit retirement
make iot         # Seed IoT data and anchor
make smoke       # Run smoke tests
make urls        # Print deep links
make logs        # Show service logs
make refresh     # Refresh explorer cache
make buyer       # Render buyer marketplace env and restart
make demo        # Full demo (all steps)
```

## 🔐 Demo Credentials

- **Admin**: `admin@demo.local` / `Admin@123`
- **Verifier**: `verifier@demo.local` / `Verifier@123`
- **Issuer**: `issuer@solarco.local` / `Solar@123`
- **Buyer**: `buyer@buyerco.local` / `Buyer@123`

## 📚 Documentation

- [TOUR.md](docs/TOUR.md) - Live demo walkthrough
- [TROUBLESHOOT.md](docs/TROUBLESHOOT.md) - Common issues and solutions
- [ADDRESSES.md](docs/ADDRESSES.md) - Contract addresses and environment variables

## 🏗️ Architecture

This repository provides orchestration and seeding for the Option-A carbon credit stack. It does **not** contain the actual application code - only the scripts to:

1. **Orchestrate** services via Docker Compose
2. **Deploy** smart contracts to local blockchain
3. **Seed** realistic demo data
4. **Run** end-to-end happy path scenarios
5. **Test** system health and invariants
6. **Integrate** buyer marketplace functionality

### Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Registry Sim  │    │ Registry Adapter │    │ Evidence Locker │
│   (Port 4000)   │◄──►│   (Port 4100)    │◄──►│   (Port 4600)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Issuer Portal  │    │ Verifier Console│    │ Buyer Marketplace│
│   (Port 3001)   │    │   (Port 3003)   │    │   (Port 3004)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Carbon Explorer │    │   IoT Oracle    │    │  IoT Solar Sim  │
│   (Port 3002)   │    │   (Port 4201)   │◄──►│   (Port 4200)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Customization

- **Ports**: Override in `.env` file
- **Data**: Modify `data/samples/` and `data/factors.json`
- **Scripts**: Customize TypeScript scripts in `scripts/`
- **Templates**: Update environment templates in `env-templates/`

## 🚨 Troubleshooting

See [TROUBLESHOOT.md](docs/TROUBLESHOOT.md) for common issues.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/demo-seed-and-scripts.git
cd demo-seed-and-scripts

# Install dependencies
pnpm install

# Run the demo
make demo
```

### Code Style

- **TypeScript**: Use strict typing and proper interfaces
- **Scripts**: Follow the existing pattern with error handling
- **Documentation**: Update docs for any new features
- **Testing**: Add smoke tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Option-A Carbon Credit Stack
- Integrates buyer marketplace functionality
- Provides comprehensive demo and testing capabilities