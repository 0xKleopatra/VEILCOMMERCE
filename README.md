# VeilCommerce

> **Private financial infrastructure for global commerce.**
>
> **Trade globally. Reveal less.**

[![Midnight](https://img.shields.io/badge/Midnight-0.5.1-purple)](https://midnight.network)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 What is VeilCommerce?

VeilCommerce is a **privacy-preserving B2B commerce platform** built on the **Midnight blockchain**. It enables businesses to transact, escrow, invoice, and finance trade **without exposing commercially sensitive information**.

### The Problem
Global commerce requires trust between strangers. Today, that trust demands total transparency:
- Bank statements
- Customer lists
- Supplier contracts
- Financial records
- Inventory levels

### The Solution
**Prove what matters without revealing everything else.**

| Instead of revealing... | VeilCommerce proves... |
|-------------------------|------------------------|
| Exact bank balance | ✓ Funds ≥ $50,000 |
| Full customer list | ✓ Business verified in NG |
| Exact inventory | ✓ Stock ≥ 10,000 units |
| Credit score | ✓ Score ≥ 650 |
| Financial history | ✓ Compliance score ≥ 70 |

---

## ✨ Features

### 🔐 Core Modules
| Module | Description | Midnight Pattern |
|--------|-------------|------------------|
| **BusinessRegistry** | Private business identity + verification | Credence (domain-separated keys, nullifiers) |
| **PurchaseOrder** | Private PO lifecycle with ZK-gated flags | dMarket (commitments, state machine) |
| **Escrow** | Conditional payment with ZK release | Midnight Escrow (persistentCommit, nullifiers) |
| **Invoice** | Verified private receivable | Privoice (commitment, acknowledgment, settlement) |
| **Financing** | Private invoice financing + risk proof | Kredz (ScoreData hash, prove_tier) + RWA |
| **Compliance** | Programmable ZK compliance | ZK-Judge (weighted scoring) + DPO2U |
| **Settlement** | Final settlement record | Custom (nullifier-gated) |
| **CredentialRegistry** | Private credentials + selective disclosure | Credence (presentation nullifiers) |

### 🛡️ Privacy Guarantees
- **No private data on-chain** — only `persistentHash` commitments
- **No linkability across roles** — domain-separated key derivation
- **No replay of authorizations** — nullifier sets per action
- **Auditable when authorized** — selective disclosure via ZK

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      VEILCOMMERCE                            │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + Vite + Tailwind)                         │
│  ├── Dashboard    ├── Trade      ├── Orders                │
│  ├── Escrow       ├── Invoices   ├── Financing             │
│  ├── Compliance   ├── Portfolio  ├── Activity              │
│  └── Settings                                                      │
├─────────────────────────────────────────────────────────────┤
│  TypeScript SDK                                              │
│  ├── business/    ├── orders/      ├── escrow/             │
│  ├── invoices/    ├── financing/   ├── proofs/             │
│  ├── credentials/ ├── settlement/  └── compliance/         │
├─────────────────────────────────────────────────────────────┤
│  Midnight Contracts (Compact 0.5.1)                         │
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

---

## 🚀 Quick Start

### Prerequisites
```bash
# Node.js 22+
nvm install 22

# Midnight compact 0.5.1 (EXACT VERSION REQUIRED)
npm install -g @midnight-ntwrk/compact@0.5.1
```

### 1. Clone & Build Contracts
```bash
git clone <repo>
cd veilcommerce/contracts

# Compile all 8 contracts
for f in *.compact; do
  compact compile "$f" "../managed/$(basename $f .compact)"
done
```

### 2. Sync ZK Assets
```bash
# From project root
mkdir -p veilcommerce/frontend/public/contract
for name in BusinessRegistry PurchaseOrder Escrow Invoice Financing Compliance Settlement CredentialRegistry; do
  cp -r veilcommerce/contracts/managed/$name/keys \
        veilcommerce/frontend/public/contract/$name/
  cp -r veilcommerce/contracts/managed/$name/zkir \
        veilcommerce/frontend/public/contract/$name/
done
cp -r veilcommerce/contracts/managed/* \
      veilcommerce/frontend/contracts/
```

### 3. Run Frontend
```bash
cd veilcommerce/frontend
npm install
npm run dev
# → http://localhost:3000
```

### 4. Deploy to Preprod (Optional)
```bash
# Connect 1AM Wallet at http://localhost:3000
# Deploy each contract via UI or script
# See DEPLOYMENT.md for details
```

---

## 📁 Repository Structure

```
veilcommerce/
├── contracts/                    # 8 Compact contracts
│   ├── BusinessRegistry.compact
│   ├── PurchaseOrder.compact
│   ├── Escrow.compact
│   ├── Invoice.compact
│   ├── Financing.compact
│   ├── Compliance.compact
│   ├── Settlement.compact
│   └── CredentialRegistry.compact
│
├── circuits/                     # 5 ZK circuits
│   ├── funds/
│   ├── inventory/
│   ├── compliance/
│   ├── delivery/
│   └── financing/
│
├── sdk/                          # TypeScript SDK
│   ├── business/
│   ├── orders/
│   ├── escrow/
│   ├── invoices/
│   ├── financing/
│   ├── compliance/
│   ├── credentials/
│   ├── settlement/
│   ├── proofs/
│   └── index.ts                  # Unified factory
│
├── frontend/                     # React app
│   ├── src/
│   │   ├── pages/               # 11 pages
│   │   ├── components/Layout.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── tests/                        # Vitest suite
│   ├── contracts/
│   ├── integration/
│   └── e2e_trade_flow.test.ts   # Complete $50k flow
│
├── docs/                         # Technical docs
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   ├── PRIVACY_MODEL.md
│   ├── SECURITY.md
│   ├── ECONOMICS.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── DEPLOYMENT.md
├── TOOLCHAIN.md
├── SHARED.md
└── README.md
```

---


---

## 🏗️ Deployed Contracts (Preprod)

All 8 contracts are deployed on **Midnight Preprod**. Addresses below are the on-chain identities used by the frontend pages (Escrow, Invoices, Financing, Compliance).

| Contract | Address | Circuits |
|----------|---------|----------|
| **BusinessRegistry** | `f3dcfd3de998769631bde89b2744700496f49c72033be1c592ba8121185f5b06` | registerBusiness/verifyBusiness/proveBusinessEligible/proveAuthorization/revokeBusiness/setJurisdictionAllowed |
| **PurchaseOrder** | `f74138cc8efcb6af81dd716a7fdad623cec54104b5a2a1616b08848d36825ca7` | createPurchaseOrder/confirmOrder/markBuyerVerified/markSellerVerified/markFundsVerified/markFunded/markShipped/markDelivered/markSettled |
| **Escrow** | `1ceac78318d05b10d13d91dd3480490ccd231d67cf031ff5c415d37593021868` | createEscrow/verifyDelivery/release/refund/dispute |
| **Invoice** | `9910e937506d34e127988c6685eacf872bd643c61be6a9a75d6820af2eb5efbd` | issue/acknowledge/markFinancingEligible/settle/voidInvoice |
| **Financing** | `52e7a4a67f05ce34b88f3d969ef1facce4a030ec24d7444b93f753d125feccd4` | commitCreditScore/requestFinancing/verifyRisk/fundInvoice/repay |
| **Compliance** | `d6acb27c082b08d9c127e6cf5185f33e491cd484be65b9239c2b4f884c6a35ad` | attestCompliance/evaluateCompliance/grantDisclosure/revokeCompliance |
| **CredentialRegistry** | `cded8a9c5065a1b8378acd666c73a0b0f13a6fa290c0d2de9b929be7c0b10ab6` | issueCredential/proveCredential/verifyCredential/revokeCredential |
| **Settlement** | `9fae70798d880597fe6db8c7bd4f3d09d50f55f7f7e78ec1b53617cd4d84eefd` | settleTrade/settleEscrowLeg/reconcile |

### Ledger access

```ts
// In any page: read the live ledger
const ledger = await queryVeilLedger('Escrow', '1ceac78318d05b10d13d91dd3480490ccd231d67cf031ff5c415d37593021868');
// → { escrows: Map<escrowId, { buyer, seller, amount, state, ... }>, totalEscrows }
```

### How to deploy (reproducible)

```ts
// Deploy any contract via the wallet (1AM dust-free or Lace)
await veilManager.deployAndWait('Escrow', [escrowId, orderId, sellerId, timestamp]);
// Returns { contractAddress } → persist in deployments.json
```

---
## 🧪 Testing

```bash
# Unit tests
npm test -- veilcommerce/tests/contracts/

# Integration tests
npm test -- veilcommerce/tests/integration/

# Complete E2E flow ($50k Nigerian → Chinese trade)
npm test -- veilcommerce/tests/integration/e2e_trade_flow.test.ts
```

### Test Coverage Targets
- ✅ All 8 contracts: 100% circuit coverage
- ✅ All 5 ZK circuits: valid/tampered/replay/insufficient
- ✅ Complete E2E: Register → PO → Escrow → Delivery → Settlement → Invoice → Financing

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SPEC.md](docs/SPEC.md) | Complete technical specification |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture & data flows |
| [PRIVACY_MODEL.md](docs/PRIVACY_MODEL.md) | Privacy guarantees & selective disclosure |
| [SECURITY.md](docs/SECURITY.md) | Threat model, mitigations, audit checklist |
| [ECONOMICS.md](docs/ECONOMICS.md) | Business model, fees, projections |
| [API.md](docs/API.md) | TypeScript SDK + REST API + Webhooks |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Step-by-step deploy to Preprod |
| [TOOLCHAIN.md](TOOLCHAIN.md) | Exact version matrix |
| [SHARED.md](SHARED.md) | Cross-cutting patterns & conventions |

