# VeilCommerce — Toolchain & Version Matrix

> **Exact versions for reproducible builds**

---

## 1. Core Toolchain

| Tool | Version | Install Command |
|------|---------|-----------------|
| **Node.js** | 22.22.0 (LTS) | `nvm install 22` / `fnm install 22` |
| **npm** | 10.9.4 | Bundled with Node |
| **Midnight `compact`** | **0.5.1** (exact) | `npm install -g @midnight-ntwrk/compact@0.5.1` |
| **TypeScript** | 5.2.2 | `npm install -D typescript@5.2.2` |
| **Vite** | 5.4.21 | `npm install -D vite@5.4.21` |

---

## 2. Midnight SDK Packages

### 2.1 Contract Compilation
| Package | Version | Purpose |
|---------|---------|---------|
| `@midnight-ntwrk/compact-js` | 2.5.0 | Compile `.compact` → TypeScript + WASM |
| `@midnight-ntwrk/compact-runtime` | 0.15.0 | Local circuit execution/testing |
| `@midnight-ntwrk/ledger-v8` | **8.0.3** | Ledger state, cost model, crypto primitives |

### 2.2 Frontend Integration
| Package | Version | Purpose |
|---------|---------|---------|
| `@midnight-ntwrk/midnight-js-contracts` | 4.0.4 | `CompiledContract`, `createUnprovenDeployTx`, `submitTxAsync` |
| `@midnight-ntwrk/midnight-js-types` | 4.0.4 | Core types (Bytes, Uint, etc.) |
| `@midnight-ntwrk/midnight-js-utils` | **4.0.4** | Encoding, hashing, witnesses |
| `@midnight-ntwrk/midnight-js-network-id` | 4.0.4 | Network configuration |
| `@midnight-ntwrk/midnight-js-fetch-zk-config-provider` | 4.0.4 | Load ZK keys from HTTP |
| `@midnight-ntwrk/midnight-js-indexer-public-data-provider` | 4.0.4 | Query contract state |
| `@midnight-ntwrk/wallet-sdk-address-format` | 3.1.0 | Address encoding/decoding |
| `@midnight-ntwrk/wallet-sdk` | 3.1.0 | 1AM wallet integration |

### 2.3 Critical: Overrides
**Must be in both `frontend/package.json` and `sdk/package.json`:**
```json
"overrides": {
  "@midnight-ntwrk/ledger-v8": "8.0.3",
  "@midnight-ntwrk/midnight-js-utils": "4.0.4"
}
```
Without these, duplicate `ledger-v8` and `midnight-js-utils` cause:
- `expected instance of _CostModel` (runtime)
- Type identity mismatches (compile-time)

---

## 3. Frontend Dependencies

### 3.1 Core
| Package | Version |
|---------|---------|
| `react` | 18.2.0 |
| `react-dom` | 18.2.0 |
| `react-router-dom` | 6.20.0 |

### 3.2 Build Tools
| Package | Version | Note |
|---------|---------|------|
| `vite` | 5.4.21 | Not Vite 6 (Rolldown not ready) |
| `@vitejs/plugin-react` | 4.2.0 | |
| `vite-plugin-wasm` | 3.6.0 | Required for ZK WASM |
| `vite-plugin-top-level-await` | 1.5.0 | Required for WASM init |
| `vite-plugin-node-polyfills` | 0.26.0 | buffer, events, stream, util |

### 3.3 Styling
| Package | Version |
|---------|---------|
| `tailwindcss` | 3.4.0 |
| `postcss` | 8.4.0 |
| `autoprefixer` | 10.4.0 |

---

## 4. Testing Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `vitest` | 2.0.0 | Unit/integration tests |
| `@vitest/coverage-v8` | 2.0.0 | Coverage reports |
| `tsx` | 4.19.0 | TypeScript execution for scripts |

---

## 5. Network Endpoints (Midnight Preprod)

| Service | URL |
|---------|-----|
| **RPC** | `https://rpc.preprod.midnight.network` |
| **Indexer HTTP** | `https://indexer.preprod.midnight.network/api/v4/graphql` |
| **Indexer WS** | `wss://indexer.preprod.midnight.network/api/v4/graphql/ws` |
| **Explorer** | `https://preprod.midnightexplorer.com` |
| **Faucet** | `https://faucet.preprod.midnight.network` |

