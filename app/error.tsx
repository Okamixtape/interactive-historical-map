'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log l'erreur dans un service de monitoring (Sentry, etc.)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-cream p-4">
      <div className="max-w-md w-full bg-white border-2 border-heritage-gold/40 rounded-lg shadow-vintage-lg p-8 text-center">
        {/* Icône d'erreur */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Message d'erreur */}
        <h2 className="text-2xl font-serif font-bold text-heritage-bordeaux mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-heritage-ink mb-6 font-serif">
          Nous sommes désolés, une erreur inattendue s'est produite. Veuillez réessayer.
        </p>

        {/* Détails de l'erreur (dev uniquement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-left">
            <p className="text-xs font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-red-600 mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-heritage-bordeaux text-heritage-cream rounded border-2 border-heritage-gold/40 hover:bg-heritage-ink hover:shadow-vintage-lg transition-all font-serif font-medium"
          >
            Réessayer
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-white text-heritage-bordeaux rounded border-2 border-heritage-gold/40 hover:bg-heritage-cream hover:shadow-vintage transition-all font-serif font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
