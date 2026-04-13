'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  const [fetchResult, setFetchResult] = useState<string>('Not fetched');
  const [fetchError, setFetchError] = useState<string>('');

  useEffect(() => {
    setMounted(true);

    // Test 1: Direct fetch
    fetch('/api/clients')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFetchResult(`OK - ${data.length} clients`);
      })
      .catch((err) => {
        setFetchError(`Fetch error: ${err.message}`);
      });
  }, []);

  // Test 2: React Query
  const { data: rqData, isLoading: rqLoading, error: rqError, dataUpdatedAt } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetch('/api/clients').then(r => r.json()),
  });

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', fontSize: 14 }}>
      <h1>Debug Page</h1>

      <h2>Environment</h2>
      <p>typeof window: <strong>{typeof window}</strong></p>
      <p>Mounted (useEffect fired): <strong>{mounted ? 'YES' : 'NO'}</strong></p>
      <p>Next.js: <strong>{process.env.NODE_ENV}</strong></p>

      <h2>Test 1: Direct fetch(/api/clients)</h2>
      <p>Result: <strong style={{ color: fetchError ? 'red' : 'green' }}>{fetchResult}</strong></p>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}

      <h2>Test 2: React Query useQuery</h2>
      <p>Loading: <strong>{rqLoading ? 'YES' : 'NO'}</strong></p>
      <p>Data: <strong>{rqData ? `${rqData.length} clients` : 'null'}</strong></p>
      <p>dataUpdatedAt: <strong>{dataUpdatedAt || 'never'}</strong></p>
      {rqError && <p style={{ color: 'red' }}>Error: {rqError.message}</p>}

      <h2>Test 3: Clients data</h2>
      <pre style={{ background: '#f0f0f0', padding: 10, maxHeight: 300, overflow: 'auto' }}>
        {rqData ? JSON.stringify(rqData.slice(0, 2).map(c => ({
          id: c.id,
          businessName: c.businessName,
          status: c.status,
        })), null, 2) : 'No data from React Query'}
      </pre>
    </div>
  );
}
