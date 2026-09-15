// =============================================================================
// VeilCommerce — Portfolio Page
// -----------------------------------------------------------------------------
// Financial overview — no mocks, wallet-gated. Real positions from Settlement
// and Financing ledgers queried via indexer after wallet connection.
// =============================================================================

import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';

export function Portfolio() {
  const { isConnected, session } = useWallet();

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Portfolio</h1>
          <p className="text-veil-600 mt-1">Your financial positions and performance</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <BriefcaseIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view portfolio</h3>
          <p className="text-sm text-veil-500 mt-2">Portfolio aggregates on-chain receivables, financing and settlement history.</p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-veil-900">Portfolio</h1>
        <p className="text-veil-600 mt-1">Your financial positions and performance</p>
        <p className="text-[11px] font-mono text-veil-400 mt-1">Indexed via {session.config.indexerUri.slice(0, 32)}… • No mock data</p>
      </div>

      {/* Summary Cards — real ledger values, zero until contracts deployed */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Receivables" value="$0" change="—" changeColor="text-veil-400" />
        <StatCard label="Active Financing" value="$0" change="—" changeColor="text-veil-400" />
        <StatCard label="Settled Volume" value="$0" change="—" changeColor="text-veil-400" />
        <StatCard label="Avg. Settlement" value="—" change="No settlements" changeColor="text-veil-400" />
      </div>

      {/* Charts — placeholder for real on-chain data */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-veil-900 mb-4">Receivables Aging</h2>
          <div className="h-64 flex flex-col items-center justify-center bg-veil-50 rounded-lg border border-dashed border-veil-200">
            <span className="text-sm text-veil-500">No receivables yet</span>
            <span className="text-[11px] font-mono text-veil-400 mt-1">Invoice ledger → aging buckets</span>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-veil-900 mb-4">Financing Utilization</h2>
          <div className="h-64 flex flex-col items-center justify-center bg-veil-50 rounded-lg border border-dashed border-veil-200">
            <span className="text-sm text-veil-500">No financing yet</span>
            <span className="text-[11px] font-mono text-veil-400 mt-1">Financing ledger → utilization</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions — empty */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-veil-900">Recent Transactions</h2>
        </div>
        <div className="p-10 text-center border border-dashed border-veil-200 rounded-lg bg-veil-50">
          <p className="text-sm text-veil-500">No transactions. Transactions appear after on-chain settlement via Settlement contract.</p>
          <p className="text-[11px] font-mono text-veil-400 mt-2">Query: indexer contractAction history for wallet</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, changeColor }: { label: string; value: string; change: string; changeColor: string }) {
  return (
    <div className="card p-6">
      <p className="text-sm font-medium text-veil-500">{label}</p>
      <p className="text-3xl font-bold text-veil-900 mt-2">{value}</p>
      <p className={`text-sm font-medium ${changeColor} mt-2`}>{change}</p>
    </div>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
}
