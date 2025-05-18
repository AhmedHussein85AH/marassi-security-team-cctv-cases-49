
import { User } from '@/types/user';

export const authService = {
  // التحقق من صلاحية محددة
  hasPermission: (user: User, permission: string): boolean => {
    if (!user || !user.permissions) return false;
    
    // إذا كان المستخدم لديه جميع الصلاحيات
    if (user.permissions.includes('all')) return true;
    
    return user.permissions.includes(permission);
  },

  // التحقق من مجموعة صلاحيات
  hasAnyPermission: (user: User, permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    
    // إذا كان المستخدم لديه جميع الصلاحيات
    if (user.permissions.includes('all')) return true;
    
    return permissions.some(permission => user.permissions.includes(permission));
  },

  // التحقق ما إذا كان المستخدم مطابق للمستخدم الحالي
  isSameUser: (loggedInUser: User, userToCheck: User): boolean => {
    return loggedInUser.id === userToCheck.id;
  },

  // الحصول على قائمة الصلاحيات حسب الدور
  getPermissionsByRole: (role: string): string[] => {
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
          'view_users',
          'manage_users'
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
  },

  // قائمة جميع الصلاحيات المتاحة في النظام
  getAllPermissions: () => [
    {
      group: 'لوحة التحكم',
      permissions: [
        {
          id: 'view_dashboard',
          label: 'عرض لوحة التحكم',
          description: 'الوصول إلى لوحة التحكم الرئيسية'
        }
      ]
    },
    {
      group: 'البلاغات',
      permissions: [
        {
          id: 'view_incidents',
          label: 'عرض البلاغات',
          description: 'عرض قائمة البلاغات وتفاصيلها'
        },
        {
          id: 'manage_incidents',
          label: 'إدارة البلاغات',
          description: 'إضافة وتعديل وحذف البلاغات'
        },
        {
          id: 'process_incidents',
          label: 'معالجة البلاغات',
          description: 'تحديث حالة البلاغات ومعالجتها'
        }
      ]
    },
    {
      group: 'الكاميرات',
      permissions: [
        {
          id: 'view_cameras',
          label: 'عرض الكاميرات',
          description: 'عرض بث الكاميرات المباشر'
        },
        {
          id: 'manage_cameras',
          label: 'إدارة الكاميرات',
          description: 'إضافة وتعديل وحذف الكاميرات'
        }
      ]
    },
    {
      group: 'التقارير',
      permissions: [
        {
          id: 'view_reports',
          label: 'عرض التقارير',
          description: 'الوصول إلى التقارير وعرضها'
        },
        {
          id: 'export_reports',
          label: 'تصدير التقارير',
          description: 'تصدير التقارير بصيغ مختلفة'
        }
      ]
    },
    {
      group: 'المستخدمين',
      permissions: [
        {
          id: 'view_users',
          label: 'عرض المستخدمين',
          description: 'عرض قائمة المستخدمين'
        },
        {
          id: 'manage_users',
          label: 'إدارة المستخدمين',
          description: 'إضافة وتعديل وحذف المستخدمين'
        }
      ]
    }
  ]
};
