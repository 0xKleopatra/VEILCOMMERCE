// =============================================================================
// VeilCommerce — Invoices Page
// -----------------------------------------------------------------------------
// Real, wallet-gated invoice lifecycle on the Midnight ledger:
//   deploy Invoice → acknowledge → markFinancingEligible → settle → void
// plus reading the live on-chain ledger through the indexer (queryVeilLedger).
// No mocks. Each action submits a real circuit call through the connected wallet.
// =============================================================================

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { veilManager, queryVeilLedger } from '../midnight/veilcommerce-manager';
import { toHex } from '../lib/hex';
import { getDeployedContractAddress } from '../midnight/deployments';

interface InvoiceRecord {
  invoiceId: Uint8Array;
  orderId: Uint8Array;
  issuerId: Uint8Array;
  commitment: Uint8Array;
  status: number;
  createdAt: bigint;
  dueAt: bigint;
  fundedAt?: bigint;
}

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: 'Issued', className: 'text-veil-500' },
  1: { label: 'Acknowledged', className: 'text-blue-600' },
  2: { label: 'Financing Eligible', className: 'text-amber-600' },
  3: { label: 'Financed', className: 'text-green-600' },
  4: { label: 'Settled', className: 'text-green-700' },
  5: { label: 'Voided', className: 'text-veil-400' },
};

