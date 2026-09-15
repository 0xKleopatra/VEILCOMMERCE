# VeilCommerce — Technical Specification

> **Private financial infrastructure for global commerce**

---

## 1. Overview

VeilCommerce is a privacy-preserving B2B commerce platform built on the Midnight blockchain. It enables businesses to transact, escrow, invoice, and finance trade without exposing commercially sensitive information.

**Core principle:** *Trust without total transparency* — prove specific facts required for a transaction without revealing the underlying data.

---

## 2. System Architecture

### 2.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                      VEILCOMMERCE                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript)                              │
│  ├── Dashboard    ├── Trade      ├── Orders                │
│  ├── Escrow       ├── Invoices   ├── Financing             │
│  ├── Compliance   ├── Portfolio  ├── Activity              │
│  └── Settings                                                      │
├─────────────────────────────────────────────────────────────┤
│  TypeScript SDK                                              │
│  ├── business/    ├── orders/      ├── escrow/             │
│  ├── invoices/    ├── financing/   ├── proofs/             │
│  ├── credentials/ ├── settlement/  ├── compliance/         │
├─────────────────────────────────────────────────────────────┤
│  Midnight Contracts (Compact)                                │
│  ├── BusinessRegistry    ├── PurchaseOrder                 │
│  ├── Escrow              ├── Invoice                       │
│  ├── Financing           ├── Compliance                    │
│  ├── Settlement          └── CredentialRegistry            │
├─────────────────────────────────────────────────────────────┤
│  ZK Circuits (Midnight)                                      │
│  ├── Proof of Funds      ├── Proof of Inventory            │
│  ├── Proof of Compliance ├── Proof of Delivery             │
│  └── Proof of Financing                                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Contract Addresses (Preprod)

