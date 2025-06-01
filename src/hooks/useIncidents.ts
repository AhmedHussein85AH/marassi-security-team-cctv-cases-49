import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useIncidentStore from '@/stores/incidents';
import { Incident } from '@/types/incident';
import { toast } from '@/hooks/use-toast';
import { incidentService } from '@/services/incidentService';

// أنواع البيانات للشارت
interface ChartData {
  dailyIncidents: { date: string; count: number }[];
  statusCounts: { status: string; count: number }[];
  typeCounts: { type: string; count: number }[];
}

// أيام الأسبوع بالعربية
const ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// الحالات الممكنة للبلاغات
const POSSIBLE_STATUSES = ["جديد", "قيد المعالجة", "معلق", "تم المعالجة"];

export const useIncidents = () => {
  const queryClient = useQueryClient();
  const { incidents, addIncident, updateIncident, deleteIncident } = useIncidentStore();

  // تحضير بيانات الشارت
  const chartData = useMemo<ChartData>(() => {
    // تجميع البلاغات حسب اليوم
    const dailyCounts = incidents.reduce((acc, incident) => {
      const date = incident.date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // تحويل البيانات إلى مصفوفة للشارت
    const dailyIncidents = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));

    // تجميع البلاغات حسب الحالة
    const statusCounts = POSSIBLE_STATUSES.map(status => ({
      status,
      count: incidents.filter(incident => incident.status === status).length,
    }));

    // تجميع البلاغات حسب النوع
    const typeCounts = incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      dailyIncidents,
      statusCounts,
      typeCounts: Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
      })),
    };
  }, [incidents]);

  // إضافة بلاغ جديد
  const handleAddIncident = async (incident: Omit<Incident, "id">) => {
    try {
      const newIncident = await incidentService.createIncident(incident);
      addIncident(newIncident);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    } catch (error) {
      console.error("Error adding incident:", error);
      throw error;
    }
  };

  // تحديث بلاغ
  const handleUpdateIncident = async (id: string, updates: Partial<Incident>) => {
    try {
      const updatedIncident = await incidentService.updateIncident(id, updates);
      updateIncident(id, updatedIncident);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    } catch (error) {
      console.error("Error updating incident:", error);
      throw error;
    }
  };

  // حذف بلاغ
  const handleDeleteIncident = async (id: string) => {
    try {
      await incidentService.deleteIncident(id);
      deleteIncident(id);
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    } catch (error) {
      console.error("Error deleting incident:", error);
      throw error;
    }
  };

  return {
    incidents,
    chartData,
    addIncident: handleAddIncident,
    updateIncident: handleUpdateIncident,
    deleteIncident: handleDeleteIncident,
  };
};

export function useIncident(id: string) {
  const queryClient = useQueryClient();

  const { data: incident, isLoading, error } = useQuery({
    queryKey: ['incidents', id],
    queryFn: () => incidentService.getIncidentById(id),
  });

  const updateIncident = useMutation({
    mutationFn: (data: Partial<Incident>) =>
      incidentService.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents', id] });
      toast({
        title: "تم تحديث البلاغ",
        description: "تم تحديث البلاغ بنجاح",
      });
    },
  });

  const deleteIncident = useMutation({
    mutationFn: () => incidentService.deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      toast({
        title: "تم حذف البلاغ",
        description: "تم حذف البلاغ بنجاح",
      });
    },
  });

  return {
    incident,
    isLoading,
    error,
    updateIncident,
    deleteIncident,
  };
} 