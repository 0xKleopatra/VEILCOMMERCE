// =============================================================================
// VeilCommerce — Midnight Session (Canonical)
// -----------------------------------------------------------------------------
// Wallet session, provider wiring, indexer patch — supports 1AM + Lace wallets
// Based on: Midnight-Skills-main/.agents/skills/1am-wallet/SKILL.md
//           references/midnight-session.md (canonical source)
//           react-wallet-connector SKILL.md (generic enumeration)
// =============================================================================

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { ContractState } from '@midnight-ntwrk/compact-runtime';
import type { MidnightProvider, WalletProvider } from '@midnight-ntwrk/midnight-js-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConnectedSession = {
  api: any;
  config: any;
  providers: {
    privateStateProvider: ReturnType<typeof createPrivateStateProvider>;
    publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>;
    zkConfigProvider: FetchZkConfigProvider<any>;
    proofProvider: { proveTx: (unprovenTx: any, _config?: any) => Promise<any> };
    walletProvider: WalletProvider;
    midnightProvider: MidnightProvider;
  };
  unshieldedAddress: string;
  coinPublicKeyBytes: Uint8Array;
};

// ---------------------------------------------------------------------------
// Hex helpers (never skip padStart)
// ---------------------------------------------------------------------------

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function fromHex(hex: string): Uint8Array {
  const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) throw new Error('Invalid hex string from wallet.');
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

// ---------------------------------------------------------------------------
// Coin public key helpers
// ---------------------------------------------------------------------------

export function coinPublicKeyToBytes(walletProvider: WalletProvider): Uint8Array {
  const pk = (walletProvider as any)?.getCoinPublicKey?.() ?? '';
  const hex =
    typeof pk === 'string'
      ? pk
      : Array.from(pk as number[])
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function coinPublicKeyToBytesInternal(pk: unknown): Uint8Array {
  if (pk instanceof Uint8Array) return pk.length === 32 ? pk : pk.slice(0, 32);
  if (typeof pk === 'string') {
    const hex = pk.startsWith('0x') ? pk.slice(2) : pk;
    if (hex.length === 64 && /^[0-9a-fA-F]+$/.test(hex)) return fromHex(hex);
    // attempt generic hex handling
    try {
      const b = fromHex(pk);
      if (b.length >= 32) return b.slice(0, 32);
      const padded = new Uint8Array(32);
      padded.set(b, 32 - b.length);
      return padded;
    } catch {
      return new Uint8Array(32);
    }
  }
  if (Array.isArray(pk)) {
    return new Uint8Array(pk.length >= 32 ? pk.slice(0, 32) : [...pk, ...new Uint8Array(32 - pk.length)]);
  }
  if (pk && typeof pk === 'object' && 'bytes' in (pk as object)) {
    return coinPublicKeyToBytesInternal((pk as { bytes: unknown }).bytes);
  }
  return new Uint8Array(32);
}

// Compact Either helpers — Left = shielded coin key, Right = unshielded/raw key
export function makeEitherLeft(bytes: Uint8Array) {
  return { is_left: true, left: { bytes }, right: { bytes: new Uint8Array(32) } };
}

export function formatEitherAddress(either: any): string {
  if (!either) return '—';
  const bytes = either.is_left ? either.left?.bytes : either.right?.bytes;
  if (!bytes) return '—';
  return '0x' + Array.from(bytes as number[]).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Private State Provider (In-Memory)
// ---------------------------------------------------------------------------

export function createPrivateStateProvider() {
  let scope = '';
  const stateStore = new Map<string, unknown>();
  const signingKeyStore = new Map<string, unknown>();
  const key = (id: string) => `${scope}:${id}`;

  return {
    setContractAddress(address: string) {
      scope = address;
    },
    async set(id: string, state: unknown) {
      stateStore.set(key(id), state);
    },
    async get(id: string) {
      return stateStore.get(key(id)) ?? null;
    },
    async remove(id: string) {
      stateStore.delete(key(id));
    },
    async clear() {
      stateStore.clear();
    },
    async setSigningKey(addr: string, k: unknown) {
      signingKeyStore.set(addr, k);
    },
    async getSigningKey(addr: string) {
      return signingKeyStore.get(addr) ?? null;
    },
    async removeSigningKey(addr: string) {
      signingKeyStore.delete(addr);
    },
    async clearSigningKeys() {
      signingKeyStore.clear();
    },
    // Expose internal stores for legacy hooks that expect getPrivateState/setPrivateState
    async getPrivateState(k: string) {
      return stateStore.get(key(k)) ?? null;
    },
    async setPrivateState(k: string, v: unknown) {
      stateStore.set(key(k), v);
    },
    async deletePrivateState(k: string) {
      stateStore.delete(k);
    },
    async exportPrivateStates(): Promise<never> {
      throw new Error('Not implemented.');
    },
    async importPrivateStates(): Promise<never> {
      throw new Error('Not implemented.');
    },
    async exportSigningKeys(): Promise<never> {
      throw new Error('Not implemented.');
    },
    async importSigningKeys(): Promise<never> {
      throw new Error('Not implemented.');
    },
  };
}

// ---------------------------------------------------------------------------
// Patched Public Data Provider — fixes indexer offset:null bug on preview/preprod
// ---------------------------------------------------------------------------

export function createPatchedPublicDataProvider(queryUrl: string, subscriptionUrl: string) {
  const base = indexerPublicDataProvider(queryUrl, subscriptionUrl);

  async function queryLatest(query: string, address: string) {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { address } }),
    });
    if (!res.ok) throw new Error(`Indexer HTTP error: ${res.status}`);
    const payload = await res.json();
    if (payload.errors?.length) throw new Error(payload.errors.map((e: any) => e.message).join('; '));
    return payload.data?.contractAction ?? null;
  }

  return {
    ...base,
    async queryContractState(contractAddress: string, config?: any) {
      if (config) return base.queryContractState(contractAddress, config);
      const action = await queryLatest(
        `
        query LATEST_CONTRACT_STATE($address: HexEncoded!) {
          contractAction(address: $address) { state }
        }`,
        contractAddress,
      );
      return action ? ContractState.deserialize(fromHex(action.state)) : null;
    },
    async queryZSwapAndContractState(contractAddress: string, config?: any) {
      if (config) return base.queryZSwapAndContractState(contractAddress, config);
      const action = await queryLatest(
        `
        query LATEST_BOTH_STATE($address: HexEncoded!) {
          contractAction(address: $address) {
            state
            zswapState
            transaction { block { ledgerParameters } }
          }
        }`,
        contractAddress,
      );
      if (!action?.zswapState) return null;
      // Dynamic import to avoid static ledger-v8 WASM top-level await in bundle
      const { ZswapChainState, LedgerParameters } = await import('@midnight-ntwrk/ledger-v8');
      return [
        ZswapChainState.deserialize(fromHex(action.zswapState)),
        ContractState.deserialize(fromHex(action.state)),
        action.transaction?.block?.ledgerParameters
          ? LedgerParameters.deserialize(fromHex(action.transaction.block.ledgerParameters))
          : LedgerParameters.initialParameters(),
      ];
    },
  };
}

