
import React, { useState, useEffect } from "react";
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
import { Shield, User, Camera } from "lucide-react";
import {
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { roleService } from "@/services/roleService";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
  phoneNumber: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  department?: string;
  phoneNumber?: string;
}

interface UserFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<FormData>;
  onCancel: () => void;
  submitLabel?: string;
}

const UserForm = ({
  onSubmit,
  isLoading,
  initialData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    phoneNumber: "",
  },
  onCancel,
  submitLabel = "إضافة المستخدم"
}: UserFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name || "",
    email: initialData.email || "",
    password: initialData.password || "",
    confirmPassword: initialData.confirmPassword || "",
    role: initialData.role || "",
    department: initialData.department || "",
    phoneNumber: initialData.phoneNumber || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);

  // تحميل الأدوار المتاحة من خدمة الأدوار
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await roleService.getRoles();
        const rolesWithIcons = roles.map(role => ({
          value: role.name,
          label: role.name,
          icon: role.name === "أدمن" ? Shield : role.name === "مدير" ? User : Camera,
          color: role.name === "أدمن" ? "text-red-500" : role.name === "مدير" ? "text-blue-500" : "text-green-500"
        }));
        setAvailableRoles(rolesWithIcons);
      } catch (error) {
        console.error("خطأ في تحميل الأدوار:", error);
      }
    };
    
    loadRoles();
  }, []);

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

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    if (!formData.role) {
      newErrors.role = "الدور مطلوب";
    }

    if (!formData.department.trim()) {
      newErrors.department = "القسم مطلوب";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
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

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
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
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="أدخل كلمة المرور"
            value={formData.password}
            onChange={handleInputChange}
            className="text-right"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="أعد إدخال كلمة المرور"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="text-right"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="department">القسم</Label>
          <Input
            id="department"
            name="department"
            placeholder="أدخل القسم"
            value={formData.department}
            onChange={handleInputChange}
            className="text-right"
          />
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="phoneNumber">رقم الهاتف</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="أدخل رقم الهاتف"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="text-right"
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="role">الدور</Label>
          <Select
            value={formData.role}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 ${role.color}`} />
                      <span>{role.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          type="button"
          onClick={onCancel}
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "جاري العمل..." : submitLabel}
        </Button>
      </CardFooter>
    </form>
  );
};

export default UserForm;
