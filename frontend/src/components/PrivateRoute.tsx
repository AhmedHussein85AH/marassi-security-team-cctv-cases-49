
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // عرض رسالة للمستخدم عند عدم تسجيل الدخول
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        variant: "destructive",
        title: "الدخول مطلوب",
        description: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة",
      });
    }
  }, [user, isLoading, toast]);

  // إذا كان جاري التحميل، يمكن عرض شاشة تحميل
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل الدخول، توجيه إلى صفحة تسجيل الدخول مع حفظ المسار الأصلي
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
