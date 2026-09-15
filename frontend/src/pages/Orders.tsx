// =============================================================================
// VeilCommerce — Orders Page
// -----------------------------------------------------------------------------
// List and manage purchase orders — no mocks, fully wallet-gated.
// Real orders are PurchaseOrder contracts queried via indexer.
// =============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { useVeilQuery, useStoredAddresses } from '../hooks/useVeilLedger';

type Filter = 'all' | 'awaiting' | 'confirmed' | 'funded' | 'shipped' | 'delivered' | 'settled';

export function Orders() {
  const { isConnected, session } = useWallet();
  const [filter, setFilter] = useState<Filter>('all');
  const addrs = useStoredAddresses();
  const poQuery = useVeilQuery(addrs.purchaseOrder ? 'PurchaseOrder' : null, addrs.purchaseOrder);

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Purchase Orders</h1>
          <p className="text-veil-600 mt-1">Manage your trade orders end-to-end</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <DocumentIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view orders</h3>
          <p className="text-sm text-veil-500 mt-2">Orders are on-chain PurchaseOrder contracts fetched via the patched indexer.</p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Purchase Orders</h1>
          <p className="text-veil-600 mt-1">Manage your trade orders end-to-end</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Network: {session.config.networkId} • Indexed via {session.config.indexerUri.slice(0, 32)}…</p>
        </div>
        <Link to="/trade" className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Order
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'awaiting', 'confirmed', 'funded', 'shipped', 'delivered', 'settled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-veil-900 text-white' : 'bg-veil-100 text-veil-600 hover:bg-veil-200'}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Real ledger query — like privoice checkpoint.ts + kredz dashboard */}
      <div className="card overflow-hidden">
        {poQuery.loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-veil-300 border-t-veil-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-veil-500">Querying PurchaseOrder ledger via patched indexer…</p>
            <p className="text-[11px] font-mono text-veil-400 mt-2">{addrs.purchaseOrder?.slice(0, 20)}…</p>
          </div>
        ) : poQuery.error ? (
          <div className="p-8 bg-red-50 border border-red-200 text-sm text-red-700">{poQuery.error}</div>
        ) : poQuery.data ? (
          <div className="p-6">
            <h3 className="font-semibold text-veil-900">On-chain PurchaseOrder</h3>
            <p className="text-[11px] font-mono text-veil-500 mt-1">Address: {addrs.purchaseOrder?.slice(0, 24)}…</p>
            <pre className="bg-veil-900 text-veil-100 p-3 rounded mt-3 text-xs overflow-auto max-h-48">{JSON.stringify(poQuery.data, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2)}</pre>
            <p className="text-[11px] font-mono text-veil-400 mt-2">Filter: {filter} • Ledger: totalOrders / orders Map</p>
          </div>
        ) : (
          <div className="p-12 text-center">
            <DocumentIcon className="w-12 h-12 mx-auto text-veil-300 mb-4" />
            <h3 className="font-semibold text-veil-900">No orders</h3>
            <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
              No PurchaseOrder contracts found for this wallet. Create a purchase order via <code className="bg-veil-100 px-1 rounded">PurchaseOrder</code> Compact contract.
              {filter !== 'all' && ` Filter: ${filter}.`}
            </p>
            <Link to="/trade" className="btn-primary mt-6">Create Purchase Order</Link>
            <p className="text-[11px] font-mono text-veil-400 mt-4">Query: publicDataProvider.queryContractState(address) → ledger(state.data) — Indexed via {session.config.indexerUri.slice(0, 30)}…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
function DocumentIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
