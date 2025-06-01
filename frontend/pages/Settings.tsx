import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="settings" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">الإعدادات</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
              <p className="text-muted-foreground">تخصيص وإدارة إعدادات النظام</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات عامة</CardTitle>
                  <CardDescription>الإعدادات العامة للنظام</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-right">قريباً - سيتم إضافة إعدادات النظام</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                  <CardDescription>تخصيص إعدادات الإشعارات والتنبيهات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-right">قريباً - سيتم إضافة إعدادات الإشعارات</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الأمان</CardTitle>
                  <CardDescription>إدارة إعدادات الأمان والخصوصية</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-right">قريباً - سيتم إضافة إعدادات الأمان</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings; 