import axiosInstance from './axiosConfig';
import { Report } from '@/types/report';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const reportService = {
  async getAllReports(): Promise<Report[]> {
    const response = await axiosInstance.get<ApiResponse<Report[]>>('/reports');
    return response.data.data;
  },

  async getReportById(id: string): Promise<Report> {
    const response = await axiosInstance.get<ApiResponse<Report>>(`/reports/${id}`);
    return response.data.data;
  },

  async createReport(reportData: Partial<Report>): Promise<Report> {
    const response = await axiosInstance.post<ApiResponse<Report>>('/reports', reportData);
    return response.data.data;
  },

  async updateReport(id: string, reportData: Partial<Report>): Promise<Report> {
    const response = await axiosInstance.put<ApiResponse<Report>>(`/reports/${id}`, reportData);
    return response.data.data;
  },

  async deleteReport(id: string): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`/reports/${id}`);
  },

  async generateIncidentReport(params: {
    startDate: string;
    endDate: string;
    type?: string;
    location?: string;
  }): Promise<Report> {
    const response = await axiosInstance.post<ApiResponse<Report>>('/reports/generate/incident', params);
    return response.data.data;
  },

  async generateCameraReport(params: {
    startDate: string;
    endDate: string;
    cameraId?: string;
    location?: string;
  }): Promise<Report> {
    const response = await axiosInstance.post<ApiResponse<Report>>('/reports/generate/camera', params);
    return response.data.data;
  },

  async generateUserActivityReport(params: {
    startDate: string;
    endDate: string;
    userId?: number;
    department?: string;
  }): Promise<Report> {
    const response = await axiosInstance.post<ApiResponse<Report>>('/reports/generate/user-activity', params);
    return response.data.data;
  },

  async exportReport(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await axiosInstance.get(`/reports/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  async searchReports(query: string): Promise<Report[]> {
    const response = await axiosInstance.get<ApiResponse<Report[]>>(`/reports/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  async getReportsByDateRange(startDate: string, endDate: string): Promise<Report[]> {
    const response = await axiosInstance.get<ApiResponse<Report[]>>('/reports/date-range', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  async getReportsByType(type: string): Promise<Report[]> {
    const response = await axiosInstance.get<ApiResponse<Report[]>>(`/reports/type/${type}`);
    return response.data.data;
  },

  async scheduleReportGeneration(params: {
    type: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    parameters: Record<string, any>;
  }): Promise<Report> {
    const response = await axiosInstance.post<ApiResponse<Report>>('/reports/schedule', params);
    return response.data.data;
  },
}; 