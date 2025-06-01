import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* باقي المكونات */}
    </QueryClientProvider>
  );
}

export default App;
