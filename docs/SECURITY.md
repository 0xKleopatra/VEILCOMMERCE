# VeilCommerce — Security

> **Security model, threat analysis, and audit checklist**

---

## 1. Security Model

### 1.1 Trust Assumptions
| Component | Trust Level |
|-----------|-------------|
| Midnight consensus | Honest majority (Byzantine fault tolerance) |
| ZK proving system | Soundness of underlying proof system (Plonk/Honk) |
| Contract code | Correctness of compiled Compact → arithmetic circuit |
| Witness functions | User's local execution environment (not on-chain) |
| Indexer | Availability (not integrity — verified via Merkle proofs) |

### 1.2 Threat Model
```
Adversary capabilities:
├── On-chain observer (sees all public state)
├── Network observer (sees transaction timing/volume)
├── Malicious counterparty (tries to cheat in trade)
├── Compromised frontend (tries to leak witnesses)
├── Malicious indexer (tries to serve wrong state)
└── Quantum adversary (future threat to ZK schemes)

Defended by:
├── ZK proofs (privacy + integrity)
├── Nullifiers (replay prevention)
├── Domain separation (linkability prevention)
├── Commitment binding (tamper evidence)
├── State machines (invalid transition rejection)
└── Witness isolation (never on-chain)
```

---

## 2. Attack Vectors & Mitigations

### 2.1 Replay Attacks
| Vector | Mitigation |
|--------|------------|
| Reuse business authorization | `usedNullifiers` set per action |
| Reuse escrow release secret | `usedReleaseNullifiers` set |
| Reuse financing nullifier | `usedFinancingNullifiers` set |
| Reuse settlement nullifier | `usedSettlementNullifiers` set |
| Reuse credential presentation | `usedCredentialNullifiers` set |

**All nullifiers:** `H(secret, action, context)` — unique per (identity, action, context)

### 2.2 Double Spending
| Vector | Mitigation |
|--------|------------|
| Fund same invoice twice | `invoiceFinancing` map + financing nullifier |
| Release escrow twice | `usedReleaseNullifiers` + state machine |
| Settle same order twice | `settledOrders` set + settlement nullifier |
| Spend same funds in multiple orders | Per-order funds verification (ZK proof) |

### 2.3 Unauthorized Actions
| Vector | Mitigation |
|--------|------------|
| Release escrow without delivery | `deliveryVerified` set + ZK proof required |
| Settle without authorization | `payerId` check + settlement nullifier |
| Fund invoice without risk check | `riskVerified` set required |
| Revoke business without admin | `adminKey` sealed, witness-derived |
| Dispute without being party | `callerId` must match buyer/seller |

### 2.4 Proof Tampering
| Vector | Mitigation |
|--------|------------|
| Forge funds proof | `persistentHash` binding + on-chain verification |
| Forge inventory proof | Same commitment scheme |
| Forge compliance proof | Weighted scoring in circuit, not off-chain |
| Forge delivery proof | Evidence hash + PO commitment binding |
| Forge credit score | `creditCommitments` map + ZK verification |

### 2.5 Invalid State Transitions
| Vector | Mitigation |
|--------|------------|
| Escrow: Funded → Released (skip delivery) | State machine: Funded → DeliveryVerified → Released |
| Order: Draft → Settled (skip all) | State machine enforces sequence |
| Invoice: Issued → Settled (skip acknowledge) | `acknowledged` set required |
| Financing: Requested → Funded (skip risk) | `riskVerified` set required |
| Business: Revoked → Verified | Status enum, no direct transition |

### 2.6 Credential Attacks
| Vector | Mitigation |
|--------|------------|
| Use revoked credential | `revokedCredentials` set checked |
| Replay credential proof | `usedCredentialNullifiers` per verifier |
| Forge credential | `trustedIssuers` set + issuer signature |
| Link credentials across verifiers | Domain-separated `partyId` + per-verifier nullifier |

---

## 3. Cryptographic Assumptions

### 3.1 Hash Functions
- **`persistentHash`**: Midnight's domain-separated poseidon/blake2b
- **Collision resistance**: 128-bit security (Bytes32 output)
- **Preimage resistance**: Required for commitment hiding

### 3.2 ZK Proof System
- **Backend**: Midnight's Plonk/Honk (via compact-runtime)
- **Soundness**: Computational (relies on discrete log)
- **Zero-knowledge**: Witness never revealed
- **Circuit compilation**: Compact 0.5.1 → arithmetic circuit

### 3.3 Commitment Schemes
- **`persistentHash(Struct)`**: Domain-separated, type-aware
- **`persistentCommit(value, nonce)`**: Pedersen-style for amounts
- **Binding**: Computational (hash collision resistance)
- **Hiding**: Information-theoretic (nonce space)

