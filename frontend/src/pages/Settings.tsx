// =============================================================================
// VeilCommerce — Settings Page — No Mocks
// -----------------------------------------------------------------------------
// Real wallet addresses from WalletContext, real network config.
// =============================================================================

import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from '../components/WalletConnect';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'network' | 'notifications' | 'security' | 'api'>('wallet');
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-veil-900">Settings</h1>
        <p className="text-veil-600 mt-1">Manage your account, wallet, and preferences</p>
      </div>
      <div className="card p-1">
        <div className="flex border-b border-veil-200">
          {(['wallet', 'network', 'notifications', 'security', 'api'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-accent-600 text-accent-600' : 'border-transparent text-veil-500 hover:text-veil-700'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'wallet' && <WalletSettings />}
      {activeTab === 'network' && <NetworkSettings />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'api' && <APISettings />}
    </div>
  );
}

function WalletSettings() {
  const { isConnected, address, unshieldedAddress, walletType, walletName, walletStatus, config, error, connect, disconnect } = useWallet();
  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Connected Wallets</h2>
        {!isConnected ? (
          <div className="card p-6 text-center">
            <p className="text-sm text-veil-600">No wallet connected. Connect 1AM (dust-free) or Lace to manage your VeilCommerce identity.</p>
            <div className="mt-4 flex justify-center"><WalletConnect /></div>
            {walletStatus === 'not-found' && <p className="text-xs text-amber-600 mt-3">No extension detected — install 1AM or Lace and refresh.</p>}
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-green-200 bg-green-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-veil-900">{walletName ?? (walletType === '1am' ? '1AM' : 'Lace')}</p>
                    <span className="badge-success text-xs">Connected</span>
                    <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border">{walletType === '1am' ? 'Dust-free' : 'DApp Connector'}</span>
                  </div>
                  <p className="text-sm text-veil-600 font-mono">{address}</p>
                  {unshieldedAddress && unshieldedAddress !== address && <p className="text-xs text-veil-500 font-mono">Unshielded: {unshieldedAddress}</p>}
                  <p className="text-xs text-veil-500 mt-1">Network: {config?.networkId ?? 'preprod'} • {config?.indexerUri?.slice(0, 40)}…</p>
                </div>
              </div>
              <button onClick={disconnect} className="btn-secondary text-sm">Disconnect</button>
            </div>
            <div className="card p-4 bg-veil-50">
              <p className="text-xs font-mono text-veil-600">Shielded coin public key (for contract args):</p>
              <p className="font-mono text-xs text-veil-900 break-all mt-1">{address}</p>
              <p className="text-[11px] text-veil-500 mt-2">Used as <code className="bg-white px-1 rounded">Bytes&lt;32&gt;</code> via coinPublicKeyToBytes helper. Private state never leaves wallet.</p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Wallet Preferences</h2>
        <div className="space-y-4">
          <ToggleSetting label="Auto-connect on visit" description="Automatically reconnect your last wallet when visiting VeilCommerce" defaultChecked />
          <ToggleSetting label="Require wallet for transactions" description="All contract calls go through walletProvider.balanceTx (dust sponsored for 1AM)" defaultChecked />
        </div>
      </section>
    </div>
  );
}

function NetworkSettings() {
  const { config } = useWallet();
  return (
    <div className="p-6 space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-veil-900 mb-4">Network Configuration — From Wallet</h2>
        <p className="text-sm text-veil-500 mb-4">Network endpoints are sourced from wallet <code className="bg-veil-100 px-1 rounded">getConfiguration()</code>, never hardcoded.</p>
        <div className="space-y-4">
          <NetworkCard name={`Midnight ${config?.networkId ?? 'Preprod (default)'}`} rpc={config?.substrateNodeUri ?? 'Not connected — connect wallet'} indexer={config?.indexerUri ?? 'Not connected'} status={config ? 'active' : 'standby'} primary />
          <div className="card p-4 bg-amber-50 border-amber-200">
            <p className="text-sm text-amber-800"><strong>Do not hardcode URLs.</strong> Use <code className="bg-white px-1 rounded">config.indexerUri</code> / <code className="bg-white px-1 rounded">config.indexerWsUri</code> from wallet.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-veil-900">Notifications</h2>
      <p className="text-sm text-veil-500">Real notifications are delivered via indexer subscriptions (WebSocket) after wallet connection. No mock push.</p>
      <label className="flex items-start gap-4 cursor-pointer p-4 rounded-lg border border-veil-200">
        <input type="checkbox" defaultChecked className="w-5 h-5 mt-0.5 rounded border-veil-300 text-accent-600" />
        <div><p className="font-medium text-veil-900">Contract state changes</p><p className="text-sm text-veil-500">Indexer subscription via patched publicDataProvider</p></div>
      </label>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-veil-900">Security</h2>
      <p className="text-sm text-veil-500">ZK private state is kept in wallet's privateStateProvider (in-memory, scoped per contract address). No mock sessions.</p>
      <div className="card p-4 bg-green-50 border-green-200 text-sm text-green-800">Private state never leaves your device — stored via privateStateProvider scoped by contractAddress.</div>
    </div>
  );
}

function APISettings() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-veil-900">API Integration</h2>
      <p className="text-sm text-veil-600">SDK usage with real Midnight providers — no mock SDK.</p>
      <pre className="bg-veil-900 text-veil-100 p-4 rounded-lg text-xs overflow-x-auto"><code>{`import { createConnectedSession } from './lib/midnight';
const session = await createConnectedSession(api, '/contract/veilcommerce');
// session.providers includes patched indexer, walletProvider.balanceTx, midnightProvider.submitTx
`}</code></pre>
    </div>
  );
}

function ToggleSetting({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer p-4 rounded-lg border border-veil-200 hover:bg-veil-50">
      <input type="checkbox" defaultChecked={defaultChecked} className="w-5 h-5 mt-0.5 rounded border-veil-300 text-accent-600" />
      <div>
        <p className="font-medium text-veil-900">{label}</p>
        <p className="text-sm text-veil-500 mt-1">{description}</p>
      </div>
    </label>
  );
}

function NetworkCard({ name, rpc, indexer, status, primary }: { name: string; rpc: string; indexer: string; status: 'active' | 'standby' | 'inactive'; primary?: boolean }) {
  return (
    <div className="p-4 rounded-lg border border-veil-200 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-veil-900">{name}</h3>
          {primary && <span className="badge-info text-xs">Primary</span>}
        </div>
        <span className={`badge ${status === 'active' ? 'bg-green-100 text-green-800' : status === 'standby' ? 'bg-yellow-100 text-yellow-800' : 'bg-veil-100 text-veil-700'}`}>{status}</span>
      </div>
      <div className="space-y-1 text-xs text-veil-600 font-mono break-all">
        <p>RPC: {rpc}</p>
        <p>Indexer: {indexer}</p>
      </div>
    </div>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
}
