// =============================================================================
// VeilCommerce SDK — Credentials Module
// -----------------------------------------------------------------------------
// TypeScript bindings for CredentialRegistry contract interactions.
// =============================================================================

export enum CredentialType {
  BusinessRegistration = 0,
  TaxId = 1,
  TradeLicense = 2,
  BankStatement = 3,
  ComplianceCert = 4,
  Other = 5
}

export enum CredentialStatus {
  Active = 0,
  Revoked = 1,
  Expired = 2,
  Suspended = 3
}

export interface CredentialRecord {
  credentialId: Uint8Array;
  holderId: Uint8Array;
  issuerId: Uint8Array;
  credentialType: CredentialType;
  commitment: Uint8Array;
  status: CredentialStatus;
  issuedAt: bigint;
  expiresAt: bigint;
}

export interface IssueCredentialParams {
  credentialId: Uint8Array;
  holderId: Uint8Array;
  credentialType: CredentialType;
  expiresAt: bigint;
  timestamp: bigint;
  // Witnesses
  holderSecret: Uint8Array;
  salt: Uint8Array;
  issuedAt: bigint;
}

export interface ProveCredentialParams {
  credentialId: Uint8Array;
  verifierId: Uint8Array;
  // Witnesses
  holderSecret: Uint8Array;
  salt: Uint8Array;
  issuedAt: bigint;
}

export class CredentialsSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async addTrustedIssuer(issuerId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.addTrustedIssuer(issuerId);
    return tx.hash;
  }

  async issueCredential(params: IssueCredentialParams): Promise<string> {
    const tx = await this.contract.circuits.issueCredential(
      params.credentialId,
      params.holderId,
      params.credentialType,
      params.expiresAt,
      params.timestamp
    );
    return tx.hash;
  }

  async proveCredential(params: ProveCredentialParams): Promise<boolean> {
    return await this.contract.circuits.proveCredential(
      params.credentialId,
      params.verifierId
    );
  }

  async verifyCredential(credentialId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.verifyCredential(credentialId);
  }

  async revokeCredential(credentialId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.revokeCredential(credentialId);
    return tx.hash;
  }

  async suspendCredential(credentialId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.suspendCredential(credentialId);
    return tx.hash;
  }

  // Reads
  async getCredential(credentialId: Uint8Array): Promise<CredentialRecord> {
    return await this.contract.circuits.getCredential(credentialId);
  }

  async isRevoked(credentialId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isRevoked(credentialId);
  }

  async commitmentOf(credentialId: Uint8Array): Promise<Uint8Array> {
    return await this.contract.circuits.commitmentOf(credentialId);
  }
}

export function createCredentialsSDK(contract: any, witnesses: any): CredentialsSDK {
  return new CredentialsSDK(contract, witnesses);
}