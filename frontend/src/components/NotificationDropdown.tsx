
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const NotificationDropdown = () => {
  const { 
    notifications, 
    markAsRead, 
    unreadCount, 
    clearNotifications,
    markAllAsRead 
  } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'incident' && notification.relatedId) {
      navigate(`/incidents/${notification.relatedId}`);
    }
  };

  // الحصول على الأيقونة والألوان حسب نوع الإشعار
  const getNotificationStyles = (type) => {
    switch(type) {
      case 'incident':
        return { 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />
        };
      case 'status':
        return { 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          icon: <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
        };
      case 'comment':
        return { 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
        };
      case 'alert':
        return { 
          bgColor: 'bg-orange-100', 
          textColor: 'text-orange-800',
          icon: <div className="w-2 h-2 rounded-full bg-orange-500 mr-1" />
        };
      case 'user':
        return { 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-800',
          icon: <div className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
        };
      default:
        return { 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800',
          icon: <div className="w-2 h-2 rounded-full bg-gray-500 mr-1" />
        };
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]" dir="rtl">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-right">الإشعارات</SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2"
                onClick={markAllAsRead}
              >
                <Check className="h-4 w-4" />
                تحديد الكل كمقروء
              </Button>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex justify-between items-center">
              <Badge variant="secondary">
                {notifications.length} إشعارات
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
                onClick={clearNotifications}
              >
                <Trash className="h-4 w-4" />
                حذف الكل
              </Button>
            </div>
          )}
        </SheetHeader>
        <div className="py-4 overflow-auto max-h-[80vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد إشعارات
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const styles = getNotificationStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      notification.read 
                        ? "bg-muted/50 hover:bg-muted" 
                        : `${styles.bgColor} hover:bg-opacity-90`
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-semibold flex items-center ${!notification.read && styles.textColor}`}>
                        {styles.icon}
                        {notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                          locale: ar
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>بواسطة: {notification.sender}</span>
                      {!notification.read && (
                        <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                          جديد
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDropdown;