---

## 6. Version Compatibility Matrix

| Component | Version | Compatible With |
|-----------|---------|-----------------|
| `compact` CLI | 0.5.1 | `compact-runtime` 0.15.0, `compact-js` 2.5.0 |
| `compact-runtime` | 0.15.0 | `ledger-v8` 8.0.3 |
| `compact-js` | 2.5.0 | `midnight-js-contracts` 4.0.4 |
| `midnight-js-contracts` | 4.0.4 | `midnight-js-types` 4.0.4, `midnight-js-utils` 4.0.4 |
| `midnight-js-utils` | 4.0.4 | `ledger-v8` 8.0.3 |
| `wallet-sdk` | 3.1.0 | `wallet-sdk-address-format` 3.1.0 |
| Vite | 5.4.21 | React 18, TypeScript 5.2 |
| TypeScript | 5.2.2 | Vite 5, React 18 |
| Node.js | 22.x | All above |

---

## 7. Common Version Issues

### 7.1 `compact` Version Mismatch
```
ERROR: compact version 0.6.x detected. Requires 0.5.x
```
**Fix:**
```bash
npm install -g @midnight-ntwrk/compact@0.5.1
# Verify
compact --version  # Must show: compact 0.5.1
```

### 7.2 `ledger-v8` Duplicate
```
expected instance of _CostModel
```
**Fix:** Add overrides to `package.json`:
```json
"overrides": {
  "@midnight-ntwrk/ledger-v8": "8.0.3",
  "@midnight-ntwrk/midnight-js-utils": "4.0.4"
}
```
Then: `rm -rf node_modules package-lock.json && npm install`

### 7.3 TypeScript Target
```
TS6 features fail on Vercel build
```
**Fix:** `tsconfig.app.json` must use:
```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["ES2020", "DOM"],
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```
**NOT** `"target": "es2023"` or `"erasableSyntaxOnly": true`

### 7.4 Vite 6 / Rolldown
```
Build fails with Rolldown errors
```
**Fix:** Pin Vite to 5.x:
```json
"vite": "5.4.21"
```

### 7.5 React 19
```
Midnight SDK types incompatible with React 19
```
**Fix:** Pin React to 18:
```json
"react": "18.2.0",
"react-dom": "18.2.0"
```

---

## 8. Verification Commands

```bash
# Verify all versions
compact --version                    # 0.5.1
node --version                       # v22.x.x
npm --version                        # 10.x.x
npx tsc --version                    # 5.2.2
npx vite --version                   # 5.4.21

# Verify Midnight packages
npm ls @midnight-ntwrk/ledger-v8              # Should show 8.0.3 (single)
npm ls @midnight-ntwrk/midnight-js-utils      # Should show 4.0.4 (single)
npm ls @midnight-ntwrk/compact-runtime        # 0.15.0
npm ls @midnight-ntwrk/compact-js             # 2.5.0
npm ls @midnight-ntwrk/midnight-js-contracts  # 4.0.4

# Test compile
compact compile contracts/BusinessRegistry.compact /tmp/test

# Test frontend build
cd frontend && npm run build
```

---

## 9. CI/CD Pipeline Versions

```yaml
# .github/workflows/ci.yml
env:
  NODE_VERSION: '22'
  COMPACT_VERSION: '0.5.1'
  NPM_VERSION: '10.9.4'

steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ env.NODE_VERSION }}
      cache: 'npm'

  - name: Install compact
    run: npm install -g @midnight-ntwrk/compact@${{ env.COMPACT_VERSION }}

  - name: Compile contracts
    run: |
      for f in contracts/*.compact; do
        compact compile "$f" "managed/$(basename $f .compact)"
      done

  - name: Install frontend deps
    run: cd frontend && npm ci

  - name: Type check
    run: cd frontend && npx tsc --noEmit

  - name: Build frontend
    run: cd frontend && npm run build

  - name: Run tests
    run: npm test
```

---

*Toolchain reference for VeilCommerce — see `frontend/package.json`, `sdk/package.json` for actual dependency files.*