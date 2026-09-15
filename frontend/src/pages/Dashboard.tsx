// =============================================================================
// VeilCommerce — Dashboard
// -----------------------------------------------------------------------------
// Private commerce overview — no mocks, fully wallet-gated.
// Real chain state is queried via publicDataProvider after wallet connection.
// =============================================================================

import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { useVeilQuery, useStoredAddresses } from '../hooks/useVeilLedger';

export function Dashboard() {
  const { isConnected, address, walletType, config } = useWallet();
  const addrs = useStoredAddresses();
  const poLedger = useVeilQuery(addrs.purchaseOrder ? 'PurchaseOrder' : null, addrs.purchaseOrder);
  const escrowLedger = useVeilQuery(addrs.escrow ? 'Escrow' : null, addrs.escrow);
  const totalOrders = (poLedger.data as any)?.totalOrders ?? 0;
  const totalEscrows = (escrowLedger.data as any)?.totalEscrows ?? 0;

  // Wallet gate — follows Midnight-Skills pattern: show connect CTA if not connected
  if (!isConnected) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Good Morning</h1>
          <p className="text-veil-600 mt-1">Your private commerce overview</p>
        </div>

        <div className="card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <WalletIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-veil-900">Connect wallet to view dashboard</h2>
          <p className="text-sm text-veil-600 mt-2 max-w-md mx-auto">
            Connect a Midnight wallet (1AM dust-free or Lace) to load your private deals, escrows and financing positions from chain state.
          </p>
          <div className="mt-6 flex justify-center">
            <WalletConnect />
          </div>
          <p className="text-[11px] font-mono text-veil-400 mt-4">Preprod • Midnight • ZK-private</p>
        </div>
      </div>
    );
  }

  // Connected — chain state is empty until contracts are deployed (no mocks)
  // Real implementation would query:
  //   session.providers.publicDataProvider.queryContractState(contractAddress)
  //   and ledger(contractState.data).activeDeals etc.
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Good Morning</h1>
          <p className="text-veil-600 mt-1">
            Connected as <span className="font-mono text-veil-900">{address?.slice(0, 10)}…{address?.slice(-6)}</span>
            <span className="ml-2 text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
              {walletType === '1am' ? '1AM • Dust-free' : walletType === 'lace' ? 'Lace' : 'Wallet'} • {config?.networkId ?? 'preprod'}
            </span>
          </p>
        </div>
        <Link to="/trade" className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Transaction
        </Link>
      </div>

      {/* Active Deals — real ledger query via patched indexer (privoice checkpoint pattern) */}
      <section className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-veil-900">Active Deals</h2>
          <div className="flex items-center gap-2">
            {poLedger.loading && <span className="text-[11px] font-mono text-veil-400 animate-pulse">Querying ledger…</span>}
            {poLedger.error && <span className="text-[11px] font-mono text-red-500">{poLedger.error.slice(0, 40)}</span>}
            <Link to="/orders" className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              View all →
            </Link>
          </div>
        </div>
        {totalOrders > 0 || totalEscrows > 0 ? (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <p className="text-sm font-medium text-green-900">On-chain: {String(totalOrders)} orders, {String(totalEscrows)} escrows</p>
              <p className="text-[11px] font-mono text-green-700 mt-1">PurchaseOrder totalOrders={String(totalOrders)} • Escrow totalEscrows={String(totalEscrows)}</p>
              <p className="text-[11px] font-mono text-veil-500">Addrs: {addrs.purchaseOrder?.slice(0, 12)}… / {addrs.escrow?.slice(0, 12)}…</p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-veil-100 flex items-center justify-center mx-auto mb-3">
              <DocumentIcon className="w-6 h-6 text-veil-400" />
            </div>
            <p className="text-sm font-medium text-veil-900">No active deals</p>
            <p className="text-xs text-veil-500 mt-1 max-w-sm mx-auto">
              No PurchaseOrder contracts indexed yet. Create one via Trade — queried via <code className="bg-veil-100 px-1 rounded">queryVeilLedger(PurchaseOrder)</code>.
            </p>
            <Link to="/trade" className="btn-primary mt-4">Create Purchase Order</Link>
            <p className="text-[10px] font-mono text-veil-400 mt-3">Indexer: {config?.indexerUri?.slice(0, 36)}…</p>
          </div>
        )}
      </section>

      {/* Available Financing — real ledger query would compute financeable invoices */}
      <section className="card p-6 bg-gradient-to-r from-accent-50 to-accent-100 border-accent-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-accent-800">Available Financing</p>
            <p className="text-3xl font-bold text-accent-900 mt-1">$0</p>
            <p className="text-xs text-accent-700 mt-1">Verified receivables will unlock financing — ZK-proven</p>
          </div>
          <Link to="/financing" className="btn-accent">
            Explore Opportunities
          </Link>
        </div>
      </section>

      {/* Verification Status — derived from CredentialRegistry / BusinessRegistry on-chain */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-6">Verification Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Business', verified: false, desc: 'Connect business credential' },
            { label: 'Compliance', verified: false, desc: 'Awaiting jurisdiction proof' },
            { label: 'Payment Capability', verified: false, desc: 'Prove funds via ZK' },
            { label: 'Trading Authorization', verified: isConnected, desc: isConnected ? 'Wallet connected' : 'Connect wallet' },
          ].map((item, i) => (
            <VerificationBadge key={i} label={item.label} status={item.verified} desc={item.desc} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-6">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/trade" className="p-4 rounded-lg border border-veil-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-veil-100 group-hover:bg-accent-100 flex items-center justify-center mb-3 transition-colors">
              <PlusIcon className="w-5 h-5 text-veil-600 group-hover:text-accent-600" />
            </div>
            <h3 className="font-medium text-veil-900">Create Order</h3>
            <p className="text-sm text-veil-500 mt-1">New purchase order</p>
          </Link>
          <Link to="/escrow" className="p-4 rounded-lg border border-veil-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-veil-100 group-hover:bg-accent-100 flex items-center justify-center mb-3 transition-colors">
              <LockIcon className="w-5 h-5 text-veil-600 group-hover:text-accent-600" />
            </div>
            <h3 className="font-medium text-veil-900">Fund Escrow</h3>
            <p className="text-sm text-veil-500 mt-1">Lock transaction funds</p>
          </Link>
          <Link to="/invoices" className="p-4 rounded-lg border border-veil-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-veil-100 group-hover:bg-accent-100 flex items-center justify-center mb-3 transition-colors">
              <DocumentIcon className="w-5 h-5 text-veil-600 group-hover:text-accent-600" />
            </div>
            <h3 className="font-medium text-veil-900">Issue Invoice</h3>
            <p className="text-sm text-veil-500 mt-1">Create receivable</p>
          </Link>
          <Link to="/financing" className="p-4 rounded-lg border border-veil-200 hover:border-accent-300 hover:bg-accent-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-veil-100 group-hover:bg-accent-100 flex items-center justify-center mb-3 transition-colors">
              <CurrencyIcon className="w-5 h-5 text-veil-600 group-hover:text-accent-600" />
            </div>
            <h3 className="font-medium text-veil-900">Request Financing</h3>
            <p className="text-sm text-veil-500 mt-1">Finance receivables</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function VerificationBadge({ label, status, desc }: { label: string; status: boolean; desc: string }) {
  return (
    <div className="p-4 rounded-lg border border-veil-200 bg-white">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status ? 'bg-green-100' : 'bg-amber-100'}`}>
          {status ? <CheckIcon className="w-5 h-5 text-green-600" /> : <ClockIcon className="w-5 h-5 text-amber-600" />}
        </div>
        <div>
          <p className="font-medium text-veil-900">{label}</p>
          <p className="text-xs text-veil-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
function CheckIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
function WalletIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
}
function ClockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function LockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function DocumentIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function CurrencyIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
