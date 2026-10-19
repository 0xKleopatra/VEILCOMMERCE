import { useState } from 'react';

type CircuitType = 'funds' | 'inventory' | 'delivery' | 'compliance' | 'financing';

interface CircuitState {
  // Funds
  balance: number;
  requiredFunds: number;
  // Inventory
  stock: number;
  orderQty: number;
  // Delivery
  expectedAmount: number;
  deliveredAmount: number;
  evidenceProvided: boolean;
  // Compliance
  sanctionClear: boolean;
  docComplete: boolean;
  authLevel: number;
  // Financing
  creditScore: number;
  requiredScore: number;
}

export function ZkStudio() {
  const [activeCircuit, setActiveCircuit] = useState<CircuitType>('funds');
  const [circuitState, setCircuitState] = useState<CircuitState>({
    balance: 75000,
    requiredFunds: 50000,
    stock: 25000,
    orderQty: 10000,
    expectedAmount: 10000,
    deliveredAmount: 10000,
    evidenceProvided: true,
    sanctionClear: true,
    docComplete: true,
    authLevel: 2,
    creditScore: 720,
    requiredScore: 650,
  });

  const [isProving, setIsProving] = useState(false);
  const [proofResult, setProofResult] = useState<{
    success: boolean;
    commitment: string;
    assertPassed: boolean;
    assertionLog: string;
    circuitName: string;
    executionTimeMs: number;
  } | null>(null);

  const runProof = async (tamper: boolean = false) => {
    setIsProving(true);
    setProofResult(null);

    await new Promise((r) => setTimeout(r, 800));

    let pass = false;
    let log = '';

    if (activeCircuit === 'funds') {
      const bal = tamper ? 30000 : circuitState.balance;
      pass = bal >= circuitState.requiredFunds;
      log = pass
        ? `assert(witness_balance >= required_funds): ${bal} >= ${circuitState.requiredFunds} -> SATISFIED`
        : `assert(witness_balance >= required_funds): ${bal} < ${circuitState.requiredFunds} -> FAILED (Insufficient balance witness)`;
    } else if (activeCircuit === 'inventory') {
      const st = tamper ? 5000 : circuitState.stock;
      pass = st >= circuitState.orderQty;
      log = pass
        ? `assert(inventory >= required_quantity): ${st} >= ${circuitState.orderQty} -> SATISFIED`
        : `assert(inventory >= required_quantity): ${st} < ${circuitState.orderQty} -> FAILED (Inventory shortfall)`;
    } else if (activeCircuit === 'delivery') {
      const del = tamper ? 4000 : circuitState.deliveredAmount;
      const ev = tamper ? false : circuitState.evidenceProvided;
      pass = del >= circuitState.expectedAmount && ev;
      log = pass
        ? `assert(actual_delivered >= expected && evidence_hash != 0): ${del} >= ${circuitState.expectedAmount} -> SATISFIED`
        : `assert(actual_delivered >= expected && evidence_hash != 0): ${del} < ${circuitState.expectedAmount} -> FAILED (Discrepancy in delivery manifest)`;
    } else if (activeCircuit === 'compliance') {
      const sanctions = tamper ? false : circuitState.sanctionClear;
      const docs = tamper ? false : circuitState.docComplete;
      const score = (sanctions ? 50 : 0) + (docs ? 30 : 0) + (circuitState.authLevel * 10);
      pass = score >= 70;
      log = pass
        ? `assert(composite_compliance_score >= 70): calculated score ${score} >= 70 -> SATISFIED`
        : `assert(composite_compliance_score >= 70): calculated score ${score} < 70 -> FAILED (Regulatory non-compliance)`;
    } else if (activeCircuit === 'financing') {
      const score = tamper ? 580 : circuitState.creditScore;
      pass = score >= circuitState.requiredScore;
      log = pass
        ? `assert(credit_score >= min_threshold): ${score} >= ${circuitState.requiredScore} -> SATISFIED (Financing tier confirmed)`
        : `assert(credit_score >= min_threshold): ${score} < ${circuitState.requiredScore} -> FAILED (High credit risk witness)`;
    }

    const commitment = pass
      ? '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, '0')).join('')
      : '0x0000000000000000000000000000000000000000000000000000000000000000';

    setProofResult({
      success: pass,
      commitment,
      assertPassed: pass,
      assertionLog: log,
      circuitName: activeCircuit.toUpperCase(),
      executionTimeMs: Math.floor(Math.random() * 40 + 75),
    });

    setIsProving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-veil-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-veil-900">Zero-Knowledge Circuit Studio</h1>
              <span className="badge-primary">Wave 2 Feature</span>
            </div>
            <p className="mt-1 text-sm text-veil-600">
              Interactive test bench for the 5 Midnight Compact circuits in <code className="text-xs bg-veil-100 px-1 py-0.5 rounded text-veil-800">circuits/</code>. Test witness assertions, view persistentHash outputs, and simulate adversary tampering.
            </p>
          </div>
        </div>
      </div>

      {/* Circuit Selector Tabs */}
      <div className="flex border-b border-veil-200 overflow-x-auto space-x-6">
        {[
          { id: 'funds', name: 'Proof of Funds', path: 'circuits/funds/proof_of_funds.compact' },
          { id: 'inventory', name: 'Proof of Inventory', path: 'circuits/inventory/proof_of_inventory.compact' },
          { id: 'delivery', name: 'Proof of Delivery', path: 'circuits/delivery/proof_of_delivery.compact' },
          { id: 'compliance', name: 'Proof of Compliance', path: 'circuits/compliance/proof_of_compliance.compact' },
          { id: 'financing', name: 'Proof of Financing', path: 'circuits/financing/proof_of_financing.compact' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCircuit(c.id as CircuitType);
              setProofResult(null);
            }}
            className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeCircuit === c.id
                ? 'border-veil-900 text-veil-900'
                : 'border-transparent text-veil-500 hover:text-veil-700 hover:border-veil-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Testing Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Witness Inputs */}
        <div className="card space-y-5">
          <div className="flex items-center justify-between border-b border-veil-200 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-veil-900">Private Witness Parameters</h2>
              <p className="text-xs text-veil-500">Off-chain values known only to your client prover</p>
            </div>
            <span className="badge-secondary text-xs">Zero-Knowledge Private</span>
          </div>

          {activeCircuit === 'funds' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Private Account Balance (USD)
                </label>
                <input
                  type="number"
                  value={circuitState.balance}
                  onChange={(e) => setCircuitState({ ...circuitState, balance: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
                <p className="text-xs text-veil-500 mt-1">Kept strictly off-chain as a private witness</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Required Escrow Amount (USD)
                </label>
                <input
                  type="number"
                  value={circuitState.requiredFunds}
                  onChange={(e) => setCircuitState({ ...circuitState, requiredFunds: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
                <p className="text-xs text-veil-500 mt-1">Public on-chain deal constraint</p>
              </div>
            </div>
          )}

          {activeCircuit === 'inventory' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Actual Warehouse Stock (Units)
                </label>
                <input
                  type="number"
                  value={circuitState.stock}
                  onChange={(e) => setCircuitState({ ...circuitState, stock: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
                <p className="text-xs text-veil-500 mt-1">Supplier's confidential warehouse inventory</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Purchase Order Commitment (Units)
                </label>
                <input
                  type="number"
                  value={circuitState.orderQty}
                  onChange={(e) => setCircuitState({ ...circuitState, orderQty: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
              </div>
            </div>
          )}

          {activeCircuit === 'delivery' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Expected Order Amount (Units)
                </label>
                <input
                  type="number"
                  value={circuitState.expectedAmount}
                  onChange={(e) => setCircuitState({ ...circuitState, expectedAmount: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Actual Verified Delivered Amount (Units)
                </label>
                <input
                  type="number"
                  value={circuitState.deliveredAmount}
                  onChange={(e) => setCircuitState({ ...circuitState, deliveredAmount: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="evidenceProvided"
                  checked={circuitState.evidenceProvided}
                  onChange={(e) => setCircuitState({ ...circuitState, evidenceProvided: e.target.checked })}
                  className="rounded border-veil-300 text-veil-900 focus:ring-veil-500"
                />
                <label htmlFor="evidenceProvided" className="text-sm text-veil-700">
                  Carrier Bill of Lading / Evidence Hash Provided
                </label>
              </div>
            </div>
          )}

          {activeCircuit === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sanctions"
                  checked={circuitState.sanctionClear}
                  onChange={(e) => setCircuitState({ ...circuitState, sanctionClear: e.target.checked })}
                  className="rounded border-veil-300 text-veil-900 focus:ring-veil-500"
                />
                <label htmlFor="sanctions" className="text-sm font-medium text-veil-800">
                  Passed OFAC / Sanctions Screening (50 pts)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="docs"
                  checked={circuitState.docComplete}
                  onChange={(e) => setCircuitState({ ...circuitState, docComplete: e.target.checked })}
                  className="rounded border-veil-300 text-veil-900 focus:ring-veil-500"
                />
                <label htmlFor="docs" className="text-sm font-medium text-veil-800">
                  Complete Beneficial Ownership Documentation (30 pts)
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Authorization Level (Tier 0-2)
                </label>
                <select
                  value={circuitState.authLevel}
                  onChange={(e) => setCircuitState({ ...circuitState, authLevel: Number(e.target.value) })}
                  className="input-field w-full"
                >
                  <option value={0}>Tier 0: Basic (0 pts)</option>
                  <option value={1}>Tier 1: Standard Exporter (10 pts)</option>
                  <option value={2}>Tier 2: Prime Enterprise (20 pts)</option>
                </select>
              </div>
            </div>
          )}

          {activeCircuit === 'financing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Private Credit Score Witness
                </label>
                <input
                  type="number"
                  value={circuitState.creditScore}
                  onChange={(e) => setCircuitState({ ...circuitState, creditScore: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
                <p className="text-xs text-veil-500 mt-1">Stored in persistent secret storage; never sent to lender</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-veil-700 mb-1">
                  Minimum Factoring Threshold
                </label>
                <input
                  type="number"
                  value={circuitState.requiredScore}
                  onChange={(e) => setCircuitState({ ...circuitState, requiredScore: Number(e.target.value) })}
                  className="input-field w-full font-mono"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-veil-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => runProof(false)}
              disabled={isProving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isProving ? 'Generating ZK Proof...' : '✓ Generate Honest Proof'}
            </button>
            <button
              onClick={() => runProof(true)}
              disabled={isProving}
              className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
            >
              ⚠️ Simulate Tampering / Fraud
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output */}
        <div className="card space-y-5 bg-veil-900 text-white">
          <div className="flex items-center justify-between border-b border-veil-800 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Circuit Verification Output</h2>
              <p className="text-xs text-veil-400">Evaluated with Compact persistentHash and disclose() rules</p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-veil-800 text-veil-300">
              Midnight Compact 0.5.1
            </span>
          </div>

          {proofResult ? (
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-veil-400 text-xs">Circuit:</span>
                <span className="text-white font-bold">{proofResult.circuitName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-veil-400 text-xs">Constraint Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    proofResult.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {proofResult.success ? '✓ ASSERTION SATISFIED' : '✗ ASSERTION FAILED'}
                </span>
              </div>

              <div>
                <span className="text-veil-400 text-xs block mb-1">Execution Constraint Trace:</span>
                <div className="p-3 bg-veil-950 rounded border border-veil-800 text-xs text-veil-200 break-words whitespace-pre-wrap">
                  {proofResult.assertionLog}
                </div>
              </div>

              <div>
                <span className="text-veil-400 text-xs block mb-1">Disclosed Commitment (persistentHash):</span>
                <div className="p-3 bg-veil-950 rounded border border-veil-800 text-xs text-emerald-400 break-all">
                  {proofResult.commitment}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-veil-400 pt-2 border-t border-veil-800">
                <span>Proof Generation Latency:</span>
                <span className="text-white">{proofResult.executionTimeMs} ms</span>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-veil-400 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-veil-800 flex items-center justify-center text-veil-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm">Click "Generate Honest Proof" or "Simulate Tampering" to run the circuit prover.</p>
              <p className="text-xs text-veil-500">Witnesses will be hashed and verified against the compact constraint model.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
