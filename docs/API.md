# VeilCommerce — API Reference

> **TypeScript SDK + REST API + Webhooks**

---

## 1. TypeScript SDK

### 1.1 Installation
```bash
npm install @veilcommerce/sdk
# or from local
npm install ../veilcommerce/sdk
```

### 1.2 Quick Start
```typescript
import { createVeilCommerceSDK } from '@veilcommerce/sdk';

const sdk = createVeilCommerceSDK({
  contracts: {
    businessRegistry: '0x...',
    purchaseOrder: '0x...',
    escrow: '0x...',
    invoice: '0x...',
    financing: '0x...',
    compliance: '0x...',
    credentialRegistry: '0x...',
    settlement: '0x...',
  },
  network: 'preprod',
  apiKey: 'vc_live_abc123...',
});

// Register business
await sdk.business.registerBusiness({
  jurisdiction: new TextEncoder().encode('NG'),
  category: BusinessCategory.Retail,
  credentialHash: hash('registration_doc.pdf'),
  timestamp: BigInt(Date.now()),
});
```

### 1.3 Module APIs

#### Business Module
```typescript
// Register
await sdk.business.registerBusiness(params: RegisterBusinessParams)

// Verify
const result = await sdk.business.verifyBusiness(businessId)
const isVerified = await sdk.business.isBusinessVerified(businessId)

// Prove eligibility
const eligible = await sdk.business.proveBusinessEligible({
  businessId,
  requiredJurisdiction: new TextEncoder().encode('NG'),
})

// Authorization (nullifier-gated)
await sdk.business.proveAuthorization({
  businessId,
  actionHash: hash('create_order'),
})

// Admin
await sdk.business.revokeBusiness(businessId)
await sdk.business.setJurisdictionAllowed(jurisdiction, true)
```

#### Orders Module
```typescript
// Create PO
await sdk.orders.createPurchaseOrder({
  orderId: 'PO-001',
  sellerId: sellerId,
  currency: new TextEncoder().encode('USDM'),
  timestamp: BigInt(Date.now()),
  quantity: 1000,
  unitPrice: 50,
  totalAmount: 50000,
  destinationHash: hash('Lagos, NG'),
  salt: randomBytes(32),
})

// Lifecycle
await sdk.orders.confirmOrder(orderId, timestamp)
await sdk.orders.markBuyerVerified(orderId)
await sdk.orders.markSellerVerified(orderId)
await sdk.orders.markFundsVerified(orderId)
await sdk.orders.markFunded(orderId, timestamp)
await sdk.orders.markShipped(orderId, timestamp)
await sdk.orders.markDelivered(orderId, timestamp)
await sdk.orders.markSettled(orderId, timestamp)
await sdk.orders.cancelOrder({ orderId, timestamp })

// Reads
const order = await sdk.orders.getOrder(orderId)
const status = await sdk.orders.orderStatus(orderId)
```

#### Escrow Module
```typescript
// Create
await sdk.escrow.createEscrow({
  escrowId: 'ESC-001',
  orderId: 'PO-001',
  sellerId: sellerId,
  timestamp: BigInt(Date.now()),
  amount: 50000n,
  nonce: randomBytes(32),
  releaseSecret: randomBytes(32),
})

// Verify delivery
await sdk.escrow.verifyDelivery(escrowId)

// Release (seller)
await sdk.escrow.release({
  escrowId,
  timestamp: BigInt(Date.now()),
  releaseSecret: secret,
})

// Refund (buyer)
await sdk.escrow.refund(escrowId)

// Dispute
await sdk.escrow.dispute(escrowId)

// Reads
const escrow = await sdk.escrow.getEscrow(escrowId)
const state = await sdk.escrow.escrowState(escrowId)
const delivered = await sdk.escrow.isDeliveryVerified(escrowId)
```

