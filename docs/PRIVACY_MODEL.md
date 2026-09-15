# VeilCommerce — Privacy Model

> **Privacy without sacrificing accountability**

---

## 1. Privacy Philosophy

### 1.1 Core Principle
> **Prove what matters without revealing everything else.**

VeilCommerce does not hide all information. It reveals *only what is necessary* for each transaction participant to make decisions, while keeping commercially sensitive data private.

### 1.2 What "Private" Means
- **Private data never leaves the user's device** — processed in ZK circuits via witnesses
- **Only commitments/hashes go on-chain** — preimages stay off-chain
- **Proofs reveal only Boolean results** — e.g., `balance ≥ required`, not the balance
- **Nullifiers prevent replay** — without exposing the underlying authorization

---

## 2. Data Classification

### 2.1 Private (Never On-Chain)
| Category | Examples |
|----------|----------|
| **Financial** | Exact bank balances, credit scores, revenue, profit margins |
| **Commercial** | Customer lists, supplier contracts, pricing, margins, inventory levels |
| **Operational** | Logistics routes, warehouse locations, production capacity |
| **Identity** | Full corporate documents, beneficial owners, authorization letters |
| **Strategic** | Business plans, M&A targets, competitive positioning |

### 2.2 Public (On-Chain Commitments Only)
| Category | What's Visible |
|----------|----------------|
| **Existence** | "Business X exists", "Order Y exists", "Invoice Z exists" |
| **State** | "Verified", "Funded", "Shipped", "Settled", "Acknowledged" |
| **Verification** | ✓ Funds sufficient, ✓ Inventory sufficient, ✓ Compliance met |
| **Nullifiers** | Hashed authorizations (prevent replay, no link to identity) |
| **Timestamps** | When events occurred |
| **Counters** | Total businesses, orders, escrows, invoices, financings |

### 2.3 Selective Disclosure (Off-Chain, ZK-Gated)
| Level | Audience | Example |
|-------|----------|---------|
| **Private** | Counterparties in trade | "I am verified business in NG" |
| **Selective** | Financier, insurer | "Credit score ≥ 650", "Revenue > $1M" |
| **Auditable** | Regulator, auditor | Full invoice + delivery docs for investigation |
| **Public Proof** | Anyone | "Transaction INV-8492 settled" (no amounts/parties) |

---

## 3. Privacy Mechanisms

### 3.1 Commitment Schemes
Every private value is committed via `persistentHash`:
```compact
// Invoice amount, buyer, memo, salt → commitment
commitment = persistentHash(InvoiceTerms{ amount, buyer, memo, salt })
```
- **Binding**: Can't change preimage after commitment
- **Hiding**: Preimage not recoverable from commitment
- **Verifiable**: Auditor recomputes and compares

### 3.2 Zero-Knowledge Proofs
Every sensitive claim is a ZK circuit:
```compact
// Prove balance ≥ $50k without revealing balance
proveFundsSufficient(privateBalance, 50000, salt)
→ { fundsSufficient: true, commitment: H(balance, salt) }
```
- **Completeness**: Valid proof always verifies
- **Soundness**: Invalid claim rejected
- **Zero-knowledge**: Verifier learns only the result

### 3.3 Nullifiers (Replay Protection)
Every private authorization consumes a nullifier:
```compact
nullifier = persistentHash([secret, action, context])
assert(!usedNullifiers.member(nullifier))
usedNullifiers.insert(nullifier)
```
- **Unique per (secret, action, context)**
- **Prevents double-spend, replay, double-funding**
- **No link to identity** (secret never revealed)

### 3.4 Domain Separation
All identities/keys derived with unique tags:
```compact
businessId  = H("veil:business:id:v1", sk)
partyId     = H("veil:party:id:v1", sk)
issuerId    = H("veil:invoice:issuer:v1", sk)
investorId  = H("veil:investor:id:v1", sk)
ownerHash   = H("veil:business:owner:v1", sk)
```
- **Prevents cross-domain linkability**
- **Same secret → different public keys per role**
- **No correlation across contracts**

---

## 4. Privacy by Component

### 4.1 BusinessRegistry
| Private | Public |
|---------|--------|
| Legal name, registration #, beneficial owners, credentials | Commitment, jurisdiction, category, verification status, nullifiers |
| **Proof**: "Verified business in NG, authorized to trade" | ✓ Verified, ✓ Jurisdiction eligible |

### 4.2 PurchaseOrder
| Private | Public |
|---------|--------|
| Quantity, unit price, total, destination, commercial terms | Commitment, buyer/seller IDs, amount commitment, status, verification flags |
| **Proof**: "Buyer has funds", "Seller has inventory" | ✓ Buyer verified, ✓ Seller verified, ✓ Funds verified |

### 4.3 Escrow
| Private | Public |
|---------|--------|
| Exact amount, release secret, nonce | Commitments, buyer/seller, order linkage, state, nullifiers |
| **Proof**: "Delivery verified" | ✓ Funded, ✓ Delivery verified, ✓ Released |

