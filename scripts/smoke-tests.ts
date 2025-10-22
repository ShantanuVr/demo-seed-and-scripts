import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

interface SmokeTest {
  name: string;
  test: () => Promise<boolean>;
}

async function runSmokeTests(): Promise<void> {
  const spinner = ora('Running smoke tests...').start();
  
  const tests: SmokeTest[] = [
    {
      name: 'Registry Stats',
      test: async () => {
        const response = await axios.get('http://localhost:4000/reports/registry-stats');
        const stats = response.data;
        return stats.issued >= 10000 && stats.retired >= 150;
      },
    },
    {
      name: 'Adapter Health',
      test: async () => {
        const response = await axios.get('http://localhost:4100/health');
        return response.data.status === 'healthy';
      },
    },
    {
      name: 'Explorer Project Page',
      test: async () => {
        const response = await axios.get('http://localhost:3002/projects/PRJ001');
        return response.status === 200;
      },
    },
    {
      name: 'Issuer Portal Health',
      test: async () => {
        const response = await axios.get('http://localhost:3001/api/health');
        return response.status === 200;
      },
    },
    {
      name: 'Verifier Console Health',
      test: async () => {
        const response = await axios.get('http://localhost:3003/api/health');
        return response.status === 200;
      },
    },
    {
      name: 'Evidence Locker Health',
      test: async () => {
        const response = await axios.get('http://localhost:4600/health');
        return response.status === 200;
      },
    },
    {
      name: 'IoT Oracle Health',
      test: async () => {
        const response = await axios.get('http://localhost:4201/health');
        return response.status === 200;
      },
    },
    {
      name: 'IoT Sim Health',
      test: async () => {
        const response = await axios.get('http://localhost:4200/health');
        return response.status === 200;
      },
    },
    {
      name: 'Buyer Marketplace Health',
      test: async () => {
        const response = await axios.get('http://localhost:3004/api/health');
        return response.status === 200;
      },
    },
    {
      name: 'BuyerCo Balance Check',
      test: async () => {
        const response = await axios.get('http://localhost:4000/credits/balance?ownerId=BuyerCo');
        const balance = response.data;
        return balance && balance.total >= 300;
      },
    },
    {
      name: 'Retirement Certificate Check',
      test: async () => {
        const response = await axios.get('http://localhost:4000/retirements');
        const retirements = response.data;
        return retirements && retirements.length > 0 && retirements[0].certificateId;
      },
    },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) {
        passed++;
        console.log(chalk.green(`✓ ${test.name}`));
      } else {
        failed++;
        console.log(chalk.red(`✗ ${test.name}`));
      }
    } catch (error) {
      failed++;
      console.log(chalk.red(`✗ ${test.name} - ${error}`));
    }
  }
  
  spinner.stop();
  
  console.log(chalk.blue('\n📊 Smoke Test Results:'));
  console.log(chalk.green(`   Passed: ${passed}`));
  console.log(chalk.red(`   Failed: ${failed}`));
  
  if (failed > 0) {
    console.log(chalk.yellow('\n💡 Some tests failed. Check service logs: make logs'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n🎉 All smoke tests passed!'));
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSmokeTests().catch((error) => {
    console.error(chalk.red('Error running smoke tests:'), error);
    process.exit(1);
  });
}

export { runSmokeTests };
