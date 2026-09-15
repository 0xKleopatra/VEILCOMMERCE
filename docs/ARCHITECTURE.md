# VeilCommerce — Architecture

> **Midnight-native private financial infrastructure**

---

## 1. Architectural Principles

### 1.1 Midnight-Load-Bearing
The privacy architecture fundamentally depends on Midnight. Not `React + DB + random tx`.

```
Private State (business data, financials, credentials)
    ↓ ZK Proofs (persistentHash, persistentCommit)
Public State (commitments, state, nullifiers, timestamps)
    ↓ Midnight Contracts (7 contracts)
Settlement Layer
```

### 1.2 Minimal Public Ledger
Only the minimum necessary on-chain:
- Commitments (not preimages)
- State enums (not full objects)
- Nullifiers (not secrets)
- Timestamps & counters

### 1.3 Domain Separation
Every identity/key derived with unique domain tag:
```
H("veil:business:id:v1", sk)
H("veil:party:id:v1", sk)
H("veil:invoice:issuer:v1", sk)
H("veil:investor:id:v1", sk)
H("veil:escrow:party:v1", sk)
...
```

---

## 2. Component Architecture

### 2.1 Contract Layer (7 Compact Contracts)

```
┌────────────────────────────────────────────────────────────┐
│                    VEILCOMMERCE CONTRACTS                   │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ BusinessReg  │ PurchaseOrder│    Escrow    │   Invoice     │
│  - Registry  │  - Lifecycle │  - Conditional│  - Receivable │
│  - Verification│  - ZK flags│  - Release   │  - Financing  │
├──────────────┼──────────────┼──────────────┼───────────────┤
│  Financing   │  Compliance  │  Settlement  │ CredentialReg │
│  - Risk ZK   │  - Rules ZK  │  - Finality  │  - Disclosure │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

**Shared Patterns:**
- `sealed` admin keys (witness-derived)
- `Counter` for monotonic IDs
- `Map<K, V>` for state, `Set<K>` for flags
- `Set<K>` for nullifiers
- `disclose()` on all public outputs
- Domain-separated `persistentHash`

### 2.2 ZK Circuit Layer (5 Circuits)

| Circuit | Purpose | Inputs (Private) | Outputs (Public) |
|---------|---------|------------------|------------------|
| `funds` | Prove balance ≥ required | balance, salt, required | sufficient, commitment |
| `inventory` | Prove stock ≥ required | inventory, salt, required | sufficient, commitment |
| `compliance` | Prove requirements met | credentials, attrs, rules | compliant, score, commitment |
| `delivery` | Prove shipment complete | evidence, PO, salt, amt | verified, commitment |
| `financing` | Prove risk score ≥ threshold | scores, status, age, rules | eligible, maxAmt, commitment |

### 2.3 SDK Layer (TypeScript)

```
@veilcommerce/sdk
├── business/     → BusinessRegistry
├── orders/       → PurchaseOrder
├── escrow/       → Escrow
├── invoices/     → Invoice
├── financing/    → Financing
├── compliance/   → Compliance
├── credentials/  → CredentialRegistry
├── settlement/   → Settlement
├── proofs/       → ZK circuit wrappers
└── index.ts      → Unified SDK factory
```

**SDK Pattern:**
```typescript
const sdk = createVeilCommerceSDK(contracts, witnesses);
await sdk.orders.createPurchaseOrder(params);
await sdk.escrow.createEscrow(params);
const proof = await sdk.proofs.proveFundsSufficient(input);
```

### 2.4 Frontend Layer (React + Vite)

```
src/
├── components/
│   └── Layout.tsx          # Shell with sidebar, header
├── pages/
│   ├── Landing.tsx         # Marketing page
│   ├── Dashboard.tsx       # Overview + quick actions
│   ├── Trade.tsx           # Stepper: Create→Verify→Escrow→Delivery→Settle
│   ├── Orders.tsx          # Table with filters
│   ├── Escrow.tsx          # Card grid + details
│   ├── Invoices.tsx        # Table + financing actions
│   ├── Financing.tsx       # Marketplace + my requests
│   ├── Compliance.tsx      # Status / Auditor / Policy tabs
│   ├── Portfolio.tsx       # Positions + charts
│   ├── Activity.tsx        # Audit trail with ZK proof IDs
│   └── Settings.tsx        # Wallet/Network/Notifications/Security/API
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities
└── midnight/               # Midnight SDK wiring
```

**State Management:**
- React Context for wallet/contract state
- Local component state for UI
- No global Redux — keep it simple

---

## 3. Data Flow Patterns

### 3.1 Private → Public (Commitment)
```
Private Input (witness)
    ↓
