// VeilCommerce — Witness Functions
// Private input providers for Compact circuits

import type { WalletAPI } from '@midnight-ntwrk/wallet-sdk';

/**
 * Business secret key witness — returns BusinessSecret { bytes: Bytes<32> }
 */
export function businessSecretWitness(
  context: { privateState: any }
): [any, { bytes: Uint8Array }] {
  const ps = context.privateState ?? {};
  const secret = (ps as any).businessSecret ?? persistentSecret('business');
  return [{ ...ps, businessSecret: secret }, { bytes: secret }];
}

/**
 * Party secret key witness — returns PartySecret { bytes: Bytes<32> }
 */
export function partySecretWitness(
  context: { privateState: any }
): [any, { bytes: Uint8Array }] {
  const ps = context.privateState ?? {};
  const secret = (ps as any).partySecret ?? persistentSecret('party');
  return [{ ...ps, partySecret: secret }, { bytes: secret }];
}

/**
 * Escrow secret witnesses
 */
export function escrowSecretWitnesses(
  context: { privateState: any }
): [any, { releaseSecret: Uint8Array; nonce: Uint8Array; amount: bigint }] {
  const ps = context.privateState ?? {};
  const releaseSecret = (ps as any).escrowReleaseSecret ?? persistentSecret('escrow.release');
  const nonce = (ps as any).escrowNonce ?? persistentSecret('escrow.nonce');
  const amount = (ps as any).escrowAmount ?? 0n;
  return [
    { ...ps, escrowReleaseSecret: releaseSecret, escrowNonce: nonce, escrowAmount: amount },
    { releaseSecret, nonce, amount },
  ];
}

/**
 * Invoice secret witnesses
 */
export function invoiceSecretWitnesses(
  context: { privateState: any }
): [any, { amount: bigint; buyer: Uint8Array; memo: Uint8Array; salt: Uint8Array }] {
  const ps = context.privateState ?? {};
  const amount = (ps as any).invoiceAmount ?? 0n;
  const buyer = (ps as any).invoiceBuyer ?? persistentSecret('invoice.buyer');
  const memo = (ps as any).invoiceMemo ?? persistentSecret('invoice.memo');
  const salt = (ps as any).invoiceSalt ?? persistentSecret('invoice.salt');
  return [
    { ...ps, invoiceAmount: amount, invoiceBuyer: buyer, invoiceMemo: memo, invoiceSalt: salt },
    { amount, buyer, memo, salt },
  ];
}

/**
 * Financing secret witnesses
 */
export function financingSecretWitnesses(
  context: { privateState: any }
): [any, { faceValue: bigint; requested: bigint; creditScore: number; creditSalt: Uint8Array }] {
  const ps = context.privateState ?? {};
  const faceValue = (ps as any).financingFaceValue ?? 0n;
  const requested = (ps as any).financingRequested ?? 0n;
  const creditScore = (ps as any).financingCreditScore ?? 720;
  const creditSalt = (ps as any).financingCreditSalt ?? persistentSecret('financing.creditSalt');
  return [
    { ...ps, financingFaceValue: faceValue, financingRequested: requested, financingCreditScore: creditScore, financingCreditSalt: creditSalt },
    { faceValue, requested, creditScore, creditSalt },
  ];
}

/**
 * Compliance secret witnesses
 */
export function complianceSecretWitnesses(
  context: { privateState: any }
): [any, { attr1: number; attr2: number; attr3: number }] {
  const ps = context.privateState ?? {};
  const attr1 = (ps as any).complianceAttr1 ?? 85;
  const attr2 = (ps as any).complianceAttr2 ?? 90;
  const attr3 = (ps as any).complianceAttr3 ?? 75;
  return [
    { ...ps, complianceAttr1: attr1, complianceAttr2: attr2, complianceAttr3: attr3 },
    { attr1, attr2, attr3 },
  ];
}

/**
 * Credential secret witnesses
 */
export function credentialSecretWitnesses(
  context: { privateState: any }
): [any, { holderSecret: Uint8Array; salt: Uint8Array; issuedAt: bigint }] {
  const ps = context.privateState ?? {};
  const holderSecret = (ps as any).credentialHolderSecret ?? persistentSecret('credential.holder');
  const salt = (ps as any).credentialSalt ?? persistentSecret('credential.salt');
  const issuedAt = (ps as any).credentialIssuedAt ?? BigInt(Date.now());
  return [
    { ...ps, credentialHolderSecret: holderSecret, credentialSalt: salt, credentialIssuedAt: issuedAt },
    { holderSecret, salt, issuedAt },
  ];
}

