// VeilCommerce — Hex Encoding Utilities

/**
 * Convert Uint8Array to hex string
 */
export function toHex(bytes: Uint8Array | ArrayBuffer): string {
  const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(uint8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function fromHex(hex: string): Uint8Array {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  if (cleanHex.length % 2 !== 0) {
    throw new Error('Invalid hex string: odd length');
  }

  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert bigint to 32-byte hex (for Compact Bytes<32>)
 */
export function bigintToBytes32(value: bigint): Uint8Array {
  const bytes = new Uint8Array(32);
  for (let i = 31; i >= 0; i--) {
    bytes[i] = Number(value & 0xffn);
    value >>= 8n;
  }
  return bytes;
}

/**
 * Convert 32-byte array to bigint
 */
export function bytes32ToBigint(bytes: Uint8Array): bigint {
  if (bytes.length !== 32) {
    throw new Error('Expected 32 bytes');
  }
  let value = 0n;
  for (let i = 0; i < 32; i++) {
    value = (value << 8n) | BigInt(bytes[i]);
  }
  return value;
}

/**
 * Pad or truncate to 32 bytes
 */
export function pad32(input: Uint8Array | string): Uint8Array {
  const bytes = typeof input === 'string' ? fromHex(input) : input;
  if (bytes.length === 32) return bytes;
  if (bytes.length > 32) return bytes.slice(0, 32);
  const padded = new Uint8Array(32);
  padded.set(bytes, 32 - bytes.length);
  return padded;
}

/**
 * Generate random bytes
 */
export function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * Hash string to 32 bytes (simple hash for demo)
 */
export async function hashString(str: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

/**
 * Convert various types to Uint8Array for Compact
 */
export function toBytes32(value: string | Uint8Array | number | bigint): Uint8Array {
  if (value instanceof Uint8Array) {
    return pad32(value);
  }
  if (typeof value === 'string') {
    if (value.startsWith('0x')) return fromHex(value);
    return pad32(new TextEncoder().encode(value));
  }
  if (typeof value === 'number') {
    return bigintToBytes32(BigInt(value));
  }
  if (typeof value === 'bigint') {
    return bigintToBytes32(value);
  }
  throw new Error(`Cannot convert ${typeof value} to Bytes32`);
}

/**
 * Format bytes for display (shortened)
 */
export function formatBytes(bytes: Uint8Array, length = 8): string {
  const hex = toHex(bytes);
  if (hex.length <= length * 2) return hex;
  return `${hex.slice(0, length)}...${hex.slice(-length)}`;
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (address.length <= 20) return address;
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}