#### Invoices Module
```typescript
// Issue
await sdk.invoices.issue({
  invoiceId: 'INV-001',
  orderId: 'PO-001',
  dueAt: BigInt(Date.now() + 30*86400000),
  createdAt: BigInt(Date.now()),
  amount: 50000n,
  buyer: buyerId,
  memo: hash('line_items'),
  salt: randomBytes(32),
})

// Acknowledge (buyer)
await sdk.invoices.acknowledge({
  invoiceId: 'INV-001',
  buyer: buyerId,
  amount: 50000n,
  memo: hash('line_items'),
  salt: salt,
})

// Financing
await sdk.invoices.markFinancingEligible(invoiceId)
await sdk.invoices.markFinanced(invoiceId)

// Settle
await sdk.invoices.settle(invoiceId)
await sdk.invoices.voidInvoice(invoiceId)

// Reads
const exists = await sdk.invoices.exists(invoiceId)
const settled = await sdk.invoices.isSettled(invoiceId)
const eligible = await sdk.invoices.isFinancingEligible(invoiceId)
const record = await sdk.invoices.getRecord(invoiceId)
const verified = await sdk.invoices.verifyCommitment(params)
```

#### Financing Module
```typescript
// Commit credit score
await sdk.financing.commitCreditScore(sellerId)

// Request
await sdk.financing.requestFinancing({
  financingId: 'FIN-001',
  invoiceId: 'INV-001',
  maturityDays: 47,
  feeBps: 200,
  timestamp: BigInt(Date.now()),
  faceValue: 50000n,
  requested: 45000n,
  salt: randomBytes(32),
  creditScore: 720,
  creditSalt: randomBytes(16),
})

// Risk verification
await sdk.financing.verifyRisk({
  financingId: 'FIN-001',
  threshold: 650,
  creditScore: 720,
  creditSalt: salt,
})

// Fund
await sdk.financing.fundInvoice({
  financingId: 'FIN-001',
  fundedAmount: 45000n,
  timestamp: BigInt(Date.now()),
})

// Repay
await sdk.financing.repay({ financingId: 'FIN-001', timestamp })
await sdk.financing.cancelFinancing(financingId)

// Reads
const financing = await sdk.financing.getFinancing(financingId)
const status = await sdk.financing.financingStatus(financingId)
const isFunded = await sdk.financing.isFunded(financingId)
const eligible = await sdk.financing.meetsThreshold(sellerId, 650)
```

#### Compliance Module
```typescript
// Attest
await sdk.compliance.attestCompliance({
  jurisdiction: new TextEncoder().encode('NG'),
  validityDays: 365n,
  timestamp: BigInt(Date.now()),
  credentialHash: hash('kyc.pdf'),
  certificationHash: hash('iso9001.pdf'),
  salt: randomBytes(32),
  privateAttr1: 85,
  privateAttr2: 90,
  privateAttr3: 75,
})

// Evaluate (ZK-Judge style)
await sdk.compliance.evaluateCompliance({
  subjectId,
  threshold: 70,
  privateAttr1: 85,
  privateAttr2: 90,
  privateAttr3: 75,
})

// Selective disclosure
await sdk.compliance.grantDisclosure({
  auditorId,
  level: DisclosureLevel.Auditable,
})

// Admin
await sdk.compliance.revokeCompliance(subjectId)
await sdk.compliance.revokeCredential(credHash)
await sdk.compliance.setJurisdictionPolicy(jurisdiction, true)

// Reads
const verified = await sdk.compliance.isVerified(subjectId)
const record = await sdk.compliance.getRecord(subjectId)
const commitment = await sdk.compliance.getCommitment(subjectId)
```

