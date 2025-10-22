import Handlebars from 'handlebars';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

interface Addresses {
  carbonCreditContract: string;
  evidenceAnchorContract: string;
  chainId: number;
  deployedAt: string;
}

interface EnvVars {
  REGISTRY_URL: string;
  ADAPTER_URL: string;
  LOCKER_URL: string;
  ORACLE_URL: string;
  SIM_URL: string;
  EXPLORER_URL: string;
  ISSUER_URL: string;
  VERIFIER_URL: string;
  BUYER_URL: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  CHAIN_RPC_URL: string;
  CHAIN_ID: string;
  PRIVATE_KEY: string;
  MINIO_ENDPOINT: string;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET: string;
  IPFS_URL: string;
  JWT_SECRET: string;
  JWKS_URL: string;
  CARBON_CREDIT_CONTRACT: string;
  EVIDENCE_ANCHOR_CONTRACT: string;
  IOT_SITE_ID: string;
  IOT_FACTOR_REF: string;
}

async function loadAddresses(): Promise<Addresses> {
  try {
    const addressesData = await fs.readFile('addresses.json', 'utf-8');
    return JSON.parse(addressesData);
  } catch (error) {
    throw new Error('addresses.json not found. Run "make contracts" first.');
  }
}

async function loadEnvExample(): Promise<EnvVars> {
  try {
    const envData = await fs.readFile('.env', 'utf-8');
    const envVars: Partial<EnvVars> = {};
    
    envData.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim() as keyof EnvVars] = value.trim();
      }
    });
    
    return envVars as EnvVars;
  } catch (error) {
    throw new Error('.env file not found. Run "make doctor" first.');
  }
}

async function renderTemplate(templatePath: string, outputPath: string, context: any): Promise<void> {
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  const rendered = template(context);
  await fs.writeFile(outputPath, rendered);
}

async function renderEnvFiles(): Promise<void> {
  const spinner = ora('Rendering environment files...').start();
  
  try {
    const addresses = await loadAddresses();
    const envVars = await loadEnvExample();
    
    const context = {
      ...envVars,
      CARBON_CREDIT_CONTRACT: addresses.carbonCreditContract,
      EVIDENCE_ANCHOR_CONTRACT: addresses.evidenceAnchorContract,
      CHAIN_ID: addresses.chainId.toString(),
    };
    
    const templates = [
      'adapter.env.tpl',
      'registry.env.tpl',
      'explorer.env.tpl',
      'issuer.env.tpl',
      'verifier.env.tpl',
      'buyer.env.tpl',
      'locker.env.tpl',
      'oracle.env.tpl',
      'sim.env.tpl',
      'chain.env.tpl',
    ];
    
    for (const template of templates) {
      const templatePath = path.join('env-templates', template);
      const outputPath = path.join('env-templates', template.replace('.tpl', ''));
      
      await renderTemplate(templatePath, outputPath, context);
    }
    
    spinner.succeed(chalk.green('✓ Environment files rendered'));
    console.log(chalk.blue('📋 Generated files:'));
    templates.forEach(template => {
      const outputFile = template.replace('.tpl', '');
      console.log(chalk.gray(`   ${outputFile}`));
    });
    
  } catch (error) {
    spinner.fail(chalk.red('✗ Environment rendering failed'));
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  renderEnvFiles().catch((error) => {
    console.error(chalk.red('Error rendering env files:'), error);
    process.exit(1);
  });
}

export { renderEnvFiles };
