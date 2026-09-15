// =============================================================================
// VeilCommerce — WalletConnect Component (1AM + Lace)
// -----------------------------------------------------------------------------
// Unified wallet connection UI covering all states per 1am-wallet skill:
//  - checking (polling for injection)
//  - not-found (no extension)
//  - disconnected (CTA + picker when multiple wallets)
//  - connected (address + walletType + disconnect)
// Supports both DApp Connector API wallets via Object.values enumeration
// =============================================================================

import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import type { DetectedWallet } from '../lib/midnight';

// Icons — inline SVGs to avoid extra deps
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}
function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function truncateAddress(addr: string, len = 10) {
  if (!addr) return '—';
  if (addr.length <= 20) return addr;
  return `${addr.slice(0, len)}…${addr.slice(-6)}`;
}

// ---------------------------------------------------------------------------
// WalletPicker — shown when multiple wallets detected & not yet connected
// ---------------------------------------------------------------------------

function WalletPicker({ wallets, onSelect, isConnecting }: { wallets: DetectedWallet[]; onSelect: (w: DetectedWallet) => void; isConnecting: boolean }) {
  if (wallets.length === 0) return null;
  if (wallets.length === 1) return null; // single wallet → use main CTA

  return (
    <div className="border border-veil-200 rounded-lg bg-white p-3 space-y-2">
      <p className="text-[10px] font-mono tracking-widest uppercase text-veil-500">Select Wallet</p>
      <div className="grid gap-2">
        {wallets.map((wallet) => (
          <button
            key={wallet.key + wallet.name}
            type="button"
            onClick={() => onSelect(wallet)}
            disabled={isConnecting}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-veil-200 hover:border-veil-900 hover:bg-veil-50 text-left transition-colors disabled:opacity-40"
          >
            {wallet.type === '1am' ? (
              <ShieldIcon className="w-5 h-5 text-violet-600 flex-shrink-0" />
            ) : wallet.type === 'lace' ? (
              <SmartphoneIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <WalletIcon className="w-5 h-5 text-veil-600 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-veil-900 truncate">{wallet.name}</p>
              <p className="text-[10px] font-mono text-veil-500 uppercase tracking-widest">
                {wallet.type === '1am' ? '1AM • Dust-free' : wallet.type === 'lace' ? 'Lace • DApp Connector' : 'Midnight Wallet'}
              </p>
            </div>
            <span className="text-xs text-veil-400">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WalletConnect — main component covering all four states
// ---------------------------------------------------------------------------

export default function WalletConnect({ compact = false, network = 'preprod' }: { compact?: boolean; network?: string }) {
  const { isConnected, address, walletType, walletName, walletStatus, isConnecting, connect, connectWallet, disconnect, detectedWallets, error } =
    useWallet();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleConnect = async (wallet?: DetectedWallet) => {
    setLocalError(null);
    try {
      if (wallet) {
        console.log('[WalletConnect] user selected wallet:', wallet.name, wallet.type);
        await connectWallet(wallet, network);
      } else {
        // Compact header: always direct-connect to preferred wallet (no picker) to guarantee popup triggers
        if (compact && detectedWallets.length > 1) {
          console.log('[WalletConnect] compact mode — direct connect to preferred');
          await connect(network);
        } else if (detectedWallets.length > 1 && !pickerOpen) {
          console.log('[WalletConnect] multiple wallets — opening picker');
          setPickerOpen(true);
          return;
        } else {
          console.log('[WalletConnect] single wallet connect triggered');
          await connect(network);
        }
      }
      setPickerOpen(false);
    } catch (e: any) {
      console.error('[WalletConnect] connect failed:', e);
      setLocalError(e?.message ?? 'Connection failed');
    }
  };

  // State 1: checking (injection poll)
  if (walletStatus === 'checking') {
    return (
      <span className="flex items-center gap-2 text-veil-500 text-[11px] font-mono animate-pulse px-3 py-1.5">
        <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
        Checking wallet...
      </span>
    );
  }

  // State 2: connected — show address + walletType + disconnect
  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'px-2 py-1' : 'border border-veil-200 bg-white px-3 py-2 rounded-lg shadow-sm'}`}>
        {walletType === 'lace' ? (
          <SmartphoneIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
        ) : walletType === '1am' ? (
          <ShieldIcon className="w-4 h-4 text-violet-600 flex-shrink-0" />
        ) : (
          <WalletIcon className="w-4 h-4 text-veil-600 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <span className="text-[9px] tracking-[0.15em] font-mono text-veil-500 uppercase block">
            {walletName ?? (walletType === '1am' ? '1AM' : walletType === 'lace' ? 'Lace' : 'Wallet')} • {compact ? '' : 'Connected'}
          </span>
          <span
            className={`font-mono text-veil-900 truncate block ${compact ? 'text-xs max-w-[110px]' : 'text-sm max-w-[150px]'}`}
            title={address}
          >
            {compact ? truncateAddress(address) : truncateAddress(address, 12)}
          </span>
        </div>
        <button
          onClick={disconnect}
          title="Disconnect"
          className="ml-1 p-1.5 rounded-lg text-veil-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Disconnect wallet"
        >
          <LogoutIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // State 3 & 4: disconnected (CTA + picker or not-found hint)
  return (
    <div className="flex flex-col gap-2">
      {detectedWallets.length > 1 && pickerOpen ? (
        <WalletPicker wallets={detectedWallets} onSelect={handleConnect} isConnecting={isConnecting} />
      ) : (
        <button
          onClick={() => handleConnect()}
          disabled={isConnecting}
          className={`flex items-center justify-center gap-2 bg-veil-900 hover:bg-black text-white font-medium rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            compact ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'
          }`}
          aria-busy={isConnecting}
        >
          {isConnecting ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <WalletIcon className="w-4 h-4" />}
          {isConnecting ? 'Connecting...' : detectedWallets.length > 1 ? 'Connect Wallet' : 'Connect Wallet'}
        </button>
      )}

      {/* Helper text */}
      {walletStatus === 'not-found' && !isConnecting ? (
        <p className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          No wallet detected. Install{' '}
          <a href="https://midnight.network" target="_blank" rel="noopener noreferrer" className="underline">
            1AM
          </a>{' '}
          or Lace extension then refresh.
        </p>
      ) : detectedWallets.length > 0 && !pickerOpen ? (
        <p className="text-[10px] font-mono text-veil-500">
          {detectedWallets.length} wallet{detectedWallets.length > 1 ? 's' : ''} detected:{' '}
          {detectedWallets.map((w) => w.name).join(', ')}
          {detectedWallets.length > 1 && (
            <button onClick={() => setPickerOpen(true)} className="ml-2 text-veil-900 underline hover:text-black">
              Choose
            </button>
          )}
        </p>
      ) : pickerOpen ? (
        <button onClick={() => setPickerOpen(false)} className="text-[10px] font-mono text-veil-500 hover:text-veil-900 text-left">
          ← Back to single connect
        </button>
      ) : null}

      {(error ?? localError) && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 max-w-[320px]">{error ?? localError}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WalletCard — presentation per react-wallet-connector skill (optional standalone)
// ---------------------------------------------------------------------------

export function WalletCard({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}: {
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="card p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-veil-900">Connection Status</h3>
        <div className={`mt-1 inline-flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-800' : 'bg-veil-100 text-veil-600'}`}>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-veil-400'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div>
        {isConnected && walletAddress ? (
          <>
            <p className="text-xs text-veil-500">Wallet Address:</p>
            <p className="font-mono text-sm text-veil-900 break-all" title={walletAddress}>
              {walletAddress}
            </p>
          </>
        ) : (
          <p className="text-sm text-veil-600">Please connect your wallet to proceed.</p>
        )}
      </div>
      <div>
        {isConnected ? (
          <button onClick={onDisconnect} className="btn-secondary w-full">
            Disconnect Wallet
          </button>
        ) : (
          <button onClick={onConnect} className="btn-primary w-full">
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
