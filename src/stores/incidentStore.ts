
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// تعريف نوع البيانات
export interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
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
  priority?: string;
  category?: string;
  assignedTo?: string;
  attachments?: Attachment[];
  createdAt?: string;
  lastUpdated?: string;
}

interface IncidentState {
  incidents: Incident[];
  getIncidentById: (id: string) => Incident | undefined;
  updateIncident: (updatedIncident: Incident) => void;
  addIncident: (newIncident: Incident) => void;
  deleteIncident: (id: string) => void;
  addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  updateStatus: (incidentId: string, newStatus: string, operatorNotes?: string) => void;
  assignIncident: (incidentId: string, userId: string) => void;
}

// بيانات البلاغات التجريبية
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
            incident.id === updatedIncident.id ? 
              { 
                ...updatedIncident,
                lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) 
              } : incident
          )
        }));
      },

      addIncident: (newIncident: Incident) => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        const incidentWithMetadata = {
          ...newIncident,
          createdAt: now,
          lastUpdated: now,
          attachments: newIncident.attachments || [],
          priority: newIncident.priority || "متوسط",
          category: newIncident.category || "أمني"
        };
        
        set(state => ({
          incidents: [...state.incidents, incidentWithMetadata]
        }));
      },
      
      deleteIncident: (id: string) => {
        set(state => ({
          incidents: state.incidents.filter(incident => incident.id !== id)
        }));
      },
      
      addComment: (incidentId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        const newComment = {
          id: `com-${Date.now()}`,
          ...comment,
          timestamp: now.split(' ')[1]
        };
        
        set(state => ({
          incidents: state.incidents.map(incident => 
            incident.id === incidentId ?
              {
                ...incident,
                comments: [...incident.comments, newComment],
                lastUpdated: now
              } : incident
          )
        }));
      },
      
      updateStatus: (incidentId: string, newStatus: string, operatorNotes?: string) => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        set(state => ({
          incidents: state.incidents.map(incident => 
            incident.id === incidentId ?
              {
                ...incident,
                status: newStatus,
                operatorNotes: operatorNotes !== undefined ? operatorNotes : incident.operatorNotes,
                lastUpdated: now
              } : incident
          )
        }));
      },
      
      assignIncident: (incidentId: string, userId: string) => {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        
        set(state => ({
          incidents: state.incidents.map(incident => 
            incident.id === incidentId ?
              {
                ...incident,
                assignedTo: userId,
                lastUpdated: now
              } : incident
          )
        }));
      }
    }),
    {
      name: 'incidents-storage',
    }
  )
);

export default useIncidentStore;
