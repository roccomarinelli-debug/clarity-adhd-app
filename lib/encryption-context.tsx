'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EncryptedStorage,
  initializeEncryption,
  unlockEncryption,
  isEncryptionSetup,
  migrateToEncrypted,
} from './crypto';

const REMEMBER_KEY = 'clarity_remember';

interface EncryptionContextType {
  isUnlocked: boolean;
  isSetup: boolean;
  isLoading: boolean;
  storage: EncryptedStorage | null;
  unlock: (passphrase: string, remember?: boolean) => Promise<boolean>;
  setup: (passphrase: string, remember?: boolean) => Promise<boolean>;
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
    const setup = isEncryptionSetup();
    setIsSetup(setup);

    // Try auto-unlock if remembered
    if (setup) {
      const remembered = localStorage.getItem(REMEMBER_KEY);
      if (remembered) {
        unlockEncryption(remembered).then((key) => {
          if (key) {
            const encStorage = new EncryptedStorage(key);
            setStorage(encStorage);
            setIsUnlocked(true);
          } else {
            // Invalid stored passphrase, clear it
            localStorage.removeItem(REMEMBER_KEY);
          }
          setIsLoading(false);
        });
        return;
      }
    }
    setIsLoading(false);
  }, []);

  const unlock = useCallback(async (passphrase: string, remember?: boolean): Promise<boolean> => {
    const key = await unlockEncryption(passphrase);
    if (key) {
      const encStorage = new EncryptedStorage(key);
      setStorage(encStorage);
      setIsUnlocked(true);
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, passphrase);
      }
      return true;
    }
    return false;
  }, []);

  const setup = useCallback(async (passphrase: string, remember?: boolean): Promise<boolean> => {
    try {
      const key = await initializeEncryption(passphrase);
      const encStorage = new EncryptedStorage(key);

      // Migrate any existing unencrypted data
      await migrateToEncrypted(encStorage);

      setStorage(encStorage);
      setIsSetup(true);
      setIsUnlocked(true);
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, passphrase);
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    setStorage(null);
    setIsUnlocked(false);
    localStorage.removeItem(REMEMBER_KEY);
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
