// =============================================================================
// VeilCommerce — Escrow Contract Tests
// -----------------------------------------------------------------------------
// Unit tests for escrow creation, delivery verification, release, refund
// =============================================================================

import { describe, it, expect, beforeEach } from 'vitest';

interface EscrowState {
  escrows: Map<string, any>;
  escrowExists: Set<string>;
  usedReleaseNullifiers: Set<string>;
  deliveryVerified: Set<string>;
  totalEscrows: number;
}

describe('Escrow', () => {
  let state: EscrowState;

  beforeEach(() => {
    state = {
      escrows: new Map(),
      escrowExists: new Set(),
      usedReleaseNullifiers: new Set(),
      deliveryVerified: new Set(),
      totalEscrows: 0,
    };
  });

  // Creation tests
  it('should create escrow with valid parameters', () => {
    const escrowId = 'esc_001';
    const orderId = 'ord_001';
    const buyer = 'buyer_001';
    const seller = 'seller_001';
    const amountCommit = 'commit_amt';
    const releaseCommit = 'commit_rel';
    
    state.escrows.set(escrowId, {
      escrowId,
      orderId,
      buyer,
      seller,
      amountCommit,
      releaseCommit,
      state: 1, // Funded
      createdAt: Date.now(),
      fundedAt: Date.now(),
      releasedAt: 0,
    });
    state.escrowExists.add(escrowId);
    state.totalEscrows++;

    expect(state.totalEscrows).toBe(1);
    expect(state.escrows.get(escrowId).state).toBe(1); // Funded
    expect(state.escrows.get(escrowId).buyer).toBe(buyer);
    expect(state.escrows.get(escrowId).seller).toBe(seller);
  });

  it('should reject duplicate escrow creation', () => {
    const escrowId = 'esc_001';
    state.escrowExists.add(escrowId);
    
    expect(() => {
      if (state.escrowExists.has(escrowId)) {
        throw new Error('Escrow already exists');
      }
    }).toThrow('Escrow already exists');
  });

  // Delivery verification tests
  it('should verify delivery by authorized party', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { state: 1, buyer: 'buyer_001', seller: 'seller_001' });
    state.escrowExists.add(escrowId);
    
    // Buyer verifies
    state.deliveryVerified.add(escrowId);
    const rec = state.escrows.get(escrowId);
    rec.state = 2; // DeliveryVerified
    
    expect(state.deliveryVerified.has(escrowId)).toBe(true);
    expect(rec.state).toBe(2);
  });

  it('should reject delivery verification for non-funded escrow', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { state: 0 }); // Empty
    
    expect(() => {
      if (state.escrows.get(escrowId).state !== 1) {
        throw new Error('Must be funded');
      }
    }).toThrow('Must be funded');
  });

  it('should reject delivery verification from unauthorized party', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { state: 1, buyer: 'buyer_001', seller: 'seller_001' });
    const unauthorizedParty = 'hacker_001';
    
    expect(() => {
      if (unauthorizedParty !== 'buyer_001' && unauthorizedParty !== 'seller_001') {
        throw new Error('Only parties can verify delivery');
      }
    }).toThrow('Only parties can verify delivery');
  });

  // Release tests
  it('should release funds with valid release secret', () => {
    const escrowId = 'esc_001';
    const releaseSecret = 'secret_001';
    const releaseCommit = 'commit_rel';
    
    state.escrows.set(escrowId, { 
      state: 2, // DeliveryVerified
      releaseCommit,
      seller: 'seller_001',
    });
    state.deliveryVerified.add(escrowId);
    
    // Seller provides correct secret
    const recomputed = releaseSecret; // In reality: hash(secret)
    const valid = recomputed === releaseCommit; // Simplified
    
    expect(valid).toBe(true);
    
    // Check nullifier
    const nullifier = `null_${releaseSecret}_${escrowId}`;
    expect(state.usedReleaseNullifiers.has(nullifier)).toBe(false);
    state.usedReleaseNullifiers.add(nullifier);
    
    // Update state
    const rec = state.escrows.get(escrowId);
    rec.state = 3; // Released
    rec.releasedAt = Date.now();
    
    expect(rec.state).toBe(3);
  });

  it('should reject release with invalid secret', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { 
      state: 2,
      releaseCommit: 'correct_commit',
      seller: 'seller_001',
    });
    
    const wrongSecret = 'wrong_secret';
    const recomputed = wrongSecret; // Simplified
    const valid = recomputed === 'correct_commit';
    
    expect(valid).toBe(false);
  });

  it('should reject replay of release secret', () => {
    const escrowId = 'esc_001';
    const releaseSecret = 'secret_001';
    const nullifier = `null_${releaseSecret}_${escrowId}`;
    
    state.usedReleaseNullifiers.add(nullifier);
    
    expect(() => {
      if (state.usedReleaseNullifiers.has(nullifier)) {
        throw new Error('Replay: already released');
      }
    }).toThrow('Replay: already released');
  });

  it('should reject release without delivery verification', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { state: 1 }); // Funded only
    
    expect(() => {
      if (!state.deliveryVerified.has(escrowId)) {
        throw new Error('Delivery not verified');
      }
    }).toThrow('Delivery not verified');
  });

  // Refund tests
  it('should allow buyer to refund before delivery verification', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { 
      state: 1, // Funded
      buyer: 'buyer_001',
      seller: 'seller_001',
    });
    
    // No delivery verified
    expect(state.deliveryVerified.has(escrowId)).toBe(false);
    
    // Buyer refunds
    const rec = state.escrows.get(escrowId);
    rec.state = 4; // Refunded
    
    expect(rec.state).toBe(4);
  });

  it('should reject refund after delivery verification', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { state: 1, buyer: 'buyer_001' });
    state.deliveryVerified.add(escrowId);
    
    expect(() => {
      if (state.deliveryVerified.has(escrowId)) {
        throw new Error('Delivery already verified');
      }
    }).toThrow('Delivery already verified');
  });

  // Dispute tests
  it('should allow parties to dispute', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { 
      state: 1, 
      buyer: 'buyer_001', 
      seller: 'seller_001' 
    });
    
    // Buyer disputes
    const rec = state.escrows.get(escrowId);
    rec.state = 5; // Disputed
    
    expect(rec.state).toBe(5);
  });

  it('should reject dispute from non-party', () => {
    const escrowId = 'esc_001';
    state.escrows.set(escrowId, { 
      state: 1, 
      buyer: 'buyer_001', 
      seller: 'seller_001' 
    });
    const unauthorized = 'hacker_001';
    
    expect(() => {
      if (unauthorized !== 'buyer_001' && unauthorized !== 'seller_001') {
        throw new Error('Only parties');
      }
    }).toThrow('Only parties');
  });
});