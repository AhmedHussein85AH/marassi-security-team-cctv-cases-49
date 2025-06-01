import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useIncidents = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await axios.get('/api/incidents/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    incidents: data?.incidents || [],
    stats: data?.stats || {},
    chartData: data?.chartData || {
      typeData: [],
      statusData: [],
      severityData: [],
      dayData: []
    },
    isLoading,
    error
  };
};
