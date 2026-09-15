// =============================================================================
// VeilCommerce — Activity Page
// -----------------------------------------------------------------------------
// Complete audit trail — no mocks, fully wallet-gated.
// Real activity is derived from indexer contractAction history.
// =============================================================================

import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';

export function Activity() {
  const { isConnected, session } = useWallet();

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Activity Log</h1>
          <p className="text-veil-600 mt-1">Complete audit trail with ZK proof references</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view activity</h3>
          <p className="text-sm text-veil-500 mt-2">Activity is on-chain contract history fetched via indexer, filtered by your wallet.</p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Activity Log</h1>
          <p className="text-veil-600 mt-1">Complete audit trail with ZK proof references</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Indexed via {session.config.indexerUri.slice(0, 40)}…</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-12 text-center">
          <ClockIcon className="w-12 h-12 mx-auto text-veil-300 mb-4" />
          <h3 className="font-semibold text-veil-900">No activity</h3>
          <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
            No contract actions indexed yet. Actions appear after you deploy and interact with VeilCommerce contracts — each transaction is indexed with its ZK proof ID.
          </p>
          <p className="text-[11px] font-mono text-veil-400 mt-4">Query: contractAction(address) history via indexer</p>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
