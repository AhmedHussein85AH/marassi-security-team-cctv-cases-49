
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const NotificationDropdown = () => {
  const { notifications, markAsRead, unreadCount } = useNotifications();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'incident' && notification.relatedId) {
      window.location.href = `/incidents/${notification.relatedId}`;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>الإشعارات</SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-auto max-h-[80vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد إشعارات
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    notification.read ? "bg-gray-100" : "bg-blue-50"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{notification.title}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                        locale: ar
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    بواسطة: {notification.sender}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDropdown;
