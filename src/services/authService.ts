import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authService = {
  // Supabase Authentication Methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    return {
      user: userData,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  },

  async register(userData: Partial<User>): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email!,
      password: userData.password!,
    });

    if (error) throw error;

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: data.user?.id,
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);

    if (profileError) throw profileError;

    return {
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (userError) throw userError;
    return userData;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    const { data, error: updateError } = await supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    };
  },

  // Your Existing Permission Methods
  hasPermission: (user: User, permission: string): boolean => {
    if (!user || !user.permissions) return false;
    
    // إذا كان المستخدم لديه جميع الصلاحيات
    if (user.permissions.includes('all') || user.permissions.includes('*')) return true;
    
    return user.permissions.includes(permission);
  },

  hasAnyPermission: (user: User, permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    
    // إذا كان المستخدم لديه جميع الصلاحيات
    if (user.permissions.includes('all') || user.permissions.includes('*')) return true;
    
    return permissions.some(permission => user.permissions.includes(permission));
  },

  isSameUser: (loggedInUser: User, userToCheck: User): boolean => {
    return loggedInUser.id === userToCheck.id;
  },

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
