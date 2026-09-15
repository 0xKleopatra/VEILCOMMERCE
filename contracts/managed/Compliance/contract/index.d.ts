import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum ComplianceStatus { Pending = 0,
                               Verified = 1,
                               Rejected = 2,
                               Expired = 3
}

export enum DisclosureLevel { Private = 0,
                              Selective = 1,
                              Auditable = 2,
                              PublicProof = 3
}

export type ComplianceSecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getComplianceSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, ComplianceSecret];
  getAdminSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, ComplianceSecret];
  complianceSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  credentialHashWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  certificationHashWitness(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  privateAttr1(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  privateAttr2(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  privateAttr3(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: bigint,
                   validityDays_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  evaluateCompliance(context: __compactRuntime.CircuitContext<PS>,
                     subjectId_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  grantDisclosure(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array,
                  level_0: DisclosureLevel): __compactRuntime.CircuitResults<PS, []>;
  revokeCompliance(context: __compactRuntime.CircuitContext<PS>,
                   subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionPolicy(context: __compactRuntime.CircuitContext<PS>,
                        jurisdiction_0: bigint,
                        allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  isVerified(context: __compactRuntime.CircuitContext<PS>,
             subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { subjectId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            status: ComplianceStatus,
                                                                            jurisdiction: bigint,
                                                                            verifiedAt: bigint,
                                                                            expiresAt: bigint,
                                                                            disclosureLevel: DisclosureLevel
                                                                          }>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type ProvableCircuits<PS> = {
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: bigint,
                   validityDays_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  evaluateCompliance(context: __compactRuntime.CircuitContext<PS>,
                     subjectId_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  grantDisclosure(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array,
                  level_0: DisclosureLevel): __compactRuntime.CircuitResults<PS, []>;
  revokeCompliance(context: __compactRuntime.CircuitContext<PS>,
                   subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionPolicy(context: __compactRuntime.CircuitContext<PS>,
                        jurisdiction_0: bigint,
                        allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  isVerified(context: __compactRuntime.CircuitContext<PS>,
             subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { subjectId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            status: ComplianceStatus,
                                                                            jurisdiction: bigint,
                                                                            verifiedAt: bigint,
                                                                            expiresAt: bigint,
                                                                            disclosureLevel: DisclosureLevel
                                                                          }>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  attestCompliance(context: __compactRuntime.CircuitContext<PS>,
                   jurisdiction_0: bigint,
                   validityDays_0: bigint,
                   timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  evaluateCompliance(context: __compactRuntime.CircuitContext<PS>,
                     subjectId_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  grantDisclosure(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array,
                  level_0: DisclosureLevel): __compactRuntime.CircuitResults<PS, []>;
  revokeCompliance(context: __compactRuntime.CircuitContext<PS>,
                   subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  setJurisdictionPolicy(context: __compactRuntime.CircuitContext<PS>,
                        jurisdiction_0: bigint,
                        allowed_0: boolean): __compactRuntime.CircuitResults<PS, []>;
  isVerified(context: __compactRuntime.CircuitContext<PS>,
             subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getRecord(context: __compactRuntime.CircuitContext<PS>,
            subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { subjectId: Uint8Array,
                                                                            commitment: Uint8Array,
                                                                            status: ComplianceStatus,
                                                                            jurisdiction: bigint,
                                                                            verifiedAt: bigint,
                                                                            expiresAt: bigint,
                                                                            disclosureLevel: DisclosureLevel
                                                                          }>;
  getCommitment(context: __compactRuntime.CircuitContext<PS>,
                subjectId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly totalComplianceChecks: bigint;
  complianceRecords: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { subjectId: Uint8Array,
                                 commitment: Uint8Array,
                                 status: ComplianceStatus,
                                 jurisdiction: bigint,
                                 verifiedAt: bigint,
                                 expiresAt: bigint,
                                 disclosureLevel: DisclosureLevel
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { subjectId: Uint8Array,
  commitment: Uint8Array,
  status: ComplianceStatus,
  jurisdiction: bigint,
  verifiedAt: bigint,
  expiresAt: bigint,
  disclosureLevel: DisclosureLevel
}]>
  };
  complianceVerified: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  complianceCommitments: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  auditorGrants: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): {
      isEmpty(): boolean;
      size(): bigint;
      member(elem_0: Uint8Array): boolean;
      [Symbol.iterator](): Iterator<Uint8Array>
    }
  };
  usedComplianceNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  jurisdictionPolicy: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): boolean;
    [Symbol.iterator](): Iterator<[bigint, boolean]>
  };
  credentialRevoked: {
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
