'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EncryptedStorage,
  initializeEncryption,
  unlockEncryption,
  isEncryptionSetup,
  migrateToEncrypted,
} from './crypto';

interface EncryptionContextType {
  isUnlocked: boolean;
  isSetup: boolean;
  isLoading: boolean;
  storage: EncryptedStorage | null;
  unlock: (passphrase: string) => Promise<boolean>;
  setup: (passphrase: string) => Promise<boolean>;
  lock: () => void;
}

const EncryptionContext = createContext<EncryptionContextType | null>(null);

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [storage, setStorage] = useState<EncryptedStorage | null>(null);

  useEffect(() => {
    // Check if encryption is already set up
    setIsSetup(isEncryptionSetup());
    setIsLoading(false);
  }, []);

  const unlock = useCallback(async (passphrase: string): Promise<boolean> => {
    const key = await unlockEncryption(passphrase);
    if (key) {
      const encStorage = new EncryptedStorage(key);
      setStorage(encStorage);
      setIsUnlocked(true);
      return true;
    }
    return false;
  }, []);

  const setup = useCallback(async (passphrase: string): Promise<boolean> => {
    try {
      const key = await initializeEncryption(passphrase);
      const encStorage = new EncryptedStorage(key);

      // Migrate any existing unencrypted data
      await migrateToEncrypted(encStorage);

      setStorage(encStorage);
      setIsSetup(true);
      setIsUnlocked(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    setStorage(null);
    setIsUnlocked(false);
  }, []);

  return (
    <EncryptionContext.Provider
      value={{
        isUnlocked,
        isSetup,
        isLoading,
        storage,
        unlock,
        setup,
        lock,
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
}
