import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum FinancingStatus { Requested = 0,
                              Funded = 1,
                              Repaid = 2,
                              Defaulted = 3,
                              Cancelled = 4
}

export type InvestorSecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getInvestorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, InvestorSecret];
  getSellerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, InvestorSecret];
  financingSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localFaceValue(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localRequested(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localCreditScore(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localCreditSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  commitCreditScore(context: __compactRuntime.CircuitContext<PS>,
                    sellerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   financingId_0: Uint8Array,
                   invoiceId_0: Uint8Array,
                   maturityDays_0: bigint,
                   feeBps_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyRisk(context: __compactRuntime.CircuitContext<PS>,
             financingId_0: Uint8Array,
             threshold_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  fundInvoice(context: __compactRuntime.CircuitContext<PS>,
              financingId_0: Uint8Array,
              fundedAmount_0: bigint,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  repay(context: __compactRuntime.CircuitContext<PS>,
        financingId_0: Uint8Array,
        timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelFinancing(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getFinancing(context: __compactRuntime.CircuitContext<PS>,
               financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { financingId: Uint8Array,
                                                                                 invoiceId: Uint8Array,
                                                                                 sellerId: Uint8Array,
                                                                                 investorId: Uint8Array,
                                                                                 faceValueCommit: Uint8Array,
                                                                                 requestedCommit: Uint8Array,
                                                                                 fundedAmount: bigint,
                                                                                 feeBps: bigint,
                                                                                 maturityDays: bigint,
                                                                                 status: FinancingStatus,
                                                                                 riskVerified: boolean,
                                                                                 createdAt: bigint,
                                                                                 fundedAt: bigint,
                                                                                 repaidAt: bigint
                                                                               }>;
  financingStatus(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, FinancingStatus>;
  isFunded(context: __compactRuntime.CircuitContext<PS>,
           financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  commitCreditScore(context: __compactRuntime.CircuitContext<PS>,
                    sellerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   financingId_0: Uint8Array,
                   invoiceId_0: Uint8Array,
                   maturityDays_0: bigint,
                   feeBps_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyRisk(context: __compactRuntime.CircuitContext<PS>,
             financingId_0: Uint8Array,
             threshold_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  fundInvoice(context: __compactRuntime.CircuitContext<PS>,
              financingId_0: Uint8Array,
              fundedAmount_0: bigint,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  repay(context: __compactRuntime.CircuitContext<PS>,
        financingId_0: Uint8Array,
        timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelFinancing(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getFinancing(context: __compactRuntime.CircuitContext<PS>,
               financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { financingId: Uint8Array,
                                                                                 invoiceId: Uint8Array,
                                                                                 sellerId: Uint8Array,
                                                                                 investorId: Uint8Array,
                                                                                 faceValueCommit: Uint8Array,
                                                                                 requestedCommit: Uint8Array,
                                                                                 fundedAmount: bigint,
                                                                                 feeBps: bigint,
                                                                                 maturityDays: bigint,
                                                                                 status: FinancingStatus,
                                                                                 riskVerified: boolean,
                                                                                 createdAt: bigint,
                                                                                 fundedAt: bigint,
                                                                                 repaidAt: bigint
                                                                               }>;
  financingStatus(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, FinancingStatus>;
  isFunded(context: __compactRuntime.CircuitContext<PS>,
           financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  commitCreditScore(context: __compactRuntime.CircuitContext<PS>,
                    sellerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  requestFinancing(context: __compactRuntime.CircuitContext<PS>,
                   financingId_0: Uint8Array,
                   invoiceId_0: Uint8Array,
                   maturityDays_0: bigint,
                   feeBps_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyRisk(context: __compactRuntime.CircuitContext<PS>,
             financingId_0: Uint8Array,
             threshold_0: bigint): __compactRuntime.CircuitResults<PS, boolean>;
  fundInvoice(context: __compactRuntime.CircuitContext<PS>,
              financingId_0: Uint8Array,
              fundedAmount_0: bigint,
              timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  repay(context: __compactRuntime.CircuitContext<PS>,
        financingId_0: Uint8Array,
        timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  cancelFinancing(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getFinancing(context: __compactRuntime.CircuitContext<PS>,
               financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { financingId: Uint8Array,
                                                                                 invoiceId: Uint8Array,
                                                                                 sellerId: Uint8Array,
                                                                                 investorId: Uint8Array,
                                                                                 faceValueCommit: Uint8Array,
                                                                                 requestedCommit: Uint8Array,
                                                                                 fundedAmount: bigint,
                                                                                 feeBps: bigint,
                                                                                 maturityDays: bigint,
                                                                                 status: FinancingStatus,
                                                                                 riskVerified: boolean,
                                                                                 createdAt: bigint,
                                                                                 fundedAt: bigint,
                                                                                 repaidAt: bigint
                                                                               }>;
  financingStatus(context: __compactRuntime.CircuitContext<PS>,
                  financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, FinancingStatus>;
  isFunded(context: __compactRuntime.CircuitContext<PS>,
           financingId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalFinancings: bigint;
  financings: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { financingId: Uint8Array,
                                 invoiceId: Uint8Array,
                                 sellerId: Uint8Array,
                                 investorId: Uint8Array,
                                 faceValueCommit: Uint8Array,
                                 requestedCommit: Uint8Array,
                                 fundedAmount: bigint,
                                 feeBps: bigint,
                                 maturityDays: bigint,
                                 status: FinancingStatus,
                                 riskVerified: boolean,
                                 createdAt: bigint,
                                 fundedAt: bigint,
                                 repaidAt: bigint
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { financingId: Uint8Array,
  invoiceId: Uint8Array,
  sellerId: Uint8Array,
  investorId: Uint8Array,
  faceValueCommit: Uint8Array,
  requestedCommit: Uint8Array,
  fundedAmount: bigint,
  feeBps: bigint,
  maturityDays: bigint,
  status: FinancingStatus,
  riskVerified: boolean,
  createdAt: bigint,
  fundedAt: bigint,
  repaidAt: bigint
}]>
  };
  financingExists: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  invoiceFinancing: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  usedFinancingNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  creditCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  riskVerified: {
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
