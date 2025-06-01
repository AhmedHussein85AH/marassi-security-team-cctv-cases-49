
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface UserFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
  initialData?: FormData;
  isEditMode?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  isLoading, 
  submitButtonText, 
  initialData,
  isEditMode = false 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!isEditMode || formData.password.trim()) {
      if (!formData.password.trim()) {
        newErrors.password = "كلمة المرور مطلوبة";
      } else if (formData.password.length < 6) {
        newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      }
    }

    if (!formData.role) {
      newErrors.role = "الدور مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const availableRoles = [
    { value: "أدمن", label: "أدمن" },
    { value: "مدير", label: "مدير" },
    { value: "مشغل كاميرات", label: "مشغل كاميرات" },
    { value: "مراقبة بيانات", label: "مراقبة بيانات" }
  ];

  return (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            type="text"
            placeholder="أدخل الاسم الكامل"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`text-right ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="text-sm text-red-500 text-right">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`text-right ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-sm text-red-500 text-right">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">الدور</Label>
          <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
            <SelectTrigger className={`text-right ${errors.role ? "border-red-500" : ""}`}>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-red-500 text-right">{errors.role}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            كلمة المرور {isEditMode && "(اتركها فارغة للاحتفاظ بكلمة المرور الحالية)"}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={isEditMode ? "كلمة مرور جديدة (اختيارية)" : "أدخل كلمة المرور"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`text-right ${errors.password ? "border-red-500" : ""}`}
          />
          {errors.password && <p className="text-sm text-red-500 text-right">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="أعد إدخال كلمة المرور"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={`text-right ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 text-right">{errors.confirmPassword}</p>}
        </div>

        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/users")}
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : submitButtonText}
          </Button>
        </div>
      </form>
    </CardContent>
  );
};

export default UserForm;
