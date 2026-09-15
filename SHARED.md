# VeilCommerce — Shared Architecture Notes

> **Cross-cutting patterns and conventions used across contracts, circuits, SDK, and frontend**

---

## 1. Naming Conventions

### 1.1 Contract Files
```
BusinessRegistry.compact    # PascalCase, matches contract name
PurchaseOrder.compact
Escrow.compact
Invoice.compact
Financing.compact
Compliance.compact
Settlement.compact
CredentialRegistry.compact
```

### 1.2 Circuits
```
circuits/
├── funds/
│   └── proof_of_funds.compact
├── inventory/
│   └── proof_of_inventory.compact
├── compliance/
│   └── proof_of_compliance.compact
├── delivery/
│   └── proof_of_delivery.compact
└── financing/
    └── proof_of_financing.compact
```

### 1.3 SDK Modules
```
sdk/
├── business/
├── orders/
├── escrow/
├── invoices/
├── financing/
├── compliance/
├── credentials/
├── settlement/
├── proofs/
└── index.ts          # Unified factory
```

### 1.4 Frontend Pages
```
pages/
├── Landing.tsx
├── Dashboard.tsx
├── Trade.tsx
├── Orders.tsx
├── Escrow.tsx
├── Invoices.tsx
├── Financing.tsx
├── Compliance.tsx
├── Portfolio.tsx
├── Activity.tsx
└── Settings.tsx
```

---

## 2. Compact Code Patterns

### 2.1 Domain-Separated Key Derivation
```compact
// ALWAYS use domain tags
pure circuit deriveBusinessId(sk: BusinessSecret): Bytes<32> {
  return persistentHash<Vector<2, Bytes<32>>>([
    pad(32, "veil:business:id:v1"),
    sk.bytes
  ]);
}

// Different tag per role/contract
"veil:business:id:v1"
"veil:party:id:v1"
"veil:registry:admin:v1"
"veil:invoice:issuer:v1"
"veil:invoice:party:v1"
"veil:investor:id:v1"
"veil:escrow:party:v1"
"veil:financing:party:v1"
"veil:cred:holder:v1"
"veil:cred:issuer:v1"
"veil:compliance:subject:v1"
"veil:compliance:admin:v1"
"veil:settlement:party:v1"
```

### 2.2 Sealed Admin Keys
```compact
// NEVER use ownPublicKey() — it's bypassable
sealed ledger adminKey: Bytes<32>;

constructor() {
  const adminSecret = getAdminSecret();
  const adminPub = deriveAdminId(adminSecret);
  adminKey = disclose(adminPub);
}

// Verify in circuits
const adminSecret = getAdminSecret();
const adminPub = deriveAdminId(adminSecret);
assert(disclose(adminPub == adminKey), "Only admin");
```

### 2.3 Nullifier Pattern (Replay Protection)
```compact
// Ledger
ledger usedNullifiers: Set<Bytes<32>>;

// Pure circuit
pure circuit computeNullifier(sk: Secret, action: Bytes<32>): Bytes<32> {
  return persistentHash<Vector<2, Bytes<32>>>([
    sk.bytes,
    action
  ]);
}

// In circuit
const nullifier = computeNullifier(sk, actionHash);
const disclosedNull = disclose(nullifier);
assert(disclose(!usedNullifiers.member(disclosedNull)), "Replay");
usedNullifiers.insert(disclosedNull);
```

### 2.4 Commitment Schemes
```compact
// Struct for domain separation
struct AmountData {
  amount: Uint<64>;
  salt: Bytes<32>;
}

// Pure commitment circuit
pure circuit commitAmount(amount: Uint<64>, salt: Bytes<32>): Bytes<32> {
  return persistentHash<AmountData>(
    AmountData { amount: amount, salt: salt }
  );
}

// In circuit
const commitment = commitAmount(amount, nonce);
// Later verify
const recomputed = commitAmount(privateAmount, nonce);
assert(disclose(recomputed == storedCommitment), "Commitment mismatch");
```

