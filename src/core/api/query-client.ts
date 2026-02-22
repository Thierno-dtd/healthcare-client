import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min avant refetch
      gcTime: 10 * 60 * 1000,          // 10 min en cache
      retry: 2,                         // 2 retries sur erreur
      refetchOnWindowFocus: false,      // Pas de refetch auto sur focus
    },
    mutations: {
      retry: 1,
    },
  },
});
