# VeilCommerce — Economics

> **Business model, tokenomics, and financial architecture**

---

## 1. Revenue Model

### 1.1 Transaction Fees
| Fee Type | Rate | Charged To | Collected Via |
|----------|------|------------|---------------|
| **Trade execution** | 0.1% (min $5, max $500) | Buyer | Escrow release |
| **Invoice settlement** | 0.05% (min $2, max $200) | Seller | Invoice settlement |
| **Financing origination** | 1-2% of funded amount | Seller | Financing funding |
| **Financing servicing** | 0.5% annually | Investor | Repayment distribution |

### 1.2 Escrow Fees
| Service | Fee |
|---------|-----|
| Standard escrow (auto-release) | 0.1% of escrow value |
| Disputed escrow (manual resolution) | 0.5% + $100 admin |
| Multi-condition escrow | +0.05% per condition |

### 1.3 Verification & Compliance
| Service | Fee |
|---------|-----|
| Business verification (one-time) | $99 |
| Annual compliance monitoring | $299/year |
| Selective disclosure request | $10 per request |
| Auditor access (per investigation) | $500 |

### 1.4 Enterprise & API
| Tier | Monthly | Includes |
|------|---------|----------|
| **Starter** | $499 | 100 verifications, 50 API calls/day |
| **Growth** | $1,999 | 1,000 verifications, 5,000 API calls/day |
| **Scale** | $4,999 | 5,000 verifications, 50,000 API calls/day |
| **Custom** | Negotiated | Unlimited, SLA, dedicated support |

---

## 2. Financial Architecture

### 2.1 Settlement Currency
| Currency | Use Case | Status |
|----------|----------|--------|
| **USDM** (Midnight shielded) | Primary trade settlement | Live on Preprod |
| **USDC** (Ethereum/Base) | Cross-chain bridging | Via Midnight bridge |
| **NIGHT** | Gas/staking | Native |
| **Local fiat** | Off-ramp via partners | Via banking APIs |

### 2.2 Escrow Mechanics
```
Buyer deposits → Escrow contract (USDM shielded)
    ↓
Funds locked in contract state (amount commitment)
    ↓
Conditions met (delivery ZK proof verified)
    ↓
Contract releases → Seller address (shielded transfer)
    ↓
Settlement record created (amount commitment)
```

### 2.3 Financing Mechanics
```
Seller requests financing ($45k on $50k invoice)
    ↓
Investor reviews ZK risk proof (score ≥ threshold)
    ↓
Investor funds → Financing contract
    ↓
Seller receives $45k (shielded)
    ↓
At maturity: Buyer pays $50k → Financing contract
    ↓
Investor receives $50k (principal + yield)
    ↓
Financing contract records repayment
```

### 2.4 Fee Collection Flow
```
Trade executed ($50k)
    ↓
Escrow releases to seller ($50k - $50 fee = $49,950)
    ↓
Fee ($50) → Treasury contract
    ↓
Monthly: Treasury → Team wallet (operational)
           Treasury → Staking rewards (if applicable)
```

---

## 3. Token Economics (Future)

### 3.1 VEIL Token (Planned)
| Property | Value |
|----------|-------|
| **Name** | VeilCommerce Protocol Token |
| **Symbol** | VEIL |
| **Supply** | 1,000,000,000 (fixed) |
| **Decimals** | 18 |

### 3.2 Token Utility
| Use Case | Mechanism |
|----------|-----------|
| **Fee discounts** | Hold VEIL → 50% fee reduction |
| **Staking** | Stake VEIL → protocol revenue share |
| **Governance** | Vote on fee parameters, upgrades |
| **Incentives** | Liquidity mining for USDM pools |
| **Reputation** | VEIL-weighted business verification |

### 3.3 Distribution
| Category | % | Vesting |
|----------|---|---------|
| Team & Advisors | 20% | 4-year linear |
| Investors | 15% | 2-year linear |
| Ecosystem Fund | 25% | DAO-controlled |
| Liquidity & Incentives | 20% | Programmatic |
| Community/Airdrop | 10% | Immediate |
| Treasury | 10% | DAO-controlled |

---

## 4. Unit Economics (Per Transaction)