/**
 * Settlement secret witnesses
 */
export function settlementSecretWitnesses(
  context: { privateState: any }
): [any, { amount: bigint; payer: Uint8Array; payee: Uint8Array; salt: Uint8Array }] {
  const ps = context.privateState ?? {};
  const amount = (ps as any).settlementAmount ?? 0n;
  const payer = (ps as any).settlementPayer ?? persistentSecret('settlement.payer');
  const payee = (ps as any).settlementPayee ?? persistentSecret('settlement.payee');
  const salt = (ps as any).settlementSalt ?? persistentSecret('settlement.salt');
  return [
    { ...ps, settlementAmount: amount, settlementPayer: payer, settlementPayee: payee, settlementSalt: salt },
    { amount, payer, payee, salt },
  ];
}

/**
 * Admin secret witness — returns BusinessSecret/ComplianceSecret { bytes: Bytes<32> }
 */
export function adminSecretWitness(
  context: { privateState: any }
): [any, { bytes: Uint8Array }] {
  const ps = context.privateState ?? {};
  const secret = (ps as any).adminSecret ?? persistentSecret('compliance.admin');
  return [{ ...ps, adminSecret: secret }, { bytes: secret }];
}

/**
 * Generate a new 32-byte secret
 */
function generateSecret(): Uint8Array {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * -- Persistent identity layer -------------------------------------------------
 *
 * VeilCommerce parties derive stable pseudo-random identities on-chain via
 *   persistentHash(CompactTypeVector(2, CompactTypeBytes(32)), [domain, secret])
 * e.g. a business owner → veil:business:owner:v1, a purchase-order party →
 * veil:po:party:v1, an escrow party → veil:escrow:party:v1, an invoice issuer →
 * veil:invoice:issuer:v1, a financing seller → veil:financing:seller:v1, an
 * investor → veil:investor:id:v1, a compliance subject → veil:compliance:subject:v1,
 * an auditor → veil:compliance:auditor:v1, a settlement party →
 * veil:settlement:party:v1.
 *
 * Because reveal/release/settle circuits validate the *caller's* derived id
 * against records created in an earlier call (same wallet), the secret saved in
 * a witness for step N must equal the secret witnessed in step N−1. We therefore
 * persist one secret per role in localStorage (falling back to module cache in
 * non-browser contexts) and reuse it across every call.
 *
 * The optional `deriveId(domain, secret)` exported here replicates the contract's
 * persistentHash so the frontend can display the same public ids it eventually
 * submits and validate ledger reads.
 */

const kPersistencePrefix = 'veil:identity:';

/** Module-level cache so repeated witness invocations within one session agree. */
const secretCache = new Map<string, Uint8Array>();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

/**
 * Get (or create+persist) the secret for a named role. The role string becomes
 * part of the persistence key, so party/business/admin/issuer/seller/investor/
 * subject/auditor identities are each stable across the whole demo run.
 */
function persistentSecret(role: string): Uint8Array {
  const cached = secretCache.get(role);
  if (cached) return cached    ;
  if (typeof localStorage !== 'undefined') {
    const hex = localStorage.getItem(kPersistencePrefix + role);
    if (hex && /^[0-9a-f]{64}$/i.test(hex)) {
      const existing = fromHex(hex);
      secretCache.set(role, existing);
      return existing;
    }
  }
  const fresh = generateSecret();
  secretCache.set(role, fresh);
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(kPersistencePrefix + role, toHex(fresh));
    } catch (e) {
      // storage may be unavailable (private mode); module cache still works
    }
  }
  return fresh;
}

/**
 * Compact identity domain prefixes — MUST match the compiled contract derivations
 * (persistentHash(CompactTypeVector(2, CompactTypeBytes(32)), [domainBytes32, secretBytes32]))
 * Kept as 32-byte, zero-padded arrays exactly like the compiled host code so frontend
 * derived ids equal the on-chain ids for the SAME secret.
 */
