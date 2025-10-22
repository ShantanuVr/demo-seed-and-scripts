# Demo Tour Guide

This guide walks you through the live demo experience after running `make demo`.

## 🎬 Demo Flow Overview

The demo showcases the complete carbon credit lifecycle:
1. **Project Registration** → 2. **Evidence Upload** → 3. **Issuance Request** → 4. **Verification** → 5. **Minting** → 6. **Transfer** → 7. **Retirement** → 8. **Certificate** → 9. **IoT Anchoring**

## 🚀 Step-by-Step Tour

### 1. Registry API Overview
**URL**: http://localhost:4000/docs

- Open the Swagger/OpenAPI documentation
- Explore the registry endpoints
- Check `/reports/registry-stats` to see current state
- Verify organizations, users, and projects are seeded

### 2. Issuer Portal Experience
**URL**: http://localhost:3001
**Login**: `issuer@solarco.local` / `Solar@123`

- **Dashboard**: View SolarCo's projects and issuances
- **Projects**: See PRJ001 - Solar Farm C details
- **Evidence**: View uploaded baseline.pdf and monitoring-plan.pdf
- **Issuances**: Check the 10,000 credit issuance request
- **Credits**: See current holdings (9,700 after transfer)

### 3. Verifier Console Experience
**URL**: http://localhost:3003
**Login**: `verifier@demo.local` / `Verifier@123`

- **Dashboard**: View pending verification requests
- **Issuances**: Review PRJ001 issuance details
- **Evidence**: Verify uploaded documents
- **Approval**: Approve the issuance (if not auto-approved)
- **Reports**: Generate verification reports

### 4. Buyer Marketplace Experience
**URL**: http://localhost:3004
**Login**: `buyer@buyerco.local` / `Buyer@123`

- **Dashboard**: View BuyerCo's credit holdings and portfolio
- **Browse Credits**: Explore available carbon credits
- **Order Management**: View purchase orders and history
- **Certificates**: Access retirement certificates
- **Portfolio**: Monitor credit balances and transfers

### 5. Carbon Explorer Public View
**URL**: http://localhost:3002/projects/PRJ001

- **Project Page**: View Solar Farm C project details
- **Class Page**: See 2024 vintage credit class
- **Certificate Page**: View retirement certificate
- **IoT Data**: Check anchored digest information
- **Transparency**: Verify all data is publicly accessible

### 6. Evidence Locker Verification
**URL**: http://localhost:4600

- **Uploads**: Verify baseline.pdf and monitoring-plan.pdf
- **Hashes**: Check SHA256 hashes for integrity
- **Metadata**: View file metadata and timestamps
- **IPFS**: Confirm files are stored on IPFS

### 7. IoT Data Flow
**URLs**: 
- Sim: http://localhost:4200
- Oracle: http://localhost:4201

- **Site Data**: View PRJ001 IoT site configuration
- **Generated Data**: Check yesterday's solar generation data
- **Digest**: View processed digest from oracle
- **Anchoring**: Verify blockchain anchor transaction

### 8. Blockchain Verification
**URL**: http://localhost:8545

- **RPC**: Use JSON-RPC to query contract state
- **Contracts**: Verify CarbonCredit1155 and EvidenceAnchor contracts
- **Transactions**: Check mint and anchor transactions
- **Balances**: Verify credit balances and transfers

### 9. Storage Infrastructure
**URLs**:
- MinIO: http://localhost:9001 (minioadmin / minioadmin123)
- IPFS: http://localhost:5001

- **MinIO**: Browse evidence files in S3-compatible storage
- **IPFS**: Check decentralized storage of evidence
- **Redis**: Monitor queue processing (if applicable)

## 🎯 Key Demo Points

### Data Integrity
- **Evidence**: Files stored in both MinIO and IPFS
- **Hashes**: SHA256 verification throughout
- **Anchoring**: IoT data anchored to blockchain
- **Certificates**: Retirement certificates with unique IDs

### Transparency
- **Public Explorer**: All data publicly accessible
- **API Access**: Registry API provides full data access
- **Blockchain**: Immutable record of all transactions
- **Audit Trail**: Complete history of all operations

### Real-World Scenarios
- **Multi-Role**: Admin, Verifier, Issuer, Buyer workflows
- **Cross-Border**: India project, US buyer
- **IoT Integration**: Real-time data collection and anchoring
- **Compliance**: Methodology compliance and verification
- **Marketplace**: Browse → Add to Cart → Buy → Retire → Open Explorer Certificate

## 🛒 Marketplace Demo Flow

### Browse and Purchase
1. **Login to Marketplace**: `buyer@buyerco.local` / `Buyer@123`
2. **Browse Credits**: View available carbon credits from Solar Farm C
3. **Add to Cart**: Select 300 credits for purchase
4. **Checkout**: Complete purchase process
5. **View Holdings**: Check updated credit balance

### Retirement Process
1. **Access Certificates**: Navigate to certificates section
2. **Retire Credits**: Retire 150 credits for carbon neutrality
3. **Generate Certificate**: Create retirement certificate
4. **View Certificate**: Access certificate in explorer
5. **Verify Transparency**: Confirm public visibility

### Portfolio Management
- **Dashboard**: Overview of all holdings and activities
- **Order History**: Track all purchases and transfers
- **Certificate Archive**: Access all retirement certificates
- **Balance Tracking**: Monitor credit balances across projects

## 🔍 Verification Checklist

After the demo, verify these key points:

- [ ] Registry shows 10,000 credits issued
- [ ] Registry shows 150 credits retired
- [ ] Explorer displays project PRJ001
- [ ] Certificate page loads with retirement details
- [ ] Evidence files accessible in locker
- [ ] IoT digest shows as anchored
- [ ] Blockchain transactions confirmed
- [ ] All services healthy (smoke tests pass)
- [ ] BuyerCo has 300 credits in marketplace
- [ ] Retirement certificate visible in marketplace

## 🎪 Advanced Scenarios

### Custom Data
- Modify `data/samples/` with your own PDFs
- Update `data/factors.json` with different emission factors
- Create additional projects via API

### Multiple Issuances
- Create additional issuances for different vintages
- Test approval workflows with multiple verifiers
- Generate certificates for different retirement types

### IoT Variations
- Generate data for different time periods
- Test multiple site configurations
- Verify oracle processing with various data formats

## 🚨 Demo Recovery

If something goes wrong:

```bash
# Check service health
make logs

# Restart specific services
docker compose restart <service-name>

# Full reset
make clean
make demo
```

## 📊 Success Metrics

A successful demo should show:
- **100%** service health (all smoke tests pass)
- **10,000** credits issued and minted
- **300** credits transferred
- **150** credits retired with certificate
- **1** IoT digest anchored
- **2** evidence files uploaded and verified

## 🎉 Demo Completion

Congratulations! You've successfully demonstrated:
- ✅ Complete carbon credit lifecycle
- ✅ Multi-stakeholder workflows
- ✅ Blockchain integration
- ✅ IoT data anchoring
- ✅ Evidence management
- ✅ Public transparency
- ✅ Certificate generation

The demo showcases a production-ready carbon credit platform with enterprise-grade features and real-world applicability.
