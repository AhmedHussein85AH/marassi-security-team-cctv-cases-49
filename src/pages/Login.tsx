import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950" dir="rtl">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary p-2 rounded-lg mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">نظام الأمن</h2>
          <p className="text-muted-foreground mt-2">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <label className="text-sm font-medium block text-right">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block text-right">
              كلمة المرور
            </label>
            <Input
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-right"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
