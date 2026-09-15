#!/usr/bin/env node
// VeilCommerce — Compile all 8 Compact contracts
// Smart reuse of kredz-midnight/scripts/compile-contract.js pattern
// Handles: BusinessRegistry, PurchaseOrder, Escrow, Invoice, Financing,
//          Compliance, CredentialRegistry, Settlement

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const contractsDir = resolve(root, 'contracts');

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

function checkCompactVersion() {
  try {
    const out = execSync('compact --version', { encoding: 'utf-8' });
    const m = out.match(/(\d+\.\d+\.\d+)/);
    if (m) {
      console.log(`compact version: ${m[1]}`);
      const [major, minor] = m[1].split('.').map(Number);
      if (major !== 0 || minor < 5) {
        console.error(`ERROR: compact ${m[1]} requires 0.5.x. Install: npm install -g @midnight-ntwrk/compact@0.5.1`);
        process.exit(1);
      }
    }
  } catch {
    console.error('ERROR: compact not on PATH. Install from https://docs.midnight.network');
    process.exit(1);
  }
}

checkCompactVersion();

let failed = [];
for (const name of CONTRACTS) {
  const src = resolve(contractsDir, `${name}.compact`);
  const dest = resolve(contractsDir, `managed/${name}`);
  if (!existsSync(src)) {
    console.warn(`⚠️  Skip ${name}: ${src} not found`);
    continue;
  }
  mkdirSync(dest, { recursive: true });
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Compiling ${name}.compact → managed/${name}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  try {
    execSync(`compact compile "${src}" "${dest}"`, { stdio: 'inherit', cwd: root });
    console.log(`✓ ${name} compiled`);
  } catch (e) {
    console.error(`✗ ${name} failed`);
    failed.push(name);
  }
}

console.log('\n' + '='.repeat(50));
if (failed.length === 0) console.log('✓ All VeilCommerce contracts compiled');
else {
  console.error(`✗ Failed: ${failed.join(', ')}`);
  process.exit(1);
}
console.log('Next: npm run sync:zk  (or node scripts/sync-zk.mjs)');
