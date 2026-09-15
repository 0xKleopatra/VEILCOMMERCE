// =============================================================================
// VeilCommerce SDK — Proofs Module
// -----------------------------------------------------------------------------
// TypeScript wrappers for ZK proof generation and verification.
// Uses the circuits in circuits/ directory.
// =============================================================================

// Proof of Funds
export interface FundsProofInput {
  privateBalance: bigint;
  requiredAmount: bigint;
  balanceSalt: Uint8Array;
}

export interface FundsProofOutput {
  fundsSufficient: boolean;
  balanceCommitment: Uint8Array;
}

export interface InventoryProofInput {
  privateInventory: bigint;
  requiredQuantity: bigint;
  inventorySalt: Uint8Array;
}

export interface InventoryProofOutput {
  inventorySufficient: boolean;
  inventoryCommitment: Uint8Array;
}

export interface ComplianceProofInput {
  credentialStatus: number;        // 0=valid, 1=revoked, 2=expired
  authorizationLevel: number;      // 0=unauthorized, 1=basic, 2=full
  jurisdictionCode: Uint8Array;
  certificationFlags: number;      // bitmask
  transactionValue: bigint;
  docCompleteness: number;         // 0=incomplete, 1=complete
  requiredJurisdiction: Uint8Array;
  requiredCertifications: number;
  maxTransactionValue: bigint;
  minAuthLevel: number;
}

export interface ComplianceProofOutput {
  compliant: boolean;
  complianceCommitment: Uint8Array;
  score: number;
}

export interface DeliveryProofInput {
  deliveryEvidenceHash: Uint8Array;
  purchaseOrderCommitment: Uint8Array;
  deliverySalt: Uint8Array;
  expectedAmount: bigint;
  actualAmount: bigint;
}

export interface DeliveryProofOutput {
  deliveryVerified: boolean;
  deliveryCommitment: Uint8Array;
}

export interface FinancingProofInput {
  invoiceAmount: bigint;
  invoiceStatus: number;           // 0=issued, 1=acknowledged, 2=settled, 3=voided
  deliveryVerified: boolean;
  buyerCreditScore: number;
  sellerCreditScore: number;
  invoiceAgeDays: number;
  minBuyerScore: number;
  minSellerScore: number;
  maxInvoiceAgeDays: number;
  financingRatioBps: number;       // e.g., 9000 = 90%
}

export interface FinancingProofOutput {
  eligible: boolean;
  maxFinancingAmount: bigint;
  financingCommitment: Uint8Array;
  riskScore: number;
}

/**
 * Proof generation functions.
 * In production, these would call the compiled WASM circuits via compact-runtime.
 * For now, they're typed interfaces that the frontend would call.
 */

export class ProofsSDK {
  // In a real implementation, these would use the compiled circuit WASM
  // via @midnight-ntwrk/compact-runtime prove() function

  async proveFundsSufficient(input: FundsProofInput): Promise<FundsProofOutput> {
    // Calls circuits/funds/proof_of_funds.compact proveFundsSufficient
    const sufficient = input.privateBalance >= input.requiredAmount;
    const commitment = await this.commitBalance(input.privateBalance, input.balanceSalt);
    return { fundsSufficient: sufficient, balanceCommitment: commitment };
  }

  async verifyFundsProof(
    balanceCommitment: Uint8Array,
    requiredAmount: bigint,
    privateBalance: bigint,
    balanceSalt: Uint8Array
  ): Promise<boolean> {
    const recomputed = await this.commitBalance(privateBalance, balanceSalt);
    return recomputed.equals(balanceCommitment) && privateBalance >= requiredAmount;
  }

  async proveInventorySufficient(input: InventoryProofInput): Promise<InventoryProofOutput> {
    const sufficient = input.privateInventory >= input.requiredQuantity;
    const commitment = await this.commitInventory(input.privateInventory, input.inventorySalt);
    return { inventorySufficient: sufficient, inventoryCommitment: commitment };
  }

  async proveCompliance(input: ComplianceProofInput): Promise<ComplianceProofOutput> {
    // Implements the weighted scoring from circuits/compliance/proof_of_compliance.compact
    let score = 0;
    if (input.credentialStatus === 0) score += 30;
    if (input.authorizationLevel >= input.minAuthLevel) score += 20;
    if (Buffer.from(input.jurisdictionCode).equals(Buffer.from(input.requiredJurisdiction))) score += 15;
    if ((input.certificationFlags & input.requiredCertifications) === input.requiredCertifications) score += 15;
    if (input.transactionValue <= input.maxTransactionValue) score += 10;
    if (input.docCompleteness === 1) score += 10;
    
    const compliant = score >= 70;
    const commitment = await this.commitCompliance(input);
    return { compliant, complianceCommitment: commitment, score };
  }

  async proveDelivery(input: DeliveryProofInput): Promise<DeliveryProofOutput> {
    const amountMatches = input.actualAmount >= input.expectedAmount;
    const evidenceProvided = input.deliveryEvidenceHash.length > 0;
    const verified = amountMatches && evidenceProvided;
    const commitment = await this.commitDelivery(
      input.deliveryEvidenceHash,
      input.purchaseOrderCommitment,
      input.deliverySalt
    );
    return { deliveryVerified: verified, deliveryCommitment: commitment };
  }

  async proveFinancingEligibility(input: FinancingProofInput): Promise<FinancingProofOutput> {
    let score = 0;
    if (input.invoiceStatus === 1) score += 25;
    else if (input.invoiceStatus === 0) score += 10;
    if (input.deliveryVerified) score += 25;
    if (input.buyerCreditScore >= input.minBuyerScore) score += 25;
    if (input.sellerCreditScore >= input.minSellerScore) score += 25;
    
    const eligible = score >= 70 && input.invoiceAgeDays <= input.maxInvoiceAgeDays;
    const maxFinancing = (input.invoiceAmount * BigInt(input.financingRatioBps)) / 10000n;
    const commitment = await this.commitFinancing(input);
    return { eligible, maxFinancingAmount: maxFinancing, financingCommitment: commitment, riskScore: score };
  }

  // Commitment helpers (would use same hash as contracts)
  private async commitBalance(balance: bigint, salt: Uint8Array): Promise<Uint8Array> {
    // persistentHash({balance, salt})
    throw new Error('Use compiled circuit WASM');
  }

  private async commitInventory(inventory: bigint, salt: Uint8Array): Promise<Uint8Array> {
    throw new Error('Use compiled circuit WASM');
  }

  private async commitCompliance(input: ComplianceProofInput): Promise<Uint8Array> {
    throw new Error('Use compiled circuit WASM');
  }

  private async commitDelivery(
    evidenceHash: Uint8Array,
    poCommitment: Uint8Array,
    salt: Uint8Array
  ): Promise<Uint8Array> {
    throw new Error('Use compiled circuit WASM');
  }

  private async commitFinancing(input: FinancingProofInput): Promise<Uint8Array> {
    throw new Error('Use compiled circuit WASM');
  }
}

export function createProofsSDK(): ProofsSDK {
  return new ProofsSDK();
}