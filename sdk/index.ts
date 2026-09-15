// =============================================================================
// VeilCommerce SDK — Main Entry Point
// -----------------------------------------------------------------------------
// Unified TypeScript SDK for all VeilCommerce contract interactions.
// =============================================================================

// Contract ABIs / Types
export * from './business';
export * from './orders';
export * from './escrow';
export * from './invoices';
export * from './financing';
export * from './compliance';
export * from './proofs';
export * from './credentials';
export * from './settlement';

// Re-export commonly used types
export type {
  BusinessSecret,
  RegisterBusinessParams,
  VerifyBusinessResult,
  ProveEligibleParams,
  ProveAuthorizationParams,
} from './business';

export type {
  OrderStatus,
  PartySecret,
  OrderRecord,
  OrderTerms,
  CreateOrderParams,
  MarkShippedParams,
  CancelOrderParams,
} from './orders';

export type {
  EscrowState,
  EscrowRecord,
  CreateEscrowParams,
  ReleaseParams,
} from './escrow';

export type {
  InvoiceStatus,
  InvoiceRecord,
  InvoiceTerms,
  IssueInvoiceParams,
  AcknowledgeParams,
  VerifyCommitmentParams,
} from './invoices';

export type {
  FinancingStatus,
  FinancingRecord,
  CreditScoreData,
  RequestFinancingParams,
  FundInvoiceParams,
  RepayParams,
  VerifyRiskParams,
} from './financing';

export type {
  ComplianceStatus,
  DisclosureLevel,
  ComplianceRecord,
  AttestComplianceParams,
  EvaluateComplianceParams,
  GrantDisclosureParams,
} from './compliance';

export type {
  FundsProofInput,
  FundsProofOutput,
  InventoryProofInput,
  InventoryProofOutput,
  ComplianceProofInput,
  ComplianceProofOutput,
  DeliveryProofInput,
  DeliveryProofOutput,
  FinancingProofInput,
  FinancingProofOutput,
} from './proofs';

export type {
  CredentialType,
  CredentialStatus,
  CredentialRecord,
  IssueCredentialParams,
  ProveCredentialParams,
} from './credentials';

export type {
  SettlementStatus,
  SettlementRecord,
  SettlementTerms,
  SettleTradeParams,
  SettleEscrowLegParams,
} from './settlement';

import { createBusinessSDK } from './business';
import { createOrdersSDK } from './orders';
import { createEscrowSDK } from './escrow';
import { createInvoicesSDK } from './invoices';
import { createFinancingSDK } from './financing';
import { createComplianceSDK } from './compliance';
import { createProofsSDK } from './proofs';
import { createCredentialsSDK } from './credentials';
import { createSettlementSDK } from './settlement';

export interface VeilCommerceSDK {
  business: ReturnType<typeof createBusinessSDK>;
  orders: ReturnType<typeof createOrdersSDK>;
  escrow: ReturnType<typeof createEscrowSDK>;
  invoices: ReturnType<typeof createInvoicesSDK>;
  financing: ReturnType<typeof createFinancingSDK>;
  compliance: ReturnType<typeof createComplianceSDK>;
  proofs: ReturnType<typeof createProofsSDK>;
  credentials: ReturnType<typeof createCredentialsSDK>;
  settlement: ReturnType<typeof createSettlementSDK>;
}

export interface ContractInstances {
  businessRegistry: any;
  purchaseOrder: any;
  escrow: any;
  invoice: any;
  financing: any;
  compliance: any;
  credentialRegistry: any;
  settlement: any;
}

export interface WitnessProviders {
  business: any;
  orders: any;
  escrow: any;
  invoices: any;
  financing: any;
  compliance: any;
  credentials: any;
  settlement: any;
}

/**
 * Create the full VeilCommerce SDK with all contract instances.
 * 
 * @param contracts - Object containing all compiled contract instances
 * @param witnesses - Object containing all witness providers
 * @returns Complete SDK with all modules
 */
export function createVeilCommerceSDK(
  contracts: ContractInstances,
  witnesses: WitnessProviders
): VeilCommerceSDK {
  return {
    business: createBusinessSDK(contracts.businessRegistry, witnesses.business),
    orders: createOrdersSDK(contracts.purchaseOrder, witnesses.orders),
    escrow: createEscrowSDK(contracts.escrow, witnesses.escrow),
    invoices: createInvoicesSDK(contracts.invoice, witnesses.invoices),
    financing: createFinancingSDK(contracts.financing, witnesses.financing),
    compliance: createComplianceSDK(contracts.compliance, witnesses.compliance),
    proofs: createProofsSDK(),
    credentials: createCredentialsSDK(contracts.credentialRegistry, witnesses.credentials),
    settlement: createSettlementSDK(contracts.settlement, witnesses.settlement),
  };
}