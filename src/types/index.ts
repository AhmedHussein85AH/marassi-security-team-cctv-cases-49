// نموذج المستخدم
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  phoneNumber: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  permissions: Permission[];
}

// الأدوار المتاحة
export enum UserRole {
  ADMIN = "أدمن",
  MANAGER = "مدير",
  SUPERVISOR = "مشرف",
  OPERATOR = "مشغل",
  SECURITY = "أمن"
}

// نموذج البلاغ
export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  category: IncidentCategory;
  reporterId: string;
  assignedTo?: string;
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

// أولويات البلاغ
export enum IncidentPriority {
  HIGH = "عالي",
  MEDIUM = "متوسط",
  LOW = "منخفض"
}

// حالات البلاغ
export enum IncidentStatus {
  NEW = "جديد",
  IN_PROGRESS = "قيد المعالجة",
  PENDING = "معلق",
  RESOLVED = "تم الحل",
  CLOSED = "مغلق"
}

// تصنيفات البلاغ
export enum IncidentCategory {
  SECURITY = "أمني",
  SAFETY = "سلامة",
  MAINTENANCE = "صيانة",
  IT = "تقنية معلومات",
  OTHER = "أخرى"
}

// نموذج المرفقات
export interface Attachment {
  id: string;
  filename: string;
  path: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

// نموذج التعليقات
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

// نموذج الكاميرا
export interface Camera {
  id: string;
  name: string;
  location: string;
  type: CameraType;
  status: CameraStatus;
  ipAddress: string;
  lastMaintenance?: Date;
  installationDate: Date;
  isRecording: boolean;
}

// أنواع الكاميرات
export enum CameraType {
  PTZ = "متحركة",
  FIXED = "ثابتة",
  THERMAL = "حرارية",
  DOME = "قبة"
}

// حالات الكاميرا
export enum CameraStatus {
  ONLINE = "متصل",
  OFFLINE = "غير متصل",
  MAINTENANCE = "صيانة"
}

// نموذج الصلاحيات
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
}

// تصنيفات الصلاحيات
export enum PermissionCategory {
  DASHBOARD = "لوحة التحكم",
  INCIDENTS = "البلاغات",
  CAMERAS = "الكاميرات",
  REPORTS = "التقارير",
  USERS = "المستخدمين",
  SETTINGS = "الإعدادات"
} 