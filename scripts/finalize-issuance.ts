import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';

interface RegistryClient {
  baseURL: string;
  token?: string;
}

interface AdapterClient {
  baseURL: string;
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
  
  async finalizeIssuance(issuanceId: string): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/issuances/${issuanceId}/finalize`, {}, {
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

class AdapterAPI {
  private client: AdapterClient;
  
  constructor(baseURL: string) {
    this.client = { baseURL };
  }
  
  async finalizeIssuance(issuanceId: string): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/v1/issuance/finalize`, {
      issuanceId,
    }, {
      headers: {
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  async getReceipt(adapterTxId: string): Promise<any> {
    const response = await axios.get(`${this.client.baseURL}/v1/receipts/${adapterTxId}`);
    return response.data;
  }
}

async function finalizeIssuance(): Promise<void> {
  const spinner = ora('Finalizing issuance...').start();
  
  try {
    const registry = new RegistryAPI('http://localhost:4000');
    const adapter = new AdapterAPI('http://localhost:4100');
    
    // Login as admin
    spinner.text = 'Logging in as admin...';
    const adminToken = await registry.login('admin@demo.local', 'Admin@123');
    registry.setToken(adminToken);
    
    // Get the first issuance (assuming it exists)
    spinner.text = 'Finding issuance to finalize...';
    const issuancesResponse = await axios.get('http://localhost:4000/issuances', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    
    if (issuancesResponse.data.length === 0) {
      throw new Error('No issuances found. Run seed-issuance first.');
    }
    
    const issuance = issuancesResponse.data[0];
    
    // Finalize via registry (which calls adapter)
    spinner.text = 'Finalizing issuance via registry...';
    const finalizeResult = await registry.finalizeIssuance(issuance.id);
    
    // Wait a bit for the transaction to be processed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get receipt from adapter
    spinner.text = 'Fetching transaction receipt...';
    const receipt = await adapter.getReceipt(finalizeResult.adapterTxId);
    
    spinner.succeed(chalk.green('✓ Issuance finalized successfully'));
    console.log(chalk.blue('🎯 Finalization Details:'));
    console.log(chalk.gray(`   Issuance ID: ${issuance.id}`));
    console.log(chalk.gray(`   Adapter TX ID: ${finalizeResult.adapterTxId}`));
    console.log(chalk.gray(`   Chain TX Hash: ${receipt.txHash}`));
    console.log(chalk.gray(`   Status: ${receipt.status}`));
    console.log(chalk.gray(`   Credits Minted: ${issuance.quantity}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Issuance finalization failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  finalizeIssuance().catch((error) => {
    console.error(chalk.red('Error finalizing issuance:'), error);
    process.exit(1);
  });
}

export { finalizeIssuance };
