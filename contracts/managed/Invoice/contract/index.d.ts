import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum InvoiceStatus { Issued = 0,
                            Acknowledged = 1,
                            Settled = 2,
                            Voided = 3,
                            FinancingRequested = 4,
                            Financed = 5
}

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localAmount(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localBuyer(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localMemo(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  issue(context: __compactRuntime.CircuitContext<PS>,
        invoiceId_0: Uint8Array,
        orderId_0: Uint8Array,
        dueAt_0: bigint,
        createdAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledge(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                        invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinanced(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  voidInvoice(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  exists(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isSettled(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAcknowledged(context: __compactRuntime.CircuitContext<PS>,
                 invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                      invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { invoiceId: Uint8Array,
                                                                            orderId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            issuerId: Uint8Array,
                                                                            status: InvoiceStatus,
                                                                            createdAt: bigint,
                                                                            dueAt: bigint
                                                                          }>;
  verifyCommitment(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array,
                   amount_0: bigint,
                   buyer_0: Uint8Array,
                   memo_0: Uint8Array,
                   salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  issue(context: __compactRuntime.CircuitContext<PS>,
        invoiceId_0: Uint8Array,
        orderId_0: Uint8Array,
        dueAt_0: bigint,
        createdAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledge(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                        invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinanced(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  voidInvoice(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  exists(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isSettled(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAcknowledged(context: __compactRuntime.CircuitContext<PS>,
                 invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                      invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { invoiceId: Uint8Array,
                                                                            orderId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            issuerId: Uint8Array,
                                                                            status: InvoiceStatus,
                                                                            createdAt: bigint,
                                                                            dueAt: bigint
                                                                          }>;
  verifyCommitment(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array,
                   amount_0: bigint,
                   buyer_0: Uint8Array,
                   memo_0: Uint8Array,
                   salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
  termsCommitment(amount_0: bigint,
                  buyer_0: Uint8Array,
                  memo_0: Uint8Array,
                  salt_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  termsCommitment(context: __compactRuntime.CircuitContext<PS>,
                  amount_0: bigint,
                  buyer_0: Uint8Array,
                  memo_0: Uint8Array,
                  salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  issue(context: __compactRuntime.CircuitContext<PS>,
        invoiceId_0: Uint8Array,
        orderId_0: Uint8Array,
        dueAt_0: bigint,
        createdAt_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledge(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                        invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  markFinanced(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  settle(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  voidInvoice(context: __compactRuntime.CircuitContext<PS>,
              invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  exists(context: __compactRuntime.CircuitContext<PS>, invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isSettled(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAcknowledged(context: __compactRuntime.CircuitContext<PS>,
                 invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isFinancingEligible(context: __compactRuntime.CircuitContext<PS>,
                      invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            invoiceId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { invoiceId: Uint8Array,
                                                                            orderId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            issuerId: Uint8Array,
                                                                            status: InvoiceStatus,
                                                                            createdAt: bigint,
                                                                            dueAt: bigint
                                                                          }>;
  verifyCommitment(context: __compactRuntime.CircuitContext<PS>,
                   invoiceId_0: Uint8Array,
                   amount_0: bigint,
                   buyer_0: Uint8Array,
                   memo_0: Uint8Array,
                   salt_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  invoices: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  invoiceRecords: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { invoiceId: Uint8Array,
                                 orderId: Uint8Array,
                                 commitment: Uint8Array,
                                 issuerId: Uint8Array,
                                 status: InvoiceStatus,
                                 createdAt: bigint,
                                 dueAt: bigint
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { invoiceId: Uint8Array,
  orderId: Uint8Array,
  commitment: Uint8Array,
  issuerId: Uint8Array,
  status: InvoiceStatus,
  createdAt: bigint,
  dueAt: bigint
}]>
  };
  issuerOf: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  orderOf: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  acknowledged: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  settled: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  voided: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  financingEligible: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly totalInvoices: bigint;
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
