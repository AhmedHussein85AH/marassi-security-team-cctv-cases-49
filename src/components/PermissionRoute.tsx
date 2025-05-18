import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermission: string;
}

export default function PermissionRoute({ children, requiredPermission }: PermissionRouteProps) {
  const { user } = useAuth();

  // التحقق من تسجيل الدخول أولاً
  if (!user) {
    return <Navigate to="/login" />;
  }

  // التحقق من الصلاحية
  if (!authService.hasPermission(user, requiredPermission)) {
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