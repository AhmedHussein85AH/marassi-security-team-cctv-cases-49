
import React from "react";
import { 
  Shield, 
  AlertTriangle, 
  Camera, 
  User, 
  FileText, 
  Bell, 
  Search,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950">
        <MainSidebar activeItem="dashboard" />
        
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="بحث..." 
                className="h-9 md:w-[200px] lg:w-[300px]"
                type="search" 
              />
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
              <p className="text-muted-foreground">مرحبًا بك في نظام إدارة بلاغات الأمن</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">إجمالي البلاغات</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-green-600">↑ 12% من الشهر الماضي</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">بلاغات قيد المعالجة</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-yellow-100">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-red-600">↑ 3% من الأسبوع الماضي</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">بلاغات تم حلها</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">16</div>
                <p className="text-xs text-green-600">↑ 8% من الشهر الماضي</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">كاميرات المراقبة</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100">
                    <Camera className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-green-600">2 تنبيهات جديدة</p>
              </Card>
            </div>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">آخر البلاغات</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">بلاغ سرقة #{i}</p>
                          <p className="text-xs text-muted-foreground">فيلا رقم {i * 10}</p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          قبل {i} ساعات
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center border-t p-4">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    عرض الكل
                  </Button>
                </div>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">أنشطة الكاميرات</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Camera className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">كاميرا {i}</p>
                          <p className="text-xs text-muted-foreground">تم اكتشاف حركة</p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          قبل {i * 10} دقائق
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center border-t p-4">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    عرض الكل
                  </Button>
                </div>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">آخر تسجيلات الدخول</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">مستخدم {i}</p>
                          <p className="text-xs text-muted-foreground">تسجيل دخول ناجح</p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center border-t p-4">
                  <Button variant="ghost" size="sm" className="ml-auto">
                    عرض الكل
                  </Button>
                </div>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