### 2.5 Witness Declarations
```compact
// Private inputs — NEVER on-chain
witness getBusinessSecret(): BusinessSecret;
witness getAdminSecret(): BusinessSecret;
witness businessSalt(): Bytes<32>;
witness credentialPreimage(): Bytes<32>;
witness localAmount(): Uint<64>;
witness localCreditScore(): Uint<16>;
```

### 2.6 Disclose Pattern
```compact
// ALWAYS disclose public outputs
businessRegistry.insert(disclosedId, disclose(record));
businessStatus.insert(disclosedId, disclose(VerificationStatus.Verified));
acknowledged.insert(disclose(invoiceId));  // Set: single arg
usedNullifiers.insert(disclosedNull);      // Set: single arg

// For Maps: disclose(key), disclose(value)
jurisdictionAllowed.insert(disclose(jurisdiction), disclose(allowed));

// For reads: disclose on lookup
return businessRegistry.lookup(disclosedId).commitment;
```

### 2.7 State Machine Enums
```compact
export enum OrderStatus {
  Draft, AwaitingSeller, Confirmed, Funded,
  Shipped, Delivered, Settled, Cancelled, Disputed
}

// Enforce transitions
assert(disclose(rec.status == OrderStatus.Confirmed), "Must be confirmed");
assert(disclose(rec.buyerVerified && rec.sellerVerified && rec.fundsVerified), "Verification incomplete");
```

### 2.8 Circuit Return Types
```compact
// Read-only circuits: no state change
export circuit getOrder(orderId: Bytes<32>): OrderRecord {
  // ...
}

// State-changing circuits: return []
export circuit createOrder(...): [] {
  // ...
}

// Boolean circuits: return Boolean
export circuit isVerified(businessId: Bytes<32>): Boolean {
  // ...
}
```

---

## 3. TypeScript SDK Patterns

### 3.1 Module Structure
```typescript
// sdk/business/index.ts
export interface BusinessSecret { bytes: Uint8Array }
export enum VerificationStatus { ... }
export enum BusinessCategory { ... }
export interface RegisterBusinessParams { ... }

export class BusinessSDK {
  constructor(private contract: any, private witnesses: any) {}

  async registerBusiness(params: RegisterBusinessParams): Promise<string> {
    const tx = await this.contract.circuits.registerBusiness(...);
    return tx.hash;
  }
}

export function createBusinessSDK(contract: any, witnesses: any): BusinessSDK {
  return new BusinessSDK(contract, witnesses);
}
```

### 3.2 Unified Factory
```typescript
// sdk/index.ts
export function createVeilCommerceSDK(
  contracts: ContractInstances,
  witnesses: WitnessProviders
): VeilCommerceSDK {
  return {
    business: createBusinessSDK(contracts.businessRegistry, witnesses.business),
    orders: createOrdersSDK(contracts.purchaseOrder, witnesses.orders),
    escrow: createEscrowSDK(contracts.escrow, witnesses.escrow),
    // ...
  };
}
```

### 3.3 Witness Providers
```typescript
// Each module gets its own witness provider
interface WitnessProviders {
  business: any;
  orders: any;
  escrow: any;
  invoices: any;
  financing: any;
  compliance: any;
  credentials: any;
  settlement: any;
}
```

---

## 4. Frontend Patterns

### 4.1 Component Structure
```tsx
// Page components: PascalCase, descriptive
export function Dashboard() { ... }
export function Trade() { ... }

// Reusable components: components/
export function VerificationDot({ label, verified }) { ... }
export function VerificationBadge({ label, status, desc }) { ... }
export function DealCard({ deal }) { ... }
export function Metric({ label, value, color }) { ... }
```

### 4.2 Layout Wrapper
```tsx
// components/Layout.tsx
export function Layout() {
  return (
    <div className="min-h-screen bg-veil-50">
      <aside className="fixed lg:translate-x-0 -translate-x-full ...">Sidebar</aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 ...">Top Bar</header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### 4.3 Tailwind Design System
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      veil: { 50: '#f8fafc', ..., 950: '#020617' },
      accent: { 50: '#fdf4ff', ..., 900: '#701a75' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    }
  }
}
```