### 4.1 $50,000 Trade Example
| Component | Amount | Notes |
|-----------|--------|-------|
| Trade value | $50,000 | |
| Escrow fee (0.1%) | -$50 | Collected at release |
| Settlement fee (0.05%) | -$25 | Collected at settlement |
| **Seller receives** | **$49,925** | Net |
| Buyer pays | $50,000 | Gross |

### 4.2 Financing Example ($50k invoice, $45k funded)
| Component | Amount | Notes |
|-----------|--------|-------|
| Invoice face value | $50,000 | |
| Financing requested | $45,000 | 90% |
| Origination fee (1.5%) | -$675 | Seller pays |
| **Seller receives upfront** | **$44,325** | |
| Investor funds | $45,000 | |
| At maturity (47 days): | | |
| Buyer pays invoice | $50,000 | |
| Investor receives | $50,000 | Principal + yield |
| **Investor yield** | **$5,000** | ~87% APR (47 days) |
| Platform servicing (0.5%/yr) | ~$30 | From investor yield |

### 4.3 Monthly Revenue Projection (Scale)
| Volume | Monthly Trades | Avg Value | Monthly Revenue |
|--------|----------------|-----------|-----------------|
| **Early** | 100 | $25k | $3,750 |
| **Growth** | 1,000 | $35k | $52,500 |
| **Scale** | 10,000 | $50k | $750,000 |
| **Mature** | 100,000 | $75k | $11,250,000 |

---

## 5. Cost Structure

### 5.1 Protocol Costs (Per Transaction)
| Cost | Estimate | Paid By |
|------|----------|---------|
| Midnight gas (proof verification) | ~$0.10 | Platform (sponsored) |
| Indexer query | ~$0.01 | Platform |
| ZK proof generation (client) | Compute | User (local) |
| Shielded transfer | ~$0.05 | Platform (sponsored) |

### 5.2 Operational Costs (Monthly)
| Category | Early Stage | Scale |
|----------|-------------|-------|
| Engineering | $50k | $500k |
| Infrastructure | $5k | $50k |
| Legal/Compliance | $10k | $100k |
| Marketing/BD | $20k | $200k |
| **Total** | **$85k** | **$850k** |

---

## 6. Financial Projections (3-Year)

### 6.1 Revenue
| Year | Monthly Trades | Avg Value | ARR |
|------|----------------|-----------|-----|
| Year 1 | 500 | $30k | $270k |
| Year 2 | 5,000 | $40k | $3.6M |
| Year 3 | 25,000 | $50k | $22.5M |

### 6.2 Financing Revenue (Year 3)
| Metric | Value |
|--------|-------|
| Invoices financed/month | 5,000 |
| Avg financed amount | $40k |
| Origination fee (1.5%) | $36M ARR |
| Servicing fee (0.5%) | $1.2M ARR |
| **Total financing revenue** | **$37.2M ARR** |

### 6.3 Combined ARR (Year 3)
| Stream | ARR |
|--------|-----|
| Trade fees | $22.5M |
| Financing | $37.2M |
| Enterprise/API | $5.0M |
| Verification/Compliance | $2.0M |
| **Total** | **$66.7M** |

---

## 7. Risk Factors

### 7.1 Revenue Risks
| Risk | Mitigation |
|------|------------|
| Low adoption | Enterprise sales, partnerships |
| Fee compression | Differentiated value (privacy + ZK) |
| Regulatory limits on financing | Compliance-first design, licenses |
| Crypto volatility | USDM/USDC stablecoins primary |

### 7.2 Cost Risks
| Risk | Mitigation |
|------|------------|
| Midnight gas spikes | Fee abstraction, sponsorship |
| ZK proving costs | Client-side, optimized circuits |
| Audit/security costs | Automated testing, bug bounties |

---

## 8. Capital Efficiency

### 8.1 Capital Requirements
| Phase | Capital Needed | Use |
|-------|----------------|-----|
| **Seed** | $2M | Core team, contracts, frontend, audit |
| **Series A** | $10M | Scale, enterprise sales, compliance |
| **Series B** | $30M | Global expansion, licensing, token |

### 8.2 Runway Targets
- **Seed**: 18 months
- **Series A**: 24 months
- **Break-even**: Month 30 (Year 2.5)

---

*Economics model for VeilCommerce — see `veilcommerce/docs/SPEC.md` for technical fee collection, `veilcommerce/contracts/` for on-chain fee logic.*