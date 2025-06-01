import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Users, 
  Settings, 
  Shield,
  LogOut,
  UserCheck,
  Anchor,
  Phone,
  Box
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";

import { 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

interface MainSidebarProps {
  activeItem?: string;
}

const MainSidebar = ({ activeItem }: MainSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, user } = useAuth();

  // التحقق من الصلاحيات
  const canViewDashboard = authService.hasPermission(user, 'view_dashboard');
  const canViewIncidents = authService.hasPermission(user, 'view_incidents');
  const canViewReports = authService.hasPermission(user, 'view_reports');
  const canViewUsers = authService.hasPermission(user, 'view_users');
  const canViewLostAndFound = authService.hasPermission(user, 'view_lost_and_found');

  return (
    <div className="fixed right-0 top-0 h-screen w-64 bg-background border-l">
      <div className="flex h-full flex-col">
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 justify-end">
            <span className="font-bold text-xl">نظام الأمن</span>
            <div className="bg-primary p-1 rounded-md">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <div className="text-right text-xs font-medium text-muted-foreground mb-2">القائمة الرئيسية</div>
            <nav className="space-y-1">
              {canViewDashboard && (
                <Link to="/" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">لوحة التحكم</span>
                  <Home className="h-4 w-4" />
                </Link>
              )}
              
              {canViewLostAndFound && (
                <Link to="/lost-and-found" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/lost-and-found" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">المعثورات والمفقودات</span>
                  <Box className="h-4 w-4" />
                </Link>
              )}
              
              {canViewIncidents && (
                <Link to="/incidents" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath.startsWith("/incidents") ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">بلاغات غرفة كاميرات المراقبة</span>
                  <AlertTriangle className="h-4 w-4" />
                </Link>
              )}

              {canViewReports && (
                <Link to="/daily-port-events" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/daily-port-events" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">أحداث مراسي اليومية</span>
                  <Anchor className="h-4 w-4" />
                </Link>
              )}

              {canViewReports && (
                <Link to="/call-center-reports" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/call-center-reports" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">بلاغات الكول سنتر</span>
                  <Phone className="h-4 w-4" />
                </Link>
              )}

              {canViewReports && (
                <Link to="/work-permits" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/work-permits" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">تصاريح العمل</span>
                  <FileText className="h-4 w-4" />
                </Link>
              )}

              {canViewReports && (
                <Link to="/reports" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/reports" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">التقارير</span>
                  <FileText className="h-4 w-4" />
                </Link>
              )}

              {canViewReports && (
                <Link to="/incident-report-form" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/incident-report-form" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">Incident Report Form</span>
                  <FileText className="h-4 w-4" />
                </Link>
              )}
            </nav>
          </div>
          
          {canViewDashboard && (
            <div className="p-2 mt-4">
              <div className="text-right text-xs font-medium text-muted-foreground mb-2">الإعدادات</div>
              <nav className="space-y-1">
                {canViewUsers && (
                  <Link to="/users" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath.startsWith("/users") ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                    <span className="flex-1 text-right">المستخدمين</span>
                    <Users className="h-4 w-4" />
                  </Link>
                )}
                <Link to="/roles" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/roles" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">الأدوار والصلاحيات</span>
                  <UserCheck className="h-4 w-4" />
                </Link>
                <Link to="/settings" className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground ${currentPath === "/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}>
                  <span className="flex-1 text-right">الإعدادات</span>
                  <Settings className="h-4 w-4" />
                </Link>
              </nav>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-end">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="font-medium text-sm">{user?.name.slice(0, 2)}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-end gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <span>تسجيل خروج</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSidebar;
