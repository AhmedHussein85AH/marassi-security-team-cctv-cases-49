
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

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
              <h1 className="text-3xl font-bold tracking-tight">مرحباً {user?.name}</h1>
              <p className="text-muted-foreground">أهلاً بك في نظام إدارة الأمن</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-sm font-medium">إجمالي المستخدمين</h3>
                <p className="text-2xl font-bold">3</p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-sm font-medium">المستخدمين النشطين</h3>
                <p className="text-2xl font-bold">3</p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-sm font-medium">التقارير اليومية</h3>
                <p className="text-2xl font-bold">12</p>
              </div>
              
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-sm font-medium">الحوادث المفتوحة</h3>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