// ---------------------------------------------------------------------------
// Wallet detection helpers — supports both 1AM and Lace via multiple strategies
// ---------------------------------------------------------------------------

export type DetectedWallet = {
  api: any; // InitialAPI
  name: string;
  type: '1am' | 'lace' | 'unknown';
  key: string;
};

/**
 * Enumerate all available wallets via window.midnight.
 * Uses Object.values (DApp Connector API UUID keys) + specific 1AM/mnLace fallbacks.
 */
export function listWallets(): DetectedWallet[] {
  if (typeof window === 'undefined') return [];
  const midnight = (window as any).midnight ?? {};
  const laceSub = (window as any).lace ?? {};
  const wallets: DetectedWallet[] = [];

  // 1) Preferred: enumerate via Object.values (generic DApp Connector API) — dmarket / react-wallet-connector skill
  //    Handles UUID-keyed wallets (Lace, 1AM, future wallets)
  try {
    const entries = Object.entries(midnight) as [string, any][];
    for (const [key, val] of entries) {
      if (val && typeof (val.connect ?? val.enable) === 'function') {
        const name: string = val.name ?? key;
        const lower = name.toLowerCase();
        const type: DetectedWallet['type'] =
          lower.includes('1am') || key === '1am' ? '1am' : lower.includes('lace') || key === 'mnLace' ? 'lace' : 'unknown';
        if (!wallets.find((w) => w.api === val)) {
          wallets.push({ api: val, name, type, key });
        }
      }
    }
  } catch {
    // ignore
  }

  // 2) Check window.lace.midnight (Midnight-ZK-Judge style: laceSub.midnight)
  try {
    const laceMidnight = laceSub?.midnight;
    if (laceMidnight && typeof laceMidnight.connect === 'function' && !wallets.find((w) => w.api === laceMidnight)) {
      wallets.push({ api: laceMidnight, name: laceMidnight.name ?? 'Lace', type: 'lace', key: 'lace' });
    }
  } catch {}

  // 3) Fallback: ensure 1AM / mnLace specifically detected even if not enumerated (kredz style)
  const w1am = midnight['1am'];
  if (w1am && !wallets.find((w) => w.api === w1am)) {
    wallets.push({ api: w1am, name: w1am.name ?? '1AM', type: '1am', key: '1am' });
  }
  const wLace = midnight.mnLace;
  if (wLace && !wallets.find((w) => w.api === wLace)) {
    wallets.push({ api: wLace, name: wLace.name ?? 'Lace', type: 'lace', key: 'mnLace' });
  }

  return wallets;
}

export function detectWalletSync(): DetectedWallet | null {
  const wallets = listWallets();
  if (wallets.length === 0) return null;
  // Prefer 1AM (dust-free) over Lace, then first available
  return wallets.find((w) => w.type === '1am') ?? wallets.find((w) => w.type === 'lace') ?? wallets[0];
}

export function detectWallet(): Promise<DetectedWallet | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      const w = detectWalletSync();
      if (w) {
        resolve(w);
        return;
      }
      if (++attempts > 60) {
        resolve(null);
        return;
      }
      setTimeout(check, 100);
    };
    check();
  });
}

