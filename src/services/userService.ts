import { User } from '@/types/user';

// Mock users data (temporary until backend is ready)
let users = [
  { 
    id: 1, 
    name: "أحمد محمد", 
    email: "ahmed@example.com",
    password: "123456",
    role: "مدير", 
    permissions: ["view_dashboard", "view_incidents", "view_reports"]
  },
  { 
    id: 2, 
    name: "سارة خالد", 
    email: "sarah@example.com",
    password: "123456",
    role: "مشغل كاميرات", 
    permissions: ["view_incidents", "view_cameras"]
  },
  { 
    id: 3, 
    name: "محمد علي", 
    email: "mohamed@example.com",
    password: "123456",
    role: "أدمن", 
    permissions: ["all"]
  }
];

export const userService = {
  // Get all users
  getUsers: async () => {
    return users;
  },

  // Get user by ID
  getUserById: async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('المستخدم غير موجود');
    return user;
  },

  // Create new user
  createUser: async (userData: Omit<User, 'id'>) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    const newUser = {
      ...userData,
      id: users.length + 1,
      permissions: getPermissionsByRole(userData.role)
    };

    users.push(newUser);
    return newUser;
  },

  // Update user
  updateUser: async (id: number, userData: Partial<User>) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');

    // Check if email is being changed and already exists
    if (userData.email && userData.email !== users[index].email) {
      if (users.some(u => u.email === userData.email)) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    // احتفظ بالصلاحيات الحالية إذا لم يتم تحديد صلاحيات جديدة
    const currentPermissions = users[index].permissions;
    
    users[index] = {
      ...users[index],
      ...userData,
      // استخدم الصلاحيات الجديدة إذا تم تحديدها، وإلا استخدم الصلاحيات الحالية
      permissions: userData.permissions || currentPermissions
    };

    return users[index];
  },

  // Delete user
  deleteUser: async (id: number) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');
    users = users.filter(u => u.id !== id);
  }
};

// Helper function to get permissions based on role
function getPermissionsByRole(role: string): string[] {
  switch (role) {
    case 'أدمن':
      return ['all'];
    case 'مدير':
      return ['view_dashboard', 'view_incidents', 'view_reports'];
    case 'مشغل كاميرات':
      return ['view_incidents', 'view_cameras'];
    default:
      return [];
  }
} 