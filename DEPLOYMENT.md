# VeilCommerce — Deployment Guide

> **Deploy to Midnight Preprod testnet**

---

## 1. Prerequisites

### 1.1 System Requirements
- **Node.js**: 22.x LTS
- **npm**: 10.x
- **Midnight `compact`**: 0.5.1 (exact)
- **Git**: 2.x

### 1.2 Midnight Toolchain
```bash
# Install compact compiler (exact version required)
npm install -g @midnight-ntwrk/compact@0.5.1

# Verify
compact --version  # Should output: compact 0.5.1
```

### 1.3 Wallet
- **1AM Wallet** browser extension (Midnight Preprod)
- Or Midnight CLI wallet for headless deployment

---

## 2. Build Contracts

### 2.1 Compile All Contracts
```bash
cd contracts

# Compile each contract to managed/
for f in *.compact; do
  name=$(basename "$f" .compact)
  echo "Compiling $name..."
  compact compile "$f" "../managed/$name"
done

# Verify all compiled
ls -la ../managed/
```

### 2.2 Expected Output
```
managed/
├── BusinessRegistry/
│   ├── contract/      # TypeScript bindings
│   ├── keys/          # Prover/verifier keys
│   └── zkir/          # ZK intermediate representations
├── PurchaseOrder/
├── Escrow/
├── Invoice/
├── Financing/
├── Compliance/
├── Settlement/
└── CredentialRegistry/
```

---

## 3. Sync ZK Assets to Frontend

### 3.1 Copy Contract Artifacts
```bash
# From project root
mkdir -p frontend/public/contract

# Copy each contract's keys and zkir to public/contract/
for name in BusinessRegistry PurchaseOrder Escrow Invoice Financing Compliance Settlement CredentialRegistry; do
  cp -r contracts/managed/$name/keys \
        frontend/public/contract/$name/
  cp -r contracts/managed/$name/zkir \
        frontend/public/contract/$name/
done

# Copy TypeScript bindings for frontend imports
mkdir -p frontend/contracts
cp -r contracts/managed/* \
      frontend/contracts/
```

### 3.2 Verify Frontend Structure
```
frontend/
├── public/contract/
│   ├── BusinessRegistry/keys/  BusinessRegistry/zkir/
│   ├── PurchaseOrder/keys/     PurchaseOrder/zkir/
│   ├── Escrow/keys/            Escrow/zkir/
│   ├── Invoice/keys/           Invoice/zkir/
│   ├── Financing/keys/         Financing/zkir/
│   ├── Compliance/keys/        Compliance/zkir/
│   ├── Settlement/keys/        Settlement/zkir/
│   └── CredentialRegistry/keys/ CredentialRegistry/zkir/
└── contracts/
    └── managed/... (TypeScript imports)
```

---

## 4. Build Frontend

### 4.1 Install Dependencies
```bash
cd frontend
npm install
```

### 4.2 Type Check
```bash
npx tsc --noEmit
```

### 4.3 Development Server
```bash
npm run dev
# Opens http://localhost:3000
```

### 4.4 Production Build
```bash
npm run build
# Output in dist/
```

---

## 5. Deploy Contracts to Preprod

### 5.1 Using 1AM Wallet (Recommended)

1. Open frontend at `http://localhost:3000` (or deployed URL)
2. Click "Connect Wallet" → Select 1AM Wallet
3. Approve connection to Midnight Preprod
4. Navigate to each contract deployment (or use deploy script)

### 5.2 Deploy Script (Automated)
```bash
cd frontend

# Create deploy script
cat > scripts/deploy-all.ts << 'EOF'
import { deployContract, waitForContractIndexed } from './src/midnight/contract';

async function deployAll() {
  const contracts = [
    { name: 'BusinessRegistry', args: [] },
    { name: 'PurchaseOrder', args: [] },
    { name: 'Escrow', args: [] },
    { name: 'Invoice', args: [] },
    { name: 'Financing', args: [] },
    { name: 'Compliance', args: [] },
    { name: 'Settlement', args: [] },
    { name: 'CredentialRegistry', args: [] },
  ];

  for (const { name, args } of contracts) {
    console.log(`Deploying ${name}...`);
    const address = await deployContract(api, { args });
    console.log(`${name} deployed to: ${address}`);
    await waitForContractIndexed(api, address);
    console.log(`${name} indexed ✓`);
  }
}
EOF

npx tsx scripts/deploy-all.ts
```

