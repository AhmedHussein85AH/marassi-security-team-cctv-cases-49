
// خدمة إدارة الأدوار
interface Role {
  id: number;
  name: string;
  permissions: string[];
  description: string;
  createdAt: string;
}

let roles: Role[] = [
  {
    id: 1,
    name: "أدمن",
    permissions: ["all"],
    description: "صلاحيات كاملة للنظام",
    createdAt: "2025-01-01"
  },
  {
    id: 2,
    name: "مدير",
    permissions: ["view_dashboard", "view_incidents", "manage_incidents", "view_reports", "export_reports", "view_users"],
    description: "إدارة العمليات والتقارير",
    createdAt: "2025-01-01"
  },
  {
    id: 3,
    name: "مشغل كاميرات",
    permissions: ["view_incidents", "process_incidents", "view_cameras", "manage_cameras"],
    description: "تشغيل المراقبة ومعالجة البلاغات",
    createdAt: "2025-01-01"
  }
];

export const roleService = {
  // الحصول على جميع الأدوار
  getRoles: async (): Promise<Role[]> => {
    return roles;
  },

  // الحصول على دور بواسطة المعرف
  getRoleById: async (id: number): Promise<Role | null> => {
    return roles.find(role => role.id === id) || null;
  },

  // إنشاء دور جديد
  createRole: async (roleData: Omit<Role, 'id'>): Promise<Role> => {
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    const newRole: Role = {
      ...roleData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    roles.push(newRole);
    return newRole;
  },

  // تحديث دور
  updateRole: async (id: number, roleData: Partial<Role>): Promise<Role> => {
    const index = roles.findIndex(role => role.id === id);
    if (index === -1) throw new Error('الدور غير موجود');
    
    roles[index] = { ...roles[index], ...roleData };
    return roles[index];
  },

  // حذف دور
  deleteRole: async (id: number): Promise<void> => {
    const index = roles.findIndex(role => role.id === id);
    if (index === -1) throw new Error('الدور غير موجود');
    
    roles = roles.filter(role => role.id !== id);
  },

  // الحصول على الصلاحيات بناءً على الدور
  getPermissionsByRoleName: async (roleName: string): Promise<string[]> => {
    const role = roles.find(r => r.name === roleName);
    return role ? role.permissions : [];
  }
};
