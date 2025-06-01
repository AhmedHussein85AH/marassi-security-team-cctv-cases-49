
import React from "react";
import { 
  Shield, 
  AlertTriangle, 
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
import { Link } from "react-router-dom";
import NotificationDropdown from "@/components/NotificationDropdown";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import useIncidentStore from "@/stores/incidents";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

const Index = () => {
  const { incidents } = useIncidentStore();

  // حساب الإحصائيات الحقيقية
  const totalIncidents = incidents.length;
  const inProgressIncidents = incidents.filter(i => i.status === "قيد المعالجة").length;
  const resolvedIncidents = incidents.filter(i => i.status === "تم المعالجة").length;
  const newIncidents = incidents.filter(i => i.status === "جديد").length;

  // أحدث البلاغات (آخر 3 بلاغات)
  const latestIncidents = incidents
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  // محاكاة آخر تسجيلات الدخول (بيانات وهمية)
  const mockLoginActivities = [
    { id: 1, user: "أحمد محمد", time: "قبل 5 دقائق" },
    { id: 2, user: "سارة خالد", time: "قبل 15 دقيقة" },
    { id: 3, user: "محمد علي", time: "قبل 30 دقيقة" },
  ];

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="dashboard" />
        
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="بحث..." 
                className="h-9 md:w-[200px] lg:w-[300px] text-right"
                type="search" 
              />
              <div className="mr-auto flex items-center gap-2">
                <NotificationDropdown />
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
                <div className="text-2xl font-bold">{totalIncidents}</div>
                <p className="text-xs text-muted-foreground">جميع البلاغات المسجلة</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">بلاغات جديدة</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-100">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{newIncidents}</div>
                <p className="text-xs text-muted-foreground">بانتظار المعالجة</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">قيد المعالجة</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-yellow-100">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{inProgressIncidents}</div>
                <p className="text-xs text-muted-foreground">يتم العمل عليها حالياً</p>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow p-6">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-sm font-medium">تم الحل</h3>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{resolvedIncidents}</div>
                <p className="text-xs text-muted-foreground">تم معالجتها بنجاح</p>
              </Card>
            </div>
            
            {/* Add our updated charts component */}
            <DashboardCharts />
            
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <Card className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">آخر البلاغات</h3>
                  <div className="space-y-4">
                    {latestIncidents.length > 0 ? (
                      latestIncidents.map((incident) => (
                        <div key={incident.id} className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{incident.type} - {incident.id}</p>
                            <p className="text-xs text-muted-foreground">{incident.location}</p>
                            <p className="text-xs text-muted-foreground">بواسطة: {incident.reporter}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {incident.date}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">لا توجد بلاغات</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center border-t p-4">
                  <Button variant="ghost" size="sm" className="mr-auto" asChild>
                    <Link to="/incidents">عرض الكل</Link>
                  </Button>
                </div>
              </Card>
              
              <Card className="rounded-lg border bg-card text-card-foreground shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">آخر تسجيلات الدخول</h3>
                  <div className="space-y-4">
                    {mockLoginActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">تسجيل دخول ناجح</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center border-t p-4">
                  <Button variant="ghost" size="sm" className="mr-auto" asChild>
                    <Link to="/users">عرض الكل</Link>
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
