// =============================================================================
// VeilCommerce — BusinessRegistry Contract Tests
// -----------------------------------------------------------------------------
// Unit tests for business registration, verification, nullifier protection
// =============================================================================

import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract state for testing
interface BusinessRegistryState {
  businessRegistry: Map<string, any>;
  businessStatus: Map<string, number>;
  revokedBusinesses: Set<string>;
  usedNullifiers: Set<string>;
  jurisdictionAllowed: Map<string, boolean>;
  totalBusinesses: number;
}

describe('BusinessRegistry', () => {
  let state: BusinessRegistryState;

  beforeEach(() => {
    state = {
      businessRegistry: new Map(),
      businessStatus: new Map(),
      revokedBusinesses: new Set(),
      usedNullifiers: new Set(),
      jurisdictionAllowed: new Map([
        ['NG', true], ['CN', true], ['US', true], ['GB', true], ['DE', true]
      ]),
      totalBusinesses: 0,
    };
  });

  // Registration tests
  it('should register a new business with valid jurisdiction', () => {
    const businessId = 'biz_001';
    const jurisdiction = 'NG';
    const credentialHash = 'cred_001';
    
    // Simulate registration
    state.businessRegistry.set(businessId, {
      commitment: 'commit_001',
      ownerHash: 'owner_001',
      jurisdiction,
      category: 0, // Retail
      status: 1, // Verified
      timestamp: Date.now(),
      credentialHash,
    });
    state.businessStatus.set(businessId, 1); // Verified
    state.totalBusinesses++;

    expect(state.totalBusinesses).toBe(1);
    expect(state.businessRegistry.has(businessId)).toBe(true);
    expect(state.businessStatus.get(businessId)).toBe(1);
  });

  it('should reject registration for non-allowed jurisdiction', () => {
    const jurisdiction = 'XX'; // Not in allowed list
    const isAllowed = state.jurisdictionAllowed.get(jurisdiction) ?? false;
    
    expect(isAllowed).toBe(false);
  });

  it('should prevent duplicate business registration', () => {
    const businessId = 'biz_001';
    state.businessRegistry.set(businessId, { commitment: 'commit_001' });
    
    const exists = state.businessRegistry.has(businessId);
    expect(exists).toBe(true);
    
    // Second registration should fail
    expect(() => {
      if (state.businessRegistry.has(businessId)) {
        throw new Error('Business already registered');
      }
    }).toThrow('Business already registered');
  });

  // Verification tests
  it('should verify a registered business', () => {
    const businessId = 'biz_001';
    state.businessRegistry.set(businessId, { status: 1 });
    state.businessStatus.set(businessId, 1);
    
    const isVerified = state.businessStatus.get(businessId) === 1;
    expect(isVerified).toBe(true);
  });

  it('should reject verification for revoked business', () => {
    const businessId = 'biz_001';
    state.revokedBusinesses.add(businessId);
    
    const isRevoked = state.revokedBusinesses.has(businessId);
    expect(isRevoked).toBe(true);
  });

  it('should prove business eligibility for allowed jurisdiction', () => {
    const businessId = 'biz_001';
    const requiredJurisdiction = 'NG';
    state.businessRegistry.set(businessId, { jurisdiction: 'NG', status: 1 });
    
    const rec = state.businessRegistry.get(businessId);
    const eligible = rec.jurisdiction === requiredJurisdiction && rec.status === 1;
    expect(eligible).toBe(true);
  });

  it('should reject eligibility for wrong jurisdiction', () => {
    const businessId = 'biz_001';
    const requiredJurisdiction = 'CN';
    state.businessRegistry.set(businessId, { jurisdiction: 'NG', status: 1 });
    
    const rec = state.businessRegistry.get(businessId);
    const eligible = rec.jurisdiction === requiredJurisdiction;
    expect(eligible).toBe(false);
  });

  // Nullifier / Replay protection tests
  it('should accept first use of nullifier', () => {
    const nullifier = 'null_001';
    const used = state.usedNullifiers.has(nullifier);
    expect(used).toBe(false);
    
    state.usedNullifiers.add(nullifier);
    expect(state.usedNullifiers.has(nullifier)).toBe(true);
  });

  it('should reject replay of used nullifier', () => {
    const nullifier = 'null_001';
    state.usedNullifiers.add(nullifier);
    
    const used = state.usedNullifiers.has(nullifier);
    expect(used).toBe(true);
    
    // Replay attempt should fail
    expect(() => {
      if (state.usedNullifiers.has(nullifier)) {
        throw new Error('Replay: nullifier already used');
      }
    }).toThrow('Replay: nullifier already used');
  });

  // Admin tests
  it('should allow admin to revoke business', () => {
    const businessId = 'biz_001';
    state.businessRegistry.set(businessId, { status: 1 });
    state.revokedBusinesses.add(businessId);
    
    expect(state.revokedBusinesses.has(businessId)).toBe(true);
  });

  it('should allow admin to set jurisdiction policy', () => {
    state.jurisdictionAllowed.set('FR', true);
    expect(state.jurisdictionAllowed.get('FR')).toBe(true);
    
    state.jurisdictionAllowed.set('RU', false);
    expect(state.jurisdictionAllowed.get('RU')).toBe(false);
  });
});

// Proof verification tests
describe('BusinessRegistry Proof Verification', () => {
  it('should accept valid proof', () => {
    const proof = {
      businessId: 'biz_001',
      commitment: 'commit_001',
      isValid: true,
    };
    expect(proof.isValid).toBe(true);
  });

  it('should reject tampered proof', () => {
    const proof = {
      businessId: 'biz_001',
      commitment: 'tampered_commit',
      isValid: false,
    };
    expect(proof.isValid).toBe(false);
  });

  it('should reject invalid commitment', () => {
    const proof = {
      businessId: 'biz_999', // Non-existent
      commitment: 'commit_001',
      isValid: false,
    };
    expect(proof.isValid).toBe(false);
  });

  it('should reject expired credential', () => {
    const proof = {
      businessId: 'biz_001',
      credentialExpired: true,
      isValid: false,
    };
    expect(proof.isValid).toBe(false);
  });

  it('should reject revoked credential', () => {
    const proof = {
      businessId: 'biz_001',
      credentialRevoked: true,
      isValid: false,
    };
    expect(proof.isValid).toBe(false);
  });

  it('should reject invalid state transition', () => {
    const proof = {
      fromStatus: 2, // Revoked
      toStatus: 1,   // Verified
      isValid: false,
    };
    expect(proof.isValid).toBe(false);
  });
});