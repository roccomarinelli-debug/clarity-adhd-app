/**
 * Client-side encryption using Web Crypto API
 * - PBKDF2 for key derivation from passphrase
 * - AES-GCM for authenticated encryption
 */

const SALT_KEY = 'clarity_salt';
const VERIFY_KEY = 'clarity_verify';
const PBKDF2_ITERATIONS = 100000;

// Generate a random salt
async function generateSalt(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Derive encryption key from passphrase using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Convert Uint8Array to base64
function arrayToBase64(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr));
}

// Convert base64 to Uint8Array
function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

// Encrypt data
export async function encrypt(data: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(data)
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return arrayToBase64(combined);
}

// Decrypt data
export async function decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
  const combined = base64ToArray(encryptedData);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

// Initialize encryption with passphrase (first time setup)
export async function initializeEncryption(passphrase: string): Promise<CryptoKey> {
  const salt = await generateSalt();
  const key = await deriveKey(passphrase, salt);

  // Store salt for future key derivation
  localStorage.setItem(SALT_KEY, arrayToBase64(salt));

  // Store encrypted verification token to validate passphrase later
  const verifyToken = await encrypt('clarity_verified', key);
  localStorage.setItem(VERIFY_KEY, verifyToken);

  return key;
}

// Unlock with existing passphrase
export async function unlockEncryption(passphrase: string): Promise<CryptoKey | null> {
  const saltBase64 = localStorage.getItem(SALT_KEY);
  const verifyToken = localStorage.getItem(VERIFY_KEY);

  if (!saltBase64 || !verifyToken) {
    return null;
  }

  const salt = base64ToArray(saltBase64);
  const key = await deriveKey(passphrase, salt);

  try {
    const decrypted = await decrypt(verifyToken, key);
    if (decrypted === 'clarity_verified') {
      return key;
    }
  } catch {
    // Decryption failed - wrong passphrase
  }

  return null;
}

// Check if encryption is set up
export function isEncryptionSetup(): boolean {
  return localStorage.getItem(SALT_KEY) !== null;
}

// Encrypted storage wrapper
export class EncryptedStorage {
  private key: CryptoKey;

  constructor(key: CryptoKey) {
    this.key = key;
  }

  async getItem(storageKey: string): Promise<string | null> {
    const encrypted = localStorage.getItem(`enc_${storageKey}`);
    if (!encrypted) return null;

    try {
      return await decrypt(encrypted, this.key);
    } catch {
      return null;
    }
  }

  async setItem(storageKey: string, value: string): Promise<void> {
    const encrypted = await encrypt(value, this.key);
    localStorage.setItem(`enc_${storageKey}`, encrypted);
  }

  removeItem(storageKey: string): void {
    localStorage.removeItem(`enc_${storageKey}`);
  }
}

// Migrate unencrypted data to encrypted storage
export async function migrateToEncrypted(storage: EncryptedStorage): Promise<void> {
  const keysToMigrate = ['flowStateData', 'epicsData', 'weeklyGoals', 'dailyTasks'];

  for (const key of keysToMigrate) {
    const unencrypted = localStorage.getItem(key);
    if (unencrypted) {
      await storage.setItem(key, unencrypted);
      localStorage.removeItem(key);
    }
  }
}
