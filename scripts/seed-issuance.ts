import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';

interface RegistryClient {
  baseURL: string;
  token?: string;
}

class RegistryAPI {
  private client: RegistryClient;
  
  constructor(baseURL: string) {
    this.client = { baseURL };
  }
  
  async login(email: string, password: string): Promise<string> {
    const response = await axios.post(`${this.client.baseURL}/auth/login`, {
      email,
      password,
    });
    return response.data.token;
  }
  
  async createIssuance(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/issuances`, data, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  setToken(token: string): void {
    this.client.token = token;
  }
}

async function seedIssuance(): Promise<void> {
  const spinner = ora('Creating issuance request...').start();
  
  try {
    const registry = new RegistryAPI('http://localhost:4000');
    
    // Login as issuer
    spinner.text = 'Logging in as issuer...';
    const issuerToken = await registry.login('issuer@solarco.local', 'Solar@123');
    registry.setToken(issuerToken);
    
    // Create issuance
    spinner.text = 'Creating issuance request...';
    const issuance = await registry.createIssuance({
      projectId: 'PRJ001',
      vintageYear: 2024,
      quantity: 10000,
      factorRef: 'FCT-DEMO-IN-2024',
      description: 'Demo issuance for Solar Farm C',
      methodology: 'RE-SOLAR',
      vintageStartDate: '2024-01-01',
      vintageEndDate: '2024-12-31',
    });
    
    spinner.succeed(chalk.green('✓ Issuance created successfully'));
    console.log(chalk.blue('📋 Issuance Details:'));
    console.log(chalk.gray(`   ID: ${issuance.id}`));
    console.log(chalk.gray(`   Project: ${issuance.projectId}`));
    console.log(chalk.gray(`   Quantity: ${issuance.quantity}`));
    console.log(chalk.gray(`   Status: ${issuance.status}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Issuance creation failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedIssuance().catch((error) => {
    console.error(chalk.red('Error creating issuance:'), error);
    process.exit(1);
  });
}

export { seedIssuance };
