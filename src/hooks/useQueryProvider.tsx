import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

// Criando um cliente de consulta com configurações padrão
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos (antes chamado cacheTime)
    },
    mutations: {}
  }
});

// Provedor do contexto do React Query
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Hook personalizado para invalidar cache de consultas de forma segura
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return (keys: string | string[]) => {
    const keyArray = Array.isArray(keys) ? keys : [keys];
    keyArray.forEach(key => queryClient.invalidateQueries({ queryKey: [key] }));
  };
}

// Hook para consultas com tratamento de erro e loading padronizado
export function useDataQuery<TData>(
  key: string | string[],
  queryFn: () => Promise<TData>,
  options = {}
) {
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery<TData, Error>({
    queryKey,
    queryFn,
    ...options,
  });
}

// Hook para mutações com tratamento de erro, loading e atualizações de cache
export function useDataMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  {
    onSuccessFn,
    invalidateQueries = [],
    ...options
  }: {
    onSuccessFn?: (data: TData, variables: TVariables) => void;
    invalidateQueries?: string[];
    [key: string]: any;
  } = {}
) {
  const queryClient = useQueryClient();
  
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      // Invalidar caches conforme necessário
      invalidateQueries.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      
      // Executa função de sucesso personalizada se fornecida
      if (onSuccessFn) {
        onSuccessFn(data, variables);
      }
      
      // Notificação padrão de sucesso
      toast({
        title: "Operação realizada com sucesso",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      // Notificação de erro
      toast({
        title: "Erro ao salvar dados",
        description: error.message || "Ocorreu um erro ao salvar os dados.",
        variant: "destructive",
      });
    },
    ...options,
  });
}

// Exporta utilitários do React Query para uso direto
export { useQuery, useMutation, useQueryClient }; 