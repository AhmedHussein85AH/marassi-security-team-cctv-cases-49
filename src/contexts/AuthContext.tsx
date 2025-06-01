import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// المستخدمين للتجربة
const mockUsers: User[] = [
  { 
    id: 1, 
    name: "أحمد محمد", 
    email: "ahmed@example.com",
    password: "123456",
    role: "مدير", 
    permissions: ["view_dashboard", "view_incidents", "view_reports", "manage_incidents"],
    department: "إدارة العمليات",
    phoneNumber: "0500000001",
    status: "نشط",
    lastLogin: "2025-05-17 10:23",
    avatarUrl: "",
    createdAt: "2025-01-15"
  },
  { 
    id: 2, 
    name: "سارة خالد", 
    email: "sarah@example.com",
    password: "123456",
    role: "مشغل كاميرات", 
    permissions: ["view_incidents", "view_cameras", "process_incidents"],
    department: "غرفة المراقبة",
    phoneNumber: "0500000002",
    status: "نشط",
    lastLogin: "2025-05-17 14:45",
    avatarUrl: "",
    createdAt: "2025-02-20"
  },
  { 
    id: 3, 
    name: "محمد علي", 
    email: "mohamed@example.com",
    password: "123456",
    role: "أدمن", 
    permissions: ["all"],
    department: "تقنية المعلومات",
    phoneNumber: "0500000003",
    status: "نشط",
    lastLogin: "2025-05-18 09:05",
    avatarUrl: "",
    createdAt: "2024-12-01"
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Set the default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user: userData } = response.data.data;
      
      // Set the authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Store user data and token
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${userData.name}`,
      });
      
      navigate('/');
    } catch (error) {
      let errorMessage = 'حدث خطأ غير متوقع';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
    navigate('/login');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('المستخدم غير مسجل الدخول');
      
      const response = await axios.put(`${API_URL}/users/${user.id}`, userData);
      const updatedUser = response.data.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث بيانات المستخدم بنجاح",
      });
      
      return Promise.resolve();
    } catch (error) {
      let errorMessage = 'حدث خطأ غير متوقع';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "خطأ في تحديث البيانات",
        description: errorMessage,
      });
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
