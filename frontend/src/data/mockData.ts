import { 
  User, 
  UserRole, 
  Incident, 
  IncidentPriority, 
  IncidentStatus, 
  IncidentCategory,
  Camera,
  CameraType,
  CameraStatus,
  Permission,
  PermissionCategory
} from '@/types';

// قائمة الصلاحيات
export const permissions: Permission[] = [
  {
    id: "1",
    name: "عرض_لوحة_التحكم",
    description: "عرض لوحة التحكم الرئيسية",
    category: PermissionCategory.DASHBOARD
  },
  {
    id: "2",
    name: "إنشاء_بلاغ",
    description: "إنشاء بلاغات جديدة",
    category: PermissionCategory.INCIDENTS
  },
  {
    id: "3",
    name: "تعديل_بلاغ",
    description: "تعديل البلاغات القائمة",
    category: PermissionCategory.INCIDENTS
  },
  {
    id: "4",
    name: "عرض_الكاميرات",
    description: "عرض بث الكاميرات المباشر",
    category: PermissionCategory.CAMERAS
  },
  {
    id: "5",
    name: "إدارة_المستخدمين",
    description: "إدارة حسابات المستخدمين",
    category: PermissionCategory.USERS
  }
];

// قائمة المستخدمين
export const users: User[] = [
  {
    id: "1",
    name: "محمد العتيبي",
    email: "m.alotaibi@security.com",
    password: "Security@2024", // للتطوير فقط
    role: UserRole.ADMIN,
    department: "إدارة الأمن",
    phoneNumber: "0555555555",
    lastLogin: new Date("2024-01-20T08:30:00"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-20"),
    isActive: true,
    permissions: permissions
  },
  {
    id: "2",
    name: "سارة القحطاني",
    email: "s.alqahtani@security.com",
    password: "Security@2024", // للتطوير فقط
    role: UserRole.SUPERVISOR,
    department: "غرفة العمليات",
    phoneNumber: "0566666666",
    lastLogin: new Date("2024-01-19T14:20:00"),
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-19"),
    isActive: true,
    permissions: permissions.filter(p => 
      [PermissionCategory.DASHBOARD, PermissionCategory.INCIDENTS, PermissionCategory.CAMERAS].includes(p.category)
    )
  }
];

// قائمة البلاغات
export const incidents: Incident[] = [
  {
    id: "1",
    title: "محاولة دخول غير مصرح",
    description: "تم رصد محاولة دخول غير مصرح بها عند البوابة الشرقية",
    location: "البوابة الشرقية - مبنى A",
    priority: IncidentPriority.HIGH,
    status: IncidentStatus.RESOLVED,
    category: IncidentCategory.SECURITY,
    reporterId: "2",
    assignedTo: "1",
    attachments: [],
    comments: [
      {
        id: "1",
        content: "تم التعامل مع الحالة وإبلاغ الجهات المختصة",
        authorId: "1",
        createdAt: new Date("2024-01-15T10:30:00"),
        updatedAt: new Date("2024-01-15T10:30:00")
      }
    ],
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T11:00:00"),
    resolvedAt: new Date("2024-01-15T11:00:00")
  },
  {
    id: "2",
    title: "عطل في كاميرا المراقبة",
    description: "انقطاع في بث الكاميرا رقم 12 في الممر الرئيسي",
    location: "الطابق الثاني - مبنى B",
    priority: IncidentPriority.MEDIUM,
    status: IncidentStatus.IN_PROGRESS,
    category: IncidentCategory.MAINTENANCE,
    reporterId: "2",
    assignedTo: "1",
    attachments: [],
    comments: [],
    createdAt: new Date("2024-01-20T09:00:00"),
    updatedAt: new Date("2024-01-20T09:00:00")
  }
];

// قائمة الكاميرات
export const cameras: Camera[] = [
  {
    id: "1",
    name: "كاميرا البوابة الرئيسية",
    location: "المدخل الرئيسي",
    type: CameraType.PTZ,
    status: CameraStatus.ONLINE,
    ipAddress: "192.168.1.101",
    installationDate: new Date("2023-06-15"),
    isRecording: true
  },
  {
    id: "2",
    name: "كاميرا موقف السيارات",
    location: "موقف السيارات الشمالي",
    type: CameraType.FIXED,
    status: CameraStatus.ONLINE,
    ipAddress: "192.168.1.102",
    installationDate: new Date("2023-06-15"),
    isRecording: true
  },
  {
    id: "3",
    name: "كاميرا المخزن",
    location: "مخزن المعدات",
    type: CameraType.THERMAL,
    status: CameraStatus.MAINTENANCE,
    ipAddress: "192.168.1.103",
    lastMaintenance: new Date("2024-01-19"),
    installationDate: new Date("2023-06-15"),
    isRecording: false
  }
]; 