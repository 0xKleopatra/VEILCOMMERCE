#!/usr/bin/env node
// VeilCommerce — Sync ZK assets for 8 contracts (browser-served)
// Smart reuse of kredz-midnight/scripts/sync-zk.js + midnight-escrow pattern
// Copies keys/, zkir/, contract/index.js to frontend/public/contract/<name>/

import { existsSync, mkdirSync, cpSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const managedRoot = resolve(root, 'contracts/managed');
const frontendRoot = resolve(root, 'frontend');

const CONTRACTS = [
  'BusinessRegistry',
  'PurchaseOrder',
  'Escrow',
  'Invoice',
  'Financing',
  'Compliance',
  'CredentialRegistry',
  'Settlement',
];

if (!existsSync(managedRoot)) {
  console.error('Managed dir not found:', managedRoot);
  console.error('Run: node scripts/compile-all.mjs first');
  process.exit(1);
}

let synced = 0;
for (const name of CONTRACTS) {
  const srcManaged = resolve(managedRoot, name);
  if (!existsSync(srcManaged)) {
    console.warn(`⚠️  Skip ${name}: not compiled yet`);
    continue;
  }
  // 1) Browser-served ZK assets: frontend/public/contract/<name>/
  const publicDest = resolve(frontendRoot, `public/contract/${name}`);
  mkdirSync(publicDest, { recursive: true });
  for (const dir of ['keys', 'zkir']) {
    const srcDir = resolve(srcManaged, dir);
    if (existsSync(srcDir)) {
      cpSync(srcDir, resolve(publicDest, dir), { recursive: true });
      console.log(`✓ Synced ${name}/${dir}/ → frontend/public/contract/${name}/${dir}/`);
    }
  }
  // contract JS for direct fetch if needed
  const contractJs = resolve(srcManaged, 'contract/index.js');
  if (existsSync(contractJs)) {
    mkdirSync(resolve(publicDest, 'contract'), { recursive: true });
    cpSync(contractJs, resolve(publicDest, 'contract/index.js'));
  }
  // 2) Frontend import: frontend/contracts/managed/<name>/
  const managedDest = resolve(frontendRoot, `contracts/managed/${name}`);
  mkdirSync(managedDest, { recursive: true });
  cpSync(srcManaged, managedDest, { recursive: true });
  console.log(`✓ Synced ${name} managed/ → frontend/contracts/managed/${name}/`);
  synced++;
}

console.log(`\n✓ Synced ${synced}/${CONTRACTS.length} contracts`);
console.log('Ready: cd frontend && npm run dev  (ensure 1AM/Lace on preprod)');
console.log('Verify ZK assets: open http://localhost:3000/contract/PurchaseOrder/keys/ in browser — must not 404');