| Contract | Address | Explorer |
|----------|---------|----------|
| BusinessRegistry | `0x...` | [View](https://preprod.midnightexplorer.com) |
| PurchaseOrder | `0x...` | [View](https://preprod.midnightexplorer.com) |
| Escrow | `0x...` | [View](https://preprod.midnightexplorer.com) |
| Invoice | `0x...` | [View](https://preprod.midnightexplorer.com) |
| Financing | `0x...` | [View](https://preprod.midnightexplorer.com) |
| Compliance | `0x...` | [View](https://preprod.midnightexplorer.com) |
| Settlement | `0x...` | [View](https://preprod.midnightexplorer.com) |
| CredentialRegistry | `0x...` | [View](https://preprod.midnightexplorer.com) |

---

## 3. Data Flow: The $50k Trade

### 3.1 Complete Transaction Flow

```
BUYER (Nigeria)                          SELLER (China)
    │                                        │
    ├── Register Business ─────────────────► │
    │                                        ├── Register Business
    │                                        │
    ├── Create PO ($50k Electronics) ─────► │
    │                                        │
    ├── ZK Proof: Funds ≥ $50k ────────────► │  (balance hidden)
    │                                        │
    │                    ◄─── ZK Proof: Inventory ≥ 10k
    │                                        │
    ├── Both Parties Verified ─────────────► │
    │                                        │
    ├── Fund Escrow ($50k locked) ─────────► │
    │                                        │
    │                    ◄─── Ship Goods
    │                                        │
    ├── ZK Proof: Delivery Verified ───────► │
    │                                        │
    ├── Escrow Releases ($50k) ────────────► │
    │                                        │
    ├── Settlement Recorded ──────────────► │
    │                                        │
    │                    ◄─── Invoice Issued ($50k)
    │                                        │
    ├── Acknowledge Invoice ──────────────► │
    │                                        │
    │                    ◄─── Request Financing ($45k)
    │                                        │
    ├── ZK Proof: Credit Score ≥ 650 ──────► │  (score hidden)
    │                                        │
    ├── Invoice Funded ($45k) ────────────► │
    │                                        │
    └── Repayment at Maturity ────────────► │
```

### 3.2 On-Chain vs Off-Chain Data

| On-Chain (Public) | Off-Chain (Private) |
|-------------------|---------------------|
| Business commitments | Legal entity details |
| Order commitments | Exact quantities, pricing |
| Escrow commitments | Exact amounts |
| Invoice commitments | Buyer/seller identities, amounts, terms |
| Financing commitments | Credit scores, financial history |
| Verification results (✓/✗) | Credential documents |
| Nullifiers | Authorization secrets |
| Timestamps & state | Commercial terms |

---

## 4. Contract Specifications

### 4.1 BusinessRegistry

**Purpose:** Private business identity with selective disclosure

**Key Circuits:**
- `registerBusiness(jurisdiction, category, credentialHash, timestamp)`
- `verifyBusiness(businessId)` → `VerificationStatus`
- `proveBusinessEligible(businessId, requiredJurisdiction)` → `Boolean`
- `proveAuthorization(businessId, actionHash)` — nullifier-gated
- `revokeBusiness(businessId)` — admin only

**State:**
- `businessRegistry: Map<Bytes32, BusinessCommit>`
- `businessStatus: Map<Bytes32, VerificationStatus>`
- `revokedBusinesses: Set<Bytes32>`
- `usedNullifiers: Set<Bytes32>`
- `jurisdictionAllowed: Map<Bytes32, Boolean>`

### 4.2 PurchaseOrder

**Purpose:** Private purchase order lifecycle

**Key Circuits:**
- `createPurchaseOrder(orderId, sellerId, currency, timestamp)`
- `confirmOrder(orderId, timestamp)`
- `markBuyerVerified(orderId)`, `markSellerVerified(orderId)`, `markFundsVerified(orderId)`
- `markFunded/markShipped/markDelivered/markSettled(orderId, timestamp)`
- `cancelOrder(orderId, timestamp)` — nullifier-gated

**State:**
- `orders: Map<Bytes32, OrderRecord>`
- `orderExists: Set<Bytes32>`
- `usedOrderNullifiers: Set<Bytes32>`

### 4.3 Escrow

**Purpose:** Conditional payment with ZK-gated release

**Key Circuits:**
- `createEscrow(escrowId, orderId, sellerId, timestamp)`
- `verifyDelivery(escrowId)`
- `release(escrowId, timestamp)` — nullifier-gated
- `refund(escrowId)`
- `dispute(escrowId)`

**Release Condition:**
```
IF buyer_authorized AND seller_authorized AND po_valid 
   AND delivery_verified THEN release
```

**State:**
- `escrows: Map<Bytes32, EscrowRecord>`
- `escrowExists: Set<Bytes32>`
- `usedReleaseNullifiers: Set<Bytes32>`
- `deliveryVerified: Set<Bytes32>`

### 4.4 Invoice

**Purpose:** Verified private receivable (Privoice pattern)

**Key Circuits:**
- `issue(invoiceId, orderId, dueAt, createdAt)`
- `acknowledge(invoiceId)` — proves buyer identity via commitment
- `markFinancingEligible(invoiceId)`
- `settle(invoiceId)` — issuer records payment
- `voidInvoice(invoiceId)`

**State:**
- `invoices: Map<Bytes32, Bytes32>` — commitment
- `invoiceRecords: Map<Bytes32, InvoiceRecord>`
- `acknowledged/settled/voided: Set<Bytes32>`
- `financingEligible: Set<Bytes32>`

### 4.5 Financing

**Purpose:** Private invoice financing with ZK risk assessment

**Key Circuits:**
- `commitCreditScore(sellerId)` — seller commits score hash
- `requestFinancing(financingId, invoiceId, maturityDays, feeBps, timestamp)`
- `verifyRisk(financingId, threshold)` — ZK proof: score ≥ threshold
- `fundInvoice(financingId, fundedAmount, timestamp)` — nullifier-gated
- `repay(financingId, timestamp)`

**State:**
- `financings: Map<Bytes32, FinancingRecord>`
- `financingExists: Set<Bytes32>`
- `invoiceFinancing: Map<Bytes32, Bytes32>`
- `creditCommitments: Map<Bytes32, Bytes32>`
- `riskVerified: Set<Bytes32>`
- `usedFinancingNullifiers: Set<Bytes32>`

### 4.6 Compliance

**Purpose:** Programmable ZK compliance (DPO2U + ZK-Judge patterns)

**Key Circuits:**
- `attestCompliance(jurisdiction, validityDays, timestamp)`
- `evaluateCompliance(subjectId, threshold)` — weighted scoring
- `grantDisclosure(auditorId, level)` — selective disclosure
- `revokeCompliance/credential`, `setJurisdictionPolicy`

**Disclosure Levels:**
1. **Private** — Only parties see
2. **Selective** — Specific fields to requester
3. **Auditable** — Full records for authorized auditor
4. **PublicProof** — Minimal on-chain verification

### 4.7 Settlement

**Purpose:** Final settlement record

**Key Circuits:**
- `settleTrade(settlementId, orderId, invoiceId, financingId, timestamp)`
- `settleEscrowLeg(settlementId, orderId, timestamp)`
- `reconcile(settlementId)`

**State:**
- `settlements: Map<Bytes32, SettlementRecord>`
- `settlementExists: Set<Bytes32>`
- `settledOrders/settledInvoices: Set<Bytes32>`
- `usedSettlementNullifiers: Set<Bytes32>`

### 4.8 CredentialRegistry

**Purpose:** Private credentials with selective disclosure

**Key Circuits:**
- `issueCredential(credentialId, holderId, type, expiresAt, timestamp)`
- `proveCredential(credentialId, verifierId)` → nullifier-gated
- `revokeCredential/suspendCredential(credentialId)`

**State:**
- `credentials: Map<Bytes32, CredentialRecord>`
- `credentialExists: Set<Bytes32>`
- `revokedCredentials: Set<Bytes32>`
- `usedCredentialNullifiers: Set<Bytes32>`
- `trustedIssuers: Set<Bytes32>`

---

## 5. ZK Circuit Specifications

### 5.1 Proof of Funds
```compact
proveFundsSufficient(privateBalance, requiredAmount, balanceSalt)
→ { fundsSufficient: Boolean, balanceCommitment: Bytes32 }
```

### 5.2 Proof of Inventory
```compact
proveInventorySufficient(privateInventory, requiredQuantity, inventorySalt)
→ { inventorySufficient: Boolean, inventoryCommitment: Bytes32 }
```

### 5.3 Proof of Compliance
```compact
proveCompliance(credentialStatus, authorizationLevel, jurisdiction,
                certificationFlags, transactionValue, docCompleteness,
                requiredJurisdiction, requiredCerts, maxValue, minAuth)
→ { compliant: Boolean, score: Uint32, commitment: Bytes32 }
```
Weighted scoring: credential(30) + auth(20) + jurisdiction(15) + certs(15) + threshold(10) + docs(10) ≥ 70

### 5.4 Proof of Delivery
```compact
proveDelivery(evidenceHash, poCommitment, deliverySalt, expectedAmt, actualAmt)
→ { deliveryVerified: Boolean, deliveryCommitment: Bytes32 }
```

### 5.5 Proof of Financing Eligibility
```compact
proveFinancingEligibility(invoiceAmt, invoiceStatus, deliveryVerified,
                          buyerScore, sellerScore, invoiceAge,
                          minBuyerScore, minSellerScore, maxAge, ratio)
→ { eligible: Boolean, maxFinancing: Uint64, riskScore: Uint16, commitment: Bytes32 }
```

---

## 6. Privacy Model

### 6.1 Selective Disclosure Levels

| Level | Audience | Data Revealed |
|-------|----------|---------------|
| **Private** | Counterparties only | Commitments, verification results |
| **Selective** | Specific verifier | Requested fields via ZK proof |
| **Auditable** | Authorized auditor | Full records for investigation |
| **Public Proof** | Everyone | Existence, state, verification ✓/✗ |

### 6.2 Nullifier / Replay Protection

Every private authorization consumes a nullifier:
```
nullifier = H(secret, action, context)
```
- Stored in `usedNullifiers` set
- Prevents replay across all circuits
- Verified on-chain before state change

### 6.3 Domain Separation

All identities derived with domain tags:
```
businessId = H("veil:business:id:v1", sk)
partyId = H("veil:party:id:v1", sk)
issuerId = H("veil:invoice:issuer:v1", sk)
investorId = H("veil:investor:id:v1", sk)
```
Prevents cross-domain linkability.

---

## 7. Security Considerations

### 7.1 Threat Model

| Attack | Mitigation |
|--------|------------|
| Replay | Nullifier sets per action |
| Double spend | Financing/escrow nullifiers |
| Unauthorized release | Multi-party auth + ZK proof |
| Tampered proof | Commitment verification on-chain |
| Invalid commitment | `persistentHash` verification |
| Invalid state transition | State machine enforcement |
| Credential replay | Presentation nullifiers |

### 7.2 Audit Checklist

- [ ] All circuits use `disclose()` on public outputs
- [ ] All witness inputs never leave prover
- [ ] Nullifiers unique per (secret, action, context)
- [ ] Domain-separated key derivation
- [ ] Sealed admin keys (witness-derived)
- [ ] `Counter` for monotonic state
- [ ] `Map`/`Set` with proper `disclose()`

---

## 8. Deployment

### 8.1 Prerequisites
- Node.js 22+
- Midnight `compact` 0.5.1
- `@midnight-ntwrk/*` packages per `package.json`

### 8.2 Build Contracts
```bash
cd veilcommerce/contracts
for f in *.compact; do
  compact compile "$f" "../managed/$(basename $f .compact)"
done
```

### 8.3 Deploy to Preprod
```bash
cd veilcommerce/frontend
npm install
npm run build
# Deploy via 1AM wallet or CLI
```

### 8.4 Environment Variables
```env
VITE_MIDNIGHT_NETWORK=preprod
VITE_INDEXER_URI=https://indexer.preprod.midnight.network/api/v4/graphql
VITE_INDEXER_WS_URI=wss://indexer.preprod.midnight.network/api/v4/graphql/ws
VITE_NODE_URI=https://rpc.preprod.midnight.network
```

---

## 9. Testing

### 9.1 Run Tests
```bash
# Unit tests
npm test -- veilcommerce/tests/contracts/

# Integration tests
npm test -- veilcommerce/tests/integration/

# E2E flow test
npm test -- veilcommerce/tests/integration/e2e_trade_flow.test.ts
```

### 9.2 Test Coverage Targets
- Contract circuits: 100% (all exported circuits)
- Proof verification: 100% (valid/tampered/replay/insufficient)
- E2E flow: 1 complete $50k trade

---

## 10. API Reference

### 10.1 SDK Usage
```typescript
import { createVeilCommerceSDK } from '@veilcommerce/sdk';

const sdk = createVeilCommerceSDK(contracts, witnesses);

// Business registration
await sdk.business.registerBusiness({
  jurisdiction: 'NG',
  category: BusinessCategory.Retail,
  credentialHash: '0x...',
  timestamp: Date.now(),
});

// Create purchase order
await sdk.orders.createPurchaseOrder({
  orderId: 'PO-001',
  sellerId: '0x...',
  currency: 'USDM',
  timestamp: Date.now(),
  quantity: 1000,
  unitPrice: 50,
  totalAmount: 50000,
  destinationHash: '0x...',
  salt: '0x...',
});

// Fund escrow
await sdk.escrow.createEscrow({
  escrowId: 'ESC-001',
  orderId: 'PO-001',
  sellerId: '0x...',
  timestamp: Date.now(),
  amount: 50000,
  nonce: '0x...',
  releaseSecret: '0x...',
});
```

---

*Generated from VeilCommerce source — see `veilcommerce/` for implementation.*