### 4.4 Invoice
| Private | Public |
|---------|--------|
| Amount, buyer identity, line items, payment terms | Commitment, issuer, order linkage, status (issued/acknowledged/settled), financing eligibility |
| **Proof**: "Valid invoice acknowledged by buyer" | ✓ Issued, ✓ Acknowledged, ✓ Financing eligible |

### 4.5 Financing
| Private | Public |
|---------|--------|
| Face value, requested amount, credit score, investor identity | Commitments, invoice linkage, funded amount, fee, maturity, status, risk verified |
| **Proof**: "Seller credit score ≥ 650" | ✓ Risk verified, ✓ Funded, ✓ Repaid |

### 4.6 Compliance
| Private | Public |
|---------|--------|
| Credential docs, private attributes, exact scores | Commitment, status, jurisdiction, verification timestamp, disclosure level |
| **Proof**: "Weighted compliance score ≥ 70" | ✓ Verified, ✓ Jurisdiction allowed |

### 4.7 CredentialRegistry
| Private | Public |
|---------|--------|
| Full credential document, holder secret | Commitment, issuer, type, status, expiry, nullifiers |
| **Proof**: "Hold valid ISO 9001 cert" (selective to verifier) | ✓ Active, ✓ Not revoked |

---

## 5. Selective Disclosure in Practice

### 5.1 Financier Request
**Financier wants:** "Prove this invoice is financeable"
**Seller provides ZK proof:**
```
✓ Invoice acknowledged by buyer
✓ Delivery verified
✓ Buyer business verified
✓ Seller credit score ≥ 650
✓ Invoice age < 90 days
✓ No prior financing
```
**Financier sees:** Boolean results + risk score (0-100)
**Financier does NOT see:** Exact credit score, buyer identity, seller financials, other invoices

### 5.2 Auditor Request
**Auditor wants:** "Verify INV-8492 for tax audit"
**Seller grants selective disclosure (Auditable level):**
```
Invoice document (full)
Delivery proof (tracking, signatures)
Buyer identity (for tax purposes)
Payment terms
```
**Auditor recomputes:** `H(amount, buyer, memo, salt)` = on-chain commitment
**Auditor does NOT see:** Other invoices, other counterparties, financial history

### 5.3 Regulator Check
**Regulator wants:** "Is this business compliant?"
**Business provides ZK proof:**
```
✓ KYC current
✓ Sanctions screening passed
✓ Required licenses valid
✓ Jurisdiction permitted
```
**Regulator sees:** ✓ Compliant
**Regulator does NOT see:** Customer data, transaction history, financial details

---

## 6. Privacy Guarantees

### 6.1 What VeilCommerce Guarantees
| Guarantee | Mechanism |
|-----------|-----------|
| **No private data on-chain** | Only `persistentHash` commitments |
| **No linkability across roles** | Domain-separated key derivation |
| **No replay of authorizations** | Nullifier sets per action |
| **No exposure in proofs** | ZK circuits reveal only Boolean |
| **Auditable when authorized** | Selective disclosure via ZK |
| **Revocation without exposure** | Nullifier-based revocation |

### 6.2 What VeilCommerce Does NOT Guarantee
| Limitation | Reason |
|------------|--------|
| **Traffic analysis** | On-chain timing/volume observable |
| **Metadata correlation** | Contract interaction patterns |
| **Off-chain leaks** | User device, network, storage |
| **Social engineering** | Human factors outside protocol |
| **Quantum future** | Current ZK schemes not quantum-resistant |

---

## 7. Compliance with Regulations

### 7.1 GDPR / Data Protection
- **Data minimization**: Only commitments on-chain
- **Right to erasure**: Revocation via nullifier (credential marked revoked)
- **Data portability**: User holds all private preimages
- **Privacy by design**: ZK circuits enforce minimization

### 7.2 AML / KYC
- **Verified identity**: BusinessRegistry + CredentialRegistry
- **Selective disclosure**: Auditor gets required fields only
- **Audit trail**: Nullifiers + timestamps + ZK proof IDs
- **No blanket exposure**: Counterparties see only what's needed

### 7.3 Trade Finance Regulations
- **Verified receivables**: Invoice commitment + acknowledgment + delivery proof
- **Risk transparency**: ZK-proven risk scores (not raw financials)
- **Investor protection**: Nullifiers prevent double-financing
- **Auditability**: Full documents available to authorized auditor

---

## 8. Privacy Best Practices for Integrators

### 8.1 Frontend
- Never log witness inputs
- Clear sensitive state on navigation
- Use secure storage for secrets (IndexedDB encrypted)

### 8.2 SDK Usage
- Witness functions run in user context
- Never send witnesses to backend
- Validate proof results before submission

### 8.3 Auditor Integration
- Request specific disclosure level
- Verify commitment recomputation
- Store disclosed documents securely

---

*Privacy model documented from VeilCommerce source — see `veilcommerce/contracts/` for contract-level privacy, `veilcommerce/circuits/` for ZK proof specifications, `veilcommerce/sdk/proofs/` for TypeScript wrappers.*