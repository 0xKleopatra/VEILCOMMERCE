# VeilCommerce — Slide Deck

## Privacy-Preserving B2B Commerce on Midnight

**Interactive Presentation:** [https://gamma.app/docs/The-Problem-jrniyf1fo5xhtir](https://gamma.app/docs/The-Problem-jrniyf1fo5xhtir)

---

## Slide 1: The Problem

### Global trade demands total transparency

- Businesses must reveal bank statements, customer lists, supplier contracts, and financial records just to transact
- Small and mid-market exporters in emerging markets are disproportionately affected
- $1.7 trillion global trade finance gap (ADB 2024)
- Privacy leaks create competitive risk, regulatory exposure, and trust barriers

---

## Slide 2: The Solution — VeilCommerce

### Trade globally. Reveal less.

**VeilCommerce** is a privacy-preserving B2B commerce platform built on Midnight.

| Instead of revealing...  | VeilCommerce proves...         |
|--------------------------|--------------------------------|
| Exact bank balance       | ✓ Funds ≥ $50,000              |
| Full customer list       | ✓ Business verified in Nigeria |
| Exact inventory          | ✓ Stock ≥ 10,000 units         |
| Credit score             | ✓ Score ≥ 650                  |
| Financial history        | ✓ Compliance score ≥ 70        |

> **Prove what matters without revealing everything else.**

---

## Slide 3: How It Works — Midnight's Dual-Ledger Model

### Public State (on-chain)
- Commitments (hashes), state flags, nullifiers, counters
- Readable by anyone — but reveals **nothing** about the underlying data

### Private Witness (off-chain, your device only)
- Secrets, amounts, salts, scores
- Never leaves your device — used only inside the ZK prover

### The Bridge
```
Private witness → persistentHash() → commitment → disclose() → on-chain
secret + id    → persistentHash() → nullifier  → disclose() → prevents replay
balance ≥ req  → assert()         → true/false → disclose() → ✓ Funds sufficient
```

---

## Slide 4: Architecture

```
┌──────────────────────────────────────────────┐
│              VEILCOMMERCE                     │
├──────────────────────────────────────────────┤
│  Frontend (React + Vite + Tailwind)           │
│  13 pages: Dashboard, Trade, Escrow,          │
│  Invoices, Financing, Auditor (W2),           │
│  ZK Studio (W2), Compliance, etc.             │
├──────────────────────────────────────────────┤
│  TypeScript SDK (9 modules)                   │
│  business, orders, escrow, invoices,          │
│  financing, compliance, credentials,          │
│  settlement, proofs                           │
├──────────────────────────────────────────────┤
│  8 Compact Contracts (v0.5.1)                 │
│  BusinessRegistry, PurchaseOrder, Escrow,     │
│  Invoice, Financing, Compliance,              │
│  Settlement, CredentialRegistry               │
├──────────────────────────────────────────────┤
│  5 ZK Circuits                                │
│  Proof of: Funds, Inventory, Compliance,      │
│  Delivery, Financing                          │
└──────────────────────────────────────────────┘
```

---

## Slide 5: Core Modules

| Module               | What It Does                              | Midnight Pattern Used                      |
|----------------------|-------------------------------------------|--------------------------------------------|
| BusinessRegistry     | Private business identity + verification  | Credence (domain-separated keys)           |
| PurchaseOrder        | Private PO lifecycle with ZK-gated flags  | dMarket (commitments, state machine)       |
| Escrow               | Conditional payment with ZK release       | Midnight Escrow (persistentCommit)         |
| Invoice              | Verified private receivable               | Privoice (commitment, acknowledgment)      |
| Financing            | Private invoice financing + risk proof    | Kredz (ScoreData hash) + RWA              |
| Compliance           | Programmable ZK compliance                | ZK-Judge (weighted scoring) + DPO2U       |
| Settlement           | Final settlement record                   | Custom (nullifier-gated)                   |
| CredentialRegistry   | Private credentials + selective disclosure| Credence (presentation nullifiers)         |

---

## Slide 6: Privacy Guarantees

- **No private data on-chain** — only `persistentHash` commitments
- **No linkability across roles** — domain-separated key derivation (`veil:business:owner:v1`, `veil:invoice:issuer:v1`)
- **No replay of authorizations** — nullifier sets per action
- **Auditable when authorized** — selective disclosure via ZK proofs

---

## Slide 7: Wave 2 Innovations

### 1. Auditor & Selective Disclosure Portal (`/auditor`)
- **Third-Party Inspection**: Customs, tax authorities, and trade financiers verify compliance without seeing private commercial preimages
- **Proof of Funds**: Proves escrow lock $\ge \$50\text{k}$ without revealing bank balance
- **Proof of Delivery**: Matches carrier waybill hash against PO commitment
- **Nullifier Status**: Real-time query confirming unspent release nullifier
- **Exportable Certificate**: One-click verifiable cryptographic audit receipt

### 2. Zero-Knowledge Circuit Studio (`/zk-studio`)
- **Interactive Workbench**: Test bench for all 5 standalone Compact circuits
- **Live Proving**: Computes `persistentHash` commitments and evaluates in-circuit constraints
- **Tamper Simulation**: Simulates adversarial witness fraud to demonstrate on-chain rejection

---

## Slide 8: End-to-End Trade Flow

```
1. Register    → Business registers with ZK-verified identity
2. Create PO   → Buyer creates purchase order (terms committed, not revealed)
3. Escrow      → Buyer locks funds (amount committed, proof of funds verified)
4. Ship        → Seller ships goods (proof of inventory verified)
5. Deliver     → Delivery confirmed (proof of delivery generated)
6. Release     → Escrow released via ZK proof (nullifier prevents replay)
7. Invoice     → Seller issues invoice (terms hashed on-chain)
8. Finance     → Invoice financed (credit score proven ≥ threshold, never revealed)
9. Settle      → Final settlement recorded with nullifier
```

---

## Slide 9: Deployed on Midnight Preprod

All **8 contracts** compiled and deployed on Midnight Preprod:

| Contract             | Status     |
|----------------------|------------|
| BusinessRegistry     | ✅ Deployed |
| PurchaseOrder        | ✅ Deployed |
| Escrow               | ✅ Deployed |
| Invoice              | ✅ Deployed |
| Financing            | ✅ Deployed |
| Compliance           | ✅ Deployed |
| CredentialRegistry   | ✅ Deployed |
| Settlement           | ✅ Deployed |

**Live Demo:** https://veilcommerce-app.vercel.app/

---

## Slide 10: Testing & Quality

- **Unit tests** — All 8 contracts with 100% circuit coverage
- **Integration tests** — Cross-contract workflows
- **E2E test** — Complete $50k Nigerian → Chinese trade flow
- **ZK circuit tests** — Valid, tampered, replay, and insufficient scenarios
- **CI/CD** — GitHub Actions pipeline

---

## Slide 11: Business Model

| Revenue Stream          | Rate                     |
|-------------------------|--------------------------|
| Trade execution         | 0.1% (min $5, max $500)  |
| Invoice settlement      | 0.05% (min $2, max $200) |
| Financing origination   | 1–2% of funded amount    |
| Financing servicing     | 0.5% annually            |
| Enterprise API          | $499–$4,999/mo           |
| Verification/Compliance | $99–$500 per attestation |

---

## Slide 12: Target Market & Adoption Path

### Primary: SME Exporters in Emerging Markets
- Nigeria, Kenya, Vietnam, Bangladesh — high trade volume, limited financial infrastructure
- $1.7T trade finance gap directly addressable

### Adoption Path
1. **Phase 1** — Pilot with 5–10 SME exporters in Nigeria (West Africa corridors)
2. **Phase 2** — Expand to East African and Southeast Asian corridors
3. **Phase 3** — Enterprise API for trade finance platforms and banks
4. **Phase 4** — Open marketplace with multi-currency settlement

---

## Slide 13: Roadmap

| Phase     | Timeline      | Milestones                                            |
|-----------|---------------|-------------------------------------------------------|
| MVP       | Q3 2026       | 8 contracts deployed, frontend live, testnet demo     |
| Beta      | Q4 2026       | Real SME pilots, wallet integration, compliance flows |
| Launch    | Q1 2027       | Mainnet deployment, API launch, first revenue         |
| Scale     | Q2–Q3 2027    | Multi-corridor expansion, financing partnerships      |

---

## Slide 14: Tech Stack

| Component  | Technology               |
|------------|--------------------------|
| Blockchain | Midnight (Preprod)       |
| Contracts  | Compact 0.5.1            |
| Frontend   | React 18 + Vite + Tailwind |
| Language   | TypeScript 5.2.2         |
| Wallet     | 1AM Wallet               |
| Deployment | Vercel (frontend)        |
| CI/CD      | GitHub Actions           |

---

## Slide 15: Why Midnight?

- **Dual-ledger model** — public state + private witnesses natively supported
- **Compact language** — purpose-built for ZK smart contracts
- **persistentHash** — commit without revealing
- **disclose()** — selective revelation at the circuit level
- **Nullifiers** — replay protection built into the protocol
- **No bridge risk** — privacy is native, not bolted on

---

## Slide 16: Team & Links

- **GitHub:** https://github.com/0xKleopatra/VEILCOMMERCE
- **Live Demo:** https://veilcommerce-app.vercel.app/
- **Video Demo:** https://youtu.be/Yyqx0SIZaX0
- **Midnight Network:** https://midnight.network

---

**VeilCommerce — Trust without total transparency.**
