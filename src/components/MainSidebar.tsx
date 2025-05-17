
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  AlertTriangle, 
  Camera, 
  FileText, 
  Users, 
  Settings, 
  Shield
} from "lucide-react";

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
  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded-md">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">نظام الأمن</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "dashboard"} tooltip="لوحة التحكم">
                  <Home />
                  <span>لوحة التحكم</span>
                </SidebarMenuButton>
                <Link to="/" />
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "incidents"} tooltip="البلاغات">
                  <AlertTriangle />
                  <span>البلاغات</span>
                </SidebarMenuButton>
                <Link to="/incidents" />
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "cameras"} tooltip="الكاميرات">
                  <Camera />
                  <span>الكاميرات</span>
                </SidebarMenuButton>
                <Link to="/cameras" />
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "reports"} tooltip="التقارير">
                  <FileText />
                  <span>التقارير</span>
                </SidebarMenuButton>
                <Link to="/reports" />
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "users"} tooltip="المستخدمين">
                  <Users />
                  <span>المستخدمين</span>
                </SidebarMenuButton>
                <Link to="/users" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeItem === "settings"} tooltip="الإعدادات">
                  <Settings />
                  <span>الإعدادات</span>
                </SidebarMenuButton>
                <Link to="/settings" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <SidebarSeparator />
          <div className="flex items-center gap-3 mt-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="font-medium text-sm">أح</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">أحمد محمد</span>
              <span className="text-xs text-muted-foreground">أدمن</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
