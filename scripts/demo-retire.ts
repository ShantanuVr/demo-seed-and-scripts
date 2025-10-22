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
  
  async retireCredits(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/credits/retire`, data, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  async getRetirementCertificate(certificateId: string): Promise<any> {
    const response = await axios.get(`${this.client.baseURL}/retirements/${certificateId}`, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
      },
    });
    return response.data;
  }
  
  setToken(token: string): void {
    this.client.token = token;
  }
}

async function demoRetire(): Promise<void> {
  const spinner = ora('Executing demo retirement...').start();
  
  try {
    const registry = new RegistryAPI('http://localhost:4000');
    
    // Login as buyer (BuyerCo)
    spinner.text = 'Logging in as buyer...';
    const buyerToken = await registry.login('buyer@buyerco.local', 'Buyer@123');
    registry.setToken(buyerToken);
    
    // Retire credits
    spinner.text = 'Retiring credits...';
    const retirement = await registry.retireCredits({
      quantity: 150,
      projectId: 'PRJ001',
      vintageYear: 2024,
      reason: 'Demo retirement for carbon neutrality',
      retirementType: 'VOLUNTARY',
      retirementBeneficiary: 'BuyerCo',
    });
    
    // Get retirement certificate
    spinner.text = 'Fetching retirement certificate...';
    const certificate = await registry.getRetirementCertificate(retirement.certificateId);
    
    spinner.succeed(chalk.green('✓ Retirement completed successfully'));
    console.log(chalk.blue('♻️ Retirement Details:'));
    console.log(chalk.gray(`   Retirement ID: ${retirement.id}`));
    console.log(chalk.gray(`   Certificate ID: ${retirement.certificateId}`));
    console.log(chalk.gray(`   Quantity Retired: ${retirement.quantity}`));
    console.log(chalk.gray(`   Project: ${retirement.projectId}`));
    console.log(chalk.gray(`   Beneficiary: ${retirement.retirementBeneficiary}`));
    console.log(chalk.gray(`   Adapter TX Hash: ${certificate.adapterTxHash || 'Pending'}`));
    console.log(chalk.gray(`   Certificate URL: http://localhost:3002/retirements/${retirement.certificateId}`));
    console.log(chalk.gray(`   Marketplace Certificate: http://localhost:3004/buyer/certificates/${retirement.certificateId}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Retirement failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demoRetire().catch((error) => {
    console.error(chalk.red('Error executing retirement:'), error);
    process.exit(1);
  });
}

export { demoRetire };
