import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum VerificationStatus { Unverified = 0,
                                 Verified = 1,
                                 Revoked = 2,
                                 Suspended = 3
}

export enum BusinessCategory { Retail = 0,
                               Wholesale = 1,
                               Manufacturing = 2,
                               Logistics = 3,
                               Finance = 4,
                               Other = 5
}

export type BusinessSecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getBusinessSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, BusinessSecret];
  getAdminSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, BusinessSecret];
  businessSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  registerBusiness(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: Uint8Array,
                   category_0: BusinessCategory,
                   credentialHash_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationStatus>;
  isBusinessVerified(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveBusinessEligible(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array,
                        requiredJurisdiction_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveAuthorization(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array,
                     actionHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionAllowed(context: __compactRuntime.CircuitContext<PS>,
                         jurisdiction_0: Uint8Array,
                         allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  getBusinessCommitment(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  exists(context: __compactRuntime.CircuitContext<PS>, businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type ProvableCircuits<PS> = {
  registerBusiness(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: Uint8Array,
                   category_0: BusinessCategory,
                   credentialHash_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationStatus>;
  isBusinessVerified(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveBusinessEligible(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array,
                        requiredJurisdiction_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveAuthorization(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array,
                     actionHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionAllowed(context: __compactRuntime.CircuitContext<PS>,
                         jurisdiction_0: Uint8Array,
                         allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  getBusinessCommitment(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  exists(context: __compactRuntime.CircuitContext<PS>, businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerBusiness(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: Uint8Array,
                   category_0: BusinessCategory,
                   credentialHash_0: Uint8Array,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, VerificationStatus>;
  isBusinessVerified(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveBusinessEligible(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array,
                        requiredJurisdiction_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  proveAuthorization(context: __compactRuntime.CircuitContext<PS>,
                     businessId_0: Uint8Array,
                     actionHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeBusiness(context: __compactRuntime.CircuitContext<PS>,
                 businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionAllowed(context: __compactRuntime.CircuitContext<PS>,
                         jurisdiction_0: Uint8Array,
                         allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  getBusinessCommitment(context: __compactRuntime.CircuitContext<PS>,
                        businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  exists(context: __compactRuntime.CircuitContext<PS>, businessId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
}

export type Ledger = {
  readonly totalBusinesses: bigint;
  businessRegistry: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { commitment: Uint8Array,
                                 ownerHash: Uint8Array,
                                 jurisdiction: Uint8Array,
                                 category: BusinessCategory,
                                 status: VerificationStatus,
                                 timestamp: bigint,
                                 credentialHash: Uint8Array
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { commitment: Uint8Array,
  ownerHash: Uint8Array,
  jurisdiction: Uint8Array,
  category: BusinessCategory,
  status: VerificationStatus,
  timestamp: bigint,
  credentialHash: Uint8Array
}]>
  };
  businessStatus: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): VerificationStatus;
    [Symbol.iterator](): Iterator<[Uint8Array, VerificationStatus]>
  };
  revokedBusinesses: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  jurisdictionAllowed: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<[Uint8Array, boolean]>
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
