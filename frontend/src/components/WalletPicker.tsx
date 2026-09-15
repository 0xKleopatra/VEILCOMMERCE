// =============================================================================
// VeilCommerce — WalletPicker (Multi-Wallet)
// -----------------------------------------------------------------------------
// When listWallets() returns >1 entry, let user choose. Displays wallet name
// safely as text only (no dangerouslySetInnerHTML).
// =============================================================================

import type { DetectedWallet } from '../lib/midnight';

type Props = {
  wallets: DetectedWallet[];
  onSelect: (wallet: DetectedWallet) => void;
  onClose?: () => void;
};

export function WalletPicker({ wallets, onSelect, onClose }: Props) {
  if (wallets.length === 0) {
    return <p className="text-sm text-veil-600">No Midnight wallet found. Install a wallet extension and refresh.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-veil-900">Choose Wallet</h3>
        {onClose && (
          <button onClick={onClose} className="text-xs text-veil-500 hover:text-veil-900">
            Cancel
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {wallets.map((wallet) => (
          <li key={wallet.key + wallet.name}>
            <button type="button" onClick={() => onSelect(wallet)} className="w-full flex items-center gap-3 px-4 py-3 border border-veil-200 rounded-lg hover:border-veil-900 hover:bg-veil-50 transition-colors text-left">
              <span className="w-8 h-8 rounded-lg bg-veil-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{wallet.name.slice(0, 2).toUpperCase()}</span>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-veil-900 truncate">{wallet.name}</p>
                <p className="text-xs text-veil-500">{wallet.type === '1am' ? 'Dust-free • 1AM' : wallet.type === 'lace' ? 'Lace • DApp Connector' : 'Midnight Wallet'}</p>
              </div>
              <span className="text-veil-400">→</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="text-[10px] font-mono text-veil-500">
        Both 1AM (dust-free) and Lace are supported. 1AM sponsors fees via ProofStation — you pay 0 NIGHT. Lace uses standard DApp Connector flow.
      </p>
    </div>
  );
}

export default WalletPicker;
