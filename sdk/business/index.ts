import { Bytes, UInt64, Counter } from '@midnight-ntwrk/compact-runtime';

// =============================================================================
// VeilCommerce SDK — Business Module
// -----------------------------------------------------------------------------
// TypeScript bindings for BusinessRegistry contract interactions.
// =============================================================================

export interface BusinessSecret {
  bytes: Uint8Array; // 32 bytes
}

export interface BusinessCommitment {
  commitment: Uint8Array;
  ownerHash: Uint8Array;
  jurisdiction: Uint8Array;
  category: BusinessCategory;
  status: VerificationStatus;
  timestamp: bigint;
  credentialHash: Uint8Array;
}

export enum VerificationStatus {
  Unverified = 0,
  Verified = 1,
  Revoked = 2,
  Suspended = 3
}

export enum BusinessCategory {
  Retail = 0,
  Wholesale = 1,
  Manufacturing = 2,
  Logistics = 3,
  Finance = 4,
  Other = 5
}

export interface RegisterBusinessParams {
  jurisdiction: Uint8Array; // 32 bytes (e.g., "NG", "CN")
  category: BusinessCategory;
  credentialHash: Uint8Array; // 32 bytes
  timestamp: bigint;
}

export interface VerifyBusinessResult {
  status: VerificationStatus;
  isVerified: boolean;
}

export interface ProveEligibleParams {
  businessId: Uint8Array;
  requiredJurisdiction: Uint8Array;
}

export interface ProveAuthorizationParams {
  businessId: Uint8Array;
  actionHash: Uint8Array;
}

export class BusinessSDK {
  private contract: any; // Compiled contract instance
  private witnesses: any;

  constructor(contract: any, witnesses: any) {
    this.contract = contract;
    this.witnesses = witnesses;
  }

  // Circuit calls
  async registerBusiness(params: RegisterBusinessParams): Promise<string> {
    const tx = await this.contract.circuits.registerBusiness(
      params.jurisdiction,
      params.category,
      params.credentialHash,
      params.timestamp
    );
    return tx.hash;
  }

  async verifyBusiness(businessId: Uint8Array): Promise<VerifyBusinessResult> {
    const status = await this.contract.circuits.verifyBusiness(businessId);
    return {
      status: status as VerificationStatus,
      isVerified: status === VerificationStatus.Verified
    };
  }

  async isBusinessVerified(businessId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.isBusinessVerified(businessId);
  }

  async proveBusinessEligible(params: ProveEligibleParams): Promise<boolean> {
    return await this.contract.circuits.proveBusinessEligible(
      params.businessId,
      params.requiredJurisdiction
    );
  }

  async proveAuthorization(params: ProveAuthorizationParams): Promise<string> {
    const tx = await this.contract.circuits.proveAuthorization(
      params.businessId,
      params.actionHash
    );
    return tx.hash;
  }

  // Admin circuits
  async revokeBusiness(businessId: Uint8Array): Promise<string> {
    const tx = await this.contract.circuits.revokeBusiness(businessId);
    return tx.hash;
  }

  async setJurisdictionAllowed(jurisdiction: Uint8Array, allowed: boolean): Promise<string> {
    const tx = await this.contract.circuits.setJurisdictionAllowed(jurisdiction, allowed);
    return tx.hash;
  }

  // Reads
  async getBusinessCommitment(businessId: Uint8Array): Promise<Uint8Array> {
    return await this.contract.circuits.getBusinessCommitment(businessId);
  }

  async exists(businessId: Uint8Array): Promise<boolean> {
    return await this.contract.circuits.exists(businessId);
  }

  // Helper: derive business ID from secret key
  static deriveBusinessId(secretKey: Uint8Array): Uint8Array {
    // This mirrors the pure circuit: persistentHash(["veil:business:id:v1", sk])
    // Implementation would use the same hash function as the contract
    throw new Error('Use contract pure circuit via SDK');
  }

  static deriveOwnerHash(secretKey: Uint8Array): Uint8Array {
    throw new Error('Use contract pure circuit via SDK');
  }
}

export function createBusinessSDK(contract: any, witnesses: any): BusinessSDK {
  return new BusinessSDK(contract, witnesses);
}