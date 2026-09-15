// =============================================================================
// Veniceland Veil — Escrow Contracts
// -----------------------------------------------------------------------------
// Real, wallet-gated management of Midnight Escrow contracts: deploy, verify
// delivery (ZK), release, dispute, refund — plus reading the live on-chain
// ledger through the indexer (queryVeilLedger). No mocks.
// =============================================================================

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { veilManager, queryVeilLedger } from '../midnight/veilcommerce-manager';
import { toHex } from '../lib/hex';
import { getDeployedContractAddress } from '../midnight/deployments';

const STATE_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: 'Empty', className: 'text-veil-500' },
  1: { label: 'Funded', className: 'text-amber-600' },
  2: { label: 'Delivery Verified', className: 'text-blue-600' },
  3: { label: 'Released', className: 'text-green-600' },
  4: { label: 'Refunded', className: 'text-veil-500' },
  5: { label: 'Disputed', className: 'text-red-600' },
};

function parseHex(input: string): Uint8Array | null {
  const hex = input.trim().replace(/^0x/, '');
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) return null;
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

export function EscrowPage() {
  const { isConnected, address, session } = useWallet();
  const [escrowAddress, setEscrowAddress] = useState<string | null>(() => localStorage.getItem('veil_escrow_address') || null);
  const [escrowAddressInput, setEscrowAddressInput] = useState(() => localStorage.getItem('veil_escrow_address') || '');
  const [escrowIdHex, setEscrowIdHex] = useState(() => localStorage.getItem('veil_escrowId') || '');
  const [proving, setProving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [record, setRecord] = useState<any>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  useEffect(() => { (async () => { if (!escrowAddress) { const addr = await getDeployedContractAddress('Escrow'); if (addr) { setEscrowAddress(addr); setEscrowAddressInput(addr); } } })(); }, [escrowAddress]);

  const escrowId = parseHex(escrowIdHex);

  if (!isConnected || !session) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Escrow Contracts</h1>
          <p className="text-veil-600 mt-1">Programmable escrow with ZK-gated release conditions</p>
        </div>
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LockIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="font-semibold text-veil-900">Connect wallet to view escrows</h3>
          <p className="text-sm text-veil-500 mt-2 max-w-md mx-auto">
            Escrow contracts are fetched from the Midnight indexer after you connect. No simulated data.
          </p>
          <div className="mt-6 flex justify-center"><WalletConnect /></div>
          <p className="text-[11px] font-mono text-veil-400 mt-3">{address ? address.slice(0, 12) + '…' : ''}</p>
        </div>
      </div>
    );
  }

  const contractAddress = deployedAddress ?? escrowAddress;

  const handleDeploy = async () => {
    if (!isConnected || !session) {
      setError('Connect wallet first — 1AM dust-free or Lace');
      return;
    }
    if (!escrowId) {
      setError('Enter a valid 64-char escrow ID (hex)');
      return;
    }
    setProving('deploy');
    setError(null);
    try {
      const orderId = (session as any).coinPublicKeyBytes ?? new Uint8Array(32);
      const sellerId = session.coinPublicKeyBytes ?? new Uint8Array(32);
      const timestamp = BigInt(Date.now());
      console.log('[Escrow] Deploying Escrow', toHex(escrowId).slice(0, 12), 'via veilManager');
      const result = await veilManager.deployAndWait('Escrow', [escrowId, orderId, sellerId, timestamp]);
      setDeployedAddress(result.contractAddress);
      setEscrowAddress(result.contractAddress);
      setEscrowAddressInput(result.contractAddress);
      localStorage.setItem('veil_escrow_address', result.contractAddress);
      localStorage.setItem('veil_escrowId', toHex(escrowId));
    } catch (e: any) {
      console.error('[Escrow] Deploy failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const requireLive = (): string | null => {
    if (!contractAddress) return 'Deploy an Escrow first — need contract address';
    if (!escrowId) return 'Enter a valid escrow ID';
    return null;
  };

  const handleVerifyDelivery = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('verifyDelivery');
    setError(null);
    try {
      console.log('[Escrow] verifyDelivery', contractAddress!.slice(0, 16), toHex(escrowId!).slice(0, 16));
      await veilManager.call('Escrow', contractAddress!, 'verifyDelivery', [escrowId!]);
    } catch (e: any) {
      console.error('[Escrow] verifyDelivery failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const handleRelease = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('release');
    setError(null);
    try {
      const timestamp = BigInt(Date.now());
      console.log('[Escrow] release', contractAddress!.slice(0, 16));
      await veilManager.call('Escrow', contractAddress!, 'release', [escrowId!, timestamp]);
    } catch (e: any) {
      console.error('[Escrow] release failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const handleDispute = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('dispute');
    setError(null);
    try {
      await veilManager.call('Escrow', contractAddress!, 'dispute', [escrowId!]);
    } catch (e: any) {
      console.error('[Escrow] dispute failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const handleRefund = async () => {
    const missing = requireLive();
    if (missing) return setError(missing);
    setProving('refund');
    setError(null);
    try {
      await veilManager.call('Escrow', contractAddress!, 'refund', [escrowId!]);
    } catch (e: any) {
      console.error('[Escrow] refund failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const handleLoadLedger = async () => {
    if (!contractAddress) return setError('Deploy an Escrow first — need contract address');
    setProving('load');
    setError(null);
    try {
      const parsed = await queryVeilLedger('Escrow', contractAddress);
      setLedger(parsed);
      if (escrowId && parsed && typeof (parsed as any).escrows?.get === 'function') {
        try {
          setRecord((parsed as any).escrows.get(escrowId) ?? null);
        } catch {
          setRecord(null);
        }
      }
    } catch (e: any) {
      console.error('[Escrow] ledger load failed', e);
      setError(e.message);
    } finally {
      setProving(null);
    }
  };

  const stateMeta =
    record && typeof record.state === 'number'
      ? STATE_LABELS[record.state] ?? { label: `State ${record.state}`, className: 'text-veil-500' }
      : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-veil-900">Escrow Contracts</h1>
          <p className="text-veil-600 mt-1">Programmable escrow with ZK-gated release conditions</p>
          <p className="text-[11px] font-mono text-veil-400 mt-1">Wallet: {address?.slice(0, 12)}… • {session.config?.networkId}</p>
        </div>
        <Link to="/trade" className="btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Escrow
        </Link>
      </div>

      {error && <div className="card p-4 bg-red-50 border-red-200 text-sm text-red-700">{error}</div>}

      {/* Deploy a new Escrow */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Deploy New Escrow</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Escrow ID (hex, 64 chars)</label>
            <input
              value={escrowIdHex}
              onChange={(e) => setEscrowIdHex(e.target.value)}
              placeholder="e.g. ab12… (32 bytes)"
              className="input"
            />
          </div>
          <button onClick={handleDeploy} className="btn-primary" disabled={!!proving} >
            {proving === 'deploy' ? 'Deploying Escrow + generating ZK proof…' : 'Deploy Escrow Contract'}
          </button>
          <p className="text-[11px] font-mono text-veil-500">
            Uses <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait('Escrow', [escrowId, orderId, sellerId, timestamp])</code> → wallet request sign & prove.
          </p>
        </div>
      </div>

      {/* Manage an existing Escrow */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Manage Escrow</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-veil-700 mb-1">Contract Address</label>
            <input
              value={escrowAddressInput}
              onChange={(e) => setEscrowAddressInput(e.target.value)}
              placeholder="veil-… contract address"
              className="input font-mono"
            />
            <button
              onClick={() => setEscrowAddress(escrowAddressInput.trim() || null)}
              className="text-xs text-accent-600 hover:text-accent-700 mt-1"
            >
              Load this address
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleVerifyDelivery} className="btn-secondary" disabled={!!proving}>
              {proving === 'verifyDelivery' ? 'Proving…' : 'Verify Delivery (ZK)'}
            </button>
            <button onClick={handleRelease} className="btn-primary" disabled={!!proving}>
              {proving === 'release' ? 'Releasing…' : 'Release (seller)'}
            </button>
            <button onClick={handleDispute} className="btn-secondary" disabled={!!proving}>
              {proving === 'dispute' ? 'Disputing…' : 'Dispute'}
            </button>
            <button onClick={handleRefund} className="btn-secondary" disabled={!!proving}>
              {proving === 'refund' ? 'Refunding…' : 'Refund (buyer)'}
            </button>
            <button onClick={handleLoadLedger} className="btn-secondary" disabled={!!proving}>
              {proving === 'load' ? 'Loading…' : 'Read On-chain Ledger'}
            </button>
          </div>
        </div>
      </div>

      {/* Ledger / record */}
      {contractAddress && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-veil-700">Ledger</p>
            <span className="text-[10px] font-mono text-veil-400">Escrow • {contractAddress.slice(0, 14)}…</span>
          </div>
          {record ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${stateMeta?.className.includes('green') ? 'bg-green-500' : stateMeta?.className.includes('red') ? 'bg-red-500' : stateMeta?.className.includes('amber') ? 'bg-amber-500' : 'bg-veil-300'}`} />
                <span className={`font-medium ${stateMeta?.className}`}>{stateMeta?.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-veil-500 uppercase">Buyer</p>
                  <p className="font-mono text-veil-800 break-all">{record.buyer ? toHex(record.buyer).slice(0, 20) + '…' : '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-veil-500 uppercase">Seller</p>
                  <p className="font-mono text-veil-800 break-all">{record.seller ? toHex(record.seller).slice(0, 20) + '…' : '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-veil-500 uppercase">Amount</p>
                  <p className="font-medium text-veil-900">{record.amount != null ? record.amount.toString() : '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-veil-500 uppercase">Escrow Id</p>
                  <p className="font-mono text-veil-800 break-all">{record.escrowId ? toHex(record.escrowId).slice(0, 20) + '…' : '—'}</p>
                </div>
              </div>
            </div>
          ) : ledger ? (
            <p className="text-[11px] font-mono text-veil-500 break-all">
              {JSON.stringify(ledger, (_k, v) => (v instanceof Uint8Array ? toHex(v).slice(0, 16) + '…' : typeof v === 'bigint' ? v.toString() : v)).slice(0, 600)}
            </p>
          ) : (
            <p className="text-[11px] font-mono text-veil-400">No contract state read yet — click “Read On-chain Ledger” after deploy.</p>
          )}
        </div>
      )}
    </div>
  );
}

function LockIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
}
function PlusIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
}
