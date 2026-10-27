"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchInterval: 30000, // 30 seconds auto-refresh
            refetchOnWindowFocus: true,
            staleTime: 10000,
            retry: 3, // Retry 3 times if it fails
            retryDelay: 5000, // Wait 5 seconds between retries
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
