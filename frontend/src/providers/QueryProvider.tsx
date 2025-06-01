import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from '@/hooks/use-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "خطأ في تحميل البيانات",
          description: error?.message || "حدث خطأ غير متوقع",
        });
      },
    },
    mutations: {
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "خطأ في العملية",
          description: error?.message || "حدث خطأ غير متوقع",
        });
      },
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
} 