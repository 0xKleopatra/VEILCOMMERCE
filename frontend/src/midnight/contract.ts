// VeilCommerce — Midnight Contract Deployment & Interaction
// Based on Kredz pattern with createUnprovenDeployTx

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import type { WalletAPI } from '@midnight-ntwrk/wallet-sdk';
import { toHex, fromHex } from '../lib/hex';
import { createContractProviders, createPatchedPublicDataProvider } from './providers';
import { persistSecret } from './witnesses';

interface ContractInstance<T = any> {
  address: string;
  contract: any;
  providers: any;
  ledger: (state: any) => T;
}

const contractCache = new Map<string, any>();

/**
 * Load compiled contract module
 */
export async function loadContractModule(modulePath: string): Promise<any> {
  if (contractCache.has(modulePath)) {
    return contractCache.get(modulePath);
  }
  
  const mod = await import(modulePath);
  const contract = mod.Contract;
  contractCache.set(modulePath, contract);
  return contract;
}

/**
 * Create compiled contract with witnesses and ZK assets
 */
export function createCompiledContract(
  contractName: string,
  contractModule: any,
  witnesses: any
): any {
  return (CompiledContract.make as any)(contractName, contractModule).pipe(
    (CompiledContract as any).withWitnesses(witnesses),
    (CompiledContract as any).withCompiledFileAssets(`/contract/${contractName}`)
  );
}

/**
 * Deploy a new contract instance
 */
export async function deployContract(
  api: WalletAPI,
  contractName: string,
  contractModule: any,
  witnesses: any,
  args: any[] = []
): Promise<string> {
  const contract = await loadContractModule(contractName);
  const compiledContract = createCompiledContract(contractName, contract, witnesses);

  const config = await api.getConfiguration();
  setNetworkId(config.networkId);

  const providers = await createContractProviders(api, contractName);

  const deployTxData = await createUnprovenDeployTx(providers, {
    compiledContract,
    args,
    signingKey: sampleSigningKey(),
  } as any);

  const contractAddress = deployTxData.public.contractAddress;
  await submitTxAsync(providers, { unprovenTx: deployTxData.private.unprovenTx } as any);

  await persistSecret({ providers } as any, contractAddress);

  return contractAddress;
}

/**
 * Wait for contract to be indexed
 */
export async function waitForContractIndexed(
  api: WalletAPI,
  contractAddress: string,
  maxAttempts = 30
): Promise<void> {
  const config = await api.getConfiguration();
  const publicDataProvider = createPatchedPublicDataProvider(
    config.indexerUri,
    config.indexerWsUri
  );
  
  for (let i = 0; i < maxAttempts; i++) {
    const state = await publicDataProvider.queryContractState(contractAddress);
    if (state?.data) return;
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Contract not indexed after polling');
}

/**
 * Join an existing deployed contract
 */
export async function joinContract(
  api: WalletAPI,
  contractName: string,
  contractModule: any,
  witnesses: any,
  contractAddress: string
): Promise<ContractInstance> {
  const contract = await loadContractModule(contractName);
  const compiledContract = createCompiledContract(contractName, contract, witnesses);
  
  const config = await api.getConfiguration();
  const publicDataProvider = createPatchedPublicDataProvider(
    config.indexerUri,
    config.indexerWsUri
  );

  // Load ledger type for state queries
  const { ledger } = await import(`../../../contracts/managed/${contractName}/contract/index.js`);

  return {
    address: contractAddress,
    contract: compiledContract,
    providers: { publicDataProvider },
    ledger,
    async getContractState() {
      const contractState = await publicDataProvider.queryContractState(contractAddress);
      if (!contractState?.data) {
        return { data: { /* default empty state */ } };
      }
      return { data: ledger(contractState.data) };
    },
    async callCircuit(circuitName: string, ...args: any[]) {
      const circuit = compiledContract.circuits[circuitName];
      if (!circuit) throw new Error(`Circuit ${circuitName} not found`);
      return circuit(...args);
    },
  };
}

/**
 * Create VeilCommerce contract instances
 */
export interface VeilCommerceContracts {
  businessRegistry: ContractInstance;
  purchaseOrder: ContractInstance;
  escrow: ContractInstance;
  invoice: ContractInstance;
  financing: ContractInstance;
  compliance: ContractInstance;
  settlement: ContractInstance;
  credentialRegistry: ContractInstance;
}

export async function createVeilCommerceContracts(
  api: WalletAPI,
  mode: 'deploy' | 'join',
  addresses?: Partial<Record<keyof VeilCommerceContracts, string>>
): Promise<VeilCommerceContracts> {
  // This would be called with actual contract modules and witnesses
  // Placeholder for the pattern
  throw new Error('Use individual deployContract/joinContract calls');
}