---

## 🔧 Toolchain Versions (Critical)

| Tool | Version | Note |
|------|---------|------|
| `compact` | **0.5.1** | Exact — `npm i -g @midnight-ntwrk/compact@0.5.1` |
| Node.js | 22.x | LTS |
| TypeScript | 5.2.2 | Not 6.x |
| Vite | 5.4.21 | Not 6.x (Rolldown) |
| React | 18.2.0 | Not 19 |

**Required overrides** (in `package.json`):
```json
"overrides": {
  "@midnight-ntwrk/ledger-v8": "8.0.3",
  "@midnight-ntwrk/midnight-js-utils": "4.0.4"
}
```

---

## 🌐 Network

- **Testnet**: Midnight Preprod
- **RPC**: `https://rpc.preprod.midnight.network`
- **Indexer**: `https://indexer.preprod.midnight.network/api/v4/graphql`
- **Explorer**: `https://preprod.midnightexplorer.com`
- **Wallet**: 1AM Wallet (browser extension)

---

## 💰 Business Model

| Revenue Stream | Rate |
|----------------|------|
| Trade execution | 0.1% (min $5, max $500) |
| Invoice settlement | 0.05% (min $2, max $200) |
| Financing origination | 1-2% of funded |
| Financing servicing | 0.5% annually |
| Enterprise API | $499-$4,999/mo |
| Verification/Compliance | $99-$500 |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feat/amazing-feature`)
3. Ensure all tests pass (`npm test`)
4. Follow [SHARED.md](SHARED.md) patterns
5. Submit PR with description

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built on patterns from the Midnight ecosystem:
- **Privoice** — Private invoice commitments
- **Midnight Escrow** — Conditional payments
- **Credence** — Private credentials + nullifiers
- **Kredz** — Privacy-preserving credit identity
- **Real World Assets** — Shielded assets + RWA
- **dMarket** — Marketplace + escrow workflow
- **SilentLedger** — Private orderbook
- **Midnight-ZK-Judge** — ZK compliance scoring
- **DPO2U** — ZK compliance attestation

---

## 🔗 Links

- **Live Demo**: [veilcommerce.xyz](https://veilcommerce.xyz) (when deployed)
- **Documentation**: [docs.veilcommerce.xyz](https://docs.veilcommerce.xyz)
- **Midnight Network**: [midnight.network](https://midnight.network)
- **1AM Wallet**: [1am.midnight.network](https://1am.midnight.network)

---

**VeilCommerce — Trust without total transparency.**