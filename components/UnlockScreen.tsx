'use client';

import { useState } from 'react';
import { useEncryption } from '@/lib/encryption-context';

export default function UnlockScreen() {
  const { isSetup, unlock, setup } = useEncryption();
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (isSetup) {
      // Unlock existing vault
      const success = await unlock(passphrase);
      if (!success) {
        setError('Incorrect passphrase. Please try again.');
      }
    } else {
      // First time setup
      if (passphrase.length < 8) {
        setError('Passphrase must be at least 8 characters.');
        setIsSubmitting(false);
        return;
      }
      if (passphrase !== confirmPassphrase) {
        setError('Passphrases do not match.');
        setIsSubmitting(false);
        return;
      }
      const success = await setup(passphrase);
      if (!success) {
        setError('Failed to set up encryption. Please try again.');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSetup ? 'Unlock Clarity' : 'Secure Your Data'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isSetup
              ? 'Enter your passphrase to access your data'
              : 'Create a passphrase to encrypt your personal data'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="passphrase"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Passphrase
            </label>
            <input
              type="password"
              id="passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              placeholder={isSetup ? 'Enter your passphrase' : 'Create a secure passphrase'}
              autoFocus
              autoComplete={isSetup ? 'current-password' : 'new-password'}
            />
          </div>

          {!isSetup && (
            <div>
              <label
                htmlFor="confirmPassphrase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Passphrase
              </label>
              <input
                type="password"
                id="confirmPassphrase"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                placeholder="Confirm your passphrase"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !passphrase}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {isSetup ? 'Unlocking...' : 'Setting up...'}
              </span>
            ) : isSetup ? (
              'Unlock'
            ) : (
              'Create Secure Vault'
            )}
          </button>
        </form>

        {!isSetup && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-medium text-blue-900 text-sm mb-2">
              Why encrypt your data?
            </h3>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>Your tasks and goals are encrypted with AES-256</li>
              <li>Only you can access your data with your passphrase</li>
              <li>Data stays on your device, fully encrypted</li>
            </ul>
          </div>
        )}

        {isSetup && (
          <p className="mt-6 text-center text-xs text-gray-400">
            Forgot your passphrase? Data cannot be recovered without it.
          </p>
        )}
      </div>
    </div>
  );
}
