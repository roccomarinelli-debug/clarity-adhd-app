'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEncryption } from './encryption-context';

export function useEncryptedStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const { storage, isUnlocked } = useEncryption();
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial value from encrypted storage
  useEffect(() => {
    if (!storage || !isUnlocked) {
      setIsLoading(false);
      return;
    }

    const loadValue = async () => {
      try {
        const item = await storage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error loading encrypted data for key "${key}":`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key, storage, isUnlocked]);

  // Save value to encrypted storage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const newValue = value instanceof Function ? value(prev) : value;

        // Save to encrypted storage asynchronously
        if (storage) {
          storage.setItem(key, JSON.stringify(newValue)).catch((error) => {
            console.error(`Error saving encrypted data for key "${key}":`, error);
          });
        }

        return newValue;
      });
    },
    [key, storage]
  );

  return [storedValue, setValue, isLoading];
}
