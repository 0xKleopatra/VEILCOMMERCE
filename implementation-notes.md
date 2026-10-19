# VeilCommerce — Implementation Notes

> Internal implementation notes for the project stack and Midnight integration.
> This document describes the design decisions and operational checklist for the VeilCommerce application without attributing implementation details to external repositories.

---

## 1. Architecture overview

VeilCommerce is a private B2B commerce stack built around Midnight’s dual-state model:

- private witness data is kept locally and never disclosed by default
- public state stores commitments, flags, and nullifiers
- compact contracts enforce business logic and state transitions
- browser-side workflow code coordinates wallet, proof generation, and ledger reads

The core goal is to prove business eligibility and trade conditions without revealing sensitive commercial information.

---

## 2. What was missing before implementation

Before the project reached its current state, the stack was missing several critical pieces:

- compact contracts were not compiled or exposed as browser-loadable artifacts
- providers lacked persistent private state and stable indexer access patterns
- wallet connection logic did not handle delayed injection or multiple connection paths consistently
- UI flows were still using demo/mock data instead of live ledger-backed state
- end-to-end validation and proof-server health checks were not formalized

These gaps were addressed by structuring the app around a persistent provider layer, compiled contract management, wallet/session handling, and explicit verification checks.

---

## 3. Implementation milestones

### 3.1 Contracts + toolchain

The project compiles a set of compact contracts and syncs generated ZK artifacts into the browser-facing deployment layout so the frontend can load prover/verifier assets and contract metadata reliably.

The build pipeline includes:

```bash
# compile compact contracts into managed output folders
node scripts/compile-all.mjs

# sync generated keys and zkir artifacts into browser/public assets
node scripts/sync-zk.mjs
```

This ensures compact modules are available to the frontend for on-chain deployment and proof operations without manual file drift.

### 3.2 Wallet + session integration

The wallet flow is designed to tolerate delayed wallet injection, multiple wallet variants, and preprod network setup.

Key requirements for the session path include:

- wallet discovery without hardcoded assumptions about a single connector
- consistent session establishment across network and proof-provider setup
- provider setup for public data access, private state management, and transaction submission
- graceful fallback behavior when a wallet or proof service is not immediately available

### 3.3 Providers + private state persistence

Private state is persisted in a browser-safe local store so session context survives reloads without exposing sensitive values to the public ledger.

The provider layer is responsible for:

- maintaining private state per account/session
- storing signing keys and role-specific state material
- exposing public state queries through the indexer/public data provider
- checking proof-server health before executing proof-intensive actions
- requesting funds or testnet support when required by the environment

### 3.4 Contract manager + deployment workflow

The application uses a single contract manager abstraction to:

- load compiled contract modules by name
- prepare witnesses and compiled assets for the browser runtime
- deploy new contract instances
- submit contract calls for state-changing actions
- query ledger state after execution for confirmation and UI updates

This centralizes contract lifecycle operations and makes the frontend logic easier to test and reason about.

### 3.5 Witnesses and proofs

The compact witness model separates private values from public commitments:

- private values remain local to the device
- public state only stores commitments, flags, and nullifiers
- proof validation confirms a private witness matches a public commitment without revealing the underlying data

This pattern is used across the trade lifecycle, including purchase order verification, escrow funding, invoice acknowledgment, compliance checks, and financing eligibility.

### 3.6 Trade flow + ledger queries

The main user journey is structured as a real, end-to-end trade flow:

- create a purchase order
- verify trading parties and required conditions
- fund or release escrowed funds based on proof-backed state transitions
- verify delivery and settlement records
- read ledger state for each contract instance to keep the UI grounded in the live chain state

The app reads from the indexer or ledger after actions so dashboards and status screens reflect actual contract state rather than static mock data.

### 3.7 Frontend cleanup + live data usage

The frontend was updated to remove placeholder values and to rely on actual wallet, contract, and indexer state where possible.

This included:

- replacing fake account addresses with real wallet-derived addresses
- removing static mock trade metrics from dashboard-style views
- reading live ledger data for orders, escrow records, and system statistics
- ensuring proof and transaction flows fail visibly when backend assumptions are not met

### 3.8 Validation + proof-server checks

The project includes validation steps keyed to proof generation and contract readiness:

- contract compile verification
- sync verification for generated ZK assets
- proof-server health checks before proof-heavy actions
- simulator-style validation of state transitions and commitment logic

This ensures the application is not only conceptually correct but operationally prepared for a real preprod deployment.

---

## 4. How to run

```bash
# 1. Compile compact contracts
cd veilcommerce
node scripts/compile-all.mjs

# 2. Sync generated ZK assets to the browser app
node scripts/sync-zk.mjs

# 3. Bring up the proof-server locally if needed
docker compose -f docker-compose.yml up -d
curl -f http://127.0.0.1:6300/health

# 4. Start the frontend
cd frontend
npm install
npm run dev
```

After startup, the app can be used to connect a wallet, create trade flows, verify conditions, and query contract state through the Midnight indexer.

---

## 5. Implementation status

The project is structured as a self-contained Midnight trade-finance application with:

- a compact contract layer
- wallet and provider integration
- browser-side proof setup
- persistent private state management
- live ledger-backed data flow

This internal implementation document intentionally avoids external repository attribution so the project remains focused on the VeilCommerce architecture and operational decisions rather than on copied source references.

