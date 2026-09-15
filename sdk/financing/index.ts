// =============================================================================
// VeilCommerce SDK — Financing Module
// -----------------------------------------------------------------------------
// TypeScript bindings for Financing contract interactions.
// =============================================================================

export enum FinancingStatus {
  Requested = 0,
  Funded = 1,
  Repaid = 2,
  Defaulted = 3,
  Cancelled = 4
}

export interface FinancingRecord {
  financingId: Uint8Array;
  invoiceId: Uint8Array;
  sellerId: Uint8Array;
  investorId: Uint8Array;
  faceValueCommit: Uint8Array;
  requestedCommit: Uint8Array;
  fundedAmount: bigint;
  feeBps: number;
  maturityDays: number;
  status: FinancingStatus;
  riskVerified: boolean;
  createdAt: bigint;
  fundedAt: bigint;
  repaidAt: bigint;
}

export interface CreditScoreData {
  score: number;
  salt: Uint8Array; // 16 bytes
}

export interface RequestFinancingParams {
  financingId: Uint8Array;
  invoiceId: Uint8Array;
  maturityDays: number;
  feeBps: number;
  timestamp: bigint;
  // Witnesses
  faceValue: bigint;
  requested: bigint;
  salt: Uint8Array;
  creditScore: number;
  creditSalt: Uint8Array;
}

export interface FundInvoiceParams {
  financingId: Uint8Array;
  fundedAmount: bigint;
  timestamp: bigint;
}

export interface RepayParams {
  financingId: Uint8Array;
  timestamp: bigint;
}

export interface VerifyRiskParams {
  financingId: Uint8Array;
  threshold: number;
  // Witness
  creditScore: number;
  creditSalt: Uint8Array;
}

export class FinancingSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async commitCreditScore(sellerId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.commitCreditScore(sellerId);
    return tx.hash;
  }

  async requestFinancing(params: RequestFinancingParams): Promise<string> {
    const tx = await this.contract.circuits.requestFinancing(
      params.financingId,
      params.invoiceId,
      params.maturityDays,
      params.feeBps,
      params.timestamp
    );
    return tx.hash;
  }

  async verifyRisk(params: VerifyRiskParams): Promise<boolean> {
    return await this.contract.circuits.verifyRisk(
      params.financingId,
      params.threshold
    );
  }

  async meetsThreshold(sellerId: Uint8Array, threshold: number): Promise<boolean> {
    return await this.contract.circuits.meetsThreshold(sellerId, threshold);
  }

  async fundInvoice(params: FundInvoiceParams): Promise<string> {
    const tx = await this.contract.circuits.fundInvoice(
      params.financingId,
      params.fundedAmount,
      params.timestamp
    );
    return tx.hash;
  }

  async repay(params: RepayParams): Promise<string> {
    const tx = await this.contract.circuits.repay(params.financingId, params.timestamp);
    return tx.hash;
  }

  async cancelFinancing(financingId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.cancelFinancing(financingId);
    return tx.hash;
  }

  // Reads
  async getFinancing(financingId: Uint8Array): Promise<FinancingRecord> {
    return await this.contract.circuits.getFinancing(financingId);
  }

  async financingStatus(financingId: Uint8Array): Promise<FinancingStatus> {
    return await this.contract.circuits.financingStatus(financingId);
  }

  async isFunded(financingId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isFunded(financingId);
  }
}

export function createFinancingSDK(contract: any, witnesses: any): FinancingSDK {
  return new FinancingSDK(contract, witnesses);
}