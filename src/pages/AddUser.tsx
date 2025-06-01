
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import MainSidebar from "@/components/MainSidebar";
import { userService } from "@/services/userService";

export default function AddUser() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    phoneNumber: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
      });
      return;
    }

    setIsLoading(true);
    try {
      await userService.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        permissions: ["view_dashboard"]
      });

      toast({
        title: "تم إنشاء المستخدم",
        description: "تم إنشاء المستخدم بنجاح",
      });
      
      navigate("/users");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء المستخدم",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="users" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-lg font-semibold">إضافة مستخدم جديد</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">إضافة مستخدم جديد</h1>
              <p className="text-muted-foreground">قم بإدخال بيانات المستخدم الجديد</p>
            </div>
            
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>بيانات المستخدم</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">الدور</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="أدمن">أدمن</SelectItem>
                        <SelectItem value="مدير">مدير</SelectItem>
                        <SelectItem value="مشغل كاميرات">مشغل كاميرات</SelectItem>
                        <SelectItem value="أمن">أمن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">القسم</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر القسم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تقنية المعلومات">تقنية المعلومات</SelectItem>
                        <SelectItem value="إدارة العمليات">إدارة العمليات</SelectItem>
                        <SelectItem value="غرفة المراقبة">غرفة المراقبة</SelectItem>
                        <SelectItem value="الأمن">الأمن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "جاري الإنشاء..." : "إنشاء المستخدم"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/users")}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
