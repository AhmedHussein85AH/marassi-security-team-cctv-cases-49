// أنواع الإشعارات
export enum NotificationType {
  INCIDENT = "حادث",
  STATUS = "حالة",
  COMMENT = "تعليق",
  ALERT = "تنبيه"
}

// حالات الإشعار
export enum NotificationStatus {
  UNREAD = "غير مقروء",
  READ = "مقروء",
  ARCHIVED = "مؤرشف"
}

// نموذج الإشعار
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  relatedId?: string;
  sender: string;
  timestamp: Date;
  read: boolean;
  category?: string;
  priority?: NotificationPriority;
  expiresAt?: Date;
}

// أولويات الإشعار
export enum NotificationPriority {
  HIGH = "عالية",
  MEDIUM = "متوسطة",
  LOW = "منخفضة"
}

// القيم الافتراضية للإشعار
export const defaultNotificationValues: Omit<Notification, 'id' | 'timestamp'> = {
  title: "",
  message: "",
  type: NotificationType.ALERT,
  status: NotificationStatus.UNREAD,
  sender: "",
  read: false,
  priority: NotificationPriority.MEDIUM
};

// نموذج تفضيلات الإشعارات
export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    [key in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string;   // HH:mm format
  };
}

// القيم الافتراضية لتفضيلات الإشعارات
export const defaultNotificationPreferences: NotificationPreferences = {
  userId: "",
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  notificationTypes: {
    [NotificationType.INCIDENT]: true,
    [NotificationType.STATUS]: true,
    [NotificationType.COMMENT]: true,
    [NotificationType.ALERT]: true
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "07:00"
  }
};

// Helper function to format timestamp in Arabic
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  } else if (hours < 24) {
    return `منذ ${hours} ساعة`;
  } else if (days < 7) {
    return `منذ ${days} يوم`;
  } else {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

// Helper function to check if notification is expired
export const isNotificationExpired = (notification: Notification): boolean => {
  if (!notification.expiresAt) return false;
  return new Date() > notification.expiresAt;
};

// Helper function to filter notifications by type
export const filterNotificationsByType = (
  notifications: Notification[],
  type: NotificationType
): Notification[] => {
  return notifications.filter(notification => notification.type === type);
};

// Helper function to get unread notifications count
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(notification => !notification.read).length;
};

// Helper function to check if notification is in quiet hours
export const isInQuietHours = (preferences: NotificationPreferences): boolean => {
  if (!preferences.quietHours.enabled) return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number);
  const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
}; 