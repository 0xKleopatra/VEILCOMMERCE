import { Uint8Array, BigInt } from '@midnight-ntwrk/compact-runtime';

// =============================================================================
// VeilCommerce SDK — Orders Module (PurchaseOrder)
// -----------------------------------------------------------------------------
// TypeScript bindings for PurchaseOrder contract interactions.
// =============================================================================

export enum OrderStatus {
  Draft = 0,
  AwaitingSeller = 1,
  Confirmed = 2,
  Funded = 3,
  Shipped = 4,
  Delivered = 5,
  Settled = 6,
  Cancelled = 7,
  Disputed = 8
}

export interface PartySecret {
  bytes: Uint8Array; // 32 bytes
}

export interface OrderRecord {
  orderId: Uint8Array;
  buyerId: Uint8Array;
  sellerId: Uint8Array;
  amountCommit: Uint8Array;
  status: OrderStatus;
  buyerVerified: boolean;
  sellerVerified: boolean;
  fundsVerified: boolean;
  createdAt: bigint;
  updatedAt: bigint;
  termsCommitment: Uint8Array;
}

export interface OrderTerms {
  quantity: bigint;
  unitPrice: bigint;
  totalAmount: bigint;
  currency: Uint8Array;
  destinationHash: Uint8Array;
  salt: Uint8Array;
}

export interface CreateOrderParams {
  orderId: Uint8Array;
  sellerId: Uint8Array;
  currency: Uint8Array;
  timestamp: bigint;
  // Witnesses provided by prover
  quantity: bigint;
  unitPrice: bigint;
  totalAmount: bigint;
  destinationHash: Uint8Array;
  salt: Uint8Array;
}

export interface MarkShippedParams {
  orderId: Uint8Array;
  timestamp: bigint;
}

export interface CancelOrderParams {
  orderId: Uint8Array;
  timestamp: bigint;
}

export class OrdersSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async createPurchaseOrder(params: CreateOrderParams): Promise<string> {
    const tx = await this.contract.circuits.createPurchaseOrder(
      params.orderId,
      params.sellerId,
      params.currency,
      params.timestamp
    );
    return tx.hash;
  }

  async confirmOrder(orderId: Uint8Array, timestamp: bigint): Promise<string> {
    const tx = await this.contract.circuits.confirmOrder(orderId, timestamp);
    return tx.hash;
  }

  async markBuyerVerified(orderId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.markBuyerVerified(orderId);
    return tx.hash;
  }

  async markSellerVerified(orderId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.markSellerVerified(orderId);
    return tx.hash;
  }

  async markFundsVerified(orderId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.markFundsVerified(orderId);
    return tx.hash;
  }

  async markFunded(orderId: Uint8Array, timestamp: bigint): Promise<string> {
    const tx = await this.contract.circuits.markFunded(orderId, timestamp);
    return tx.hash;
  }

  async markShipped(params: MarkShippedParams): Promise<string> {
    const tx = await this.contract.circuits.markShipped(params.orderId, params.timestamp);
    return tx.hash;
  }

  async markDelivered(orderId: Uint8Array, timestamp: bigint): Promise<string> {
    const tx = await this.contract.circuits.markDelivered(orderId, timestamp);
    return tx.hash;
  }

  async markSettled(orderId: Uint8Array, timestamp: bigint): Promise<string> {
    const tx = await this.contract.circuits.markSettled(orderId, timestamp);
    return tx.hash;
  }

  async cancelOrder(params: CancelOrderParams): Promise<string> {
    const tx = await this.contract.circuits.cancelOrder(params.orderId, params.timestamp);
    return tx.hash;
  }

  // Reads
  async getOrder(orderId: Uint8Array): Promise<OrderRecord> {
    return await this.contract.circuits.getOrder(orderId);
  }

  async orderStatus(orderId: Uint8Array): Promise<OrderStatus> {
    return await this.contract.circuits.orderStatus(orderId);
  }
}

export function createOrdersSDK(contract: any, witnesses: any): OrdersSDK {
  return new OrdersSDK(contract, witnesses);
}