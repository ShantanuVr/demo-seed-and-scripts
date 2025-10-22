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
  
  async transferCredits(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/credits/transfer`, data, {
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

async function demoTransfer(): Promise<void> {
  const spinner = ora('Executing demo transfer...').start();
  
  try {
    const registry = new RegistryAPI('http://localhost:4000');
    
    // Login as issuer (SolarCo)
    spinner.text = 'Logging in as issuer...';
    const issuerToken = await registry.login('issuer@solarco.local', 'Solar@123');
    registry.setToken(issuerToken);
    
    // Get BuyerCo organization ID
    spinner.text = 'Finding BuyerCo organization...';
    const orgsResponse = await axios.get('http://localhost:4000/organizations', {
      headers: {
        'Authorization': `Bearer ${issuerToken}`,
      },
    });
    
    const buyerOrg = orgsResponse.data.find((org: any) => org.name === 'BuyerCo');
    if (!buyerOrg) {
      throw new Error('BuyerCo organization not found. Run seed-registry first.');
    }
    
    // Transfer credits to BuyerCo
    spinner.text = 'Transferring credits to BuyerCo...';
    const transfer = await registry.transferCredits({
      toOrganizationId: buyerOrg.id,
      quantity: 300,
      projectId: 'PRJ001',
      vintageYear: 2024,
      reason: 'Demo transfer to BuyerCo',
    });
    
    spinner.succeed(chalk.green('✓ Transfer completed successfully'));
    console.log(chalk.blue('💸 Transfer Details:'));
    console.log(chalk.gray(`   Transfer ID: ${transfer.id}`));
    console.log(chalk.gray(`   From: SolarCo`));
    console.log(chalk.gray(`   To: BuyerCo`));
    console.log(chalk.gray(`   Quantity: ${transfer.quantity}`));
    console.log(chalk.gray(`   Project: ${transfer.projectId}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Transfer failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demoTransfer().catch((error) => {
    console.error(chalk.red('Error executing transfer:'), error);
    process.exit(1);
  });
}

export { demoTransfer };
