.PHONY: doctor up down clean contracts env seed finalize transfer retire iot demo urls logs refresh smoke

# Default target
demo: doctor up wait contracts env restart seed finalize transfer retire iot smoke urls

# Preflight checks
doctor:
	@echo "🔍 Running preflight checks..."
	@./scripts/doctor.sh

# Docker operations
up:
	@echo "🚀 Starting services..."
	@docker compose up -d

down:
	@echo "🛑 Stopping services..."
	@docker compose down

clean:
	@echo "🧹 Cleaning up (removing volumes)..."
	@docker compose down -v
	@docker system prune -f

# Wait for services to be healthy
wait:
	@echo "⏳ Waiting for services to be healthy..."
	@pnpm tsx scripts/wait-on.ts

# Contract deployment
contracts:
	@echo "📜 Deploying contracts..."
	@pnpm tsx scripts/deploy-contracts.ts

# Environment rendering
env:
	@echo "🔧 Rendering environment files..."
	@pnpm tsx scripts/render-env.ts

# Restart services to pick up new env
restart:
	@echo "🔄 Restarting services..."
	@docker compose restart adapter registry explorer issuer verifier buyer oracle sim

# Seeding operations
seed:
	@echo "🌱 Seeding registry data..."
	@pnpm tsx scripts/seed-registry.ts
	@pnpm tsx scripts/seed-issuance.ts

finalize:
	@echo "✅ Finalizing issuance..."
	@pnpm tsx scripts/finalize-issuance.ts

transfer:
	@echo "💸 Demo transfer..."
	@pnpm tsx scripts/demo-transfer.ts

retire:
	@echo "♻️ Demo retirement..."
	@pnpm tsx scripts/demo-retire.ts

iot:
	@echo "📡 Seeding IoT data..."
	@pnpm tsx scripts/seed-iot.ts

# Smoke tests
smoke:
	@echo "🧪 Running smoke tests..."
	@pnpm tsx scripts/smoke-tests.ts

# Utilities
urls:
	@echo "🔗 Generating URLs..."
	@pnpm tsx scripts/urls.ts

logs:
	@echo "📋 Showing logs..."
	@docker compose logs -f

refresh:
	@echo "🔄 Refreshing explorer cache..."
	@curl -X POST http://localhost:3002/api/refresh || true

# Buyer marketplace specific
buyer:
	@echo "🛒 Rendering buyer marketplace environment..."
	@pnpm tsx scripts/render-env.ts
	@docker compose restart buyer-marketplace

# Help
help:
	@echo "Available targets:"
	@echo "  doctor     - Run preflight checks"
	@echo "  up         - Start all services"
	@echo "  down       - Stop all services"
	@echo "  clean      - Stop and remove volumes (DANGEROUS)"
	@echo "  wait       - Wait for services to be healthy"
	@echo "  contracts  - Deploy smart contracts"
	@echo "  env        - Render environment files"
	@echo "  restart    - Restart services"
	@echo "  seed       - Seed registry and issuance data"
	@echo "  finalize   - Finalize issuance (mint credits)"
	@echo "  transfer   - Demo credit transfer"
	@echo "  retire     - Demo credit retirement"
	@echo "  iot        - Seed IoT data and anchor"
	@echo "  smoke      - Run smoke tests"
	@echo "  urls       - Print deep links"
	@echo "  logs       - Show service logs"
	@echo "  refresh    - Refresh explorer cache"
	@echo "  buyer      - Render buyer marketplace env and restart"
	@echo "  demo       - Full demo (doctor + up + wait + contracts + env + restart + seed + finalize + transfer + retire + iot + smoke + urls)"
