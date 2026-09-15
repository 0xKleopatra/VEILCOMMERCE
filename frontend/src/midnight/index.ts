// VeilCommerce — Midnight Integration Exports

// Providers
export { createContractProviders, createPatchedPublicDataProvider, createPrivateStateProvider } from './providers';

// Witnesses
export {
  businessSecretWitness,
  partySecretWitness,
  escrowSecretWitnesses,
  invoiceSecretWitnesses,
  financingSecretWitnesses,
  complianceSecretWitnesses,
  credentialSecretWitnesses,
  settlementSecretWitnesses,
  adminSecretWitness,
  createWitnesses,
  persistSecret,
} from './witnesses';

// Contract deployment & interaction
export {
  loadContractModule,
  createCompiledContract,
  deployContract,
  waitForContractIndexed,
  joinContract,
  type ContractInstance,
  type VeilCommerceContracts,
  createVeilCommerceContracts,
} from './contract';

// VeilCommerce Manager — smart integration of 11 repos (8 contracts)
export {
  veilManager,
  VeilCommerceManager,
  loadVeilContractModule,
  createVeilCompiledContract,
  queryVeilLedger,
  VEIL_CONTRACTS,
  type VeilContractName,
  type VeilCommerceDeployment,
} from './veilcommerce-manager';

// Private state
export { privateStateProvider, createPrivateStateProvider, type PrivateStateProvider } from './private-state';

// Wallet hook
export { useMidnightWallet, type MidnightWalletState, MIDNIGHT_PREPROD_CONFIG } from '../hooks/useMidnightWallet';

// Contract hook
export { useMidnightContract, type ContractState, type DeployedContract } from '../hooks/useContract';

// Types
export type { WalletAPI } from '@midnight-ntwrk/wallet-sdk';
export type { PublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';