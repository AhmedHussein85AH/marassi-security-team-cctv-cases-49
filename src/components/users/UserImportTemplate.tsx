
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserImportTemplate = () => {
  const { toast } = useToast();

  const downloadTemplate = () => {
    // Create a simple CSV template
    const csvContent = "الاسم,البريد الإلكتروني,كلمة المرور,الدور,القسم,رقم الهاتف\nأحمد محمد,ahmed@example.com,123456,مدير,إدارة العمليات,0500000001\nسارة خالد,sarah@example.com,123456,مشغل كاميرات,غرفة المراقبة,0500000002";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "نموذج_استيراد_المستخدمين.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم تحميل النموذج",
      description: "تم تحميل نموذج استيراد المستخدمين بنجاح",
    });
  };

  return (
    <Button 
      variant="ghost"
      className="flex items-center gap-2"
      onClick={downloadTemplate}
    >
      <Download className="h-4 w-4" />
      تحميل نموذج Excel
    </Button>
  );
};

export default UserImportTemplate;
