import React, { createContext, useContext, useState, useEffect } from 'react';

type NotificationType = 'incident' | 'status' | 'comment' | 'alert';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  sender: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
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
    relatedId: '123',
    sender: 'أحمد محمد',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // قبل 30 دقيقة
    read: false
  },
  {
    id: '2',
    title: 'تحديث حالة',
    message: 'تم تحديث حالة البلاغ #456',
    type: 'status',
    relatedId: '456',
    sender: 'سارة خالد',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // قبل ساعتين
    read: false
  },
  {
    id: '3',
    title: 'تعليق جديد',
    message: 'تم إضافة تعليق جديد على البلاغ #789',
    type: 'comment',
    relatedId: '789',
    sender: 'محمد علي',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // قبل يوم
    read: true
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // تحديث عدد الإشعارات غير المقروءة
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
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

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
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
