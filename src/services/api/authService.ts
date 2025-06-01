import axios from 'axios';
import { User } from '@/types/user';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async register(userData: Partial<User>): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await axios.put(`${API_URL}/users/profile`, userData);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  }
}; 