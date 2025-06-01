
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AddUser() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا يمكن إضافة منطق حفظ المستخدم
    alert("تم إنشاء المستخدم بنجاح!");
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">إضافة مستخدم جديد</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => navigate("/users")}
                className="text-gray-600 hover:text-gray-900"
              >
                المستخدمين
              </button>
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                الرئيسية
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">إضافة مستخدم جديد</h1>
            <p className="text-gray-600">قم بإدخال بيانات المستخدم الجديد</p>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    الدور
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    required
                  >
                    <option value="">اختر الدور</option>
                    <option value="أدمن">أدمن</option>
                    <option value="مدير">مدير</option>
                    <option value="مشغل كاميرات">مشغل كاميرات</option>
                    <option value="أمن">أمن</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    القسم
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    required
                  >
                    <option value="">اختر القسم</option>
                    <option value="تقنية المعلومات">تقنية المعلومات</option>
                    <option value="إدارة العمليات">إدارة العمليات</option>
                    <option value="غرفة المراقبة">غرفة المراقبة</option>
                    <option value="الأمن">الأمن</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    إنشاء المستخدم
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/users")}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
