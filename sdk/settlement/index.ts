// =============================================================================
// VeilCommerce SDK — Settlement Module
// -----------------------------------------------------------------------------
// TypeScript bindings for Settlement contract interactions.
// =============================================================================

export enum SettlementStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Reconciled = 3
}

export interface SettlementRecord {
  settlementId: Uint8Array;
  orderId: Uint8Array;
  invoiceId: Uint8Array;
  financingId: Uint8Array;
  payerId: Uint8Array;
  payeeId: Uint8Array;
  amountCommit: Uint8Array;
  status: SettlementStatus;
  createdAt: bigint;
  completedAt: bigint;
}

export interface SettlementTerms {
  amount: bigint;
  payer: Uint8Array;
  payee: Uint8Array;
  salt: Uint8Array;
}

export interface SettleTradeParams {
  settlementId: Uint8Array;
  orderId: Uint8Array;
  invoiceId: Uint8Array;
  financingId: Uint8Array;
  timestamp: bigint;
  // Witnesses
  amount: bigint;
  payer: Uint8Array;
  payee: Uint8Array;
  salt: Uint8Array;
}

export interface SettleEscrowLegParams {
  settlementId: Uint8Array;
  orderId: Uint8Array;
  timestamp: bigint;
  // Witnesses
  amount: bigint;
  payer: Uint8Array;
  payee: Uint8Array;
  salt: Uint8Array;
}

export class SettlementSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async settleTrade(params: SettleTradeParams): Promise<string> {
    const tx = await this.contract.circuits.settleTrade(
      params.settlementId,
      params.orderId,
      params.invoiceId,
      params.financingId,
      params.timestamp
    );
    return tx.hash;
  }

  async settleEscrowLeg(params: SettleEscrowLegParams): Promise<string> {
    const tx = await this.contract.circuits.settleEscrowLeg(
      params.settlementId,
      params.orderId,
      params.timestamp
    );
    return tx.hash;
  }

  async reconcile(settlementId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.reconcile(settlementId);
    return tx.hash;
  }

  // Reads
  async getSettlement(settlementId: Uint8Array): Promise<SettlementRecord> {
    return await this.contract.circuits.getSettlement(settlementId);
  }

  async isOrderSettled(orderId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isOrderSettled(orderId);
  }

  async isInvoiceSettled(invoiceId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isInvoiceSettled(invoiceId);
  }

  async settlementStatus(settlementId: Uint8Array): Promise<SettlementStatus> {
    return await this.contract.circuits.settlementStatus(settlementId);
  }
}

export function createSettlementSDK(contract: any, witnesses: any): SettlementSDK {
  return new SettlementSDK(contract, witnesses);
}