#### Credentials Module
```typescript
// Admin
await sdk.credentials.addTrustedIssuer(issuerId)

// Issue
await sdk.credentials.issueCredential({
  credentialId: 'CRED-001',
  holderId,
  credentialType: CredentialType.TradeLicense,
  expiresAt: BigInt(Date.now() + 365*86400000),
  timestamp: BigInt(Date.now()),
  holderSecret: holderId,
  salt: randomBytes(32),
  issuedAt: BigInt(Date.now()),
})

// Prove (nullifier-gated)
const valid = await sdk.credentials.proveCredential({
  credentialId: 'CRED-001',
  verifierId: auditorId,
  holderSecret: holderId,
  salt: salt,
  issuedAt: BigInt(Date.now()),
})

// Verify (lightweight)
const active = await sdk.credentials.verifyCredential(credentialId)

// Revoke/Suspend
await sdk.credentials.revokeCredential(credentialId)
await sdk.credentials.suspendCredential(credentialId)

// Reads
const cred = await sdk.credentials.getCredential(credentialId)
const revoked = await sdk.credentials.isRevoked(credentialId)
const commitment = await sdk.credentials.commitmentOf(credentialId)
```

#### Settlement Module
```typescript
// Full settlement
await sdk.settlement.settleTrade({
  settlementId: 'SET-001',
  orderId: 'PO-001',
  invoiceId: 'INV-001',
  financingId: 'FIN-001',
  timestamp: BigInt(Date.now()),
  amount: 50000n,
  payer: buyerId,
  payee: sellerId,
  salt: randomBytes(32),
})

// Escrow-only settlement
await sdk.settlement.settleEscrowLeg({
  settlementId: 'SET-002',
  orderId: 'PO-001',
  timestamp: BigInt(Date.now()),
  amount: 50000n,
  payer: buyerId,
  payee: sellerId,
  salt: randomBytes(32),
})

// Reconcile
await sdk.settlement.reconcile(settlementId)

// Reads
const settlement = await sdk.settlement.getSettlement(settlementId)
const orderSettled = await sdk.settlement.isOrderSettled(orderId)
const invoiceSettled = await sdk.settlement.isInvoiceSettled(invoiceId)
const status = await sdk.settlement.settlementStatus(settlementId)
```

#### Proofs Module
```typescript
const proofs = sdk.proofs;

// Funds
const fundsProof = await proofs.proveFundsSufficient({
  privateBalance: 100000n,
  requiredAmount: 50000n,
  balanceSalt: salt,
})
const fundsValid = await proofs.verifyFundsProof(commitment, 50000n, 100000n, salt)

// Inventory
const invProof = await proofs.proveInventorySufficient({
  privateInventory: 15000n,
  requiredQuantity: 10000n,
  inventorySalt: salt,
})

// Compliance
const compProof = await proofs.proveCompliance({
  credentialStatus: 0,
  authorizationLevel: 2,
  jurisdictionCode: encoder.encode('NG'),
  certificationFlags: 0b111,
  transactionValue: 50000n,
  docCompleteness: 1,
  requiredJurisdiction: encoder.encode('NG'),
  requiredCertifications: 0b111,
  maxTransactionValue: 100000n,
  minAuthLevel: 1,
})

// Delivery
const delProof = await proofs.proveDelivery({
  deliveryEvidenceHash: hash('tracking.pdf'),
  purchaseOrderCommitment: poCommitment,
  deliverySalt: salt,
  expectedAmount: 50000n,
  actualAmount: 50000n,
})

// Financing
const finProof = await proofs.proveFinancingEligibility({
  invoiceAmount: 50000n,
  invoiceStatus: 1,
  deliveryVerified: true,
  buyerCreditScore: 720,
  sellerCreditScore: 720,
  invoiceAgeDays: 15,
  minBuyerScore: 650,
  minSellerScore: 650,
  maxInvoiceAgeDays: 90,
  financingRatioBps: 9000,
})
```

---

## 2. REST API

### 2.1 Base URL
```
https://api.veilcommerce.xyz/v1
```

### 2.2 Authentication
```http
Authorization: Bearer vc_live_abc123def456...
```

### 2.3 Endpoints

#### Businesses
```http
POST   /businesses                    # Register
GET    /businesses/{id}               # Get profile
GET    /businesses/{id}/verify        # Verify status
POST   /businesses/{id}/authorize     # Prove authorization
DELETE /businesses/{id}               # Revoke (admin)
```

