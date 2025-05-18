import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// تعريف نوع البيانات
export interface Comment {
  text: string;
  user: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  type: string;
  location: string;
  date: string;
  time: string;
  status: string;
  reporter: string;
  description: string;
  propertyInfo: string;
  vehicleInfo: string;
  comments: Comment[];
  operatorNotes: string;
}

interface IncidentState {
  incidents: Incident[];
  getIncidentById: (id: string) => Incident | undefined;
  updateIncident: (updatedIncident: Incident) => void;
  addIncident: (newIncident: Incident) => void;
}

// نموذج البيانات الأولي
const mockIncidents: Incident[] = [
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
    comments: [
      { text: "تم استلام البلاغ وجاري العمل عليه", user: "سارة خالد", timestamp: "15:30" },
      { text: "تم مراجعة الكاميرات", user: "محمد علي", timestamp: "16:00" }
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
    comments: [
      { text: "تم إرسال فريق الأمن", user: "خالد عمر", timestamp: "10:00" }
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
    comments: [],
    operatorNotes: "بانتظار مزيد من المعلومات"
  },
];

const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: mockIncidents,
      
      getIncidentById: (id: string) => {
        return get().incidents.find(incident => incident.id === id);
      },

      updateIncident: (updatedIncident: Incident) => {
        set(state => ({
          incidents: state.incidents.map(incident =>
            incident.id === updatedIncident.id ? updatedIncident : incident
          )
        }));
      },

      addIncident: (newIncident: Incident) => {
        set(state => ({
          incidents: [...state.incidents, newIncident]
        }));
      },
    }),
    {
      name: 'incidents-storage',
    }
  )
);

export default useIncidentStore; 