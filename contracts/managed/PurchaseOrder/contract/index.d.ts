import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum OrderStatus { Draft = 0,
                          AwaitingSeller = 1,
                          Confirmed = 2,
                          Funded = 3,
                          Shipped = 4,
                          Delivered = 5,
                          Settled = 6,
                          Cancelled = 7,
                          Disputed = 8
}

export type PartySecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getPartySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, PartySecret];
  orderSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localQuantity(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localUnitPrice(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localTotalAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localDestinationHash(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  createPurchaseOrder(context: __compactRuntime.CircuitContext<PS>,
                      orderId_0: Uint8Array,
                      sellerId_0: Uint8Array,
                      currency_0: Uint8Array,
                      timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markBuyerVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSellerVerified(context: __compactRuntime.CircuitContext<PS>,
                     orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFundsVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFunded(context: __compactRuntime.CircuitContext<PS>,
             orderId_0: Uint8Array,
             timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markShipped(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markDelivered(context: __compactRuntime.CircuitContext<PS>,
                orderId_0: Uint8Array,
                timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getOrder(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { orderId: Uint8Array,
                                                                                                                       buyerId: Uint8Array,
                                                                                                                       sellerId: Uint8Array,
                                                                                                                       amountCommit: Uint8Array,
                                                                                                                       status: OrderStatus,
                                                                                                                       buyerVerified: boolean,
                                                                                                                       sellerVerified: boolean,
                                                                                                                       fundsVerified: boolean,
                                                                                                                       createdAt: bigint,
                                                                                                                       updatedAt: bigint,
                                                                                                                       termsCommitment: Uint8Array
                                                                                                                     }>;
  orderStatus(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, OrderStatus>;
}

export type ProvableCircuits<PS> = {
  createPurchaseOrder(context: __compactRuntime.CircuitContext<PS>,
                      orderId_0: Uint8Array,
                      sellerId_0: Uint8Array,
                      currency_0: Uint8Array,
                      timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markBuyerVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSellerVerified(context: __compactRuntime.CircuitContext<PS>,
                     orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFundsVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFunded(context: __compactRuntime.CircuitContext<PS>,
             orderId_0: Uint8Array,
             timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markShipped(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markDelivered(context: __compactRuntime.CircuitContext<PS>,
                orderId_0: Uint8Array,
                timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getOrder(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { orderId: Uint8Array,
                                                                                                                       buyerId: Uint8Array,
                                                                                                                       sellerId: Uint8Array,
                                                                                                                       amountCommit: Uint8Array,
                                                                                                                       status: OrderStatus,
                                                                                                                       buyerVerified: boolean,
                                                                                                                       sellerVerified: boolean,
                                                                                                                       fundsVerified: boolean,
                                                                                                                       createdAt: bigint,
                                                                                                                       updatedAt: bigint,
                                                                                                                       termsCommitment: Uint8Array
                                                                                                                     }>;
  orderStatus(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, OrderStatus>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createPurchaseOrder(context: __compactRuntime.CircuitContext<PS>,
                      orderId_0: Uint8Array,
                      sellerId_0: Uint8Array,
                      currency_0: Uint8Array,
                      timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  confirmOrder(context: __compactRuntime.CircuitContext<PS>,
               orderId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markBuyerVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markSellerVerified(context: __compactRuntime.CircuitContext<PS>,
                     orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFundsVerified(context: __compactRuntime.CircuitContext<PS>,
                    orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFunded(context: __compactRuntime.CircuitContext<PS>,
             orderId_0: Uint8Array,
             timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markShipped(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markDelivered(context: __compactRuntime.CircuitContext<PS>,
                orderId_0: Uint8Array,
                timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  markSettled(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelOrder(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  getOrder(context: __compactRuntime.CircuitContext<PS>, orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { orderId: Uint8Array,
                                                                                                                       buyerId: Uint8Array,
                                                                                                                       sellerId: Uint8Array,
                                                                                                                       amountCommit: Uint8Array,
                                                                                                                       status: OrderStatus,
                                                                                                                       buyerVerified: boolean,
                                                                                                                       sellerVerified: boolean,
                                                                                                                       fundsVerified: boolean,
                                                                                                                       createdAt: bigint,
                                                                                                                       updatedAt: bigint,
                                                                                                                       termsCommitment: Uint8Array
                                                                                                                     }>;
  orderStatus(context: __compactRuntime.CircuitContext<PS>,
              orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, OrderStatus>;
}

export type Ledger = {
  readonly totalOrders: bigint;
  orders: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { orderId: Uint8Array,
                                 buyerId: Uint8Array,
                                 sellerId: Uint8Array,
                                 amountCommit: Uint8Array,
                                 status: OrderStatus,
                                 buyerVerified: boolean,
                                 sellerVerified: boolean,
                                 fundsVerified: boolean,
                                 createdAt: bigint,
                                 updatedAt: bigint,
                                 termsCommitment: Uint8Array
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { orderId: Uint8Array,
  buyerId: Uint8Array,
  sellerId: Uint8Array,
  amountCommit: Uint8Array,
  status: OrderStatus,
  buyerVerified: boolean,
  sellerVerified: boolean,
  fundsVerified: boolean,
  createdAt: bigint,
  updatedAt: bigint,
  termsCommitment: Uint8Array
}]>
  };
  orderExists: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedOrderNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