function parseHex(input: string): Uint8Array | null {
  const hex = input.trim().replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export function Invoices() {
  const { isConnected, session, address } = useWallet();
  const [invoiceAddress, setInvoiceAddress] = useState<string | null>(() => localStorage.getItem('veil_invoice_address') || null);
  useEffect(() => { (async () => { if (!invoiceAddress) { const addr = await getDeployedContractAddress("Invoice"); if (addr) setInvoiceAddress(addr); } })(); }, [invoiceAddress]);
  const [invoiceIdHex, setInvoiceIdHex] = useState(() => localStorage.getItem('veil_invoiceId') || '');
  const [proving, setProving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [record, setRecord] = useState<InvoiceRecord | null>(null);

  const invoiceId = parseHex(invoiceIdHex);

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Invoices</h1>
          <p className="text-veil-600 mt-1">Private invoicing — issued, acknowledged, settled</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view invoices</h3>
          <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
            Invoices are fetched from the Midnight indexer after you connect. No simulated data.
          </p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
          <p className="text-[11px] font-mono text-veil-400 mt-3">{address ? address.slice(0, 12) + '…' : ''}</p>
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    if (!isConnected || !session) { setError('Connect wallet first'); return; }
    if (!invoiceId) { setError('Enter a valid 64-char invoice ID (hex)'); return; }
    setProving('deploy'); setError(null);
    try {
      const orderId = (session as any).orderIdBytes ?? new Uint8Array(32);
      const issuerId = session.coinPublicKeyBytes ?? new Uint8Array(32);
      const dueAt = BigInt(Date.now()) + 30n * 24n * 60n * 60n * 1000n;
      const timestamp = BigInt(Date.now());
      const result = await veilManager.deployAndWait('Invoice', [invoiceId, orderId, dueAt, timestamp]);
      setInvoiceAddress(result.contractAddress);
      localStorage.setItem('veil_invoice_address', result.contractAddress);
      localStorage.setItem('veil_invoiceId', toHex(invoiceId));
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const requireLive = (): string | null => {
    if (!invoiceAddress) return 'Deploy an Invoice first — need contract address';
    if (!invoiceId) return 'Enter a valid invoice ID';
    return null;
  };

  const handleAcknowledge = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('acknowledge'); setError(null);
    try { await veilManager.call('Invoice', invoiceAddress, 'acknowledge', [invoiceId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleMarkFinancingEligible = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('markFinancingEligible'); setError(null);
    try { await veilManager.call('Invoice', invoiceAddress, 'markFinancingEligible', [invoiceId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleSettle = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('settle'); setError(null);
    try { await veilManager.call('Invoice', invoiceAddress, 'settle', [invoiceId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleVoidInvoice = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('voidInvoice'); setError(null);
    try { await veilManager.call('Invoice', invoiceAddress, 'voidInvoice', [invoiceId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleLoadLedger = async () => {
    if (!invoiceAddress) return setError('Deploy an Invoice first');
    setProving('load'); setError(null);
    try {
      const parsed = await queryVeilLedger('Invoice', invoiceAddress);
      setLedger(parsed);
      if (invoiceId && parsed && typeof (parsed as any).invoices?.get === 'function') {
        try { setRecord((parsed as any).invoices.get(invoiceId) ?? null); }
        catch { setRecord(null); }
      }
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const statusMeta = record && typeof record.status === 'number' ? STATUS_LABELS[record.status] ?? { label: `Status ${record.status}`, className: 'text-veil-500' } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Invoices</h1>
          <p className="text-veil-600 mt-1">Private invoicing — issued, acknowledged, settled</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Wallet: {address?.slice(0, 12)}… • {session.config?.networkId}</p>
        </div>
        <Link to="/trade" className="btn-primary">+ New Invoice</Link>
      </div>

      {error && <div className="card p-4 bg-red-50 border-red-200 text-sm text-red-700">{error}</div>}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Deploy New Invoice</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Invoice ID (hex, 64 chars)</label>
            <input value={invoiceIdHex} onChange={(e) => setInvoiceIdHex(e.target.value)} placeholder="64 hex chars" className="input" />
          </div>
          <button onClick={handleDeploy} className="btn-primary" disabled={!!proving}>
            {proving === 'deploy' ? 'Deploying Invoice…' : 'Deploy Invoice'}
          </button>
          <p className="text-[11px] font-mono text-veil-500">Uses <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait('Invoice', [invoiceId, orderId, dueAt, timestamp])</code></p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Manage Invoice</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Contract Address</label>
            <input value={invoiceAddress ?? ''} onChange={(e) => setInvoiceAddress(e.target.value.trim() || null)} placeholder="veil-… contract address" className="input font-mono" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAcknowledge} className="btn-primary" disabled={!!proving}>{proving === 'acknowledge' ? 'Acknowledging…' : 'Acknowledge'}</button>
            <button onClick={handleMarkFinancingEligible} className="btn-primary" disabled={!!proving}>{proving === 'markFinancingEligible' ? 'Marking…' : 'Mark Financing Eligible'}</button>
            <button onClick={handleSettle} className="btn-primary" disabled={!!proving}>{proving === 'settle' ? 'Settling…' : 'Settle'}</button>
            <button onClick={handleVoidInvoice} className="btn-secondary" disabled={!!proving}>{proving === 'voidInvoice' ? 'Voiding…' : 'Void Invoice'}</button>
            <button onClick={handleLoadLedger} className="btn-secondary" disabled={!!proving}>{proving === 'load' ? 'Loading…' : 'Read On-chain Ledger'}</button>
          </div>
        </div>
      </div>

      {invoiceAddress && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-veil-700">Ledger</p>
            <span className="text-[10px] font-mono text-veil-400">Invoice • {invoiceAddress.slice(0, 14)}…</span>
          </div>
          {record ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${statusMeta?.className.includes('green') ? 'bg-green-500' : statusMeta?.className.includes('amber') ? 'bg-amber-500' : statusMeta?.className.includes('blue') ? 'bg-blue-500' : 'bg-veil-300'}`} />
                <span className={`font-medium ${statusMeta?.className}`}>{statusMeta?.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-veil-500 uppercase">Issuer</p><p className="font-mono text-veil-800 break-all">{record.issuerId ? toHex(record.issuerId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Order Id</p><p className="font-mono text-veil-800 break-all">{record.orderId ? toHex(record.orderId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Invoice Id</p><p className="font-mono text-veil-800 break-all">{record.invoiceId ? toHex(record.invoiceId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Due At</p><p className="font-medium text-veil-900">{record.dueAt != null ? record.dueAt.toString() : '—'}</p></div>
              </div>
            </div>
          ) : ledger ? (
            <p className="text-[11px] font-mono text-veil-500 break-all">{JSON.stringify(ledger, (_k, v) => (v instanceof Uint8Array ? toHex(v).slice(0, 16) + '…' : typeof v === 'bigint' ? v.toString() : v)).slice(0, 600)}</p>
          ) : (
            <p className="text-[11px] font-mono text-veil-400">No contract state read yet — click "Read On-chain Ledger" after deploy.</p>
          )}
        </div>
      )}
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
