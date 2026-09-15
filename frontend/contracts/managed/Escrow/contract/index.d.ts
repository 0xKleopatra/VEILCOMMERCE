import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum EscrowState { Empty = 0,
                          Funded = 1,
                          DeliveryVerified = 2,
                          Released = 3,
                          Refunded = 4,
                          Disputed = 5
}

export type PartySecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getPartySecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, PartySecret];
  releaseSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  escrowNonce(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  privateAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  createEscrow(context: __compactRuntime.CircuitContext<PS>,
               escrowId_0: Uint8Array,
               orderId_0: Uint8Array,
               sellerId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyDelivery(context: __compactRuntime.CircuitContext<PS>,
                 escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  release(context: __compactRuntime.CircuitContext<PS>,
          escrowId_0: Uint8Array,
          timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  refund(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  dispute(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { escrowId: Uint8Array,
                                                                                                                         orderId: Uint8Array,
                                                                                                                         buyer: Uint8Array,
                                                                                                                         seller: Uint8Array,
                                                                                                                         amountCommit: Uint8Array,
                                                                                                                         releaseCommit: Uint8Array,
                                                                                                                         state: EscrowState,
                                                                                                                         createdAt: bigint,
                                                                                                                         fundedAt: bigint,
                                                                                                                         releasedAt: bigint
                                                                                                                       }>;
  escrowState(context: __compactRuntime.CircuitContext<PS>,
              escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, EscrowState>;
  isDeliveryVerified(context: __compactRuntime.CircuitContext<PS>,
                     escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  createEscrow(context: __compactRuntime.CircuitContext<PS>,
               escrowId_0: Uint8Array,
               orderId_0: Uint8Array,
               sellerId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyDelivery(context: __compactRuntime.CircuitContext<PS>,
                 escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  release(context: __compactRuntime.CircuitContext<PS>,
          escrowId_0: Uint8Array,
          timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  refund(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  dispute(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { escrowId: Uint8Array,
                                                                                                                         orderId: Uint8Array,
                                                                                                                         buyer: Uint8Array,
                                                                                                                         seller: Uint8Array,
                                                                                                                         amountCommit: Uint8Array,
                                                                                                                         releaseCommit: Uint8Array,
                                                                                                                         state: EscrowState,
                                                                                                                         createdAt: bigint,
                                                                                                                         fundedAt: bigint,
                                                                                                                         releasedAt: bigint
                                                                                                                       }>;
  escrowState(context: __compactRuntime.CircuitContext<PS>,
              escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, EscrowState>;
  isDeliveryVerified(context: __compactRuntime.CircuitContext<PS>,
                     escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  createEscrow(context: __compactRuntime.CircuitContext<PS>,
               escrowId_0: Uint8Array,
               orderId_0: Uint8Array,
               sellerId_0: Uint8Array,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyDelivery(context: __compactRuntime.CircuitContext<PS>,
                 escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  release(context: __compactRuntime.CircuitContext<PS>,
          escrowId_0: Uint8Array,
          timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  refund(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  dispute(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getEscrow(context: __compactRuntime.CircuitContext<PS>, escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { escrowId: Uint8Array,
                                                                                                                         orderId: Uint8Array,
                                                                                                                         buyer: Uint8Array,
                                                                                                                         seller: Uint8Array,
                                                                                                                         amountCommit: Uint8Array,
                                                                                                                         releaseCommit: Uint8Array,
                                                                                                                         state: EscrowState,
                                                                                                                         createdAt: bigint,
                                                                                                                         fundedAt: bigint,
                                                                                                                         releasedAt: bigint
                                                                                                                       }>;
  escrowState(context: __compactRuntime.CircuitContext<PS>,
              escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, EscrowState>;
  isDeliveryVerified(context: __compactRuntime.CircuitContext<PS>,
                     escrowId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalEscrows: bigint;
  escrows: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { escrowId: Uint8Array,
                                 orderId: Uint8Array,
                                 buyer: Uint8Array,
                                 seller: Uint8Array,
                                 amountCommit: Uint8Array,
                                 releaseCommit: Uint8Array,
                                 state: EscrowState,
                                 createdAt: bigint,
                                 fundedAt: bigint,
                                 releasedAt: bigint
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { escrowId: Uint8Array,
  orderId: Uint8Array,
  buyer: Uint8Array,
  seller: Uint8Array,
  amountCommit: Uint8Array,
  releaseCommit: Uint8Array,
  state: EscrowState,
  createdAt: bigint,
  fundedAt: bigint,
  releasedAt: bigint
}]>
  };
  escrowExists: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedReleaseNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  deliveryVerified: {
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
