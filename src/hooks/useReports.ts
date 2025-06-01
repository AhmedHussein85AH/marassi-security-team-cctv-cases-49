import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export function useReports() {
  const queryClient = useQueryClient();

  const generateIncidentReport = useMutation({
    mutationFn: ({ startDate, endDate, filters }: { startDate: string; endDate: string; filters?: any }) =>
      reportService.generateIncidentReport(startDate, endDate, filters),
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء تقرير الحوادث بنجاح",
      });
      return data;
    },
  });

  const generateCameraReport = useMutation({
    mutationFn: ({ startDate, endDate, filters }: { startDate: string; endDate: string; filters?: any }) =>
      reportService.generateCameraReport(startDate, endDate, filters),
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء تقرير الكاميرات بنجاح",
      });
      return data;
    },
  });

  const generateMaintenanceReport = useMutation({
    mutationFn: ({ startDate, endDate, filters }: { startDate: string; endDate: string; filters?: any }) =>
      reportService.generateMaintenanceReport(startDate, endDate, filters),
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء تقرير الصيانة بنجاح",
      });
      return data;
    },
  });

  const generatePerformanceReport = useMutation({
    mutationFn: ({ startDate, endDate, filters }: { startDate: string; endDate: string; filters?: any }) =>
      reportService.generatePerformanceReport(startDate, endDate, filters),
    onSuccess: (data) => {
      toast({
        title: "تم إنشاء التقرير",
        description: "تم إنشاء تقرير الأداء بنجاح",
      });
      return data;
    },
  });

  const exportReport = useMutation({
    mutationFn: ({ reportId, format }: { reportId: string; format: 'pdf' | 'excel' | 'csv' }) =>
      reportService.exportReport(reportId, format),
    onSuccess: (data) => {
      toast({
        title: "تم تصدير التقرير",
        description: "تم تصدير التقرير بنجاح",
      });
      return data;
    },
  });

  const scheduleReport = useMutation({
    mutationFn: ({ reportType, schedule, recipients }: { 
      reportType: string; 
      schedule: { frequency: string; time: string; days?: string[] }; 
      recipients: string[] 
    }) =>
      reportService.scheduleReport(reportType, schedule, recipients),
    onSuccess: () => {
      toast({
        title: "تم جدولة التقرير",
        description: "تم جدولة التقرير بنجاح",
      });
    },
  });

  return {
    generateIncidentReport,
    generateCameraReport,
    generateMaintenanceReport,
    generatePerformanceReport,
    exportReport,
    scheduleReport,
  };
}

export function useReportHistory() {
  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: reportService.getReportHistory,
  });

  return {
    reports,
    isLoading,
    error,
  };
}

export function useScheduledReports() {
  const { data: scheduledReports = [], isLoading, error } = useQuery({
    queryKey: ['scheduled-reports'],
    queryFn: reportService.getScheduledReports,
  });

  const updateSchedule = useMutation({
    mutationFn: ({ reportId, schedule }: { reportId: string; schedule: { frequency: string; time: string; days?: string[] } }) =>
      reportService.updateReportSchedule(reportId, schedule),
    onSuccess: () => {
      toast({
        title: "تم تحديث الجدول",
        description: "تم تحديث جدول التقرير بنجاح",
      });
    },
  });

  const deleteSchedule = useMutation({
    mutationFn: (reportId: string) =>
      reportService.deleteReportSchedule(reportId),
    onSuccess: () => {
      toast({
        title: "تم حذف الجدول",
        description: "تم حذف جدول التقرير بنجاح",
      });
    },
  });

  return {
    scheduledReports,
    isLoading,
    error,
    updateSchedule,
    deleteSchedule,
  };
} 