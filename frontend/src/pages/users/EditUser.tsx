import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Shield, User as UserIcon, Camera, ArrowLeft, Save, AlertTriangle, Loader2 } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { Switch } from "@/components/ui/switch";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface FormData {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
}

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    status: "نشط"
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await userService.getUserById(Number(id));
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status || "نشط"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء تحميل بيانات المستخدم";
      setError(errorMessage);
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
      navigate("/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
    if (errors.role) {
      setErrors(prev => ({
        ...prev,
        role: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم المستخدم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.role) {
      newErrors.role = "الدور مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // التحقق من صلاحيات المستخدم الحالي
        if (!currentUser?.permissions?.includes('manage_users')) {
          throw new Error('ليس لديك صلاحية لتعديل المستخدمين');
        }

        // التحقق من عدم تعديل دور المستخدم الحالي
        if (currentUser?.id === Number(id) && formData.role !== currentUser.role) {
          throw new Error('لا يمكنك تغيير دورك الخاص');
        }

        await userService.updateUser(Number(id), {
          ...formData,
          updatedBy: currentUser?.id,
          updatedAt: new Date().toISOString()
        });

        toast({
          title: "تم تحديث المستخدم",
          description: "تم تحديث بيانات المستخدم بنجاح",
        });
        
        // إرسال إشعار للمدير
        if (currentUser?.role === 'مدير') {
          toast({
            title: "إشعار للمدير",
            description: `تم تحديث بيانات المستخدم ${formData.name} بواسطة ${currentUser.name}`,
          });
        }
        
        navigate("/users");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء تحديث المستخدم";
        setError(errorMessage);
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'أدمن': { color: 'bg-red-500', icon: <Shield className="w-4 h-4" /> },
      'مدير': { color: 'bg-blue-500', icon: <UserIcon className="w-4 h-4" /> },
      'مشغل كاميرات': { color: 'bg-green-500', icon: <Camera className="w-4 h-4" /> }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || { color: 'bg-gray-500', icon: <UserIcon className="w-4 h-4" /> };

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        {role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
          <MainSidebar activeItem="users" />
          <SidebarInset className="overflow-auto">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg">جاري تحميل البيانات...</p>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/users")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">تعديل المستخدم</h1>
              {user && getRoleBadge(user.role)}
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    تعديل المستخدم
                  </CardTitle>
                  <CardDescription>تعديل بيانات المستخدم</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>خطأ</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="name">اسم المستخدم</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="أدخل اسم المستخدم"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-right"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل البريد الإلكتروني"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="text-right"
                      dir="ltr"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="role">الدور</Label>
                    <Select
                      value={formData.role}
                      onValueChange={handleRoleChange}
                      disabled={currentUser?.id === Number(id)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="أدمن">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span>أدمن</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="مدير">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-500" />
                            <span>مدير</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="مشغل كاميرات">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4 text-green-500" />
                            <span>مشغل كاميرات</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-500">{errors.role}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="status">حالة الحساب</Label>
                    <Switch
                      id="status"
                      checked={formData.status === "نشط"}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          status: checked ? "نشط" : "غير نشط"
                        }))
                      }
                      disabled={currentUser?.id === Number(id)}
                    />
                    <span>{formData.status}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate("/users")}
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    type="submit"
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
                        حفظ التغييرات
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default EditUser; 