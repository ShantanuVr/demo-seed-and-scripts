import chalk from 'chalk';

interface URLConfig {
  name: string;
  url: string;
  description: string;
  credentials?: {
    username: string;
    password: string;
  };
}

function printURLs(): void {
  const urls: URLConfig[] = [
    {
      name: 'Registry API',
      url: 'http://localhost:4000/docs',
      description: 'Official Registry Sim API documentation',
    },
    {
      name: 'Issuer Portal',
      url: 'http://localhost:3001',
      description: 'Issuer portal for managing projects and issuances',
      credentials: {
        username: 'issuer@solarco.local',
        password: 'Solar@123',
      },
    },
    {
      name: 'Verifier Console',
      url: 'http://localhost:3003',
      description: 'Verifier console for reviewing and approving issuances',
      credentials: {
        username: 'verifier@demo.local',
        password: 'Verifier@123',
      },
    },
    {
      name: 'Buyer Marketplace',
      url: 'http://localhost:3004',
      description: 'Carbon credit marketplace for buyers',
      credentials: {
        username: 'buyer@buyerco.local',
        password: 'Buyer@123',
      },
    },
    {
      name: 'Carbon Explorer',
      url: 'http://localhost:3002/projects/PRJ001',
      description: 'Public explorer showing project details and certificates',
    },
    {
      name: 'Evidence Locker',
      url: 'http://localhost:4600',
      description: 'Evidence storage and verification service',
    },
    {
      name: 'MinIO Console',
      url: 'http://localhost:9001',
      description: 'Object storage management interface',
      credentials: {
        username: 'minioadmin',
        password: 'minioadmin123',
      },
    },
    {
      name: 'IPFS API',
      url: 'http://localhost:5001',
      description: 'IPFS HTTP API for decentralized storage',
    },
    {
      name: 'Chain RPC',
      url: 'http://localhost:8545',
      description: 'Ethereum-compatible blockchain RPC endpoint',
    },
  ];
  
  console.log(chalk.blue.bold('\n🔗 Demo Stack URLs\n'));
  
  urls.forEach((config, index) => {
    console.log(chalk.cyan(`${index + 1}. ${config.name}`));
    console.log(chalk.gray(`   ${config.url}`));
    console.log(chalk.white(`   ${config.description}`));
    
    if (config.credentials) {
      console.log(chalk.yellow(`   Login: ${config.credentials.username} / ${config.credentials.password}`));
    }
    
    console.log('');
  });
  
  console.log(chalk.green.bold('🎯 Key Demo Flow:'));
  console.log(chalk.white('   1. Login to Issuer Portal → Create/Manage Projects'));
  console.log(chalk.white('   2. Login to Verifier Console → Review/Approve Issuances'));
  console.log(chalk.white('   3. Login to Buyer Marketplace → Browse/Buy Credits'));
  console.log(chalk.white('   4. View Carbon Explorer → See Projects & Certificates'));
  console.log(chalk.white('   5. Check Registry API → View Raw Data & Stats'));
  
  console.log(chalk.blue.bold('\n📊 Demo Data Summary:'));
  console.log(chalk.white('   • Project: PRJ001 - Solar Farm C (India)'));
  console.log(chalk.white('   • Issuance: 10,000 credits (2024 vintage)'));
  console.log(chalk.white('   • Transfer: 300 credits to BuyerCo'));
  console.log(chalk.white('   • Retirement: 150 credits with certificate'));
  console.log(chalk.white('   • IoT: Anchored digest for yesterday\'s data'));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  printURLs();
}

export { printURLs };
