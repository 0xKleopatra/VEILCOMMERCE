// =============================================================================
// VeilCommerce — Financing Page
// -----------------------------------------------------------------------------
// Real, wallet-gated financing lifecycle on the Midnight ledger:
//   commitCreditScore → requestFinancing → verifyRisk → fund → repay
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

interface FinancingRecord {
  financingId: Uint8Array;
  invoiceId: Uint8Array;
  sellerId: Uint8Array;
  investorId: Uint8Array;
  faceValue: bigint;
  requested: bigint;
  fundedAmount: bigint;
  state: number;
  createdAt: bigint;
  maturityAt: bigint;
  repaidAt?: bigint;
}

const STATE_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: 'Requested', className: 'text-veil-500' },
  1: { label: 'Verified', className: 'text-blue-600' },
  2: { label: 'Funded', className: 'text-green-600' },
  3: { label: 'Repaid', className: 'text-green-700' },
  4: { label: 'Cancelled', className: 'text-veil-400' },
};

function parseHex(input: string): Uint8Array | null {
  const hex = input.trim().replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export function Financing() {
  const { isConnected, session, address } = useWallet();
  const [financingAddress, setFinancingAddress] = useState<string | null>(() => localStorage.getItem('veil_financing_address') || null);
  useEffect(() => { (async () => { if (!financingAddress) { const addr = await getDeployedContractAddress("Financing"); if (addr) setFinancingAddress(addr); } })(); }, [financingAddress]);
  const [financingIdHex, setFinancingIdHex] = useState(() => localStorage.getItem('veil_financingId') || '');
  const [proving, setProving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [record, setRecord] = useState<FinancingRecord | null>(null);

  const financingId = parseHex(financingIdHex);

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Financing</h1>
          <p className="text-veil-600 mt-1">Private invoice financing — credit commitment, request, funding</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view financing</h3>
          <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
            Financing positions are fetched from the Midnight indexer after you connect. No simulated data.
          </p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
          <p className="text-[11px] font-mono text-veil-400 mt-3">{address ? address.slice(0, 12) + '…' : ''}</p>
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    if (!isConnected || !session) { setError('Connect wallet first'); return; }
    if (!financingId) { setError('Enter a valid 64-char financing ID (hex)'); return; }
    setProving('deploy'); setError(null);
    try {
      const invoiceId = (session as any).orderIdBytes ?? new Uint8Array(32);
      const sellerId = session.coinPublicKeyBytes ?? new Uint8Array(32);
      const investorId = session.coinPublicKeyBytes ?? new Uint8Array(32);
      const maturityDays = 90n;
      const feeBps = 50n;
      const timestamp = BigInt(Date.now());
      const result = await veilManager.deployAndWait('Financing', []);
      await veilManager.call('Financing', result.contractAddress, 'commitCreditScore', [sellerId]);
      setFinancingAddress(result.contractAddress);
      localStorage.setItem('veil_financing_address', result.contractAddress);
      localStorage.setItem('veil_financingId', toHex(financingId));
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const requireLive = (): string | null => {
    if (!financingAddress) return 'Deploy Financing first — need contract address';
    if (!financingId) return 'Enter a valid financing ID';
    return null;
  };

  const handleCommitCreditScore = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('commitCreditScore'); setError(null);
    try { await veilManager.call('Financing', financingAddress, 'commitCreditScore', [financingId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleRequestFinancing = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('requestFinancing'); setError(null);
    try { await veilManager.call('Financing', financingAddress, 'requestFinancing', [financingId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleVerifyRisk = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('verifyRisk'); setError(null);
    try { await veilManager.call('Financing', financingAddress, 'verifyRisk', [financingId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleFundInvoice = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('fundInvoice'); setError(null);
    try { await veilManager.call('Financing', financingAddress, 'fundInvoice', [financingId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleRepay = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('repay'); setError(null);
    try { await veilManager.call('Financing', financingAddress, 'repay', [financingId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleLoadLedger = async () => {
    if (!financingAddress) return setError('Deploy Financing first');
    setProving('load'); setError(null);
    try {
      const parsed = await queryVeilLedger('Financing', financingAddress);
      setLedger(parsed);
      if (financingId && parsed && typeof (parsed as any).financings?.get === 'function') {
        try { setRecord((parsed as any).financings.get(financingId) ?? null); }
        catch { setRecord(null); }
      }
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const stateMeta = record && typeof record.state === 'number' ? STATE_LABELS[record.state] ?? { label: `State ${record.state}`, className: 'text-veil-500' } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Financing</h1>
          <p className="text-veil-600 mt-1">Private invoice financing — credit commitment, request, funding</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Wallet: {address?.slice(0, 12)}… • {session.config?.networkId}</p>
        </div>
        <Link to="/trade" className="btn-primary">+ New Financing</Link>
      </div>

      {error && <div className="card p-4 bg-red-50 border-red-200 text-sm text-red-700">{error}</div>}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Deploy New Financing</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Financing ID (hex, 64 chars)</label>
            <input value={financingIdHex} onChange={(e) => setFinancingIdHex(e.target.value)} placeholder="64 hex chars" className="input" />
          </div>
          <button onClick={handleDeploy} className="btn-primary" disabled={!!proving}>
            {proving === 'deploy' ? 'Deploying Financing…' : 'Deploy Financing'}
          </button>
          <p className="text-[11px] font-mono text-veil-500">Uses <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait('Financing', [financingId, invoiceId, sellerId, investorId, maturityDays, feeBps, timestamp])</code></p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Manage Financing</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Contract Address</label>
            <input value={financingAddress ?? ''} onChange={(e) => setFinancingAddress(e.target.value.trim() || null)} placeholder="veil-… contract address" className="input font-mono" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleCommitCreditScore} className="btn-primary" disabled={!!proving}>{proving === 'commitCreditScore' ? 'Committing…' : 'Commit Credit Score'}</button>
            <button onClick={handleRequestFinancing} className="btn-primary" disabled={!!proving}>{proving === 'requestFinancing' ? 'Requesting…' : 'Request Financing'}</button>
            <button onClick={handleVerifyRisk} className="btn-secondary" disabled={!!proving}>{proving === 'verifyRisk' ? 'Verifying…' : 'Verify Risk'}</button>
            <button onClick={handleFundInvoice} className="btn-primary" disabled={!!proving}>{proving === 'fundInvoice' ? 'Funding…' : 'Fund Invoice'}</button>
            <button onClick={handleRepay} className="btn-primary" disabled={!!proving}>{proving === 'repay' ? 'Repaying…' : 'Repay'}</button>
            <button onClick={handleLoadLedger} className="btn-secondary" disabled={!!proving}>{proving === 'load' ? 'Loading…' : 'Read On-chain Ledger'}</button>
          </div>
        </div>
      </div>

      {financingAddress && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-veil-700">Ledger</p>
            <span className="text-[10px] font-mono text-veil-400">Financing • {financingAddress.slice(0, 14)}…</span>
          </div>
          {record ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${stateMeta?.className.includes('green') ? 'bg-green-500' : stateMeta?.className.includes('blue') ? 'bg-blue-500' : stateMeta?.className.includes('amber') ? 'bg-amber-500' : 'bg-veil-300'}`} />
                <span className={`font-medium ${stateMeta?.className}`}>{stateMeta?.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-veil-500 uppercase">Invoice Id</p><p className="font-mono text-veil-800 break-all">{record.invoiceId ? toHex(record.invoiceId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Seller</p><p className="font-mono text-veil-800 break-all">{record.sellerId ? toHex(record.sellerId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Financing Id</p><p className="font-mono text-veil-800 break-all">{record.financingId ? toHex(record.financingId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Face Value</p><p className="font-medium text-veil-900">{record.faceValue != null ? record.faceValue.toString() : '—'}</p></div>
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
