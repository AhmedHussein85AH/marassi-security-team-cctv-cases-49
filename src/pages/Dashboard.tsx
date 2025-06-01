
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Shield, Camera, FileText } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: "15",
      description: "المستخدمون النشطون",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "البلاغات الجديدة",
      value: "8",
      description: "تحتاج للمراجعة",
      icon: Shield,
      color: "text-red-500"
    },
    {
      title: "الكاميرات النشطة",
      value: "12",
      description: "تعمل بشكل طبيعي",
      icon: Camera,
      color: "text-green-500"
    },
    {
      title: "التقارير الشهرية",
      value: "3",
      description: "تم إنشاؤها هذا الشهر",
      icon: FileText,
      color: "text-purple-500"
    }
  ];

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="dashboard" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-lg font-semibold">لوحة التحكم</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">مرحباً، {user?.name}</h1>
              <p className="text-muted-foreground">نظرة عامة على حالة النظام</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>آخر الأنشطة</CardTitle>
                  <CardDescription>
                    الأحداث الأخيرة في النظام
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تم تسجيل دخول مستخدم جديد</p>
                        <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تم إنشاء بلاغ جديد</p>
                        <p className="text-xs text-muted-foreground">منذ 15 دقيقة</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">تحديث حالة كاميرا</p>
                        <p className="text-xs text-muted-foreground">منذ 30 دقيقة</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>
                    معلومات حسابك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">الاسم: </span>
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">البريد الإلكتروني: </span>
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">الدور: </span>
                      <span className="text-sm">{user?.role}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">القسم: </span>
                      <span className="text-sm">{user?.department}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">آخر تسجيل دخول: </span>
                      <span className="text-sm">{user?.lastLogin}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
