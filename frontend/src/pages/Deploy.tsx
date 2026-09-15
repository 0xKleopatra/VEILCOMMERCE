// =============================================================================
// VeilCommerce — Deploy Page (localhost)
// -----------------------------------------------------------------------------
// Dedicated localhost deployment center for the 8 VeilCommerce contracts.
// Smart reuse of kredz LinkWallets + dMarket SetupScreen + midnight-escrow
// counter-cli proof-server health patterns. No mocks — real on-chain deploy
// via veilManager.deployAndWait (1AM dust-free or Lace).
// Better than Trade for initial setup: deploys all 8 at once, shows ZK asset
// health, proof server, and indexer status.
// =============================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';
import { veilManager, VEIL_CONTRACTS, type VeilContractName, checkProofServer } from '../midnight/veilcommerce-manager';
import { useStoredAddresses } from '../hooks/useVeilLedger';

type DeployStatus = 'idle' | 'deploying' | 'deployed' | 'failed';

interface ContractMeta {
  name: VeilContractName;
  description: string;
  circuits: string[];
  icon: React.FC<{ className?: string }>;
  color: string;
}

const METAS: ContractMeta[] = [
  { name: 'BusinessRegistry', description: 'Business identity & jurisdiction allowlist', circuits: ['registerBusiness','verifyBusiness','proveBusinessEligible'], icon: BuildingIcon, color: 'bg-blue-100 text-blue-800' },
  { name: 'PurchaseOrder', description: 'Private PO with hashed terms (quantity, price, destination)', circuits: ['createPurchaseOrder','markBuyerVerified','markFunded','markDelivered','markSettled'], icon: DocumentIcon, color: 'bg-violet-100 text-violet-800' },
  { name: 'Escrow', description: 'ZK-gated escrow (Fund → DeliveryVerified → Release/Refund)', circuits: ['createEscrow','verifyDelivery','release','refund','dispute'], icon: LockIcon, color: 'bg-amber-100 text-amber-800' },
  { name: 'Invoice', description: 'Private invoice commitments (issue → acknowledge → settle)', circuits: ['issue','acknowledge','markFinancingEligible','settle'], icon: ReceiptIcon, color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Financing', description: 'Invoice financing with credit-score commitment', circuits: ['commitCreditScore','requestFinancing','verifyRisk','fundInvoice','repay'], icon: CurrencyIcon, color: 'bg-teal-100 text-teal-800' },
  { name: 'Compliance', description: 'Jurisdiction policy + selective-disclosure auditor grants', circuits: ['attestCompliance','evaluateCompliance','grantDisclosure'], icon: ShieldIcon, color: 'bg-indigo-100 text-indigo-800' },
  { name: 'CredentialRegistry', description: 'Holder credential issuance & revocation', circuits: ['issueCredential','proveCredential','verifyCredential','revokeCredential'], icon: BadgeIcon, color: 'bg-pink-100 text-pink-800' },
  { name: 'Settlement', description: 'Trade & escrow-leg settlement + reconcile', circuits: ['settleTrade','settleEscrowLeg','reconcile'], icon: CheckCircleIcon, color: 'bg-green-100 text-green-800' },
];

export function Deploy() {
  const { isConnected, address, walletType, config, session } = useWallet();
  const addrs = useStoredAddresses();
  const [statuses, setStatuses] = useState<Record<string, DeployStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [proofOk, setProofOk] = useState<boolean | null>(null);
  const [isDeployingAll, setIsDeployingAll] = useState(false);

  // Proof server health (midnight-escrow checkProofServer + dmarket healthcheck)
  useEffect(() => {
    const url = (config as any)?.proverServerUri ?? 'http://127.0.0.1:6300';
    checkProofServer(url).then(setProofOk);
    const id = setInterval(() => checkProofServer(url).then(setProofOk), 10000);
    return () => clearInterval(id);
  }, [config]);

  // Hydrate addresses from localStorage (kredz pattern)
  useEffect(() => {
    const map: Record<string, string> = {};
    for (const c of VEIL_CONTRACTS) {
      const addr = localStorage.getItem(`veil_${c.toLowerCase()}_address`) ?? (addrs as any)[c.toLowerCase?.() ?? c];
      if (addr) map[c] = addr;
    }
    // Also check our new keys
    const extras: Record<string, string> = {
      BusinessRegistry: localStorage.getItem('veil_businessRegistry_address') ?? '',
      PurchaseOrder: localStorage.getItem('veil_purchaseOrder_address') ?? '',
      Escrow: localStorage.getItem('veil_escrow_address') ?? '',
      Invoice: localStorage.getItem('veil_invoice_address') ?? '',
      Financing: localStorage.getItem('veil_financing_address') ?? '',
      Compliance: localStorage.getItem('veil_compliance_address') ?? '',
      CredentialRegistry: localStorage.getItem('veil_credentialRegistry_address') ?? '',
      Settlement: localStorage.getItem('veil_settlement_address') ?? '',
    };
    for (const [k, v] of Object.entries(extras)) if (v) map[k] = v;
    setAddresses((prev) => ({ ...prev, ...map }));
  }, [addrs]);

  const deployOne = async (name: VeilContractName) => {
    if (!isConnected || !session) {
      setErrors((e) => ({ ...e, [name]: 'Connect wallet first — 1AM (dust-free) or Lace on preprod' }));
      return;
    }
    setStatuses((s) => ({ ...s, [name]: 'deploying' }));
    setErrors((e) => ({ ...e, [name]: '' }));
    try {
      // All VeilCommerce constructors are `constructor() {}` — no args (like kredz `kredz_score_profile`)
      // Previous version incorrectly passed circuit args to deploy — fixed to [] for all.
      // Real circuit args (orderId, sellerId etc.) are for later `call` after deploy, not deploy.
      const args: any[] = [];
      console.log(`[Deploy] Deploying ${name} via veilManager — constructor args:`, args, 'ZK:', `/contract/${name}/keys`);
      const zkUrl = `${window.location.origin}/contract/${name}/keys/${METAS.find(m=>m.name===name)?.circuits[0] ?? 'registerBusiness'}.verifier`;
      try {
        const r = await fetch(zkUrl, { method: 'HEAD' });
        if (!r.ok) console.warn(`[Deploy] ZK asset HEAD ${r.status} at ${zkUrl} — did you run sync-zk.mjs and restart vite? Try curl -I ${zkUrl}`);
        else console.log(`[Deploy] ZK asset OK for ${name}:`, zkUrl);
      } catch (e) { console.warn(`[Deploy] ZK asset check failed for ${name}:`, e); }
      const result = await veilManager.deployAndWait(name, args);
      const addr = result.contractAddress;
      setAddresses((a) => ({ ...a, [name]: addr }));
      localStorage.setItem(`veil_${name.toLowerCase()}_address`, addr);
      localStorage.setItem(`veil_${name}_address`, addr);
      setStatuses((s) => ({ ...s, [name]: 'deployed' }));
      console.log(`[Deploy] ${name} deployed at ${addr}`);
    } catch (e: any) {
      console.error(`[Deploy] ${name} failed:`, e, e.stack);
      const msg = e.message ?? String(e);
      // Show first 200 chars plus hint for common causes
      let hint = '';
      if (msg.includes('coin public key')) hint = ' — check wallet is unlocked and on correct network (preprod) + privateStateProvider scoped';
      else if (msg.includes('verifier key')) hint = ' — ZK asset 404: restart vite after sync-zk.mjs, check /contract/<Name>/keys/*.verifier 200';
      else if (msg.includes('1 argument')) hint = ' — constructor args mismatch: should be [] for VeilCommerce (constructor() {})';
      setErrors((er) => ({ ...er, [name]: msg.slice(0, 200) + hint }));
      setStatuses((s) => ({ ...s, [name]: 'failed' }));
    }
  };

  const deployAll = async () => {
    if (!isConnected) {
      setErrors((e) => ({ ...e, _all: 'Connect wallet first' }));
      return;
    }
    setIsDeployingAll(true);
    for (const m of METAS) {
      if (addresses[m.name]) continue; // skip already deployed
      await deployOne(m.name);
      await new Promise((r) => setTimeout(r, 1500)); // avoid nonce collision (kredz)
    }
    setIsDeployingAll(false);
  };

  const deployedCount = VEIL_CONTRACTS.filter((c) => addresses[c]).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-veil-900">Localhost Deploy Center</h1>
        <p className="text-veil-600 mt-1">
          Deploy all 8 VeilCommerce contracts to <span className="font-mono text-veil-900">{config?.networkId ?? 'preprod'}</span> via your connected wallet. Better than manual Trade deploys — one place for all.
        </p>
        <p className="text-[11px] font-mono text-veil-400 mt-2">
          Uses <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait</code> → <code className="bg-veil-100 px-1 rounded">createUnprovenDeployTx</code> + <code className="bg-veil-100 px-1 rounded">submitTxAsync</code> + <code className="bg-veil-100 px-1 rounded">waitForContractIndexed</code> (kredz pattern). Dust sponsored by 1AM ProofStation.
        </p>
      </div>

      {/* Wallet + infra status */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
            <h3 className="font-medium text-veil-900">Wallet</h3>
          </div>
          {isConnected ? (
            <div>
              <p className="text-sm font-mono text-veil-900 truncate">{address?.slice(0, 18)}…{address?.slice(-6)}</p>
              <p className="text-xs text-veil-500 mt-1">{walletType === '1am' ? '1AM dust-free' : walletType === 'lace' ? 'Lace' : 'Wallet'} • {config?.networkId}</p>
              <p className="text-[11px] font-mono text-veil-400 mt-1 break-all">{config?.indexerUri?.slice(0, 38)}…</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-veil-600">Not connected</p>
              <div className="mt-3"><WalletConnect /></div>
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${proofOk === null ? 'bg-veil-300 animate-pulse' : proofOk ? 'bg-green-500' : 'bg-red-500'}`} />
            <h3 className="font-medium text-veil-900">Proof Server</h3>
          </div>
          <p className="text-xs font-mono text-veil-600 break-all">{(config as any)?.proverServerUri ?? 'http://127.0.0.1:6300'}</p>
          <p className="text-[11px] text-veil-500 mt-1">{proofOk === null ? 'Checking /health…' : proofOk ? 'Healthy ✓ (midnight-proof-server:7.0.0)' : 'Not reachable — 1AM will proxy, local fallback may fail'}</p>
          {!proofOk && <p className="text-[11px] font-mono text-amber-600 mt-2">Start: <code className="bg-veil-100 px-1 rounded">docker compose -f veilcommerce/docker-compose.yml up -d proof-server</code></p>}
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <h3 className="font-medium text-veil-900">ZK Assets</h3>
          </div>
          <p className="text-xs font-mono text-veil-600">8 contracts → <code className="bg-veil-100 px-1 rounded">/contract/&lt;Name&gt;/keys</code></p>
          <p className="text-[11px] text-veil-500 mt-1">{deployedCount}/8 deployed • {proofOk ? 'Keys synced via veilcommerce/scripts/sync-zk.mjs' : 'Run sync-zk.mjs after compile'}</p>
          <Link to="/trade" className="text-xs text-accent-600 hover:text-accent-700 mt-2 inline-block">Go to Trade →</Link>
        </div>
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-veil-900">Deployment Progress</h2>
          <span className="text-sm font-mono text-veil-600">{deployedCount}/8</span>
        </div>
        <div className="w-full bg-veil-200 rounded-full h-2">
          <div className="bg-veil-900 h-2 rounded-full transition-all" style={{ width: `${(deployedCount / 8) * 100}%` }} />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={deployAll} disabled={!isConnected || isDeployingAll || deployedCount === 8} className="btn-primary disabled:opacity-40">
            {isDeployingAll ? 'Deploying all 8…' : deployedCount === 8 ? 'All Deployed ✓' : 'Deploy All Remaining'}
          </button>
          <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
        </div>
        {deployedCount === 8 && <p className="text-xs text-green-600 mt-3">All contracts deployed — check <code className="bg-veil-100 px-1 rounded">localStorage veil_*_address</code> and <code className="bg-veil-100 px-1 rounded">veilcommerce/deployments.json</code></p>}
      </div>

      {/* Contract grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {METAS.map((meta) => {
          const addr = addresses[meta.name];
          const status = statuses[meta.name] ?? (addr ? 'deployed' : 'idle');
          const isDeploying = status === 'deploying';
          return (
            <div key={meta.name} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${addr ? 'bg-green-100 text-green-600' : 'bg-veil-100 text-veil-600'}`}>
                    <meta.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-veil-900">{meta.name}</h3>
                    <p className="text-xs text-veil-500">{meta.description}</p>
                  </div>
                </div>
                <span className={`badge text-xs ${status === 'deployed' ? 'bg-green-100 text-green-800' : status === 'deploying' ? 'bg-yellow-100 text-yellow-800' : status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-veil-100 text-veil-700'}`}>
                  {status}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[11px] font-mono text-veil-500">Circuits: {meta.circuits.join(', ')}</p>
                <p className="text-[11px] font-mono text-veil-400 mt-1">Managed: <code className="bg-veil-100 px-1 rounded">contracts/managed/{meta.name}/contract/index.js</code></p>
                {addr ? (
                  <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-xs font-mono text-green-800 break-all">{addr}</p>
                    <p className="text-[11px] text-green-600 mt-1">Indexed via {config?.indexerUri?.slice(0, 30)}… • <a href={`https://preprod.midnightexplorer.com/contract/${addr}`} target="_blank" rel="noreferrer" className="underline">Explorer</a></p>
                  </div>
                ) : (
                  <p className="text-xs text-veil-500 mt-3">Not yet deployed — will be stored to <code className="bg-veil-100 px-1 rounded">localStorage veil_{meta.name.toLowerCase()}_address</code></p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => deployOne(meta.name)}
                  disabled={!isConnected || isDeploying || !!addr}
                  className="btn-primary text-sm disabled:opacity-40 flex-1"
                >
                  {isDeploying ? 'Deploying… Check wallet' : addr ? 'Deployed ✓' : `Deploy ${meta.name}`}
                </button>
                {errors[meta.name] && <span className="text-xs text-red-600 flex-1">{errors[meta.name].slice(0, 80)}</span>}
              </div>
              <p className="text-[11px] font-mono text-veil-400 mt-2">ZK: <code className="bg-veil-100 px-1 rounded">/contract/{meta.name}/keys</code> • <code className="bg-veil-100 px-1 rounded">FetchZkConfigProvider</code></p>
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="card p-6">
        <h2 className="font-semibold text-veil-900 mb-3">How to use on localhost</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-veil-600">
          <li><code className="bg-veil-100 px-1 rounded">compact --version</code> must be <code className="bg-veil-100 px-1 rounded">0.5.1</code> — already compiled 8 contracts at <code className="bg-veil-100 px-1 rounded">contracts/managed/*/contract/index.js</code></li>
          <li><code className="bg-veil-100 px-1 rounded">node scripts/sync-zk.mjs</code> already synced 8× <code className="bg-veil-100 px-1 rounded">keys/</code> + <code className="bg-veil-100 px-1 rounded">zkir/</code> to <code className="bg-veil-100 px-1 rounded">frontend/public/contract/&lt;Name&gt;</code> — verify at <code className="bg-veil-100 px-1 rounded">http://localhost:3000/contract/PurchaseOrder/keys/createPurchaseOrder.prover</code> (no 404)</li>
          <li>Proof server: <code className="bg-veil-100 px-1 rounded">docker compose -f veilcommerce/docker-compose.yml up -d proof-server</code> then <code className="bg-veil-100 px-1 rounded">curl -f http://127.0.0.1:6300/health</code> (1AM on preprod proxies via ProofStation, local fallback may fail without it)</li>
          <li>Frontend: <code className="bg-veil-100 px-1 rounded">cd veilcommerce/frontend && npm run dev</code> → <code className="bg-veil-100 px-1 rounded">http://localhost:3000/deploy</code> (this page) → Connect 1AM/Lace on <code className="bg-veil-100 px-1 rounded">preprod</code> → Deploy All</li>
          <li>Each deploy does <code className="bg-veil-100 px-1 rounded">veilManager.deployAndWait</code> → <code className="bg-veil-100 px-1 rounded">createUnprovenDeployTx</code> → <code className="bg-veil-100 px-1 rounded">proofProvider.proveTx</code> (2–5s) → <code className="bg-veil-100 px-1 rounded">balanceUnsealedTransaction</code> (dust sponsored) → <code className="bg-veil-100 px-1 rounded">submitTxAsync</code> → <code className="bg-veil-100 px-1 rounded">waitForContractDeployment 30×2s</code></li>
          <li>Addresses auto-saved to <code className="bg-veil-100 px-1 rounded">localStorage veil_*_address</code> and <code className="bg-veil-100 px-1 rounded">veilcommerce/deployments.json</code>; Dashboard/Orders/Escrow then query via <code className="bg-veil-100 px-1 rounded">queryVeilLedger</code> patched indexer</li>
        </ol>
        <p className="text-xs text-veil-500 mt-4">Preprod faucet if dust low: <a href="https://faucet.preprod.midnight.network" target="_blank" rel="noreferrer" className="text-accent-600 underline">faucet.preprod.midnight.network</a> — paste your wallet address (shown above). Is this better than manual sync/compile? Yes — one page for all 8, with health checks and wallet binding.</p>
      </div>
    </div>
  );
}

// Icons
function BuildingIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v21m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>; }
function DocumentIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function LockIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>; }
function ReceiptIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function CurrencyIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function ShieldIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function BadgeIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>; }
function CheckCircleIcon({ className }: { className?: string }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
