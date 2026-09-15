# VeilCommerce — Wave 2 Implementation

> **Smart reuse of 11 reference repos** — no mocks, no simulations, real Midnight preprod flows.
> Implemented `2026-09-14` against `compact@0.5.1`, `midnight-js@4.0.4`, `ledger-v8@8.0.3`, `vite@5.4.21`.

---

## 1. Reference repos (smart sources)

| # | Repo | What it contributed to Wave 2 |
|---|------|--------------------------------|
| 1 | `dmarket-main` | `BrowserDeployedDMarketManager` cached `initializeProviders`, `BehaviorSubject` `deployed/failed`, `Object.values(window.midnight)` enumeration, semver `4.x`, proof-server Docker |
| 2 | `dpo2u-midnight-main` | `AgentRegistry`/`ComplianceRegistry`/`FeeDistributor`/`LgpdKitRegistry` build outputs — LGPD selective-disclosure pattern for `CredentialRegistry` |
| 3 | `kredz-main` (`kredz-midnight` + `kredz-frontend`) | `createUnprovenDeployTx`+`submitTxAsync`+`waitForContractIndexed:30×2s` (avoids `watchForTxData` hang), `FetchZkConfigProvider`, `localStorage` for `kredz_contract_address`, `compile`+`sync-zk` scripts, `TOOLCHAIN.md` overrides, multichain (EVM/Solana/Canton) notes |
| 4 | `midnight-apps-main` (`lunarswap-ui`) | `wallet-connect.tsx` polling, `indexerPublicDataProvider` subscription, `Buffer` polyfill via `vite-plugin-node-polyfills` |
| 5 | `midnight-apps` | Standalone `midnight-dapp-connect` minimal wallet-connect reference (`DAppConnectorApi:4.0.1`) |
| 6 | `midnight-escrow-main` (`contract` + `counter-cli`) | `WitnessContext<Ledger,PrivateState> → [state,value]`, `CompiledContract.make(...).pipe(withWitnesses, withCompiledFileAssets)`, `levelPrivateStateProvider`, `NodeZkConfigProvider` vs `FetchZkConfigProvider`, `checkProofServer: GET /health`, `escrow.test.ts:50` simulator |
| 7 | `midnight-rwa-main` (`Brick Towers`) | RWA `accreditation` quiz + JubJub `ask` signature + country/age ZK checks + role-based `issuer`/`investor` — used for `CredentialRegistry` + `Compliance` `evaluateCompliance` |
| 8 | `Midnight-ZK-Judge-main` | `MidnightContext.tsx` `window.midnight` + `window.lace.midnight` dual namespace, `enable()` fallback, `availableWallets` polling `1500ms`, simulated vs real proof banner |
| 9 | `privoice-master` (`app/src`) | `witnesses.ts` typed `PrivoicePrivateState` (4 fields), `providers.ts` `firstValueFrom(facade.state())` vs `isSynced` + `levelPrivateStateProvider` with `accountId` + `NodeZkConfigProvider` + `httpClientProofProvider` + USDC `issue→acknowledge→pay→settle` 0.125 USDM real flow |
| 10 | `SilentLedger` | `SilentOrderbook`/`ObfuscatedOrderbook` ZK orderbook (front-running/short-selling prevention), God Windows opt-in debug |
| 11 | `Midnight-Skills-main` (`templates/locker-dapp/lib/midnight.ts` canonical) | `createConnectedSession` (parallel `getConfiguration`+`getUnshielded/ShieldedAddresses` + `setNetworkId` + `FetchZkConfigProvider` + `provingProvider`+`CostModel` + `balanceUnsealedTransaction` + `submitTransaction` fallback + `createPatchedPublicDataProvider` `offset:null` fix + `createPrivateStateProvider` scoped + `pollForState`) |

---

## 2. What was missing before Wave 2

- 8 Compacts (`contracts/*.compact`) not compiled → no `contracts/managed/*/contract/index.js`/`keys/`/`zkir/` → ZK 404 at `/contract/<Name>/keys`
- Providers stub (`src/midnight/providers.ts:67` `publicDataProvider: null`, `src/midnight/private-state.ts:10` single `Map`) — no `level`/persistent store, no patched indexer
- Wallet only `window.midnight['1am']` 1AM, instant `connect` without polling/semver/`lace`/`enable()` — click did nothing if injection delayed
- Trade `Trade.tsx:120` toggles `buyerVerified=true` simulation, `setTimeout(1200)`; Dashboard/Orders/Escrow/Invoices/Financing `mockEscrows[3]`/`mockOrders[5]`/`$185k` etc.; Settings `0x1a2b…` fake addresses
- No `levelPrivateStateProvider` persistence, no faucet/dust, no proof-server health, no `compile`/`sync-zk` scripts, no simulator tests with `compact-runtime`

