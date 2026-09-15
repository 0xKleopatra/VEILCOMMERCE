// =============================================================================
// VeilCommerce SDK — Escrow Module
// -----------------------------------------------------------------------------
// TypeScript bindings for Escrow contract interactions.
// =============================================================================

export enum EscrowState {
  Empty = 0,
  Funded = 1,
  DeliveryVerified = 2,
  Released = 3,
  Refunded = 4,
  Disputed = 5
}

export interface PartySecret {
  bytes: Uint8Array;
}

export interface EscrowRecord {
  escrowId: Uint8Array;
  orderId: Uint8Array;
  buyer: Uint8Array;
  seller: Uint8Array;
  amountCommit: Uint8Array;
  releaseCommit: Uint8Array;
  state: EscrowState;
  createdAt: bigint;
  fundedAt: bigint;
  releasedAt: bigint;
}

export interface CreateEscrowParams {
  escrowId: Uint8Array;
  orderId: Uint8Array;
  sellerId: Uint8Array;
  timestamp: bigint;
  // Witnesses
  amount: bigint;
  nonce: Uint8Array;
  releaseSecret: Uint8Array;
}

export interface ReleaseParams {
  escrowId: Uint8Array;
  timestamp: bigint;
  // Witness
  releaseSecret: Uint8Array;
}

export class EscrowSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async createEscrow(params: CreateEscrowParams): Promise<string> {
    const tx = await this.contract.circuits.createEscrow(
      params.escrowId,
      params.orderId,
      params.sellerId,
      params.timestamp
    );
    return tx.hash;
  }

  async verifyDelivery(escrowId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.verifyDelivery(escrowId);
    return tx.hash;
  }

  async release(params: ReleaseParams): Promise<string> {
    const tx = await this.contract.circuits.release(params.escrowId, params.timestamp);
    return tx.hash;
  }

  async refund(escrowId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.refund(escrowId);
    return tx.hash;
  }

  async dispute(escrowId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.dispute(escrowId);
    return tx.hash;
  }

  // Reads
  async getEscrow(escrowId: Uint8Array): Promise<EscrowRecord> {
    return await this.contract.circuits.getEscrow(escrowId);
  }

  async escrowState(escrowId: Uint8Array): Promise<EscrowState> {
    return await this.contract.circuits.escrowState(escrowId);
  }

  async isDeliveryVerified(escrowId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isDeliveryVerified(escrowId);
  }
}

export function createEscrowSDK(contract: any, witnesses: any): EscrowSDK {
  return new EscrowSDK(contract, witnesses);
}