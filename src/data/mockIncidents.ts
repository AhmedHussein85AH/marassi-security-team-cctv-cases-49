
import { Incident } from "@/types/incident";

// بيانات البلاغات التجريبية
export const mockIncidents: Incident[] = [
  { 
    id: "INC-001", 
    type: "سرقة", 
    location: "فيلا رقم 15", 
    date: "2025-05-15", 
    time: "14:30", 
    status: "قيد المعالجة",
    reporter: "أحمد محمد",
    description: "تم ملاحظة محاولة سرقة من الفيلا، شخص مجهول حاول كسر النافذة الخلفية",
    propertyInfo: "فيلا رقم 15، بلوك C",
    vehicleInfo: "",
    priority: "عالي",
    category: "أمني",
    assignedTo: "سارة خالد",
    attachments: [
      {
        id: "att1",
        name: "صورة من كاميرا المراقبة",
        url: "/placeholder.svg",
        type: "image/jpeg",
        size: "1.2 MB",
        uploadedBy: "أحمد محمد",
        uploadedAt: "2025-05-15 14:45"
      }
    ],
    createdAt: "2025-05-15 14:35",
    lastUpdated: "2025-05-15 17:20",
    comments: [
      { 
        id: "com1",
        text: "تم استلام البلاغ وجاري العمل عليه", 
        user: "سارة خالد", 
        timestamp: "15:30" 
      },
      { 
        id: "com2",
        text: "تم مراجعة الكاميرات", 
        user: "محمد علي", 
        timestamp: "16:00" 
      }
    ],
    operatorNotes: "تم رصد شخص مشبوه في الكاميرات"
  },
  { 
    id: "INC-002", 
    type: "حادث", 
    location: "مدخل المجمع الرئيسي", 
    date: "2025-05-16", 
    time: "09:45", 
    status: "تم المعالجة",
    reporter: "سارة أحمد",
    description: "حادث تصادم بسيط عند المدخل الرئيسي",
    propertyInfo: "المدخل الرئيسي",
    vehicleInfo: "تويوتا كامري أبيض - لوحة 1234 ABC",
    priority: "متوسط",
    category: "حادث",
    assignedTo: "خالد عبدالله",
    createdAt: "2025-05-16 09:50",
    lastUpdated: "2025-05-16 11:30",
    comments: [
      { 
        id: "com3",
        text: "تم إرسال فريق الأمن", 
        user: "خالد عمر", 
        timestamp: "10:00" 
      }
    ],
    operatorNotes: "تم التعامل مع الحادث وتوثيقه"
  },
  { 
    id: "INC-003", 
    type: "تحرش", 
    location: "منطقة الحديقة", 
    date: "2025-05-17", 
    time: "18:15", 
    status: "معلق",
    reporter: "خالد إبراهيم",
    description: "تم الإبلاغ عن سلوك مشبوه في منطقة الحديقة",
    propertyInfo: "الحديقة المركزية",
    vehicleInfo: "",
    priority: "عالي",
    category: "أمني",
    createdAt: "2025-05-17 18:20",
    lastUpdated: "2025-05-17 19:00",
    comments: [],
    operatorNotes: "بانتظار مزيد من المعلومات"
  },
];