const identityDomain = {
  businessRegistry: new Uint8Array([118, 101, 105, 108, 58, 98, 117, 115, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:bus:v1"
  party: new Uint8Array([118, 101, 105, 108, 58, 101, 115, 99, 114, 111, 119, 58, 112, 97, 114, 116, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:escrow:party:v1"
  escrowRelease: new Uint8Array([118, 101, 105, 108, 58, 101, 115, 99, 114, 111, 119, 58, 114, 101, 108, 101, 97, 115, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:escrow:release:v1"
  invoiceIssuer: new Uint8Array([118, 101, 105, 108, 58, 105, 110, 118, 111, 105, 99, 101, 58, 105, 115, 115, 117, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:invoice:issuer:v1"
  invoiceParty: new Uint8Array([118, 101, 105, 108, 58, 105, 110, 118, 111, 105, 99, 101, 58, 112, 97, 114, 116, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:invoice:party:v1"
  seller: new Uint8Array([118, 101, 105, 108, 58, 102, 105, 110, 97, 110, 99, 105, 110, 103, 58, 112, 97, 114, 116, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:financing:party:v1"
  investor: new Uint8Array([118, 101, 105, 108, 58, 105, 110, 118, 101, 115, 116, 111, 114, 58, 105, 100, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:investor:id:v1"
  subject: new Uint8Array([118, 101, 105, 108, 58, 99, 111, 109, 112, 108, 105, 97, 110, 99, 101, 58, 115, 117, 98, 106, 101, 99, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0]), // "veil:compliance:subject:v1"
  complianceAdmin: new Uint8Array([118, 101, 105, 108, 58, 99, 111, 109, 112, 108, 105, 97, 110, 99, 101, 58, 97, 100, 109, 105, 110, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:compliance:admin:v1"
  holder: new Uint8Array([118, 101, 105, 108, 58, 99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 58, 104, 111, 108, 100, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:credential:holder:v1"
  issuer: new Uint8Array([118, 101, 105, 108, 58, 99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 58, 105, 115, 115, 117, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:credential:issuer:v1"
  payer: new Uint8Array([118, 101, 105, 108, 58, 115, 101, 116, 116, 108, 101, 109, 101, 110, 116, 58, 112, 97, 121, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:settlement:payer:v1"
  payee: new Uint8Array([118, 101, 105, 108, 58, 115, 101, 116, 116, 108, 101, 109, 101, 110, 116, 58, 112, 97, 121, 101, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:settlement:payee:v1"
  nonce: new Uint8Array([118, 101, 105, 108, 58, 101, 115, 99, 114, 111, 119, 58, 110, 111, 110, 99, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:escrow:nonce:v1"
  salt: new Uint8Array([118, 101, 105, 108, 58, 105, 110, 118, 111, 105, 99, 101, 58, 115, 97, 108, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:invoice:salt:v1"
  financing: new Uint8Array([118, 101, 105, 108, 58, 102, 105, 110, 97, 110, 99, 105, 110, 103, 58, 115, 97, 108, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:financing:salt:v1"
  credential: new Uint8Array([118, 101, 105, 108, 58, 99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:credential:v1"
  compliance: new Uint8Array([118, 101, 105, 108, 58, 99, 111, 109, 112, 108, 105, 97, 110, 99, 101, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:compliance:v1"
  settlement: new Uint8Array([118, 101, 105, 108, 58, 115, 101, 116, 116, 108, 101, 109, 101, 110, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:settlement:v1"
  delivery: new Uint8Array([118, 101, 105, 108, 58, 101, 115, 99, 114, 111, 119, 58, 100, 101, 108, 105, 118, 101, 114, 121, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:escrow:delivery:v1"
  destination: new Uint8Array([118, 101, 105, 108, 58, 112, 111, 58, 100, 101, 115, 116, 105, 110, 97, 116, 105, 111, 110, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:po:destination:v1"
  order: new Uint8Array([118, 101, 105, 108, 58, 112, 111, 58, 111, 114, 100, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), // "veil:po:order:v1"
} as const; 


/**
 * Individual witnesses for each Compact contract — matches compiled contract expectations
 * BusinessRegistry: getBusinessSecret, getAdminSecret, businessSalt, credentialPreimage
 * PurchaseOrder: getPartySecret, orderSalt, localQuantity, localUnitPrice, localTotalAmount, localDestinationHash
 * Escrow: getPartySecret, releaseSecret, escrowNonce, privateAmount
 * Invoice: localSecretKey, localAmount, localBuyer, localMemo, localSalt
 * Financing: getInvestorSecret, getSellerSecret, financingSalt, localFaceValue, localRequested, localCreditScore, localCreditSalt
 * Compliance: getComplianceSecret, getAdminSecret, complianceSalt, credentialHashWitness, certificationHashWitness, privateAttr1-3
 * CredentialRegistry: getHolderSecret, getIssuerSecret, credentialSalt, credentialIssuedAt
 * Settlement: getSettlementSecret, settlementSalt, localAmount, localPayer, localPayee
 */
function businessSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).businessSalt ?? persistentSecret('business.salt');
  return [{ ...ps, businessSalt: v }, v];
}
function credentialPreimageWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).credentialPreimage ?? persistentSecret('credential.preimage');
  return [{ ...ps, credentialPreimage: v }, v];
}
function orderSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).orderSalt ?? persistentSecret('order.salt');
  return [{ ...ps, orderSalt: v }, v];
}
function localQuantityWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localQuantity ?? 10000n;
  return [{ ...ps, localQuantity: v }, v];
}
function localUnitPriceWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localUnitPrice ?? 5000n;
  return [{ ...ps, localUnitPrice: v }, v];
}
function localTotalAmountWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localTotalAmount ?? 50000n;
  return [{ ...ps, localTotalAmount: v }, v];
}
function localDestinationHashWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localDestinationHash ?? persistentSecret('order.destination');
  return [{ ...ps, localDestinationHash: v }, v];
}
function escrowNonceWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).escrowNonce ?? persistentSecret('escrow.nonce');
  return [{ ...ps, escrowNonce: v }, v];
}
function releaseSecretWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).releaseSecret ?? persistentSecret('escrow.release');
  return [{ ...ps, releaseSecret: v }, v];
}
function privateAmountWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).privateAmount ?? 50000n;
  return [{ ...ps, privateAmount: v }, v];
}
function localSecretKeyWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localSecretKey ?? persistentSecret('invoice.key');
  return [{ ...ps, localSecretKey: v }, v];
}
function localAmountWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localAmount ?? 18500n;
  return [{ ...ps, localAmount: v }, v];
}
function localBuyerWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localBuyer ?? persistentSecret('invoice.buyer');
  return [{ ...ps, localBuyer: v }, v];
}
function localMemoWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localMemo ?? persistentSecret('invoice.memo');
  return [{ ...ps, localMemo: v }, v];
}
function localSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localSalt ?? persistentSecret('invoice.salt');
  return [{ ...ps, localSalt: v }, v];
}
function getInvestorSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).investorSecret ?? persistentSecret('financing.investor');
  return [{ ...ps, investorSecret: v }, { bytes: v }];
}
function getSellerSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).sellerSecret ?? persistentSecret('financing.seller');
  return [{ ...ps, sellerSecret: v }, { bytes: v }];
}
function financingSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).financingSalt ?? persistentSecret('financing.salt');
  return [{ ...ps, financingSalt: v }, v];
}
function localFaceValueWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localFaceValue ?? 50000n;
  return [{ ...ps, localFaceValue: v }, v];
}
function localRequestedWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localRequested ?? 45000n;
  return [{ ...ps, localRequested: v }, v];
}
function localCreditScoreWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localCreditScore ?? 720n;
  return [{ ...ps, localCreditScore: v }, v];
}
function localCreditSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localCreditSalt ?? persistentSecret('financing.creditSalt').slice(0, 16);
  // pad to 16 bytes for Bytes<16>
  const b16 = v.length === 16 ? v : v.slice(0, 16);
  return [{ ...ps, localCreditSalt: b16 }, b16];
}
function getComplianceSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).complianceSecret ?? persistentSecret('compliance.subject');
  return [{ ...ps, complianceSecret: v }, { bytes: v }];
}
function complianceSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).complianceSalt ?? persistentSecret('compliance.salt');
  return [{ ...ps, complianceSalt: v }, v];
}
function credentialHashWitnessFn(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).credentialHashWitness ?? generateSecret();
  return [{ ...ps, credentialHashWitness: v }, v];
}
function certificationHashWitnessFn(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).certificationHashWitness ?? generateSecret();
  return [{ ...ps, certificationHashWitness: v }, v];
}
function privateAttr1Witness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).privateAttr1 ?? 85n;
  return [{ ...ps, privateAttr1: v }, v];
}
function privateAttr2Witness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).privateAttr2 ?? 90n;
  return [{ ...ps, privateAttr2: v }, v];
}
function privateAttr3Witness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).privateAttr3 ?? 75n;
  return [{ ...ps, privateAttr3: v }, v];
}
function getHolderSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).holderSecret ?? persistentSecret('credential.holder');
  return [{ ...ps, holderSecret: v }, { bytes: v }];
}
function getIssuerSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).issuerSecret ?? persistentSecret('credential.issuer');
  return [{ ...ps, issuerSecret: v }, { bytes: v }];
}
function credentialSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).credentialSalt ?? persistentSecret('credential.salt');
  return [{ ...ps, credentialSalt: v }, v];
}
function credentialIssuedAtWitness(ctx: { privateState: any }): [any, bigint] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).credentialIssuedAt ?? BigInt(Date.now());
  return [{ ...ps, credentialIssuedAt: v }, v];
}
function getSettlementSecretWitness(ctx: { privateState: any }): [any, { bytes: Uint8Array }] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).settlementSecret ?? persistentSecret('settlement.party');
  return [{ ...ps, settlementSecret: v }, { bytes: v }];
}
function settlementSaltWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).settlementSalt ?? persistentSecret('settlement.salt');
  return [{ ...ps, settlementSalt: v }, v];
}
function localPayerWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localPayer ?? persistentSecret('settlement.payer');
  return [{ ...ps, localPayer: v }, v];
}
function localPayeeWitness(ctx: { privateState: any }): [any, Uint8Array] {
  const ps = ctx.privateState ?? {};
  const v = (ps as any).localPayee ?? persistentSecret('settlement.payee');
  return [{ ...ps, localPayee: v }, v];
}

