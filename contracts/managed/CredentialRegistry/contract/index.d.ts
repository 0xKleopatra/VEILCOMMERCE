import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum CredentialType { BusinessRegistration = 0,
                             TaxId = 1,
                             TradeLicense = 2,
                             BankStatement = 3,
                             ComplianceCert = 4,
                             Other = 5
}

export enum CredentialStatus { Active = 0,
                               Revoked = 1,
                               Expired = 2,
                               Suspended = 3
}

export type HolderSecret = { bytes: Uint8Array };

export type Witnesses<PS> = {
  getHolderSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, HolderSecret];
  getIssuerSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, HolderSecret];
  credentialSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  credentialIssuedAt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  addTrustedIssuer(context: __compactRuntime.CircuitContext<PS>,
                   issuerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  issueCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  holderId_0: Uint8Array,
                  credentialType_0: CredentialType,
                  expiresAt_0: bigint,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  verifierId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  suspendCredential(context: __compactRuntime.CircuitContext<PS>,
                    credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCredential(context: __compactRuntime.CircuitContext<PS>,
                credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { credentialId: Uint8Array,
                                                                                   holderId: Uint8Array,
                                                                                   issuerId: Uint8Array,
                                                                                   credentialType: CredentialType,
                                                                                   commitment: Uint8Array,
                                                                                   status: CredentialStatus,
                                                                                   issuedAt: bigint,
                                                                                   expiresAt: bigint
                                                                                 }>;
  isRevoked(context: __compactRuntime.CircuitContext<PS>,
            credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type ProvableCircuits<PS> = {
  addTrustedIssuer(context: __compactRuntime.CircuitContext<PS>,
                   issuerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  issueCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  holderId_0: Uint8Array,
                  credentialType_0: CredentialType,
                  expiresAt_0: bigint,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  verifierId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  suspendCredential(context: __compactRuntime.CircuitContext<PS>,
                    credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCredential(context: __compactRuntime.CircuitContext<PS>,
                credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { credentialId: Uint8Array,
                                                                                   holderId: Uint8Array,
                                                                                   issuerId: Uint8Array,
                                                                                   credentialType: CredentialType,
                                                                                   commitment: Uint8Array,
                                                                                   status: CredentialStatus,
                                                                                   issuedAt: bigint,
                                                                                   expiresAt: bigint
                                                                                 }>;
  isRevoked(context: __compactRuntime.CircuitContext<PS>,
            credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  addTrustedIssuer(context: __compactRuntime.CircuitContext<PS>,
                   issuerId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  issueCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  holderId_0: Uint8Array,
                  credentialType_0: CredentialType,
                  expiresAt_0: bigint,
                  timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCredential(context: __compactRuntime.CircuitContext<PS>,
                  credentialId_0: Uint8Array,
                  verifierId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  verifyCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  revokeCredential(context: __compactRuntime.CircuitContext<PS>,
                   credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  suspendCredential(context: __compactRuntime.CircuitContext<PS>,
                    credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getCredential(context: __compactRuntime.CircuitContext<PS>,
                credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, { credentialId: Uint8Array,
                                                                                   holderId: Uint8Array,
                                                                                   issuerId: Uint8Array,
                                                                                   credentialType: CredentialType,
                                                                                   commitment: Uint8Array,
                                                                                   status: CredentialStatus,
                                                                                   issuedAt: bigint,
                                                                                   expiresAt: bigint
                                                                                 }>;
  isRevoked(context: __compactRuntime.CircuitContext<PS>,
            credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  commitmentOf(context: __compactRuntime.CircuitContext<PS>,
               credentialId_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
}

export type Ledger = {
  readonly totalCredentials: bigint;
  credentials: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { credentialId: Uint8Array,
                                 holderId: Uint8Array,
                                 issuerId: Uint8Array,
                                 credentialType: CredentialType,
                                 commitment: Uint8Array,
                                 status: CredentialStatus,
                                 issuedAt: bigint,
                                 expiresAt: bigint
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { credentialId: Uint8Array,
  holderId: Uint8Array,
  issuerId: Uint8Array,
  credentialType: CredentialType,
  commitment: Uint8Array,
  status: CredentialStatus,
  issuedAt: bigint,
  expiresAt: bigint
}]>
  };
  credentialExists: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  revokedCredentials: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  holderCredentials: {
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
  usedCredentialNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  trustedIssuers: {
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
