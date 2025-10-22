import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

interface ServiceConfig {
  name: string;
  url: string;
  timeout?: number;
}

const services: ServiceConfig[] = [
  { name: 'PostgreSQL', url: 'http://localhost:5432', timeout: 30000 },
  { name: 'Redis', url: 'http://localhost:6379', timeout: 30000 },
  { name: 'MinIO', url: 'http://localhost:9000/minio/health/live', timeout: 30000 },
  { name: 'IPFS', url: 'http://localhost:5001/api/v0/id', timeout: 30000 },
  { name: 'Chain', url: 'http://localhost:8545', timeout: 30000 },
  { name: 'Registry', url: 'http://localhost:4000/health', timeout: 60000 },
  { name: 'Adapter', url: 'http://localhost:4100/health', timeout: 60000 },
  { name: 'Evidence Locker', url: 'http://localhost:4600/health', timeout: 60000 },
  { name: 'IoT Oracle', url: 'http://localhost:4201/health', timeout: 60000 },
  { name: 'IoT Solar Sim', url: 'http://localhost:4200/health', timeout: 60000 },
  { name: 'Carbon Explorer', url: 'http://localhost:3002/api/health', timeout: 60000 },
  { name: 'Issuer Portal', url: 'http://localhost:3001/api/health', timeout: 60000 },
  { name: 'Verifier Console', url: 'http://localhost:3003/api/health', timeout: 60000 },
  { name: 'Buyer Marketplace', url: 'http://localhost:3004/api/health', timeout: 60000 },
];

async function checkService(service: ServiceConfig): Promise<boolean> {
  const spinner = ora(`Waiting for ${service.name}...`).start();
  
  try {
    const response = await axios.get(service.url, {
      timeout: service.timeout || 30000,
      validateStatus: (status) => status < 500, // Accept any status < 500
    });
    
    spinner.succeed(chalk.green(`✓ ${service.name} is healthy`));
    return true;
  } catch (error) {
    spinner.fail(chalk.red(`✗ ${service.name} is not responding`));
    return false;
  }
}

async function waitForServices(): Promise<void> {
  console.log(chalk.blue('⏳ Waiting for all services to be healthy...\n'));
  
  const results = await Promise.allSettled(
    services.map(service => checkService(service))
  );
  
  const failed = results.filter(result => 
    result.status === 'rejected' || 
    (result.status === 'fulfilled' && !result.value)
  );
  
  if (failed.length > 0) {
    console.log(chalk.red(`\n❌ ${failed.length} service(s) failed to start`));
    console.log(chalk.yellow('💡 Try running: make logs'));
    process.exit(1);
  }
  
  console.log(chalk.green('\n🎉 All services are healthy and ready!'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  waitForServices().catch((error) => {
    console.error(chalk.red('Error waiting for services:'), error);
    process.exit(1);
  });
}

export { waitForServices };