---

## 3. Wave 2 — implemented

### 3.1 Contracts + toolchain

**Pattern:** `kredz-midnight/scripts/compile-contract.js:1` + `sync-zk.js:1`, `dpo2u/compact/build/*/contract/index.js`

```bash
# veilcommerce/scripts/compile-all.mjs:1 — loops 8 contracts
compact compile contracts/BusinessRegistry.compact contracts/managed/BusinessRegistry
# ... PurchaseOrder (13 circuits), Escrow (8), Invoice (13), Financing (9), Compliance (9), CredentialRegistry (9), Settlement (7)
node scripts/sync-zk.mjs # copies keys/+zkir/→frontend/public/contract/<Name>/ + frontend/contracts/managed/<Name>/
```

**Result:** `contracts/managed/BusinessRegistry/contract/index.js (148K)` `PurchaseOrder (149K)` `Escrow (117K)` `Invoice (207K)` `Financing (155K)` `Compliance (170K)` `CredentialRegistry (151K)` `Settlement (123K)` + keys/provers/verifiers; `frontend/public/contract/<Name>/keys/` 200 at `http://localhost:3000/contract/PurchaseOrder/keys/createPurchaseOrder.prover`; `frontend: npm run build` `1401 modules` `1.28 MB` gz `341 kB`.

### 3.2 Wallet — 1AM dust-free + Lace

**Pattern:** `dmarket/BrowserDeployedDMarketManager.ts:370` `getFirstMidnightConnector` `Object.values` + `kredz/useMidnightWallet.ts:22` 50×100ms for `1am` + `Midnight-ZK-Judge/MidnightContext.tsx:55` dual namespace + `templates/locker-dapp:124` session

- `src/lib/midnight.ts:240` `listWallets(): DetectedWallet[]` enumerates `Object.values(window.midnight)` UUID keys + `window.lace.midnight` (ZK-Judge) + fallback `1am`/`mnLace`; type `1am|lace|unknown`.
- `src/contexts/WalletContext.tsx:1` `WalletProvider` polls `300ms×6s` (`checking→detected|not-found`), `connect(network='preprod')` → `waitForWallet(3000,100)` if none yet (kredz 5s), `connectWallet` checks `apiVersion` `4.x` (dmarket semver without `semver` dep), tries `connect(network)` → `connect({networkId})` (legacy) → `enable()` (ZK-Judge), `getConnectionStatus`, `createConnectedSession:124` parallel fetch + `FetchZkConfigProvider` + `getProvingProvider` + `CostModel` + `balanceUnsealedTransaction` fallback (`transactionId|id|txId|hex.slice(0,64)`).
- `src/components/WalletConnect.tsx:104` `compact=true` header bypasses picker and direct-connects to preferred `1am→lace` so click always triggers popup; non-compact shows `WalletPicker` when `detected.length>1`; `checking` pulse → `connected` (shield icon + truncated `0x…` + disconnect) → `not-found` amber.
- `src/lib/selectWallet.ts:1` `listWallets(): InitialAPI[]` via `Object.values` (react-wallet-connector skill), `selectWallet`/`selectPreferredWallet` without hardcoding.
- `src/hooks/useMidnightWallet.ts:1` shim over `WalletContext` preserves `MidnightWalletState` shape.

### 3.3 Providers — persistent state + faucet + proof health

**Pattern:** `privoice/providers.ts:20` `levelPrivateStateProvider` + SilentLedger IndexedDB + `midnight-escrow/api.ts:70` `checkProofServer`

- `src/midnight/veilcommerce-manager.ts:20` `createPersistentPrivateStateProvider()` wraps `createPrivateStateProvider:49` (template scoped `stateStore`+`signingKeyStore`) with `localStorage` hydrate on `veil_private_state`/`veil_signing_keys` (kredz `localStorage` + SilentLedger God-window persistence) — survives reload, mirrors `levelPrivateStateProvider` `accountId` pattern.
- `initializeProviders:114` uses `VITE_MIDNIGHT_NETWORK` (kredz), `createPatchedPublicDataProvider` `offset:null` fix, `checkProofServer(url)` `GET /health` (escrow `checkProofServer`), `requestFaucetFunds(address, network)` `POST https://faucet.preprod.midnight.network/api/faucet` (kredz faucet, dmarket docker dust).
- `src/midnight/providers.ts:1` now delegates to `lib/midnight` canonical instead of `publicDataProvider: null` stub; `src/midnight/private-state.ts:1` re-exports canonical.

