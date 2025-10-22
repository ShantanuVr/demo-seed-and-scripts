import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';

// Contract ABIs (simplified for demo)
const CARBON_CREDIT_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const EVIDENCE_ANCHOR_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function deployContracts(): Promise<void> {
  const spinner = ora('Deploying smart contracts...').start();
  
  try {
    // Setup client
    const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
    
    const publicClient = createPublicClient({
      chain: hardhat,
      transport: http('http://localhost:8545'),
    });
    
    const walletClient = createWalletClient({
      account,
      chain: hardhat,
      transport: http('http://localhost:8545'),
    });
    
    // Deploy CarbonCredit1155 contract
    spinner.text = 'Deploying CarbonCredit1155 contract...';
    const carbonCreditHash = await walletClient.deployContract({
      abi: CARBON_CREDIT_ABI,
      bytecode: '0x608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b57806395d89b4114610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b6100616100e3565b60405161006e91906100a1565b60405180910390f35b60606040518060400160405280600a81526020017f436172626f6e437265646974000000000000000000000000000000000000000000815250905090565b60606040518060400160405280600381526020017f434300000000000000000000000000000000000000000000000000000000000000815250905090565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b9291505056fea2646970667358221220...',
      args: ['CarbonCredit', 'CC'],
    });
    
    const carbonCreditReceipt = await publicClient.waitForTransactionReceipt({
      hash: carbonCreditHash,
    });
    
    // Deploy EvidenceAnchor contract
    spinner.text = 'Deploying EvidenceAnchor contract...';
    const evidenceAnchorHash = await walletClient.deployContract({
      abi: EVIDENCE_ANCHOR_ABI,
      bytecode: '0x608060405234801561001057600080fd5b50600436106100365760003560e01c806306fdde031461003b57806395d89b4114610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b6100616100e3565b60405161006e91906100a1565b60405180910390f35b60606040518060400160405280600d81526020017f45766964656e6365416e63686f7200000000000000000000000000000000000000815250905090565b60606040518060400160405280600381526020017f454100000000000000000000000000000000000000000000000000000000000000815250905090565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b9291505056fea2646970667358221220...',
      args: ['EvidenceAnchor'],
    });
    
    const evidenceAnchorReceipt = await publicClient.waitForTransactionReceipt({
      hash: evidenceAnchorHash,
    });
    
    // Save addresses
    const addresses = {
      carbonCreditContract: carbonCreditReceipt.contractAddress,
      evidenceAnchorContract: evidenceAnchorReceipt.contractAddress,
      chainId: hardhat.id,
      deployedAt: new Date().toISOString(),
    };
    
    await fs.writeFile('addresses.json', JSON.stringify(addresses, null, 2));
    
    spinner.succeed(chalk.green('✓ Contracts deployed successfully'));
    console.log(chalk.blue('📜 Contract Addresses:'));
    console.log(chalk.gray(`   CarbonCredit1155: ${addresses.carbonCreditContract}`));
    console.log(chalk.gray(`   EvidenceAnchor: ${addresses.evidenceAnchorContract}`));
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Contract deployment failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployContracts().catch((error) => {
    console.error(chalk.red('Error deploying contracts:'), error);
    process.exit(1);
  });
}

export { deployContracts };
