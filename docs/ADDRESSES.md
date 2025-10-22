# Addresses and Environment Variables

This document explains the contract addresses and environment variables used in the demo.

## 📜 Contract Addresses

After running `make contracts`, the `addresses.json` file contains:

```json
{
  "carbonCreditContract": "0x...",
  "evidenceAnchorContract": "0x...",
  "chainId": 31337,
  "deployedAt": "2024-01-01T00:00:00.000Z"
}
```

### Contract Details

#### CarbonCredit1155 Contract
- **Purpose**: ERC-1155 token for carbon credits
- **Address**: `carbonCreditContract` field
- **Functions**: Mint, transfer, retire credits
- **Standards**: ERC-1155 Multi Token Standard

#### EvidenceAnchor Contract
- **Purpose**: Anchor evidence and IoT data to blockchain
- **Address**: `evidenceAnchorContract` field
- **Functions**: Store evidence hashes, anchor IoT digests
- **Standards**: Custom contract for evidence anchoring

## 🔧 Environment Variables

### Core Configuration

#### Database
```bash
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/carbon_registry
REDIS_URL=redis://localhost:6379
```

#### Blockchain
```bash
CHAIN_RPC_URL=http://localhost:8545
CHAIN_ID=31337
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Service URLs

#### Registry Services
```bash
REGISTRY_URL=http://localhost:4000
ADAPTER_URL=http://localhost:4100
LOCKER_URL=http://localhost:4600
```

#### Frontend Applications
```bash
EXPLORER_URL=http://localhost:3002
ISSUER_URL=http://localhost:3001
VERIFIER_URL=http://localhost:3003
BUYER_URL=http://localhost:3004
```

#### IoT Services
```bash
ORACLE_URL=http://localhost:4201
SIM_URL=http://localhost:4200
```

### Storage Configuration

#### MinIO (S3-Compatible)
```bash
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=evidence
```

#### IPFS
```bash
IPFS_URL=http://localhost:5001
```

### Authentication

#### JWT Configuration
```bash
JWT_SECRET=demo-jwt-secret-key-change-in-production
JWKS_URL=http://localhost:4000/.well-known/jwks.json
```

### Demo Data

#### User Credentials
```bash
ADMIN_EMAIL=admin@demo.local
ADMIN_PASSWORD=Admin@123
VERIFIER_EMAIL=verifier@demo.local
VERIFIER_PASSWORD=Verifier@123
ISSUER_EMAIL=issuer@solarco.local
ISSUER_PASSWORD=Solar@123
BUYER_EMAIL=buyer@buyerco.local
BUYER_PASSWORD=Buyer@123
```

#### Project Configuration
```bash
PROJECT_ID=PRJ001
PROJECT_NAME=Solar Farm C
METHODOLOGY=RE-SOLAR
VINTAGE_YEAR=2024
ISSUANCE_QUANTITY=10000
TRANSFER_QUANTITY=300
RETIRE_QUANTITY=150
```

#### IoT Configuration
```bash
IOT_SITE_ID=PRJ001
IOT_FACTOR_REF=FCT-DEMO-IN-2024
```

## 🌐 Service Ports

| Service | Port | Purpose |
|---------|------|---------|
| Registry API | 4000 | Core registry service |
| Adapter API | 4100 | Blockchain adapter |
| IoT Oracle | 4201 | IoT data processing |
| IoT Solar Sim | 4200 | IoT data simulation |
| Evidence Locker | 4600 | Evidence storage |
| Carbon Explorer | 3002 | Public explorer |
| Issuer Portal | 3001 | Issuer interface |
| Verifier Console | 3003 | Verifier interface |
| Buyer Marketplace | 3004 | Buyer interface |
| Chain RPC | 8545 | Blockchain node |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache/Queue |
| MinIO | 9000 | Object storage |
| MinIO Console | 9001 | Storage management |
| IPFS API | 5001 | Decentralized storage |
| IPFS Gateway | 8080 | IPFS gateway |

## 🔐 Security Notes

### Demo Secrets
- **JWT Secret**: Change in production
- **Database Password**: Use strong passwords in production
- **Private Key**: Use secure key management in production
- **MinIO Credentials**: Change default credentials

### Production Considerations
- Use environment-specific configuration
- Implement proper secret management
- Use HTTPS in production
- Implement proper access controls
- Use production-grade databases
- Implement monitoring and logging

## 📋 Environment Templates

The `env-templates/` directory contains service-specific environment templates:

- `adapter.env.tpl` - Registry adapter configuration
- `registry.env.tpl` - Registry service configuration
- `explorer.env.tpl` - Carbon explorer configuration
- `issuer.env.tpl` - Issuer portal configuration
- `buyer.env.tpl` - Buyer marketplace configuration
- `locker.env.tpl` - Evidence locker configuration
- `oracle.env.tpl` - IoT oracle configuration
- `sim.env.tpl` - IoT simulation configuration
- `chain.env.tpl` - Blockchain configuration

These templates are rendered with actual values during `make env`.

## 🔄 Environment Rendering

The `scripts/render-env.ts` script:

1. Loads `addresses.json` (contract addresses)
2. Loads `.env` (base configuration)
3. Renders each template with combined values
4. Outputs service-specific `.env` files

This ensures all services have the correct contract addresses and configuration.

## 🚨 Important Notes

- **Contract Addresses**: Generated during `make contracts`
- **Environment Files**: Rendered during `make env`
- **Service Restart**: Required after `make env` to pick up new configs
- **Port Conflicts**: Check for port conflicts before starting
- **Resource Requirements**: Ensure sufficient Docker resources
- **Network**: All services communicate via `carbon-net` Docker network