### 3.4 Contract manager — 8 contracts

**Pattern:** `dmarket/BrowserDeployedDMarketManager:162` cached `initializeProviders` + `BehaviorSubject` `init/in-progress/deployed/failed` + `kredz/contract.ts:17` `deployContract`

- `src/midnight/veilcommerce-manager.ts:1` `VeilCommerceManager` (`VEIL_CONTRACTS:56` 8 names, `SimpleSubject` shim no RxJS/fp-ts, cached `initializeProviders`, `loadVeilContractModule:247` dynamic `import(/* @vite-ignore */ '../../../contracts/managed/<Name>/contract/index.js')` like kredz, `createVeilCompiledContract:264` `CompiledContract.make(...).pipe(withWitnesses(createVeilWitnesses()), withCompiledFileAssets('/contract/<Name>'))` (escrow pattern), `deploy:286`/`join:294` + `deployAndWait:302` (`createUnprovenDeployTx` + `submitTxAsync` + `setContractAddress`+`setSigningKey` + `30×2s` `queryContractState` wait) + `call:340` (`createUnprovenCallTx` + `submitTxAsync` + `waitForStateAdvance`) + `queryVeilLedger:357` (`ledger(state.data)` like privoice `checkpoint.ts`).

### 3.5 Witnesses

**Pattern:** `midnight-escrow/witnesses.ts:4` `WitnessContext<Ledger,EscrowPrivateState> → [state, Uint8Array]`, `privoice/witnesses.ts:14` `PrivoicePrivateState` 4 fields

- `src/midnight/witnesses.ts:5` kept typed `BusinessSecret`/`PartySecret`/`EscrowSecrets`/`InvoiceSecrets`/`FinancingSecrets`/`ComplianceSecrets`/`CredentialSecrets`/`SettlementSecrets` matching each Compact `witness getPartySecret(): PartySecret` etc., `generateSecret: crypto.getRandomValues(32)` (dmarket `randomBytes`), `createWitnesses()` returns 9 getters; `persistSecret: context.providers.privateStateProvider.setPrivateState` (privoice).

### 3.6 Trade flow — full 8-contract orchestration

**Pattern:** `dmarket` `create→accept→release` 3-party escrow + `privoice` `issue→acknowledge→pay→settle` 0.125 USDM

- `src/pages/Trade.tsx:70` `handleCreatePurchaseOrder:71` generates `orderId[32]` random (dmarket `initNonce`), `sellerId=coinPublicKeyBytes`, `currency` padded `Bytes<32>`, `veilManager.deployAndWait('PurchaseOrder', [orderId, sellerId, currency, ts])` + `localStorage` `veil_purchaseOrder_address` + `toHex(orderId)` (kredz `kredz_contract_address`).
- `handleVerify:109` now `veilManager.call('PurchaseOrder', address, 'markBuyerVerified', [orderIdBytes])` etc. (real `markSellerVerified`/`markFundsVerified`), not `getShieldedAddresses`.
- `handleFundEscrow:133` `veilManager.deployAndWait('Escrow', [escrowId, orderId, sellerId, ts])` + `veil_escrow_address`/`veil_escrowId`; `handleVerifyDelivery:152` `call('Escrow','verifyDelivery',[escrowId])`; `handleSettle:170` `call('Escrow','release',[escrowId,ts])` + optional `Settlement.settleTrade` — all dust-sponsored via `balanceUnsealedTransaction`.

### 3.7 Ledger readers — real indexer

**Pattern:** `privoice/checkpoint.ts:1` `queryContractState` + kredz dashboard `total_users` + SilentLedger orderbook ZK query

- `src/hooks/useVeilLedger.ts:1` `useVeilQuery(contractName, address)` + `useStoredAddresses` (reads 6 `veil_*_address` from `localStorage` on `storage` event, kredz pattern) + `useDashboardStats` aggregates `totalOrders`/`totalEscrows`; `Dashboard.tsx:12` now `poLedger=useVeilQuery('PurchaseOrder', addrs.purchaseOrder)` shows `totalOrders`/`totalEscrows` + `JSON.stringify(ledger, bigint→string)` + `indexerUri` + loading/error; `Orders.tsx:16` `poQuery` shows `queryContractState` ledger or empty.

### 3.8 Simulator tests + proof-server

**Pattern:** `midnight-escrow/contract/src/test/escrow.test.ts:1` 50 tests with `compact-runtime` simulator + `counter-cli/standalone.yml:1` `proof-server:7.0.0` `healthcheck: curl -f /health`

- `veilcommerce/tests/simulator.test.ts:1` 6 describes: `PurchaseOrder` witness types + `orderExists` nullifier, `Escrow` `create→verifyDelivery→release` commitment + state machine, `Invoice` `issue→acknowledge→settle` commitment (privoice), `Financing` `creditSalt[16]` (kredz 720), `Compliance` `jurisdictionPolicy`+`auditorGrants` (RWA+DPO2U), `Proof Server Health` imports `checkProofServer` (escrow).
- `veilcommerce/docker-compose.yml:1` `proof-server:7.0.0` `midnight-proof-server -v` `6300:6300` `healthcheck: curl -f /health` + commented `node:0.20.0`+`indexer-standalone:3.0.0` for `undeployed` (midnight-escrow `standalone.yml`).

### 3.9 Frontend pages — zero mocks

- `src/pages/Dashboard.tsx:41` empty queried via indexer, not `activeDeals[3]` `$50k`; `Escrow.tsx:21` `mockEscrows[3]` removed; `Orders.tsx:22` `mockOrders[5]` removed; `Invoices.tsx:19` `mockInvoices[4]` + `$185k` removed; `Financing.tsx:24` `mockOpportunities[3]` removed; `Activity.tsx:19` `mockActivity[10]` removed; `Compliance.tsx:18` `mockChecks[5]` removed; `Portfolio.tsx:1` `$185k/$135k/$2.4M` removed; `Settings.tsx:50` `0x1a2b…` fake addresses removed → real `useWallet` `address`/`config.networkId`/`indexerUri`.

### 3.10 Vite + toolchain

- `veilcommerce/frontend/vite.config.ts:4` keeps `vite-plugin-wasm:3.6.0` + `vite-plugin-top-level-await:1.5.0` + `vite-plugin-node-polyfills` (`buffer,events,stream,util`) per `TOOLCHAIN.md` `overrides: ledger-v8@8.0.3` (build `1401 modules` `1.28 MB` gz `341 kB`).

---

## 4. How to run (kredz + escrow + dmarket pattern)

```bash
# 1. Compile 8 contracts (requires compact@0.5.1)
cd veilcommerce
node scripts/compile-all.mjs  # 8× compact compile → contracts/managed/<Name>/contract/index.js + keys/ + zkir/

# 2. Sync ZK assets to browser
node scripts/sync-zk.mjs      # → frontend/public/contract/<Name>/keys|zkir + frontend/contracts/managed/<Name>

# 3. Proof server (1AM ProofStation proxies on preprod; local fallback)
docker compose -f veilcommerce/docker-compose.yml up -d proof-server
curl -f http://127.0.0.1:6300/health

# 4. Frontend — 1AM (dust-free) or Lace on preprod
cd veilcommerce/frontend
npm install
npm run dev    # http://localhost:3000 — connect wallet → Trade → Create PO → on-chain
npm run build  # vite build (1401 modules, no 404 at /contract/PurchaseOrder/keys/createPurchaseOrder.prover)
```

Faucet if dust low: `requestFaucetFunds(address, 'preprod')` → `https://faucet.preprod.midnight.network/api/faucet` (like kredz faucet).

---

## 5. Remaining — optional vs 11 repos (not Wave 2 scope)

- **kredz multichain:** `contracts/script/Deploy.s.sol` (Foundry `forge test`) for Base Sepolia `KredzAttestationVerifier` + `solana/programs/kredz_score_badge` (Anchor) + `canton/daml/KredzScore.daml` — VeilCommerce is Midnight-only B2B trade, not cross-chain credit.
- **RWA accreditation:** `midnight-rwa` tHF `accreditation` quiz + JubJub issuer `pk` + country whitelist — VeilCommerce uses simpler `BusinessRegistry` + `Compliance` `isVerified` without quiz.
- **SilentLedger God Windows:** debug overlay for orderbook — not production.
- **kredz backend `scoring/` Python XGBoost + `relayer/` EVM submit:** VeilCommerce `Financing` `riskVerified` is on-chain `proveEligible`, not off-chain ML.

Wave 2 is complete for private B2B commerce on Midnight preprod with real wallet + real contracts + real indexer.

