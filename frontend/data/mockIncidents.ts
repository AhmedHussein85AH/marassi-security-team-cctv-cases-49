
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
  { 
    id: "INC-004", 
    type: "مشاجرة", 
    location: "ملعب الأطفال", 
    date: "2025-05-18", 
    time: "16:30", 
    status: "قيد المعالجة",
    reporter: "فاطمة علي",
    description: "مشاجرة بين مجموعة من الشباب في ملعب الأطفال",
    propertyInfo: "منطقة الألعاب",
    vehicleInfo: "",
    priority: "عالي",
    category: "أمني",
    createdAt: "2025-05-18 16:35",
    lastUpdated: "2025-05-18 17:00",
    comments: [],
    operatorNotes: "تم إرسال فريق الأمن"
  },
  { 
    id: "INC-005", 
    type: "ركن مخالف", 
    location: "شارع النخيل", 
    date: "2025-05-19", 
    time: "08:00", 
    status: "جديد",
    reporter: "محمد حسن",
    description: "سيارة متوقفة في مكان محظور أمام المدخل",
    propertyInfo: "شارع النخيل",
    vehicleInfo: "هونداي إلانترا سوداء - لوحة 5678 XYZ",
    priority: "متوسط",
    category: "مرور",
    createdAt: "2025-05-19 08:05",
    lastUpdated: "2025-05-19 08:05",
    comments: [],
    operatorNotes: ""
  },
  { 
    id: "INC-006", 
    type: "سرعة زائدة", 
    location: "الشارع الداخلي", 
    date: "2025-05-20", 
    time: "14:15", 
    status: "قيد المعالجة",
    reporter: "عائشة المالكي",
    description: "سيارة تسير بسرعة زائدة في المنطقة السكنية",
    propertyInfo: "الشارع الداخلي",
    vehicleInfo: "BMW X5 أبيض",
    priority: "متوسط",
    category: "مرور",
    createdAt: "2025-05-20 14:20",
    lastUpdated: "2025-05-20 14:20",
    comments: [],
    operatorNotes: "تم رصد السيارة في الكاميرات"
  },
  { 
    id: "INC-007", 
    type: "إزعاج", 
    location: "فيلا رقم 42", 
    date: "2025-05-21", 
    time: "23:30", 
    status: "تم المعالجة",
    reporter: "نور الدين",
    description: "موسيقى عالية ومزعجة من إحدى الفيلل",
    propertyInfo: "فيلا رقم 42، بلوك A",
    vehicleInfo: "",
    priority: "منخفض",
    category: "شكوى",
    createdAt: "2025-05-21 23:35",
    lastUpdated: "2025-05-22 00:15",
    comments: [
      { 
        id: "com4",
        text: "تم التواصل مع صاحب الفيلا وحل المشكلة", 
        user: "أحمد الأمني", 
        timestamp: "00:10" 
      }
    ],
    operatorNotes: "تم حل المشكلة بالتواصل المباشر"
  },
  { 
    id: "INC-008", 
    type: "تلف حوض زراعة", 
    location: "الحديقة العامة", 
    date: "2025-05-22", 
    time: "10:00", 
    status: "جديد",
    reporter: "البستاني المسؤول",
    description: "تلف في أحد أحواض الزراعة في الحديقة العامة",
    propertyInfo: "الحديقة العامة - القسم الشمالي",
    vehicleInfo: "",
    priority: "منخفض",
    category: "صيانة",
    createdAt: "2025-05-22 10:05",
    lastUpdated: "2025-05-22 10:05",
    comments: [],
    operatorNotes: ""
  }
];
