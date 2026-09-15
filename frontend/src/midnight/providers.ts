// VeilCommerce — Midnight Providers (Real, No Mocks)
// Delegates to canonical lib/midnight.ts per Midnight-Skills templates
// References: templates/locker-dapp/lib/midnight.ts, kredz/midnight/providers.ts

export {
  createPatchedPublicDataProvider,
  createPrivateStateProvider,
  createConnectedSession,
  listWallets,
  detectWallet,
  toHex,
  fromHex,
} from '../lib/midnight';

import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { toHex, fromHex } from '../lib/midnight';
import { createPrivateStateProvider, createPatchedPublicDataProvider } from '../lib/midnight';

export interface ContractProviders {
  zkConfigProvider: FetchZkConfigProvider<any>;
  privateStateProvider: ReturnType<typeof createPrivateStateProvider>;
  proofProvider: { proveTx: (unprovenTx: any) => Promise<any> };
  walletProvider: any;
  midnightProvider: any;
  publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider> | null;
}

/**
 * Create contract providers from wallet API — real dust-free flow.
 * Mirrors kredz-frontend/src/midnight/contract.ts deployContract providers.
 */
export async function createContractProviders(api: any, contractName: string): Promise<ContractProviders> {
  const config = await api.getConfiguration();
  const shielded = await api.getShieldedAddresses();

  const zkConfigProvider = new FetchZkConfigProvider<any>(
    new URL(`/contract/${contractName}`, window.location.origin).toString(),
    window.fetch.bind(window),
  );

  const provingProvider = await api.getProvingProvider(zkConfigProvider as any);

  return {
    zkConfigProvider,
    privateStateProvider: createPrivateStateProvider(),
    publicDataProvider: createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri),
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
        const balanced = await api.balanceUnsealedTransaction(txHex);
        if (!balanced?.tx) throw new Error('balanceUnsealedTransaction returned invalid result');
        const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
        return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
      },
    },
    midnightProvider: {
      submitTx: async (tx: any) => {
        const txHex = toHex(tx.serialize());
        const result = await api.submitTransaction(txHex);
        if (typeof result === 'string' && result) return result;
        if ((result as any)?.transactionId) return (result as any).transactionId;
        if ((result as any)?.id) return (result as any).id;
        if ((result as any)?.txId) return (result as any).txId;
        return txHex.slice(0, 64);
      },
    },
  };
}
