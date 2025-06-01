import axiosInstance from './axiosConfig';
import { User } from '@/types/user';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  async getUserById(id: number): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', userData);
    return response.data.data;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  async deleteUser(id: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`/users/${id}`);
  },

  async updateUserStatus(id: number, status: string): Promise<User> {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/users/${id}/status`, { status });
    return response.data.data;
  },

  async updateUserPermissions(id: number, permissions: string[]): Promise<User> {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/users/${id}/permissions`, { permissions });
    return response.data.data;
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await axiosInstance.get<ApiResponse<User[]>>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },
}; 