// =============================================================================
// VeilCommerce — Payload Encryption (Optional)
// -----------------------------------------------------------------------------
// Encrypt on-chain strings using a key derived deterministically from wallet signature
// Requires `api.signData`. Key is scoped to wallet + network + contract.
// =============================================================================

// Derive a scoped AES-GCM key from the user's wallet signature.
// Key is deterministic: same wallet + same contract = same key across sessions.
export async function deriveContractKey(
  api: any,
  networkId: string,
  contractAddress: string,
): Promise<CryptoKey> {
  const message = `midnight-app-key|${networkId}|${contractAddress}`;
  const signature = await api.signData(message, { encoding: 'text' });
  if (!signature) throw new Error('signData returned empty — cannot derive encryption key');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(signature),
    'HKDF',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(`midnight-salt|${networkId}`),
      info: new TextEncoder().encode(`midnight-contract|${contractAddress}`),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// Encrypt a string → versioned envelope: "enc:v1:<base64url(iv+ciphertext)>"
export async function encryptPayload(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return 'enc:v1:' + btoa(String.fromCharCode(...combined)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Decrypt a versioned envelope → original string
export async function decryptPayload(key: CryptoKey, envelope: string): Promise<string> {
  if (!envelope.startsWith('enc:v1:')) throw new Error('Not an encrypted payload');
  const b64 = envelope.slice(7).replace(/-/g, '+').replace(/_/g, '/');
  const combined = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plain);
}

export const isEncryptedPayload = (s: string) => typeof s === 'string' && s.startsWith('enc:v1:');
