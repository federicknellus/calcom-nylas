'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Qualcosa è andato storto!</h2>
      <p>Errore: {error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          background: '#0070f3',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Riprova
      </button>
    </div>
  );
}
