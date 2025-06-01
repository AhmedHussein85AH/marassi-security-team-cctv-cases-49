
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type NotificationType = 'incident' | 'status' | 'comment' | 'alert' | 'user';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  sender: string;
  timestamp: string;
  read: boolean;
  recipientRoles?: string[]; // الأدوار المستهدفة للإشعار
  recipientIds?: number[]; // معرفات محددة للمستلمين
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addRoleBasedNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    roles: string[]
  ) => void;
  addUserNotification: (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    userIds: number[]
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// بيانات تجريبية للإشعارات
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'بلاغ جديد',
    message: 'تم إضافة بلاغ جديد في المنطقة الشمالية',
    type: 'incident',
    relatedId: 'INC-001',
    sender: 'النظام',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // قبل 30 دقيقة
    read: false,
    recipientRoles: ['مشغل كاميرات', 'مدير']
  },
  {
    id: '2',
    title: 'تحديث حالة',
    message: 'تم تحديث حالة البلاغ #INC-002',
    type: 'status',
    relatedId: 'INC-002',
    sender: 'سارة خالد',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // قبل ساعتين
    read: false,
    recipientRoles: ['مدير']
  },
  {
    id: '3',
    title: 'تعليق جديد',
    message: 'تم إضافة تعليق جديد على البلاغ #INC-003',
    type: 'comment',
    relatedId: 'INC-003',
    sender: 'محمد علي',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // قبل يوم
    read: true,
    recipientRoles: ['مشغل كاميرات', 'مدير']
  },
  {
    id: '4',
    title: 'مستخدم جديد',
    message: 'تم إضافة مستخدم جديد للنظام',
    type: 'user',
    sender: 'النظام',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // قبل 5 ساعات
    read: true,
    recipientRoles: ['أدمن', 'مدير']
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // تحديث عدد الإشعارات غير المقروءة
    if (user) {
      // فلترة الإشعارات التي تخص المستخدم الحالي
      const userNotifications = notifications.filter(n => 
        // إشعارات للجميع (بدون تحديد أدوار أو مستخدمين محددين)
        (!n.recipientRoles && !n.recipientIds) ||
        // إشعارات لدور المستخدم
        (n.recipientRoles?.includes(user.role)) ||
        // إشعارات لمستخدم محدد
        (n.recipientIds?.includes(user.id))
      );
      
      const count = userNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // إضافة إشعار لأدوار محددة
  const addRoleBasedNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    roles: string[]
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      recipientRoles: roles
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // إضافة إشعار لمستخدمين محددين
  const addUserNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    userIds: number[]
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      recipientIds: userIds
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // فلترة الإشعارات حسب المستخدم الحالي
  const filteredNotifications = user ? notifications.filter(notification => {
    // إشعارات للجميع
    if (!notification.recipientRoles && !notification.recipientIds) {
      return true;
    }
    
    // إشعارات لدور محدد
    if (notification.recipientRoles && notification.recipientRoles.includes(user.role)) {
      return true;
    }
    
    // إشعارات لمستخدم محدد
    if (notification.recipientIds && notification.recipientIds.includes(user.id)) {
      return true;
    }
    
    return false;
  }) : [];

  return (
    <NotificationContext.Provider
      value={{
        notifications: filteredNotifications,
        unreadCount,
        addNotification,
        addRoleBasedNotification,
        addUserNotification,
        removeNotification,
        clearNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
