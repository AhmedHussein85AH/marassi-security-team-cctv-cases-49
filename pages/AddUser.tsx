
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { userService } from "@/services/userService";
import { defaultUserValues } from "@/types/user";
import UserForm from "@/components/users/UserForm";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      // Create new user with default values and form data
      const newUser = {
        ...defaultUserValues,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: "نشط",
        permissions: [] // Will be set by service based on role
      };
      
      await userService.createUser(newUser);

      toast({
        title: "تم إضافة المستخدم",
        description: "تم إضافة المستخدم بنجاح",
      });
      
      navigate("/users");
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إضافة المستخدم",
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
              <h1 className="text-xl font-bold">إضافة مستخدم جديد</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Card>
              <CardHeader>
                <CardTitle>إضافة مستخدم جديد</CardTitle>
                <CardDescription>أدخل معلومات المستخدم الجديد</CardDescription>
              </CardHeader>
              
              <UserForm 
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                onCancel={handleCancel}
              />
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AddUser;
