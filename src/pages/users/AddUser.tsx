import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, Save, UserPlus, AlertTriangle } from "lucide-react";
import MainSidebar from "@/components/MainSidebar";
import { userService } from "@/services/userService";
import { defaultUserValues } from "@/types/user";
import UserForm from "@/components/users/UserForm";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const AddUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // التحقق من صلاحيات المستخدم الحالي
      if (!currentUser?.permissions?.includes('manage_users')) {
        throw new Error('ليس لديك صلاحية لإضافة مستخدمين');
      }

      // التحقق من تطابق كلمة المرور
      if (formData.password !== formData.confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      // التحقق من قوة كلمة المرور
      if (formData.password.length < 8) {
        throw new Error('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
      }

      // Create new user with default values and form data
      const newUser = {
        ...defaultUserValues,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: "نشط",
        permissions: [], // Will be set by service based on role
        createdBy: currentUser?.id,
        createdAt: new Date().toISOString()
      };
      
      await userService.createUser(newUser);

      toast({
        title: "تم إضافة المستخدم",
        description: "تم إضافة المستخدم بنجاح",
      });
      
      // إرسال إشعار للمدير
      if (currentUser?.role === 'مدير') {
        toast({
          title: "إشعار للمدير",
          description: `تم إضافة مستخدم جديد بواسطة ${currentUser.name}`,
        });
      }
      
      navigate("/users");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء إضافة المستخدم";
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="users" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/users")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">إضافة مستخدم جديد</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  إضافة مستخدم جديد
                </CardTitle>
                <CardDescription>أدخل معلومات المستخدم الجديد</CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>خطأ</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <UserForm 
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  onCancel={handleCancel}
                />
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  form="user-form"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AddUser; 