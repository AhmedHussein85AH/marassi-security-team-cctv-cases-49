import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface LostAndFoundItem {
  id: string;
  name: string;
  description: string;
  status: 'delivered' | 'in_storage' | 'pending';
  type: 'found' | 'lost';
  value: 'high' | 'low';
  image?: string;
  date: string;
}

export const lostAndFoundService = {
  // Get all items
  getAllItems: async () => {
    const response = await axios.get(`${API_URL}/lost-and-found`);
    return response.data;
  },

  // Get items by status
  getItemsByStatus: async (status: string) => {
    const response = await axios.get(`${API_URL}/lost-and-found/status/${status}`);
    return response.data;
  },

  // Add new item
  addItem: async (item: Omit<LostAndFoundItem, 'id'>) => {
    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await axios.post(`${API_URL}/lost-and-found`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update item
  updateItem: async (id: string, item: Partial<LostAndFoundItem>) => {
    const formData = new FormData();
    Object.entries(item).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    const response = await axios.put(`${API_URL}/lost-and-found/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete items
  deleteItems: async (ids: string[]) => {
    const response = await axios.delete(`${API_URL}/lost-and-found`, {
      data: { ids },
    });
    return response.data;
  },

  // Export items
  exportItems: async (status?: string) => {
    const url = status 
      ? `${API_URL}/lost-and-found/export?status=${status}`
      : `${API_URL}/lost-and-found/export`;
    
    const response = await axios.get(url, {
      responseType: 'blob',
    });
    return response.data;
  },
}; 