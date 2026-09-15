// VeilCommerce — Deployed contract addresses
// Loaded from /deployments.json (copied from repo root at build time).
// Falls back to localStorage for per-session persistence.

export interface ContractDeployment {
  address: string;
  status: string;
  circuits: string[];
  deployVia: string;
}

export interface Deployments {
  network: string;
  deployed: string;
  contracts: Record<string, ContractDeployment>;
}

const CACHE = new Map<string, Deployments>();

export async function loadDeployments(): Promise<Deployments | null> {
  if (CACHE.has('all')) return CACHE.get('all') ?? null;
  try {
    const res = await fetch('/deployments.json');
    if (!res.ok) return null;
    const data: Deployments = await res.json();
    CACHE.set('all', data);
    return data;
  } catch {
    return null;
  }
}

export function getContractAddress(name: string): string | null {
  const stored = localStorage.getItem(`veil_${name.toLowerCase()}_address`);
  if (stored) return stored;
  // Will be resolved asynchronously via loadDeployments()
  return null;
}

export async function getDeployedContractAddress(name: string): Promise<string | null> {
  const stored = localStorage.getItem(`veil_${name.toLowerCase()}_address`);
  if (stored) return stored;
  const deps = await loadDeployments();
  return deps?.contracts[name]?.address ?? null;
}
