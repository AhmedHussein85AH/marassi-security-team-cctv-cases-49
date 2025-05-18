
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export default function PermissionRoute({ children, requiredPermission }: PermissionRouteProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // التحقق من تسجيل الدخول أولاً
  if (!user) {
    return <Navigate to="/login" />;
  }

  // التحقق من الصلاحية
  const hasPermission = authService.hasPermission(user, requiredPermission);

  // عند عدم وجود الصلاحية، أظهر تنبيه
  useEffect(() => {
    if (!hasPermission) {
      toast({
        variant: "destructive",
        title: "غير مصرح",
        description: "ليس لديك صلاحية الوصول إلى هذه الصفحة",
      });
    }
  }, [hasPermission, toast]);

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">غير مصرح</h1>
        <p className="text-lg text-gray-600 mb-8">
          عذراً، ليس لديك صلاحية الوصول إلى هذه الصفحة
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          العودة للصفحة السابقة
        </button>
      </div>
    );
  }

  return children;
}
