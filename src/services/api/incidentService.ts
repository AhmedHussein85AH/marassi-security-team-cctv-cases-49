import axiosInstance from './axiosConfig';
import { Incident } from '@/types/incident';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const incidentService = {
  async getAllIncidents(): Promise<Incident[]> {
    const response = await axiosInstance.get<ApiResponse<Incident[]>>('/incidents');
    return response.data.data;
  },

  async getIncidentById(id: string): Promise<Incident> {
    const response = await axiosInstance.get<ApiResponse<Incident>>(`/incidents/${id}`);
    return response.data.data;
  },

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    const response = await axiosInstance.post<ApiResponse<Incident>>('/incidents', incidentData);
    return response.data.data;
  },

  async updateIncident(id: string, incidentData: Partial<Incident>): Promise<Incident> {
    const response = await axiosInstance.put<ApiResponse<Incident>>(`/incidents/${id}`, incidentData);
    return response.data.data;
  },

  async deleteIncident(id: string): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`/incidents/${id}`);
  },

  async updateIncidentStatus(id: string, status: string): Promise<Incident> {
    const response = await axiosInstance.patch<ApiResponse<Incident>>(`/incidents/${id}/status`, { status });
    return response.data.data;
  },

  async addComment(id: string, comment: { text: string; userId: number }): Promise<Incident> {
    const response = await axiosInstance.post<ApiResponse<Incident>>(`/incidents/${id}/comments`, comment);
    return response.data.data;
  },

  async addAttachment(id: string, file: File): Promise<Incident> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post<ApiResponse<Incident>>(`/incidents/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async searchIncidents(query: string): Promise<Incident[]> {
    const response = await axiosInstance.get<ApiResponse<Incident[]>>(`/incidents/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  async getIncidentsByDateRange(startDate: string, endDate: string): Promise<Incident[]> {
    const response = await axiosInstance.get<ApiResponse<Incident[]>>('/incidents/date-range', {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  async getIncidentsByStatus(status: string): Promise<Incident[]> {
    const response = await axiosInstance.get<ApiResponse<Incident[]>>(`/incidents/status/${status}`);
    return response.data.data;
  },
}; 