### 5.3 Record Contract Addresses
After deployment, update `docs/SPEC.md` with actual addresses:

| Contract | Address | Tx Hash | Block |
|----------|---------|---------|-------|
| BusinessRegistry | `FAILED` | `` | undeployed |
| PurchaseOrder | `FAILED` | `` | undeployed |
| Escrow | `FAILED` | `` | undeployed |
| Invoice | `FAILED` | `` | undeployed |
| Financing | `FAILED` | `` | undeployed |
| Compliance | `FAILED` | `` | undeployed |
| CredentialRegistry | `FAILED` | `` | undeployed |
| Settlement | `FAILED` | `` | undeployed |

---

## 6. Verify Deployment

### 6.1 Check Contract State
```bash
# Query each contract via indexer
curl -X POST https://indexer.preprod.midnight.network/api/v4/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ contractState(address: \"0x...\") { data } }"}'
```

### 6.2 Run Integration Tests
```bash
cd veilcommerce
npm test -- tests/integration/e2e_trade_flow.test.ts
```

### 6.3 Manual Verification Flow
1. Open deployed frontend
2. Connect 1AM Wallet
3. Register two test businesses (NG + CN)
4. Create $50k purchase order
5. Generate ZK proofs (funds + inventory)
6. Fund escrow
7. Verify delivery
8. Release escrow
9. Issue invoice
10. Request financing
11. Verify risk
12. Fund invoice
13. Confirm settlement

---

## 7. Production Considerations

### 7.1 Environment Variables
```env
# .env.production
VITE_MIDNIGHT_NETWORK=preprod
VITE_INDEXER_URI=https://indexer.preprod.midnight.network/api/v4/graphql
VITE_INDEXER_WS_URI=wss://indexer.preprod.midnight.network/api/v4/graphql/ws
VITE_NODE_URI=https://rpc.preprod.midnight.network
```

### 7.2 Vercel/Netlify Deployment
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

### 7.3 Contract Upgrades
- Contracts are immutable on Midnight
- Deploy new versions with new addresses
- Update frontend config with new addresses
- Migrate state via off-chain coordination

---

## 8. Troubleshooting

### 8.1 Compact Version Mismatch
```
ERROR: compact version 0.6.x detected. Requires 0.5.x
```
→ `npm install -g @midnight-ntwrk/compact@0.5.1`

### 8.2 Ledger-v8 Duplicate
```
expected instance of _CostModel
```
→ Ensure `overrides` in package.json:
```json
"overrides": {
  "@midnight-ntwrk/ledger-v8": "8.0.3",
  "@midnight-ntwrk/midnight-js-utils": "4.0.4"
}
```

### 8.3 Contract Not Indexed
```
Contract not indexed after polling
```
→ Wait 30-120s, increase `maxAttempts` in `waitForContractIndexed`

### 8.4 ZK Assets 404
```
GET /contract/BusinessRegistry/keys/... 404
```
→ Run sync step (Section 3.1) after every contract compile

---

## 9. Deployment Checklist

- [ ] `compact --version` = 0.5.1
- [ ] All 8 contracts compile without errors
- [ ] ZK assets copied to `frontend/public/contract/`
- [ ] TypeScript bindings in `frontend/contracts/managed/`
- [ ] `npm run build` succeeds
- [ ] 1AM Wallet connects to Preprod
- [ ] All 8 contracts deployed
- [ ] Contract addresses recorded
- [ ] E2E test passes ($50k flow)
- [ ] Frontend deployed to Vercel/Netlify
- [ ] README updated with live URLs

---

*Deployment guide for VeilCommerce — see `frontend/contracts/`, `frontend/` for source.*