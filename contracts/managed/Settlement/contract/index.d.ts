import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum SettlementStatus { Pending = 0,
                               Completed = 1,
                               Failed = 2,
                               Reconciled = 3
}

export type SettlementSecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getSettlementSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, SettlementSecret];
  settlementSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localPayer(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localPayee(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  settleTrade(context: __compactRuntime.CircuitContext<PS>,
              settlementId_0: Uint8Array,
              orderId_0: Uint8Array,
              invoiceId_0: Uint8Array,
              financingId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  settleEscrowLeg(context: __compactRuntime.CircuitContext<PS>,
                  settlementId_0: Uint8Array,
                  orderId_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  reconcile(context: __compactRuntime.CircuitContext<PS>,
            settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSettlement(context: __compactRuntime.CircuitContext<PS>,
                settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { settlementId: Uint8Array,
                                                                                   orderId: Uint8Array,
                                                                                   invoiceId: Uint8Array,
                                                                                   financingId: Uint8Array,
                                                                                   payerId: Uint8Array,
                                                                                   payeeId: Uint8Array,
                                                                                   amountCommit: Uint8Array,
                                                                                   status: SettlementStatus,
                                                                                   createdAt: bigint,
                                                                                   completedAt: bigint
                                                                                 }>;
  isOrderSettled(context: __compactRuntime.CircuitContext<PS>,
                 orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isInvoiceSettled(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  settlementStatus(context: __compactRuntime.CircuitContext<PS>,
                   settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettlementStatus>;
}

export type ProvableCircuits<PS> = {
  settleTrade(context: __compactRuntime.CircuitContext<PS>,
              settlementId_0: Uint8Array,
              orderId_0: Uint8Array,
              invoiceId_0: Uint8Array,
              financingId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  settleEscrowLeg(context: __compactRuntime.CircuitContext<PS>,
                  settlementId_0: Uint8Array,
                  orderId_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  reconcile(context: __compactRuntime.CircuitContext<PS>,
            settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSettlement(context: __compactRuntime.CircuitContext<PS>,
                settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { settlementId: Uint8Array,
                                                                                   orderId: Uint8Array,
                                                                                   invoiceId: Uint8Array,
                                                                                   financingId: Uint8Array,
                                                                                   payerId: Uint8Array,
                                                                                   payeeId: Uint8Array,
                                                                                   amountCommit: Uint8Array,
                                                                                   status: SettlementStatus,
                                                                                   createdAt: bigint,
                                                                                   completedAt: bigint
                                                                                 }>;
  isOrderSettled(context: __compactRuntime.CircuitContext<PS>,
                 orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isInvoiceSettled(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  settlementStatus(context: __compactRuntime.CircuitContext<PS>,
                   settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettlementStatus>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  settleTrade(context: __compactRuntime.CircuitContext<PS>,
              settlementId_0: Uint8Array,
              orderId_0: Uint8Array,
              invoiceId_0: Uint8Array,
              financingId_0: Uint8Array,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  settleEscrowLeg(context: __compactRuntime.CircuitContext<PS>,
                  settlementId_0: Uint8Array,
                  orderId_0: Uint8Array,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  reconcile(context: __compactRuntime.CircuitContext<PS>,
            settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getSettlement(context: __compactRuntime.CircuitContext<PS>,
                settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { settlementId: Uint8Array,
                                                                                   orderId: Uint8Array,
                                                                                   invoiceId: Uint8Array,
                                                                                   financingId: Uint8Array,
                                                                                   payerId: Uint8Array,
                                                                                   payeeId: Uint8Array,
                                                                                   amountCommit: Uint8Array,
                                                                                   status: SettlementStatus,
                                                                                   createdAt: bigint,
                                                                                   completedAt: bigint
                                                                                 }>;
  isOrderSettled(context: __compactRuntime.CircuitContext<PS>,
                 orderId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isInvoiceSettled(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  settlementStatus(context: __compactRuntime.CircuitContext<PS>,
                   settlementId_0: Uint8Array): __compactRuntime.CircuitResults<PS, SettlementStatus>;
}

export type Ledger = {
  readonly totalSettlements: bigint;
  settlements: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { settlementId: Uint8Array,
                                 orderId: Uint8Array,
                                 invoiceId: Uint8Array,
                                 financingId: Uint8Array,
                                 payerId: Uint8Array,
                                 payeeId: Uint8Array,
                                 amountCommit: Uint8Array,
                                 status: SettlementStatus,
                                 createdAt: bigint,
                                 completedAt: bigint
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { settlementId: Uint8Array,
  orderId: Uint8Array,
  invoiceId: Uint8Array,
  financingId: Uint8Array,
  payerId: Uint8Array,
  payeeId: Uint8Array,
  amountCommit: Uint8Array,
  status: SettlementStatus,
  createdAt: bigint,
  completedAt: bigint
}]>
  };
  settlementExists: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedSettlementNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  settledOrders: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  settledInvoices: {
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