### 4.4 Private Data Visual Indicators
```tsx
// Consistent "private" badge
<span className="badge-private">Private</span>

// Verification dots
<div className="flex items-center gap-1.5">
  <span className={`w-2 h-2 rounded-full ${verified ? 'bg-green-500' : 'bg-red-500'}`} />
  <span className="font-medium text-veil-700">{label}</span>
</div>

// Private indicator prefix
.private-indicator::before {
  content: '';
  @apply w-2 h-2 rounded-full bg-veil-400;
}
```

---

## 5. Testing Patterns

### 5.1 Unit Test Structure
```typescript
// tests/contracts/business_registry.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('BusinessRegistry', () => {
  let state: BusinessRegistryState;

  beforeEach(() => {
    state = { /* fresh state */ };
  });

  it('should register a new business', () => { ... });
  it('should reject duplicate registration', () => { ... });
  it('should verify business', () => { ... });
});
```

### 5.2 Proof Verification Tests
```typescript
describe('Proof Verification', () => {
  it('should accept valid proof', () => {
    const proof = { valid: true };
    expect(proof.valid).toBe(true);
  });

  it('should reject tampered proof', () => {
    const proof = { valid: false, tampered: true };
    expect(proof.valid).toBe(false);
  });

  it('should reject replay', () => {
    const used = new Set(['null_001']);
    expect(used.has('null_001')).toBe(true);
  });
});
```

### 5.3 E2E Flow Test
```typescript
// tests/integration/e2e_trade_flow.test.ts
describe('E2E: $50k Nigerian → Chinese Trade', () => {
  it('Scene 1: Business verification', () => { ... });
  it('Scene 2: PO creation + ZK proofs', () => { ... });
  it('Scene 3: Escrow funding', () => { ... });
  it('Scene 4: Delivery verification', () => { ... });
  it('Scene 5: Settlement', () => { ... });
  it('Scene 6: Invoice generation', () => { ... });
  it('Scene 7: Invoice financing', () => { ... });
  it('Scene 8: Complete flow verification', () => { ... });
});
```

---

## 6. Documentation Patterns

### 6.1 Contract Header
```compact
// =============================================================================
// VeilCommerce — BusinessRegistry
// -----------------------------------------------------------------------------
// Private business identity as infrastructure for commerce (Credence pattern).
//
// Private: legal identity, registration credentials, authorized reps, salt
// Public : commitment, businessId, jurisdiction, category, verification status,
//          revocation + nullifier (replay protection)
// =============================================================================
```

### 6.2 Circuit Header
```compact
// =============================================================================
// VeilCommerce — Proof of Funds Circuit
// -----------------------------------------------------------------------------
// Proves: private_balance >= required_amount
// without revealing the actual balance.
//
// Inputs (private witnesses):
//   - private_balance: the prover's actual balance
//   - required_amount: the amount needed for the transaction
//   - balance_salt: salt for balance commitment
// =============================================================================
```

### 6.3 Module Export
```typescript
// sdk/index.ts - re-export everything
export * from './business';
export * from './orders';
// ...

// Types
export type { BusinessSecret, RegisterBusinessParams } from './business';
// Factory
export function createVeilCommerceSDK(...) { ... }
```

---

## 7. Deployment Patterns

### 7.1 Contract Compile
```bash
# From contracts/
for f in *.compact; do
  compact compile "$f" "../managed/$(basename $f .compact)"
done
```

### 7.2 ZK Asset Sync
```bash
# Copy keys/zkir to frontend public/
for name in BusinessRegistry PurchaseOrder Escrow Invoice Financing Compliance Settlement CredentialRegistry; do
  cp -r managed/$name/keys public/contract/$name/
  cp -r managed/$name/zkir public/contract/$name/
done

# Copy TS bindings
cp -r managed/* frontend/contracts/
```

### 7.3 Deploy Script Pattern
```typescript
const deployTx = await createUnprovenDeployTx(providers, {
  compiledContract,
  args: [],
  signingKey: sampleSigningKey(),
});
await submitTxAsync(providers, { unprovenTx: deployTx.private.unprovenTx });
const address = deployTx.public.contractAddress;
await waitForContractIndexed(api, address);
```

---

*Shared patterns for VeilCommerce — enforce consistency across all layers.*