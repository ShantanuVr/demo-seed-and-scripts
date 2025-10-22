import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

interface SimClient {
  baseURL: string;
}

interface OracleClient {
  baseURL: string;
}

class SimAPI {
  private client: SimClient;
  
  constructor(baseURL: string) {
    this.client = { baseURL };
  }
  
  async createSite(data: any): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/sites`, data);
    return response.data;
  }
  
  async generateData(siteId: string, day: string): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/sites/${siteId}/generate?day=${day}`);
    return response.data;
  }
}

class OracleAPI {
  private client: OracleClient;
  
  constructor(baseURL: string) {
    this.client = { baseURL };
  }
  
  async getLatestDigest(siteId: string): Promise<any> {
    const response = await axios.get(`${this.client.baseURL}/v1/sites/${siteId}/digests/latest`);
    return response.data;
  }
  
  async anchorDigest(siteId: string, digestId: string): Promise<any> {
    const response = await axios.post(`${this.client.baseURL}/v1/anchor`, {
      siteId,
      digestId,
    });
    return response.data;
  }
}

async function seedIoT(): Promise<void> {
  const spinner = ora('Seeding IoT data...').start();
  
  try {
    const sim = new SimAPI('http://localhost:4200');
    const oracle = new OracleAPI('http://localhost:4201');
    
    // Create IoT site
    spinner.text = 'Creating IoT site...';
    const site = await sim.createSite({
      id: 'PRJ001',
      name: 'Solar Farm C IoT Site',
      projectId: 'PRJ001',
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        country: 'IN',
      },
      deviceType: 'SOLAR_MONITOR',
      factorRef: 'FCT-DEMO-IN-2024',
    });
    
    // Generate yesterday's data
    spinner.text = 'Generating historical data...';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    await sim.generateData(site.id, yesterdayStr);
    
    // Wait for oracle to process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get latest digest
    spinner.text = 'Fetching latest digest...';
    const digest = await oracle.getLatestDigest(site.id);
    
    // Anchor the digest
    spinner.text = 'Anchoring digest to blockchain...';
    const anchorResult = await oracle.anchorDigest(site.id, digest.id);
    
    spinner.succeed(chalk.green('✓ IoT data seeded successfully'));
    console.log(chalk.blue('📡 IoT Details:'));
    console.log(chalk.gray(`   Site ID: ${site.id}`));
    console.log(chalk.gray(`   Digest ID: ${digest.id}`));
    console.log(chalk.gray(`   Anchored: ${digest.anchored ? 'Yes' : 'No'}`));
    console.log(chalk.gray(`   TX Hash: ${anchorResult.txHash || 'Pending'}`));
    console.log(chalk.gray(`   Data Date: ${yesterdayStr}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ IoT seeding failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedIoT().catch((error) => {
    console.error(chalk.red('Error seeding IoT data:'), error);
    process.exit(1);
  });
}

export { seedIoT };
