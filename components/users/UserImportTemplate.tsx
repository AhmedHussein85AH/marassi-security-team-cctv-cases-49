import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const UserImportTemplate = () => {
  const handleDownloadTemplate = () => {
    // قم بإنشاء بيانات نموذجية
    const templateData = [
      {
        "الاسم": "اسم المستخدم",
        "البريد الإلكتروني": "example@email.com",
        "كلمة المرور": "123456",
        "الدور": "مدير/مشغل كاميرات/أدمن",
        "الحالة": "نشط/غير نشط"
      }
    ];

    // تحويل البيانات إلى CSV مع دعم العربية
    const headers = Object.keys(templateData[0]);
    const rows = [
      headers.join('\t'),
      Object.values(templateData[0]).join('\t')
    ];
    
    // إضافة BOM للدعم الأفضل للغة العربية
    const BOM = '\ufeff';
    const csvContent = BOM + rows.join('\n');

    // إنشاء ملف للتحميل
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8-sig;' 
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'قالب_المستخدمين.xls';
    link.click();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleDownloadTemplate}
    >
      <Download className="h-4 w-4" />
      تحميل قالب Excel
    </Button>
  );
};

export default UserImportTemplate; 