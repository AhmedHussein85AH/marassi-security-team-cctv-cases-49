
import { User } from '@/types/user';

// بيانات المستخدمين (مؤقتاً حتى يتم ربط قاعدة البيانات)
let users = [
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
  },
  {
    id: 4,
    name: "خالد عبدالله",
    email: "khalid@example.com",
    password: "123456",
    role: "مشغل كاميرات",
    permissions: ["view_incidents", "view_cameras", "process_incidents"],
    department: "غرفة المراقبة",
    phoneNumber: "0500000004",
    status: "غير نشط",
    lastLogin: "2025-05-10 11:30",
    avatarUrl: "",
    createdAt: "2025-03-10"
  },
  {
    id: 5,
    name: "فاطمة عمر",
    email: "fatima@example.com",
    password: "123456",
    role: "مدير",
    permissions: ["view_dashboard", "view_incidents", "view_reports", "export_reports"],
    department: "إدارة التقارير",
    phoneNumber: "0500000005",
    status: "نشط",
    lastLogin: "2025-05-16 16:15",
    avatarUrl: "",
    createdAt: "2025-02-05"
  }
];

export const userService = {
  // الحصول على جميع المستخدمين
  getUsers: async () => {
    return users;
  },

  // الحصول على مستخدم بواسطة المعرف
  getUserById: async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('المستخدم غير موجود');
    
    // نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // إنشاء مستخدم جديد
  createUser: async (userData: Omit<User, 'id'>) => {
    // التحقق من وجود البريد الإلكتروني
    if (users.some(u => u.email === userData.email)) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    // إنشاء معرف جديد
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // تحديد الصلاحيات بناءً على الدور إذا لم يتم تحديدها
    const permissions = userData.permissions || getPermissionsByRole(userData.role);
    
    // إنشاء المستخدم الجديد
    const newUser: User = {
      ...userData,
      id: newId,
      permissions,
      status: userData.status || "نشط",
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    
    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // تحديث مستخدم
  updateUser: async (id: number, userData: Partial<User>) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (userData.email && userData.email !== users[index].email) {
      if (users.some(u => u.email === userData.email)) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    // تحديث المستخدم مع الاحتفاظ بالقيم الحالية إذا لم يتم تحديد قيم جديدة
    users[index] = {
      ...users[index],
      ...userData,
      // تحديث الصلاحيات إذا تم تغيير الدور وعدم تحديد صلاحيات جديدة
      permissions: userData.permissions || 
                  (userData.role && userData.role !== users[index].role ? 
                    getPermissionsByRole(userData.role) : users[index].permissions)
    };

    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },

  // حذف مستخدم
  deleteUser: async (id: number) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');
    users = users.filter(u => u.id !== id);
  },
  
  // تحديث صلاحيات مستخدم
  updateUserPermissions: async (id: number, permissions: string[]) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');
    
    users[index].permissions = permissions;
    
    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },
  
  // تغيير حالة المستخدم (نشط/غير نشط)
  toggleUserStatus: async (id: number) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');
    
    users[index].status = users[index].status === "نشط" ? "غير نشط" : "نشط";
    
    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }
};

// وظيفة مساعدة للحصول على الصلاحيات بناءً على الدور
function getPermissionsByRole(role: string): string[] {
  switch (role) {
    case 'أدمن':
      return ['all'];
    case 'مدير':
      return [
        'view_dashboard',
        'view_incidents',
        'manage_incidents',
        'view_reports',
        'export_reports',
        'view_users'
      ];
    case 'مشغل كاميرات':
      return [
        'view_incidents',
        'process_incidents',
        'view_cameras',
        'manage_cameras'
      ];
    default:
      return [];
  }
}