### 3.4 Key Derivation
```compact
identity = persistentHash(["veil:domain:v1", secret])
```
- **Domain separation**: Unique tag per role/contract
- **One-way**: Secret → identity, not reversible
- **Unlinkable**: Different domains → uncorrelated outputs

---

## 4. Audit Checklist

### 4.1 Contract-Level (All 8 Contracts)
- [ ] All `export circuit` have proper `assert` conditions
- [ ] All public outputs wrapped in `disclose()`
- [ ] All witness inputs never appear in public state
- [ ] `sealed` admin keys derived from witness (not `ownPublicKey()`)
- [ ] `Counter` used for monotonic IDs/nonces
- [ ] `Map<K, V>` and `Set<K>` with proper `disclose()` on insert/lookup
- [ ] Nullifier sets for every private authorization
- [ ] State machine enums prevent invalid transitions
- [ ] Domain-separated key derivation for all identities
- [ ] No `let` (reserved keyword) — use `const`
- [ ] No `as Bytes<32>` casts on `Field` — use `Bytes<32>` params

### 4.2 Circuit-Level (5 ZK Circuits)
- [ ] All private inputs via `witness`
- [ ] All public outputs via `disclose` in circuit return
- [ ] Pure helper circuits for off-chain recomputation
- [ ] Commitment verification circuits exported
- [ ] No arithmetic overflow (use appropriate `Uint<N>`)
- [ ] Weighted scoring computed in-circuit (not off-chain)

### 4.3 SDK/Frontend
- [ ] Witness functions never send secrets to backend
- [ ] `CompiledContract.withWitnesses()` wired correctly
- [ ] `createUnprovenDeployTx` + `submitTxAsync` (not `deployContract`)
- [ ] `balanceUnsealedTransaction` for fee payment
- [ ] `waitForContractIndexed` polling after deploy
- [ ] Private state provider for witness caching
- [ ] Indexer patch for `queryContractState` compatibility

### 4.4 Deployment
- [ ] `compact --version` = 0.5.1 exact
- [ ] All contracts compile without warnings
- [ ] ZK assets (`keys/`, `zkir/`) copied to frontend public/
- [ ] TypeScript bindings in `frontend/contracts/managed/`
- [ ] `overrides` for `ledger-v8` and `midnight-js-utils`
- [ ] Vite config: WASM, top-level-await, node polyfills
- [ ] Vercel: Root directory empty, SPA rewrites

---

## 5. Known Limitations

### 5.1 Current Midnight Constraints
| Limitation | Impact |
|------------|--------|
| No `msg.sender` | Identity via witness + nullifier |
| No native events | State changes via Map/Set reads |
| No contract-to-contract calls | Coordination via shared state/off-chain |
| Limited `Uint<N>` arithmetic | Overflow checks manual |
| No `let` keyword | Use `const` everywhere |

### 5.2 Privacy Boundaries
| Boundary | Note |
|----------|------|
| Transaction graph | On-chain timing/volume visible |
| Contract interaction | Which contracts called when |
| Gas patterns | Computation complexity inferable |
| Quantum | Current ZK not post-quantum |

### 5.3 Operational
| Risk | Mitigation |
|------|------------|
| Indexer downtime | Local state cache, retry logic |
| Wallet disconnect | Reconnect flow, persisted secrets |
| Proof generation failure | Retry with new salt/nonce |
| Network partition | Off-chain coordination, eventual consistency |

---

## 6. Incident Response

### 6.1 Compromise Scenarios
| Scenario | Detection | Response |
|----------|-----------|----------|
| Frontend compromised (witness leak) | User reports, anomaly detection | Rotate secrets, redeploy contracts |
| Admin key compromised | Unauthorized revocations | Rotate admin key (new deploy) |
| ZK proof forge attempt | Failed verifications on-chain | Circuit audit, upgrade |
| Indexer serves wrong state | Merkle proof mismatch | Switch indexer, alert users |

### 6.2 Emergency Procedures
1. **Pause**: Admin sets `DexState.Paused` equivalent (if implemented)
2. **Investigate**: Check on-chain state, proof IDs, nullifiers
3. **Communicate**: Status page, Discord, email
4. **Remediate**: Deploy fixed contracts, migrate state
5. **Post-mortem**: Public report within 72h

---

*Security documentation for VeilCommerce — see `veilcommerce/contracts/` for contract implementations, `veilcommerce/circuits/` for ZK circuits, `veilcommerce/tests/` for security tests.*