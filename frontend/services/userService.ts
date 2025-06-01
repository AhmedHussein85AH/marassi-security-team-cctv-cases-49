import { User } from '@/types/user';
import { roleService } from './roleService';

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
  },
  {
    id: 6,
    name: "احمد حسين",
    email: "AhmedHusseinElsayed@outlook.com",
    password: "123456",
    role: "مراقبة بيانات",
    permissions: ["view_incidents", "view_reports"],
    department: "مراقبة البيانات",
    phoneNumber: "0500000006",
    status: "نشط",
    lastLogin: "",
    avatarUrl: "",
    createdAt: "2025-05-25"
  }
];

export const userService = {
  // الحصول على جميع المستخدمين
  getUsers: async () => {
    // تحديث صلاحيات المستخدمين بناءً على أدوارهم
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const permissions = await roleService.getPermissionsByRoleName(user.role);
        return { ...user, permissions };
      })
    );
    return updatedUsers;
  },

  // الحصول على مستخدم بواسطة المعرف
  getUserById: async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('المستخدم غير موجود');
    
    // تحديث الصلاحيات بناءً على الدور
    const permissions = await roleService.getPermissionsByRoleName(user.role);
    
    // نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = { ...user, permissions };
    return userWithoutPassword;
  },

  // إنشاء مستخدم جديد
  createUser: async (userData: Omit<User, 'id' | 'permissions'>) => {
    // التحقق من وجود البريد الإلكتروني
    if (users.some(u => u.email === userData.email)) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }

    // إنشاء معرف جديد
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // الحصول على الصلاحيات بناءً على الدور
    const permissions = await roleService.getPermissionsByRoleName(userData.role);
    
    // إنشاء المستخدم الجديد مع كلمة مرور افتراضية
    const newUser: User = {
      ...userData,
      id: newId,
      permissions,
      password: userData.password || "123456", // كلمة مرور افتراضية
      status: userData.status || "نشط",
      lastLogin: "",
      avatarUrl: "",
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    
    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // تحديث مستخدم (بدون تعديل الصلاحيات مباشرة)
  updateUser: async (id: number, userData: Partial<Omit<User, 'permissions'>>) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');

    // التحقق من البريد الإلكتروني إذا تم تغييره
    if (userData.email && userData.email !== users[index].email) {
      if (users.some(u => u.email === userData.email)) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    // تحديث المستخدم
    users[index] = {
      ...users[index],
      ...userData,
    };

    // تحديث الصلاحيات بناءً على الدور الجديد إذا تم تغييره
    if (userData.role) {
      const permissions = await roleService.getPermissionsByRoleName(userData.role);
      users[index].permissions = permissions;
    }

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
  
  // تغيير حالة المستخدم (نشط/غير نشط)
  toggleUserStatus: async (id: number) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('المستخدم غير موجود');
    
    users[index].status = users[index].status === "نشط" ? "غير نشط" : "نشط";
    
    // إعادة نسخة من المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  },

  // تحديث الصلاحيات بناءً على تغييرات الأدوار
  syncUserPermissionsWithRoles: async () => {
    for (let i = 0; i < users.length; i++) {
      const permissions = await roleService.getPermissionsByRoleName(users[i].role);
      users[i].permissions = permissions;
    }
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
