import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

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
  
  async createOrganization(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/organizations`, data, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  async createUser(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/users`, data, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  async createProject(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/projects`, data, {
      headers: {
        'Authorization': `Bearer ${this.client.token}`,
        'Idempotency-Key': uuidv4(),
      },
    });
    return response.data;
  }
  
  async uploadEvidence(projectId: string, filePath: string): Promise<any> {
    const formData = new FormData();
    const fileBuffer = await fs.readFile(filePath);
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob, path.basename(filePath));
    
    const response = await axios.post(
      `${this.client.baseURL}/projects/${projectId}/evidence`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${this.client.token}`,
          'Idempotency-Key': uuidv4(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
  
  setToken(token: string): void {
    this.client.token = token;
  }
}

async function seedRegistry(): Promise<void> {
  const spinner = ora('Seeding registry data...').start();
  
  try {
    const registry = new RegistryAPI('http://localhost:4000');
    
    // Login as admin
    spinner.text = 'Logging in as admin...';
    const adminToken = await registry.login('admin@demo.local', 'Admin@123');
    registry.setToken(adminToken);
    
    // Create organizations
    spinner.text = 'Creating organizations...';
    const adminOrg = await registry.createOrganization({
      name: 'AdminOrg',
      type: 'ADMIN',
      country: 'US',
      description: 'Administrative organization for demo',
    });
    
    const verifierOrg = await registry.createOrganization({
      name: 'VerifierOrg',
      type: 'VERIFIER',
      country: 'US',
      description: 'Verification organization for demo',
    });
    
    const solarOrg = await registry.createOrganization({
      name: 'SolarCo',
      type: 'ISSUER',
      country: 'IN',
      description: 'Solar energy company issuing carbon credits',
    });
    
    const buyerOrg = await registry.createOrganization({
      name: 'BuyerCo',
      type: 'BUYER',
      country: 'US',
      description: 'Company purchasing carbon credits',
    });
    
    // Create users
    spinner.text = 'Creating users...';
    const verifierUser = await registry.createUser({
      email: 'verifier@demo.local',
      password: 'Verifier@123',
      role: 'VERIFIER',
      organizationId: verifierOrg.id,
      firstName: 'Verifier',
      lastName: 'User',
    });
    
    const issuerUser = await registry.createUser({
      email: 'issuer@solarco.local',
      password: 'Solar@123',
      role: 'ISSUER',
      organizationId: solarOrg.id,
      firstName: 'Solar',
      lastName: 'Issuer',
    });
    
    const buyerUser = await registry.createUser({
      email: 'buyer@buyerco.local',
      password: 'Buyer@123',
      role: 'BUYER',
      organizationId: buyerOrg.id,
      firstName: 'Carbon',
      lastName: 'Buyer',
    });
    
    // Create project
    spinner.text = 'Creating project...';
    const project = await registry.createProject({
      id: 'PRJ001',
      name: 'Solar Farm C',
      description: 'Large-scale solar farm in India',
      methodology: 'RE-SOLAR',
      country: 'IN',
      organizationId: solarOrg.id,
      vintageYear: 2024,
      estimatedCredits: 10000,
    });
    
    // Upload evidence files
    spinner.text = 'Uploading evidence files...';
    try {
      await registry.uploadEvidence(project.id, 'data/samples/baseline.pdf');
      await registry.uploadEvidence(project.id, 'data/samples/monitoring-plan.pdf');
    } catch (error) {
      console.log(chalk.yellow('⚠️  Evidence files not found, skipping upload'));
    }
    
    spinner.succeed(chalk.green('✓ Registry seeded successfully'));
    console.log(chalk.blue('📊 Created:'));
    console.log(chalk.gray(`   Organizations: 4`));
    console.log(chalk.gray(`   Users: 3`));
    console.log(chalk.gray(`   Project: ${project.id} - ${project.name}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Registry seeding failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRegistry().catch((error) => {
    console.error(chalk.red('Error seeding registry:'), error);
    process.exit(1);
  });
}

export { seedRegistry };
