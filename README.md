# Demo Seed and Scripts

One-Click Orchestration, Seeding & Happy-Path Runner for Option-A Carbon Credit Stack

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repo-url>
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

## 🔧 Customization

- **Ports**: Override in `.env` file
- **Data**: Modify `data/samples/` and `data/factors.json`
- **Scripts**: Customize TypeScript scripts in `scripts/`
- **Templates**: Update environment templates in `env-templates/`

## 🚨 Troubleshooting

See [TROUBLESHOOT.md](docs/TROUBLESHOOT.md) for common issues.

## 📄 License

MIT License - see LICENSE file for details.