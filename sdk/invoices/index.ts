// =============================================================================
// VeilCommerce SDK — Invoices Module
// -----------------------------------------------------------------------------
// TypeScript bindings for Invoice contract interactions.
// =============================================================================

export enum InvoiceStatus {
  Issued = 0,
  Acknowledged = 1,
  Settled = 2,
  Voided = 3,
  FinancingRequested = 4,
  Financed = 5
}

export interface InvoiceRecord {
  invoiceId: Uint8Array;
  orderId: Uint8Array;
  commitment: Uint8Array;
  issuerId: Uint8Array;
  status: InvoiceStatus;
  createdAt: bigint;
  dueAt: bigint;
}

export interface InvoiceTerms {
  amount: bigint;
  buyer: Uint8Array;
  memo: Uint8Array;
  salt: Uint8Array;
}

export interface IssueInvoiceParams {
  invoiceId: Uint8Array;
  orderId: Uint8Array;
  dueAt: bigint;
  createdAt: bigint;
  // Witnesses
  amount: bigint;
  buyer: Uint8Array;
  memo: Uint8Array;
  salt: Uint8Array;
}

export interface AcknowledgeParams {
  invoiceId: Uint8Array;
  // Witnesses
  buyer: Uint8Array;
  amount: bigint;
  memo: Uint8Array;
  salt: Uint8Array;
}

export interface VerifyCommitmentParams {
  invoiceId: Uint8Array;
  amount: bigint;
  buyer: Uint8Array;
  memo: Uint8Array;
  salt: Uint8Array;
}

export class InvoicesSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async issue(params: IssueInvoiceParams): Promise<string> {
    const tx = await this.contract.circuits.issue(
      params.invoiceId,
      params.orderId,
      params.dueAt,
      params.createdAt
    );
    return tx.hash;
  }

  async acknowledge(params: AcknowledgeParams): Promise<string> {
    const tx = await this.contract.circuits.acknowledge(params.invoiceId);
    return tx.hash;
  }

  async markFinancingEligible(invoiceId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.markFinancingEligible(invoiceId);
    return tx.hash;
  }

  async markFinanced(invoiceId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.markFinanced(invoiceId);
    return tx.hash;
  }

  async settle(invoiceId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.settle(invoiceId);
    return tx.hash;
  }

  async voidInvoice(invoiceId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.voidInvoice(invoiceId);
    return tx.hash;
  }

  // Reads
  async exists(invoiceId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.exists(invoiceId);
  }

  async isSettled(invoiceId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isSettled(invoiceId);
  }

  async isAcknowledged(invoiceId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isAcknowledged(invoiceId);
  }

  async isFinancingEligible(invoiceId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isFinancingEligible(invoiceId);
  }

  async commitmentOf(invoiceId: Uint8Array): Promise<Uint8Array> {
    return await this.contract.circuits.commitmentOf(invoiceId);
  }

  async getRecord(invoiceId: Uint8Array): Promise<InvoiceRecord> {
    return await this.contract.circuits.getRecord(invoiceId);
  }

  async verifyCommitment(params: VerifyCommitmentParams): Promise<boolean> {
    return await this.contract.circuits.verifyCommitment(
      params.invoiceId,
      params.amount,
      params.buyer,
      params.memo,
      params.salt
    );
  }
}

export function createInvoicesSDK(contract: any, witnesses: any): InvoicesSDK {
  return new InvoicesSDK(contract, witnesses);
}