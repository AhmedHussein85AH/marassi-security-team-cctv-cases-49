
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import UserForm from "@/components/users/UserForm";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [initialData, setInitialData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (id) {
          const userData = await userService.getUserById(parseInt(id));
          setUser(userData);
          setInitialData({
            name: userData.name,
            email: userData.email,
            password: "",
            confirmPassword: "",
            role: userData.role
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل بيانات المستخدم",
        });
        navigate("/users");
      }
    };

    loadUser();
  }, [id, navigate, toast]);

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (!id) throw new Error("معرف المستخدم غير موجود");
      
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      await userService.updateUser(parseInt(id), updateData);

      toast({
        title: "تم تحديث المستخدم",
        description: "تم تحديث بيانات المستخدم بنجاح",
      });
      
      navigate("/users");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث المستخدم",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
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
              <h1 className="text-lg font-semibold">تعديل المستخدم</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">تعديل المستخدم</h1>
              <p className="text-muted-foreground">تعديل بيانات المستخدم {user.name}</p>
            </div>
            
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>بيانات المستخدم</CardTitle>
                <CardDescription>قم بتعديل المعلومات المطلوبة</CardDescription>
              </CardHeader>
              <UserForm 
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                submitButtonText="تحديث المستخدم"
                initialData={initialData}
                isEditMode={true}
              />
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EditUser;
