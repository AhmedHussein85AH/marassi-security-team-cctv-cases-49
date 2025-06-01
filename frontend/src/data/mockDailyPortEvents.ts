import { DailyPortEvent } from '@/types/dailyPortEvents';
import { EventType, EventSubType, Department, EventStatus, EventPriority } from '@/types';

export const mockDailyPortEvents: DailyPortEvent[] = [
  {
    id: '1',
    crrNumber: 'CRR-2024-001',
    dateTime: new Date('2024-03-20T10:00:00'),
    type: EventType.SECURITY_INCIDENT,
    subType: EventSubType.UNAUTHORIZED_ACCESS,
    location: 'البوابة الرئيسية',
    description: 'محاولة دخول غير مصرح بها من قبل شخص غير معروف',
    responsibleDepartment: Department.SECURITY,
    actionTaken: 'تم إيقاف الشخص وتسليمه للجهات المختصة',
    responseDate: new Date('2024-03-20T10:15:00'),
    notes: 'تم التعامل مع الموقف بسرعة وفعالية',
    status: EventStatus.COMPLETED,
    priority: EventPriority.HIGH,
    reporterId: 'user1',
    attachments: [],
    comments: [],
    createdAt: new Date('2024-03-20T10:00:00'),
    updatedAt: new Date('2024-03-20T10:15:00'),
    resolvedAt: new Date('2024-03-20T10:15:00')
  },
  {
    id: '2',
    crrNumber: 'CRR-2024-002',
    dateTime: new Date('2024-03-20T14:30:00'),
    type: EventType.EQUIPMENT_ISSUE,
    subType: EventSubType.CRANE_FAILURE,
    location: 'منطقة الشحن',
    description: 'عطل في الرافعة الرئيسية',
    responsibleDepartment: Department.MAINTENANCE,
    actionTaken: 'تم إيقاف الرافعة وإجراء الصيانة اللازمة',
    responseDate: new Date('2024-03-20T15:00:00'),
    notes: 'تم إصلاح العطل وإعادة تشغيل الرافعة',
    status: EventStatus.COMPLETED,
    priority: EventPriority.MEDIUM,
    reporterId: 'user2',
    attachments: [],
    comments: [],
    createdAt: new Date('2024-03-20T14:30:00'),
    updatedAt: new Date('2024-03-20T15:00:00'),
    resolvedAt: new Date('2024-03-20T15:00:00')
  }
]; 