persistentHash(Struct{...})  // or persistentCommit
    ↓
disclose(commitment) → on-chain Map/Set
```

### 3.2 ZK Verification (Proof)
```
Private Inputs (witness)
    ↓
Circuit: assert(condition)  // e.g., balance ≥ required
    ↓
disclose(result) → Boolean on-chain
```

### 3.3 Nullifier (Replay Protection)
```
Secret (witness) + Action + Context
    ↓
persistentHash([secret, action, context])
    ↓
assert(!usedNullifiers.member(nullifier))
    ↓
usedNullifiers.insert(nullifier)
```

### 3.3 Selective Disclosure
```
Subject Secret + Verifier ID + Credential ID
    ↓
nullifier = H(secret, credId, verifierId)
    ↓
assert(!usedCredentialNullifiers.member(nullifier))
    ↓
Return requested fields only
```

---

## 4. Network & Deployment

### 4.1 Midnight Preprod
- RPC: `https://rpc.preprod.midnight.network`
- Indexer: `https://indexer.preprod.midnight.network/api/v4/graphql`
- WS: `wss://indexer.preprod.midnight.network/api/v4/graphql/ws`
- Explorer: `https://preprod.midnightexplorer.com`

### 4.2 Wallet Integration
- **1AM Wallet** (Midnight Preprod)
- Connection via `@midnight-ntwrk/wallet-sdk`
- `createUnprovenDeployTx` + `submitTxAsync` pattern
- `balanceUnsealedTransaction` for fee payment (1AM sponsors)

### 4.3 Contract Deployment Flow
```typescript
// 1. Load compiled contract
const mod = await import('../contracts/managed/xyz/contract/index.js');

// 2. Create compiled contract with witnesses
const compiled = CompiledContract.make('xyz', mod.Contract)
  .pipe(CompiledContract.withWitnesses(witnesses))
  .pipe(CompiledContract.withCompiledFileAssets('/contract/xyz'));

// 3. Deploy
const deployTx = await createUnprovenDeployTx(providers, {
  compiledContract: compiled,
  args: [],
  signingKey: sampleSigningKey(),
});
await submitTxAsync(providers, { unprovenTx: deployTx.private.unprovenTx });
const address = deployTx.public.contractAddress;
```

---

## 5. Development Workflow

### 5.1 Contract Development
```bash
# Edit .compact file
# Compile
compact compile contracts/Xyz.compact contracts/managed/xyz

# Test (via compact-runtime or Vitest)
npm test -- tests/contracts/xyz.test.ts
```

### 5.2 Frontend Development
```bash
cd veilcommerce/frontend
npm install
npm run dev  # http://localhost:3000
```

### 5.3 Type Generation
After contract compile, generated TypeScript bindings in:
```
contracts/managed/xyz/contract/
  ├── index.ts          # Contract class
  ├── witnesses.ts      # Witness types
  ├── circuits.ts       # Circuit types
  └── ledger.ts         # Ledger state types
```

---

## 6. Extensibility

### 6.1 Adding a New Module
1. Create `Xyz.compact` in `contracts/`
2. Add ZK circuit in `circuits/xyz/`
3. Create `sdk/xyz/index.ts`
4. Add page in `frontend/src/pages/Xyz.tsx`
5. Add route in `App.tsx`
6. Add tests in `tests/contracts/xyz.test.ts`

### 6.2 Adding a New Circuit
1. Create `circuits/new/proof.compact`
2. Export pure circuits for off-chain recomputation
3. Add TypeScript wrapper in `sdk/proofs/`
4. Call from relevant SDK module

### 6.3 New Disclosure Level
1. Add enum value in `Compliance.compact`
2. Update `grantDisclosure` logic
3. Add UI in Compliance page

---

*Architecture documented from VeilCommerce source — see `veilcommerce/contracts/`, `veilcommerce/circuits/`, `veilcommerce/sdk/`, `veilcommerce/frontend/` for implementation.*