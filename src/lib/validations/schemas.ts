import { z } from 'zod';

// Incident Schemas
export const incidentSchema = z.object({
  title: z.string().min(3, 'العنوان يجب أن يكون 3 أحرف على الأقل').max(100, 'العنوان يجب أن لا يتجاوز 100 حرف'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  location: z.string().min(3, 'الموقع يجب أن يكون 3 أحرف على الأقل'),
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    required_error: 'يجب تحديد مستوى الخطورة',
  }),
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed'], {
    required_error: 'يجب تحديد الحالة',
  }),
  assignedTo: z.number().optional(),
  cameraId: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

export const incidentCommentSchema = z.object({
  text: z.string().min(1, 'التعليق لا يمكن أن يكون فارغاً'),
  userId: z.number(),
});

export const incidentStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed'], {
    required_error: 'يجب تحديد الحالة',
  }),
});

// Camera Schemas
export const cameraSchema = z.object({
  name: z.string().min(3, 'اسم الكاميرا يجب أن يكون 3 أحرف على الأقل').max(50, 'اسم الكاميرا يجب أن لا يتجاوز 50 حرف'),
  location: z.string().min(3, 'الموقع يجب أن يكون 3 أحرف على الأقل'),
  model: z.string().min(1, 'يجب تحديد نموذج الكاميرا'),
  status: z.enum(['active', 'inactive', 'maintenance', 'offline'], {
    required_error: 'يجب تحديد حالة الكاميرا',
  }),
  ipAddress: z.string().ip('يجب إدخال عنوان IP صحيح'),
  resolution: z.string().optional(),
  lastMaintenance: z.string().datetime().optional(),
});

export const maintenanceRecordSchema = z.object({
  type: z.enum(['routine', 'repair', 'upgrade', 'emergency'], {
    required_error: 'يجب تحديد نوع الصيانة',
  }),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  technician: z.string().min(3, 'اسم الفني يجب أن يكون 3 أحرف على الأقل'),
  date: z.string().datetime(),
});

export const maintenanceScheduleSchema = z.object({
  date: z.string().datetime(),
  type: z.enum(['routine', 'repair', 'upgrade', 'emergency'], {
    required_error: 'يجب تحديد نوع الصيانة',
  }),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
});

// Report Schemas
export const reportDateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  filters: z.record(z.any()).optional(),
});

export const reportScheduleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly'], {
    required_error: 'يجب تحديد تكرار التقرير',
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'يجب إدخال وقت صحيح'),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).optional(),
  recipients: z.array(z.string().email('يجب إدخال بريد إلكتروني صحيح')),
});

export const reportExportSchema = z.object({
  reportId: z.string(),
  format: z.enum(['pdf', 'excel', 'csv'], {
    required_error: 'يجب تحديد صيغة التصدير',
  }),
}); 