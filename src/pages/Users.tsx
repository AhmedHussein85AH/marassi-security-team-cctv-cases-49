
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainSidebar from "@/components/MainSidebar";
import { userService } from "@/services/userService";
import { User } from "@/types/user";

export default function Users() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل المستخدمين",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      try {
        await userService.deleteUser(id);
        toast({
          title: "تم الحذف",
          description: "تم حذف المستخدم بنجاح",
        });
        loadUsers();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء حذف المستخدم",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="users" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-lg font-semibold">إدارة المستخدمين</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">المستخدمين</h1>
                <p className="text-muted-foreground">إدارة حسابات المستخدمين والصلاحيات</p>
              </div>
              <Button onClick={() => navigate("/users/add")}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة مستخدم جديد
              </Button>
            </div>

            <div className="rounded-md border bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-right align-middle font-medium">الاسم</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">البريد الإلكتروني</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">الدور</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">القسم</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">الحالة</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">آخر تسجيل دخول</th>
                      <th className="h-12 px-4 text-center align-middle font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="h-12 px-4 align-middle">{user.name}</td>
                        <td className="h-12 px-4 align-middle">{user.email}</td>
                        <td className="h-12 px-4 align-middle">{user.role}</td>
                        <td className="h-12 px-4 align-middle">{user.department}</td>
                        <td className="h-12 px-4 align-middle">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === "نشط" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="h-12 px-4 align-middle text-sm text-muted-foreground">
                          {user.lastLogin}
                        </td>
                        <td className="h-12 px-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/users/edit/${user.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
