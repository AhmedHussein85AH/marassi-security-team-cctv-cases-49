# نظام الإشعارات - Notification System Documentation

## Project Overview
The notification system is a real-time notification feature implemented for an Arabic security management application. It provides users with instant updates about incidents, status changes, and comments in a culturally appropriate and user-friendly interface.

## Feature Specifications

### Core Features
- Real-time notification counter
- Arabic-first UI design
- Read/unread status tracking
- Timestamp formatting in Arabic
- Interactive notification items
- Navigation to related incidents
- Bulk actions (mark all as read, clear all)

### User Stories
1. As a user, I want to see my unread notifications count at a glance
2. As a user, I want to view all my notifications in Arabic
3. As a user, I want to mark notifications as read
4. As a user, I want to clear all notifications
5. As a user, I want to navigate to related incidents from notifications
6. As a user, I want to see when notifications were received in Arabic format

## Technical Implementation

### Components Structure

#### NotificationContext (`src/contexts/NotificationContext.tsx`)
The context provider that manages the notification state and operations.

```typescript
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
```

#### NotificationDropdown (`src/components/NotificationDropdown.tsx`)
The UI component that displays notifications in a dropdown sheet.

Features:
- Unread count badge
- Mark all as read button
- Clear all notifications
- Individual notification cards with:
  - Title
  - Message
  - Sender
  - Timestamp in Arabic
  - Read/unread status
  - Navigation to related content

### Integration

The notification system is integrated at the application root level in `App.tsx`:

```typescript
<AuthProvider>
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
</AuthProvider>
```

## Usage Guidelines

### Adding a New Notification
```typescript
const { addNotification } = useNotifications();

addNotification({
  title: 'عنوان الإشعار',
  message: 'محتوى الإشعار',
  type: 'incident',
  relatedId: 'incident-123',
  sender: 'اسم المرسل'
});
```

### Handling Notifications
```typescript
const { markAsRead, clearNotifications, markAllAsRead } = useNotifications();

// Mark single notification as read
markAsRead('notification-id');

// Mark all as read
markAllAsRead();

// Clear all notifications
clearNotifications();
```

## Testing Guidelines

### Test Cases
1. Notification Creation
   - Verify notification appears in list
   - Check unread count increment
   - Validate timestamp formatting

2. Notification Actions
   - Test mark as read functionality
   - Verify bulk actions (mark all as read, clear all)
   - Check navigation to related content

3. UI/UX Testing
   - Verify Arabic text rendering
   - Test responsive design
   - Validate accessibility features

## Security Considerations

1. Data Protection
   - Notifications should not contain sensitive information in preview
   - Implement proper access control for notification data
   - Sanitize notification content before display

2. Performance
   - Implement pagination for large notification lists
   - Cache notification data appropriately
   - Handle offline scenarios gracefully

## Future Enhancements

1. Planned Features
   - Real-time WebSocket integration
   - Notification categories and filtering
   - Custom notification preferences
   - Push notifications support
   - Notification expiry/archiving

2. Technical Debt
   - Implement proper backend integration
   - Add notification persistence
   - Enhance error handling
   - Add comprehensive testing suite

## Troubleshooting

Common Issues:
1. Notifications not appearing
   - Verify NotificationProvider is properly mounted
   - Check component hierarchy
   - Validate notification creation parameters

2. UI Rendering Issues
   - Verify Arabic font loading
   - Check RTL support
   - Validate CSS specificity

## API Documentation

### Context API
```typescript
const {
  notifications,      // Current notifications array
  unreadCount,        // Number of unread notifications
  addNotification,    // Add new notification
  removeNotification, // Remove specific notification
  clearNotifications, // Clear all notifications
  markAsRead,        // Mark specific notification as read
  markAllAsRead      // Mark all notifications as read
} = useNotifications();
```

### Notification Types
```typescript
type NotificationType = 'incident' | 'status' | 'comment' | 'alert';
``` 