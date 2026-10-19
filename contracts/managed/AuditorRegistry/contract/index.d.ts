import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum AuditorStatus { Inactive = 0,
                            Certified = 1,
                            Suspended = 2,
                            Revoked = 3
}

export enum AttestationStatus { Pending = 0,
                                Verified = 1,
                                Rejected = 2,
                                Expired = 3
}

export type AuditorSecret = { bytes: Uint8Array };

export type AuditAttestationRecord = { attestationId: Uint8Array;
                                       tradeId: Uint8Array;
                                       auditorId: Uint8Array;
                                       subjectCommitment: Uint8Array;
                                       verificationSeal: Uint8Array;
                                       status: AttestationStatus;
                                       certifiedAt: bigint;
                                       expiresAt: bigint
                                     };

export type Witnesses<PS> = {
  getAuditorSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, AuditorSecret];
  getAdminSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, AuditorSecret];
  auditSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  auditTimestamp(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  registerAuditor(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeAuditor(context: __compactRuntime.CircuitContext<PS>,
                auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitTradeAttestation(context: __compactRuntime.CircuitContext<PS>,
                         attestationId_0: Uint8Array,
                         tradeId_0: Uint8Array,
                         subjectCommitment_0: Uint8Array,
                         expiry_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAndSealAttestation(context: __compactRuntime.CircuitContext<PS>,
                           attestationId_0: Uint8Array,
                           verificationSeal_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  isAuditorCertified(context: __compactRuntime.CircuitContext<PS>,
                     auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAttestationVerified(context: __compactRuntime.CircuitContext<PS>,
                        attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getAttestation(context: __compactRuntime.CircuitContext<PS>,
                 attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, AuditAttestationRecord>;
}

export type ProvableCircuits<PS> = {
  registerAuditor(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeAuditor(context: __compactRuntime.CircuitContext<PS>,
                auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitTradeAttestation(context: __compactRuntime.CircuitContext<PS>,
                         attestationId_0: Uint8Array,
                         tradeId_0: Uint8Array,
                         subjectCommitment_0: Uint8Array,
                         expiry_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAndSealAttestation(context: __compactRuntime.CircuitContext<PS>,
                           attestationId_0: Uint8Array,
                           verificationSeal_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  isAuditorCertified(context: __compactRuntime.CircuitContext<PS>,
                     auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAttestationVerified(context: __compactRuntime.CircuitContext<PS>,
                        attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getAttestation(context: __compactRuntime.CircuitContext<PS>,
                 attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, AuditAttestationRecord>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  registerAuditor(context: __compactRuntime.CircuitContext<PS>,
                  auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  revokeAuditor(context: __compactRuntime.CircuitContext<PS>,
                auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  submitTradeAttestation(context: __compactRuntime.CircuitContext<PS>,
                         attestationId_0: Uint8Array,
                         tradeId_0: Uint8Array,
                         subjectCommitment_0: Uint8Array,
                         expiry_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  verifyAndSealAttestation(context: __compactRuntime.CircuitContext<PS>,
                           attestationId_0: Uint8Array,
                           verificationSeal_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  isAuditorCertified(context: __compactRuntime.CircuitContext<PS>,
                     auditorId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  isAttestationVerified(context: __compactRuntime.CircuitContext<PS>,
                        attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  getAttestation(context: __compactRuntime.CircuitContext<PS>,
                 attestationId_0: Uint8Array): __compactRuntime.CircuitResults<PS, AuditAttestationRecord>;
}

export type Ledger = {
  readonly totalAuditors: bigint;
  readonly totalAttestations: bigint;
  auditors: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): AuditorStatus;
    [Symbol.iterator](): Iterator<[Uint8Array, AuditorStatus]>
  };
  certifiedAuditors: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  attestations: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): AuditAttestationRecord;
    [Symbol.iterator](): Iterator<[Uint8Array, AuditAttestationRecord]>
  };
  verifiedAttestations: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  tradeAttestationMap: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Uint8Array;
    [Symbol.iterator](): Iterator<[Uint8Array, Uint8Array]>
  };
  usedAuditNullifiers: {
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
