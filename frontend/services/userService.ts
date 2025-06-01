
import { User, CreateUserData, UpdateUserData } from '@/types/user';

// Mock users data - في التطبيق الحقيقي، هذا سيأتي من API
let mockUsers: User[] = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "مدير",
    department: "إدارة العمليات",
    phoneNumber: "0500000001",
    status: "نشط",
    lastLogin: "2025-05-17 10:23",
    avatarUrl: "",
    createdAt: "2025-01-15",
    permissions: ["view_dashboard", "manage_users", "view_reports"]
  },
  {
    id: 2,
    name: "سارة خالد",
    email: "sarah@example.com",
    role: "مشغل كاميرات",
    department: "غرفة المراقبة",
    phoneNumber: "0500000002",
    status: "نشط",
    lastLogin: "2025-05-17 14:45",
    avatarUrl: "",
    createdAt: "2025-02-20",
    permissions: ["view_dashboard", "view_cameras"]
  },
  {
    id: 3,
    name: "محمد علي",
    email: "mohamed@example.com",
    role: "أدمن",
    department: "تقنية المعلومات",
    phoneNumber: "0500000003",
    status: "نشط",
    lastLogin: "2025-05-18 09:05",
    avatarUrl: "",
    createdAt: "2024-12-01",
    permissions: ["all"]
  }
];

export const userService = {
  // Get all users
  async getUsers(): Promise<User[]> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }
    return user;
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    const newUser: User = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      ...userData,
      status: "نشط",
      lastLogin: "لم يسجل دخول بعد",
      avatarUrl: "",
      createdAt: new Date().toISOString().split('T')[0]
    };

    mockUsers.push(newUser);
    return newUser;
  },

  // Update user
  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    // Check if email already exists (excluding current user)
    if (userData.email && mockUsers.some(u => u.email === userData.email && u.id !== id)) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData
    };

    return mockUsers[userIndex];
  },

  // Delete user
  async deleteUser(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    mockUsers.splice(userIndex, 1);
  },

  // Toggle user status
  async toggleUserStatus(id: number): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    mockUsers[userIndex].status = mockUsers[userIndex].status === "نشط" ? "معطل" : "نشط";
    return mockUsers[userIndex];
  }
};
