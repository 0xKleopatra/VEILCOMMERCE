// VeilCommerce — Ledger Query Hooks (Real Indexer, No Mocks)
// Smart reuse of privoice checkpoint.ts + kredz dashboard + silentLedger orderbook queries
// Each hook queries a specific VeilCommerce contract's ledger via patched indexer

import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { queryVeilLedger, type VeilContractName } from '../midnight/veilcommerce-manager';

// Generic query hook
export function useVeilQuery<T = any>(contractName: VeilContractName | null, contractAddress: string | null) {
  const { isConnected, session } = useWallet();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isConnected || !session || !contractName || !contractAddress) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const ledger = await queryVeilLedger(contractName, contractAddress);
      setData(ledger as T);
    } catch (e: any) {
      setError(e.message ?? 'Query failed');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [isConnected, session, contractName, contractAddress]);

  useEffect(() => { refresh(); }, [refresh]);

  // Auto-refresh every 8s when connected (like lunarswap pool polling)
  useEffect(() => {
    if (!isConnected || !contractAddress) return;
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [isConnected, contractAddress, refresh]);

  return { data, loading, error, refresh };
}

// Convenience: read addresses from localStorage (kredz pattern: kredz_contract_address)
export function useStoredAddresses() {
  const [addrs, setAddrs] = useState<Record<string, string | null>>({
    purchaseOrder: localStorage.getItem('veil_purchaseOrder_address'),
    escrow: localStorage.getItem('veil_escrow_address'),
    invoice: localStorage.getItem('veil_invoice_address'),
    financing: localStorage.getItem('veil_financing_address'),
    settlement: localStorage.getItem('veil_settlement_address'),
    businessRegistry: localStorage.getItem('veil_businessRegistry_address'),
  });
  useEffect(() => {
    const onStorage = () => setAddrs({
      purchaseOrder: localStorage.getItem('veil_purchaseOrder_address'),
      escrow: localStorage.getItem('veil_escrow_address'),
      invoice: localStorage.getItem('veil_invoice_address'),
      financing: localStorage.getItem('veil_financing_address'),
      settlement: localStorage.getItem('veil_settlement_address'),
      businessRegistry: localStorage.getItem('veil_businessRegistry_address'),
    });
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return addrs;
}

// Dashboard aggregates — like kredz dashboard layer breakdown
export function useDashboardStats() {
  const addrs = useStoredAddresses();
  const po = useVeilQuery(addrs.purchaseOrder ? 'PurchaseOrder' : null, addrs.purchaseOrder);
  const escrow = useVeilQuery(addrs.escrow ? 'Escrow' : null, addrs.escrow);
  const invoice = useVeilQuery(addrs.invoice ? 'Invoice' : null, addrs.invoice);
  return { addrs, po, escrow, invoice };
}