/** Legacy helper: returns raw InitialAPI (like original detectWallet) */
export function getRawWallet(): any | null {
  return detectWalletSync()?.api ?? null;
}

// ---------------------------------------------------------------------------
// Session setup — fetch config, network, addresses in parallel
// ---------------------------------------------------------------------------

export async function createConnectedSession(
  api: any,
  zkAssetBasePath: string = '/contract/your-contract',
): Promise<ConnectedSession> {
  // Fetch in parallel — never await sequentially
  const [config, unshieldedAddress, shieldedAddress] = await Promise.all([
    api.getConfiguration(),
    api.getUnshieldedAddress(),
    api.getShieldedAddresses(),
  ]);

  // Must be called before any SDK operations
  setNetworkId(config.networkId);

  // ZK assets served from /contract/<name> relative to origin
  const zkConfigProvider = new FetchZkConfigProvider<any>(
    new URL(zkAssetBasePath, window.location.origin).toString(),
    window.fetch.bind(window),
  );

  // Smoke-test ZK asset reachability at startup (non-blocking)
  // Use a generic circuit name probe; failures are logged not thrown
  try {
    (zkConfigProvider as any).getZKIR?.('yourCircuit')?.then(
      (zkir: any) => console.log('[zkConfigProvider] getZKIR ok, length:', zkir?.length),
      (err: any) => console.warn('[zkConfigProvider] getZKIR probe failed (expected if assets not yet deployed):', err?.message ?? err),
    );
  } catch {
    // ignore probe errors
  }

  const provingProvider = await api.getProvingProvider(zkConfigProvider);

  // Custom wrapper — DO NOT use createProofProvider() from midnight-js-types
  const proofProvider = {
    async proveTx(unprovenTx: any, _config?: any) {
      const { CostModel } = await import('@midnight-ntwrk/ledger-v8');
      return unprovenTx.prove(provingProvider, CostModel.initialCostModel());
    },
  };

  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => shieldedAddress.shieldedCoinPublicKey,
    getEncryptionPublicKey: () => shieldedAddress.shieldedEncryptionPublicKey,
    balanceTx: async (tx: any) => {
      const txHex = toHex(tx.serialize());
      const balanced = await api.balanceUnsealedTransaction(txHex);
      if (!balanced?.tx) throw new Error('balanceUnsealedTransaction returned invalid result');
      const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
      return Transaction.deserialize('signature', 'proof', 'binding', fromHex(balanced.tx));
    },
  };

  const midnightProvider: MidnightProvider = {
    submitTx: async (tx: any) => {
      const txHex = toHex(tx.serialize());
      const result = await api.submitTransaction(txHex);
      if (typeof result === 'string' && result) return result;
      if (result?.transactionId) return result.transactionId;
      if (result?.id) return result.id;
      if (result?.txId) return result.txId;
      return txHex.slice(0, 64); // fallback pseudo-txId
    },
  };

  const publicDataProvider = createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri);

  return {
    api,
    config,
    providers: {
      privateStateProvider: createPrivateStateProvider(),
      publicDataProvider,
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    },
    unshieldedAddress: unshieldedAddress.unshieldedAddress,
    coinPublicKeyBytes: coinPublicKeyToBytesInternal(shieldedAddress.shieldedCoinPublicKey),
  };
}

// ---------------------------------------------------------------------------
// Polling helpers
// ---------------------------------------------------------------------------

export async function waitForContractDeployment(
  publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>,
  contractAddress: string,
  pollIntervalMs = 2000,
  maxAttempts = 30,
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const state = await publicDataProvider.queryContractState(contractAddress);
    if ((state as any)?.data) return;
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  throw new Error(`Contract not indexed after ${maxAttempts * pollIntervalMs}ms — check address or indexer lag`);
}

export async function waitForStateAdvance(
  publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>,
  hasAdvanced: (provider: typeof publicDataProvider) => Promise<boolean>,
  pollIntervalMs = 2000,
  maxAttempts = 30,
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    if (await hasAdvanced(publicDataProvider)) return;
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  throw new Error(`State did not advance after ${maxAttempts * pollIntervalMs}ms`);
}

export async function pollForState(
  queryUrl: string,
  contractAddress: string,
  maxAttempts = 60,
  intervalMs = 2000,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `query LATEST_CONTRACT_STATE($address: HexEncoded!) {
          contractAction(address: $address) { state }
        }`,
        variables: { address: contractAddress },
      }),
    });
    if (res.ok) {
      const payload = await res.json();
      const state = payload.data?.contractAction?.state;
      if (state) return state;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Contract state not indexed after ${(maxAttempts * intervalMs) / 1000}s`);
}

// ---------------------------------------------------------------------------
// ZK utility: compiled contract helper (generic)
// ---------------------------------------------------------------------------

export function getCompiledContract(contractName: string, contractModule: any, witnesses?: any) {
  // Dynamic import to avoid hard dep on compact-js at bundle init
  // Caller should provide compiled contract artifact
  return { contractName, contractModule, witnesses };
}