#### Orders
```http
POST   /orders                        # Create PO
GET    /orders                        # List (with filters)
GET    /orders/{id}                   # Get order
POST   /orders/{id}/confirm           # Seller confirms
POST   /orders/{id}/verify/buyer      # Mark buyer verified
POST   /orders/{id}/verify/seller     # Mark seller verified
POST   /orders/{id}/verify/funds      # Mark funds verified
POST   /orders/{id}/fund              # Mark funded
POST   /orders/{id}/ship              # Mark shipped
POST   /orders/{id}/deliver           # Mark delivered
POST   /orders/{id}/settle            # Mark settled
POST   /orders/{id}/cancel            # Cancel
```

#### Escrows
```http
POST   /escrows                       # Create escrow
GET    /escrows                       # List
GET    /escrows/{id}                  # Get escrow
POST   /escrows/{id}/verify-delivery  # Verify delivery
POST   /escrows/{id}/release          # Release funds
POST   /escrows/{id}/refund           # Refund
POST   /escrows/{id}/dispute          # Dispute
```

#### Invoices
```http
POST   /invoices                      # Issue invoice
GET    /invoices                      # List
GET    /invoices/{id}                 # Get invoice
POST   /invoices/{id}/acknowledge     # Buyer acknowledges
POST   /invoices/{id}/finance         # Request financing
POST   /invoices/{id}/settle          # Settle
POST   /invoices/{id}/void            # Void
```

#### Financing
```http
POST   /financing                     # Request financing
GET    /financing                     # List opportunities
GET    /financing/{id}                # Get financing
POST   /financing/{id}/verify-risk    # Verify risk
POST   /financing/{id}/fund           # Fund invoice
POST   /financing/{id}/repay          # Repay
POST   /financing/{id}/cancel         # Cancel
```

#### Compliance
```http
POST   /compliance/attest             # Attest compliance
POST   /compliance/evaluate           # Evaluate (ZK)
POST   /compliance/disclosure         # Grant disclosure
GET    /compliance/{subjectId}        # Get record
GET    /compliance/{subjectId}/verify # Verify status
```

---

## 3. Webhooks

### 3.1 Configuration
```http
POST /webhooks
{
  "url": "https://your-app.com/webhooks/veilcommerce",
  "events": [
    "order.created",
    "order.confirmed",
    "order.funded",
    "order.shipped",
    "order.delivered",
    "order.settled",
    "escrow.created",
    "escrow.verified",
    "escrow.released",
    "escrow.refunded",
    "invoice.issued",
    "invoice.acknowledged",
    "invoice.settled",
    "financing.requested",
    "financing.funded",
    "financing.repaid",
    "settlement.completed"
  ]
}
```

### 3.2 Payload Format
```json
{
  "id": "evt_abc123",
  "type": "order.settled",
  "timestamp": "2024-01-25T14:32:18Z",
  "data": {
    "orderId": "PO-8492",
    "buyerId": "biz_001",
    "sellerId": "biz_002",
    "amount": "50000",
    "currency": "USDM",
    "settlementId": "SET-8492",
    "proofId": "ZK-SET-8492"
  }
}
```

### 3.3 Verification
```http
# Verify webhook signature
X-VeilCommerce-Signature: sha256=abc123...
X-VeilCommerce-Timestamp: 1706194338
```

---

## 4. Error Codes

| Code | HTTP | Message |
|------|------|---------|
| `INVALID_PARAMS` | 400 | Request parameters invalid |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `VERIFICATION_FAILED` | 422 | ZK proof verification failed |
| `INSUFFICIENT_FUNDS` | 422 | Balance below required |
| `INVALID_STATE` | 422 | Invalid state transition |
| `REPLAY_DETECTED` | 422 | Nullifier already used |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

*API reference for VeilCommerce — see `veilcommerce/sdk/` for TypeScript implementation.*