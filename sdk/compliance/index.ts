// =============================================================================
// VeilCommerce SDK — Compliance Module
// -----------------------------------------------------------------------------
// TypeScript bindings for Compliance contract interactions.
// =============================================================================

export enum ComplianceStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2,
  Expired = 3
}

export enum DisclosureLevel {
  Private = 0,
  Selective = 1,
  Auditable = 2,
  PublicProof = 3
}

export interface ComplianceRecord {
  subjectId: Uint8Array;
  commitment: Uint8Array;
  status: ComplianceStatus;
  jurisdiction: Uint8Array;
  verifiedAt: bigint;
  expiresAt: bigint;
  disclosureLevel: DisclosureLevel;
}

export interface AttestComplianceParams {
  jurisdiction: Uint8Array;
  validityDays: bigint;
  timestamp: bigint;
  // Witnesses
  credentialHash: Uint8Array;
  certificationHash: Uint8Array;
  salt: Uint8Array;
  privateAttr1: number;
  privateAttr2: number;
  privateAttr3: number;
}

export interface EvaluateComplianceParams {
  subjectId: Uint8Array;
  threshold: number;
  // Witnesses
  privateAttr1: number;
  privateAttr2: number;
  privateAttr3: number;
}

export interface GrantDisclosureParams {
  auditorId: Uint8Array;
  level: DisclosureLevel;
  // Witness: subject secret key
}

export class ComplianceSDK {
  private contract: any;
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  async attestCompliance(params: AttestComplianceParams): Promise<string> {
    const tx = await this.contract.circuits.attestCompliance(
      params.jurisdiction,
      params.validityDays,
      params.timestamp
    );
    return tx.hash;
  }

  async evaluateCompliance(params: EvaluateComplianceParams): Promise<string> {
    const tx = await this.contract.circuits.evaluateCompliance(
      params.subjectId,
      params.threshold
    );
    return tx.hash;
  }

  async grantDisclosure(params: GrantDisclosureParams): Promise<string> {
    const tx = await this.contract.circuits.grantDisclosure(
      params.auditorId,
      params.level
    );
    return tx.hash;
  }

  async revokeCompliance(subjectId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.revokeCompliance(subjectId);
    return tx.hash;
  }

  async revokeCredential(credHash: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.revokeCredential(credHash);
    return tx.hash;
  }

  async setJurisdictionPolicy(jurisdiction: Uint8Array, allowed: boolean): Promise<string> {
    const tx = await this.contract.circuits.setJurisdictionPolicy(jurisdiction, allowed);
    return tx.hash;
  }

  // Reads
  async isVerified(subjectId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isVerified(subjectId);
  }

  async getRecord(subjectId: Uint8Array): Promise<ComplianceRecord> {
    return await this.contract.circuits.getRecord(subjectId);
  }

  async getCommitment(subjectId: Uint8Array): Promise<Uint8Array> {
    return await this.contract.circuits.getCommitment(subjectId);
  }
}

export function createComplianceSDK(contract: any, witnesses: any): ComplianceSDK {
  return new ComplianceSDK(contract, witnesses);
}