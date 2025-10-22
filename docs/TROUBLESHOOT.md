# Troubleshooting Guide

Common issues and solutions for the demo-seed-and-scripts environment.

## 🚨 Common Issues

### Docker Issues

#### "Docker is not running"
```bash
# Start Docker Desktop
open -a Docker
# Wait for Docker to start, then retry
make doctor
```

#### "Insufficient Docker resources"
- **Problem**: Services fail to start or run slowly
- **Solution**: Increase Docker Desktop resources
  - Docker Desktop → Settings → Resources
  - Set CPUs to 4+ and Memory to 6-8GB
  - Restart Docker Desktop

#### "Port already in use"
```bash
# Check what's using the port
lsof -i :4000

# Kill the process (replace PID)
kill -9 <PID>

# Or use different ports in .env
REGISTRY_URL=http://localhost:4001
```

### Service Health Issues

#### "Service not responding"
```bash
# Check service logs
make logs

# Check specific service
docker compose logs registry

# Restart specific service
docker compose restart registry
```

#### "Health check failed"
- **Problem**: Services start but health checks fail
- **Solution**: Wait longer or check service configuration
```bash
# Wait for services to stabilize
sleep 30
make wait

# Check health endpoints manually
curl http://localhost:4000/health
```

### Contract Deployment Issues

#### "addresses.json not found"
```bash
# Deploy contracts first
make contracts

# Check if chain is running
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
  http://localhost:8545
```

#### "Contract deployment failed"
- **Problem**: Smart contracts fail to deploy
- **Solution**: Check chain connectivity and private key
```bash
# Verify chain is running
docker compose logs chain

# Check chain RPC
curl http://localhost:8545
```

### Environment Issues

#### "Environment files not rendered"
```bash
# Check if addresses.json exists
ls -la addresses.json

# Re-render environment files
make env
```

#### "Service can't connect to database"
- **Problem**: Database connection errors
- **Solution**: Check database is running and accessible
```bash
# Check database logs
docker compose logs postgres

# Test database connection
docker compose exec postgres psql -U postgres -d carbon_registry -c "SELECT 1;"
```

### Seeding Issues

#### "Registry seeding failed"
- **Problem**: User/organization creation fails
- **Solution**: Check registry is healthy and accessible
```bash
# Check registry health
curl http://localhost:4000/health

# Check registry logs
docker compose logs registry

# Retry seeding
make seed
```

#### "Evidence upload failed"
- **Problem**: PDF files can't be uploaded
- **Solution**: Check evidence locker and file paths
```bash
# Check locker health
curl http://localhost:4600/health

# Check file exists
ls -la data/samples/

# Check MinIO is running
curl http://localhost:9000/minio/health/live
```

### Performance Issues

#### "Services running slowly"
- **Problem**: High CPU/memory usage
- **Solution**: Increase Docker resources or reduce service count
```bash
# Check Docker resource usage
docker stats

# Increase Docker Desktop resources
# Docker Desktop → Settings → Resources
```

#### "Timeouts during demo"
- **Problem**: Scripts timeout waiting for services
- **Solution**: Increase timeout values or check service health
```bash
# Check service health manually
make wait

# Increase timeout in scripts if needed
# Edit scripts/wait-on.ts timeout values
```

## 🔧 Debugging Commands

### Service Status
```bash
# Check all services
docker compose ps

# Check service health
docker compose exec registry curl http://localhost:4000/health
```

### Logs
```bash
# All services
make logs

# Specific service
docker compose logs -f registry

# Last 100 lines
docker compose logs --tail=100 registry
```

### Database
```bash
# Connect to database
docker compose exec postgres psql -U postgres -d carbon_registry

# Check tables
\dt

# Check data
SELECT * FROM organizations;
```

### Blockchain
```bash
# Check chain status
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Check contract addresses
cat addresses.json
```

## 🚀 Recovery Procedures

### Complete Reset
```bash
# Nuclear option - removes everything
make clean

# Start fresh
make demo
```

### Partial Reset
```bash
# Stop services
make down

# Remove volumes (keeps images)
docker compose down -v

# Restart
make up
make wait
make contracts
make env
make restart
make seed
```

### Service-Specific Reset
```bash
# Reset specific service
docker compose stop registry
docker compose rm registry
docker compose up -d registry

# Wait for health
make wait
```

## 📊 Health Checks

### Manual Health Checks
```bash
# Registry
curl http://localhost:4000/health

# Adapter
curl http://localhost:4100/health

# Explorer
curl http://localhost:3002/api/health

# Issuer Portal
curl http://localhost:3001/api/health

# Verifier Console
curl http://localhost:3003/api/health

# Evidence Locker
curl http://localhost:4600/health

# IoT Oracle
curl http://localhost:4201/health

# IoT Sim
curl http://localhost:4200/health
```

### Smoke Tests
```bash
# Run all smoke tests
make smoke

# Check specific test
pnpm tsx scripts/smoke-tests.ts
```

## 🆘 Getting Help

### Check Logs First
```bash
# Most issues can be diagnosed from logs
make logs
```

### Common Solutions
1. **Restart Docker Desktop** - Fixes most Docker issues
2. **Increase Docker resources** - Fixes performance issues
3. **Check port conflicts** - Fixes connection issues
4. **Wait longer** - Fixes timing issues
5. **Full reset** - Fixes everything else

### Still Stuck?
- Check the [TOUR.md](TOUR.md) for expected behavior
- Verify all prerequisites are met
- Check Docker Desktop is running with sufficient resources
- Ensure no port conflicts
- Try a complete reset with `make clean && make demo`

## 🔍 Diagnostic Information

When reporting issues, include:
- Docker Desktop version
- Available system resources (CPU/RAM)
- Port conflicts (`lsof -i :4000`)
- Service logs (`make logs`)
- Health check results (`make smoke`)
- Operating system and version
