// =============================================================================
// VeilCommerce — Wallet Selection Helpers (DApp Connector API)
// -----------------------------------------------------------------------------
// Implements react-wallet-connector skill: enumerate via Object.values(window.midnight)
// Supports both generic enumeration and specific 1AM / Lace fallbacks
// =============================================================================

import type { InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { listWallets as listDetected, type DetectedWallet } from './midnight';

// Re-export DetectedWallet helpers
export type { DetectedWallet } from './midnight';

/**
 * List wallets as raw InitialAPI array (react-wallet-connector spec)
 * Uses Object.values(window.midnight) — never hardcode wallet keys.
 */
export const listWallets = (): InitialAPI[] => {
  // Prefer canonical enumeration from midnight.ts (handles both 1AM + Lace + generic UUID keys)
  const detected = listDetected();
  if (detected.length > 0) return detected.map((d) => d.api as InitialAPI);

  // Fallback raw enumeration for wallet extensions not yet captured
  const injected = (window as any).midnight;
  if (!injected) return [];
  return Object.values(injected).filter((w: any) => w && typeof w.connect === 'function') as InitialAPI[];
};

/**
 * List wallets as DetectedWallet with metadata (type, name, key)
 * Recommended for UI pickers needing walletType distinction (1AM vs Lace)
 */
export const listWalletsWithMeta = (): DetectedWallet[] => listDetected();

/**
 * Select first available wallet or throw (react-wallet-connector spec)
 */
export const selectWallet = (): InitialAPI => {
  const wallets = listWallets();
  if (wallets.length === 0) {
    throw new Error('No Midnight wallet found. Please install a Midnight wallet extension.');
  }
  return wallets[0];
};

/**
 * Select wallet with metadata — prefers 1AM (dust-free) over Lace
 */
export const selectPreferredWallet = (): DetectedWallet => {
  const wallets = listDetected();
  if (wallets.length === 0) {
    throw new Error('No Midnight wallet found. Please install 1AM or Lace wallet extension.');
  }
  return wallets.find((w) => w.type === '1am') ?? wallets.find((w) => w.type === 'lace') ?? wallets[0];
};

/**
 * Get wallet by name
 */
export const getWalletByName = (name: string): InitialAPI | null => {
  const wallets = listWallets();
  return wallets.find((w: any) => w.name === name) ?? null;
};
