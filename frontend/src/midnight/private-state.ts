// VeilCommerce — Private State Provider (Real, No Mocks)
// Canonical implementation from templates/locker-dapp/lib/midnight.ts
// Re-exports lib/midnight for consistency; keeps singleton for legacy imports.

export { createPrivateStateProvider } from '../lib/midnight';
import { createPrivateStateProvider } from '../lib/midnight';

// Singleton matching old API but backed by canonical provider
const singleton = createPrivateStateProvider() as any;

// Extend singleton to support legacy getPrivateState/setPrivateState aliases
if (!singleton.getPrivateState) {
  singleton.getPrivateState = singleton.get.bind(singleton);
  singleton.setPrivateState = singleton.set.bind(singleton);
  singleton.deletePrivateState = singleton.remove.bind(singleton);
}

export const privateStateProvider = singleton;
export type PrivateStateProvider = ReturnType<typeof createPrivateStateProvider>;