/**
 * Create all witnesses for a contract — covers all 8 VeilCommerce contracts
 */
export function createWitnesses() {
  return {
    // BusinessRegistry
    getBusinessSecret: businessSecretWitness,
    getAdminSecret: adminSecretWitness,
    businessSalt: businessSaltWitness,
    credentialPreimage: credentialPreimageWitness,
    // PurchaseOrder
    getPartySecret: partySecretWitness,
    orderSalt: orderSaltWitness,
    localQuantity: localQuantityWitness,
    localUnitPrice: localUnitPriceWitness,
    localTotalAmount: localTotalAmountWitness,
    localDestinationHash: localDestinationHashWitness,
    // Escrow
    escrowNonce: escrowNonceWitness,
    releaseSecret: releaseSecretWitness,
    privateAmount: privateAmountWitness,
    // Invoice
    localSecretKey: localSecretKeyWitness,
    localAmount: localAmountWitness,
    localBuyer: localBuyerWitness,
    localMemo: localMemoWitness,
    localSalt: localSaltWitness,
    // Financing
    getInvestorSecret: getInvestorSecretWitness,
    getSellerSecret: getSellerSecretWitness,
    financingSalt: financingSaltWitness,
    localFaceValue: localFaceValueWitness,
    localRequested: localRequestedWitness,
    localCreditScore: localCreditScoreWitness,
    localCreditSalt: localCreditSaltWitness,
    // Compliance
    getComplianceSecret: getComplianceSecretWitness,
    complianceSalt: complianceSaltWitness,
    credentialHashWitness: credentialHashWitnessFn,
    certificationHashWitness: certificationHashWitnessFn,
    privateAttr1: privateAttr1Witness,
    privateAttr2: privateAttr2Witness,
    privateAttr3: privateAttr3Witness,
    // CredentialRegistry
    getHolderSecret: getHolderSecretWitness,
    getIssuerSecret: getIssuerSecretWitness,
    credentialSalt: credentialSaltWitness,
    credentialIssuedAt: credentialIssuedAtWitness,
    // Settlement
    getSettlementSecret: getSettlementSecretWitness,
    settlementSalt: settlementSaltWitness,
    localPayer: localPayerWitness,
    localPayee: localPayeeWitness,
    // Legacy grouped (kept for compat, not used by Contract constructor)
    getEscrowSecrets: escrowSecretWitnesses,
    getInvoiceSecrets: invoiceSecretWitnesses,
    getFinancingSecrets: financingSecretWitnesses,
    getComplianceSecrets: complianceSecretWitnesses,
    getCredentialSecrets: credentialSecretWitnesses,
    getSettlementSecrets: settlementSecretWitnesses,
  };
}

/**
 * Persist secret to private state after deploy
 */
export async function persistSecret(
  context: { providers: { privateStateProvider: any } },
  contractAddress: string
): Promise<void> {
  const { privateStateProvider } = context.providers;
  // Store contract address and any derived secrets
  await privateStateProvider.setPrivateState(contractAddress, {
    contractAddress,
    deployedAt: Date.now(),
  });
}