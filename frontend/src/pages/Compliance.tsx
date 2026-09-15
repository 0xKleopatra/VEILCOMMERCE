// =============================================================================
// VeilCommerce — Compliance Page
// -----------------------------------------------------------------------------
// Real, wallet-gated compliance lifecycle on the Midnight ledger:
//   attestCompliance → grantDisclosure → evaluateCompliance
// plus reading the live on-chain ledger through the indexer (queryVeilLedger).
// No mocks. Each action submits a real circuit call through the connected wallet.
// =============================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { veilManager, queryVeilLedger } from '../midnight/veilcommerce-manager';
import { toHex } from '../lib/hex';

interface ComplianceRecord {
  subjectId: Uint8Array;
  jurisdiction: string;
  status: number;
  attestedAt?: bigint;
  threshold: bigint;
}

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: 'Pending', className: 'text-veil-500' },
  1: { label: 'Attested', className: 'text-green-600' },
  2: { label: 'Evaluated', className: 'text-blue-600' },
};

function parseHex(input: string): Uint8Array | null {
  const hex = input.trim().replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export function Compliance() {
  const { isConnected, session, address } = useWallet();
  const [complianceAddress, setComplianceAddress] = useState<string | null>(() => localStorage.getItem('veil_compliance_address') || null);
  const [subjectIdHex, setSubjectIdHex] = useState(() => localStorage.getItem('veil_subjectId') || '');
  const [proving, setProving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [record, setRecord] = useState<ComplianceRecord | null>(null);

  const subjectId = parseHex(subjectIdHex);

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Compliance</h1>
          <p className="text-veil-600 mt-1">Private compliance — attestations, disclosures, evaluation</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view compliance</h3>
          <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
            Compliance records are fetched from the Midnight indexer after you connect. No simulated data.
          </p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
          <p className="text-[11px] font-mono text-veil-400 mt-3">{address ? address.slice(0, 12) + '…' : ''}</p>
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    if (!isConnected || !session) { setError('Connect wallet first'); return; }
    if (!subjectId) { setError('Enter a valid 64-char subject ID (hex)'); return; }
    setProving('deploy'); setError(null);
    try {
      const adminId = session.coinPublicKeyBytes ?? new Uint8Array(32);
      const timestamp = BigInt(Date.now());
      const result = await veilManager.deployAndWait('Compliance', [subjectId, adminId, timestamp]);
      setComplianceAddress(result.contractAddress);
      localStorage.setItem('veil_compliance_address', result.contractAddress);
      localStorage.setItem('veil_subjectId', toHex(subjectId));
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const requireLive = (): string | null => {
    if (!complianceAddress) return 'Deploy Compliance first — need contract address';
    if (!subjectId) return 'Enter a valid subject ID';
    return null;
  };

  const handleAttestCompliance = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('attestCompliance'); setError(null);
    try { await veilManager.call('Compliance', complianceAddress, 'attestCompliance', [subjectId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleGrantDisclosure = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('grantDisclosure'); setError(null);
    try { await veilManager.call('Compliance', complianceAddress, 'grantDisclosure', [subjectId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleEvaluateCompliance = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('evaluateCompliance'); setError(null);
    try { await veilManager.call('Compliance', complianceAddress, 'evaluateCompliance', [subjectId!]); }
    catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const handleLoadLedger = async () => {
    if (!complianceAddress) return setError('Deploy Compliance first');
    setProving('load'); setError(null);
    try {
      const parsed = await queryVeilLedger('Compliance', complianceAddress);
      setLedger(parsed);
      if (subjectId && parsed && typeof (parsed as any).complianceRecords?.get === 'function') {
        try { setRecord((parsed as any).complianceRecords.get(subjectId) ?? null); }
        catch { setRecord(null); }
      }
    } catch (e: any) { setError(e.message); }
    finally { setProving(null); }
  };

  const stateMeta = record && typeof record.status === 'number' ? STATUS_LABELS[record.status] ?? { label: `Status ${record.status}`, className: 'text-veil-500' } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Compliance</h1>
          <p className="text-veil-600 mt-1">Private compliance — attestations, disclosures, evaluation</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Wallet: {address?.slice(0, 12)}… • {session.config?.networkId}</p>
        </div>
        <Link to="/trade" className="btn-primary">+ New Compliance</Link>
      </div>

      {error && <div className="card p-4 bg-red-50 border-red-200 text-sm text-red-700">{error}</div>}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Deploy New Compliance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Subject ID (hex, 64 chars)</label>
            <input value={subjectIdHex} onChange={(e) => setSubjectIdHex(e.target.value)} placeholder="64 hex chars" className="input" />
          </div>
          <button onClick={handleDeploy} className="btn-primary" disabled={!!proving}>
            {proving === 'deploy' ? 'Deploying Compliance…' : 'Deploy Compliance'}
          </button>
          <p className="text-[11px] font-mono text-veil-500">Uses <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait('Compliance', [subjectId, adminId, timestamp])</code></p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Manage Compliance</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Contract Address</label>
            <input value={complianceAddress ?? ''} onChange={(e) => setComplianceAddress(e.target.value.trim() || null)} placeholder="veil-… contract address" className="input font-mono" />
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAttestCompliance} className="btn-primary" disabled={!!proving}>{proving === 'attestCompliance' ? 'Attesting…' : 'Attest Compliance'}</button>
            <button onClick={handleGrantDisclosure} className="btn-primary" disabled={!!proving}>{proving === 'grantDisclosure' ? 'Granting…' : 'Grant Disclosure'}</button>
            <button onClick={handleEvaluateCompliance} className="btn-secondary" disabled={!!proving}>{proving === 'evaluateCompliance' ? 'Evaluating…' : 'Evaluate Compliance'}</button>
            <button onClick={handleLoadLedger} className="btn-secondary" disabled={!!proving}>{proving === 'load' ? 'Loading…' : 'Read On-chain Ledger'}</button>
          </div>
        </div>
      </div>

      {complianceAddress && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-veil-700">Ledger</p>
            <span className="text-[10px] font-mono text-veil-400">Compliance • {complianceAddress.slice(0, 14)}…</span>
          </div>
          {record ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${stateMeta?.className.includes('green') ? 'bg-green-500' : stateMeta?.className.includes('blue') ? 'bg-blue-500' : 'bg-veil-300'}`} />
                <span className={`font-medium ${stateMeta?.className}`}>{stateMeta?.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-[11px] text-veil-500 uppercase">Subject</p><p className="font-mono text-veil-800 break-all">{record.subjectId ? toHex(record.subjectId).slice(0, 20) + '…' : '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Jurisdiction</p><p className="font-medium text-veil-900">{record.jurisdiction ?? '—'}</p></div>
                <div><p className="text-[11px] text-veil-500 uppercase">Status</p><p className="font-medium text-veil-900">{record.status != null ? record.status.toString() : '—'}</p></div>
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
