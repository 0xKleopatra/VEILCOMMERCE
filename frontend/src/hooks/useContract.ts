// VeilCommerce — Contract Hook — Real, No Mocks
// Uses canonical providers from lib/midnight.ts per 1am-wallet skill
// Reference: kredz-frontend/src/midnight/contract.ts, templates/locker-dapp

import { useState, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { toHex, fromHex, createPatchedPublicDataProvider, createPrivateStateProvider } from '../lib/midnight';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';

export interface ContractState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface DeployedContract {
  address: string;
  contract: any;
  providers: any;
}

export function useMidnightContract<T = any>(contractName: string, contractModule: any, witnesses: any) {
  const { session, isConnected } = useWallet();
  const [contractState, setContractState] = useState<ContractState<T>>({ data: null, loading: false, error: null });
  const [deployedContract, setDeployedContract] = useState<DeployedContract | null>(null);

  const createProviders = useCallback(async () => {
    if (!session) throw new Error('Wallet not connected — create session first');
    const config = session.config;
    const shielded = await session.api.getShieldedAddresses();
    const zkConfigProvider = new FetchZkConfigProvider<any>(
      new URL(`/contract/${contractName}`, window.location.origin).toString(),
      window.fetch.bind(window),
    );
    const provingProvider = await session.api.getProvingProvider(zkConfigProvider as any);
    const privateStateProvider = createPrivateStateProvider();
    const publicDataProvider = createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri);

    return {
      zkConfigProvider,
      privateStateProvider,
      publicDataProvider,
      proofProvider: {
        async proveTx(unprovenTx: any) {
          const { CostModel } = await import('@midnight-ntwrk/ledger-v8');
          return unprovenTx.prove(provingProvider, CostModel.initialCostModel());
        },
      },
      walletProvider: {
        getCoinPublicKey: () => (shielded as any).shieldedCoinPublicKey,
        getEncryptionPublicKey: () => (shielded as any).shieldedEncryptionPublicKey,
        balanceTx: async (tx: any) => {
          const txHex = toHex(tx.serialize());
          const balanced = await session.api.balanceUnsealedTransaction(txHex);
          if (!balanced?.tx) throw new Error('balanceUnsealedTransaction returned invalid result');
          const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
          return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
        },
      },
      midnightProvider: {
        submitTx: async (tx: any) => {
          const txHex = toHex(tx.serialize());
          const result = await session.api.submitTransaction(txHex);
          if (typeof result === 'string' && result) return result;
          if ((result as any)?.transactionId) return (result as any).transactionId;
          if ((result as any)?.id) return (result as any).id;
          return txHex.slice(0, 64);
        },
      },
    } as any;
  }, [session, contractName]);

  const deploy = useCallback(async () => {
    if (!session || !isConnected) throw new Error('Wallet not connected — connect 1AM or Lace first');
    setContractState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const providers = await createProviders();
      const compiledContract = (CompiledContract.make as any)(contractName, contractModule).pipe(
        (CompiledContract as any).withWitnesses(witnesses),
        (CompiledContract as any).withCompiledFileAssets(`/contract/${contractName}`),
      );
      const deployTxData = await createUnprovenDeployTx(providers as any, {
        compiledContract,
        args: [],
        signingKey: sampleSigningKey(),
      } as any);
      const contractAddress = deployTxData.public.contractAddress;
      await submitTxAsync(providers as any, { unprovenTx: deployTxData.private.unprovenTx } as any);
      await providers.privateStateProvider.setContractAddress(contractAddress);
      await providers.privateStateProvider.setSigningKey(contractAddress, deployTxData.private.signingKey);
      // Poll for indexing — real indexer lag, no simulation
      for (let i = 0; i < 30; i++) {
        const state = await providers.publicDataProvider.queryContractState(contractAddress);
        if ((state as any)?.data) break;
        await new Promise((r) => setTimeout(r, 2000));
      }
      setDeployedContract({ address: contractAddress, contract: compiledContract, providers });
      setContractState((prev) => ({ ...prev, loading: false }));
      return contractAddress;
    } catch (err) {
      setContractState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Deployment failed' }));
      throw err;
    }
  }, [session, isConnected, contractName, contractModule, witnesses, createProviders]);

  const join = useCallback(async (contractAddress: string) => {
    if (!session || !isConnected) throw new Error('Wallet not connected');
    setContractState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const providers = await createProviders();
      const compiledContract = (CompiledContract.make as any)(contractName, contractModule).pipe(
        (CompiledContract as any).withWitnesses(witnesses),
        (CompiledContract as any).withCompiledFileAssets(`/contract/${contractName}`),
      );
      setDeployedContract({ address: contractAddress, contract: compiledContract, providers });
      setContractState((prev) => ({ ...prev, loading: false }));
      return { address: contractAddress, contract: compiledContract, providers };
    } catch (err) {
      setContractState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Join failed' }));
      throw err;
    }
  }, [session, isConnected, contractName, contractModule, witnesses, createProviders]);

  const callCircuit = useCallback(async (circuitName: string, ...args: any[]): Promise<any> => {
    if (!deployedContract) throw new Error('Contract not deployed or joined');
    const { contract } = deployedContract;
    const circuit = contract.circuits[circuitName];
    if (!circuit) throw new Error(`Circuit ${circuitName} not found`);
    return circuit(...args);
  }, [deployedContract]);

  const queryState = useCallback(async (): Promise<T | null> => {
    if (!deployedContract) return null;
    try {
      const { providers } = deployedContract;
      const state = await providers.publicDataProvider?.queryContractState(deployedContract.address);
      if ((state as any)?.data) {
        const ledger = contractModule.ledger((state as any).data);
        return ledger as T;
      }
      return null;
    } catch (err) {
      console.error('Query state failed:', err);
      return null;
    }
  }, [deployedContract, contractModule]);

  return { contractState, deployedContract, deploy, join, callCircuit, queryState, isDeployed: !!deployedContract };
}
