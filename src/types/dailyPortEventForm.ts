import { DailyPortEvent } from './dailyPortEvents';

export interface DailyPortEventFormData {
  crrNumber: string;
  dateTime: string;
  attachments: string[];
  type: string;
  subType: string;
  location: string;
  description: string;
  responsibleDepartment: string;
  actionTaken: string;
  responseDate: string;
  notes: string;
}

export interface DailyPortEventFormErrors {
  crrNumber?: string;
  dateTime?: string;
  type?: string;
  location?: string;
  description?: string;
  responsibleDepartment?: string;
  actionTaken?: string;
  responseDate?: string;
}

export const validateDailyPortEventForm = (data: DailyPortEventFormData): DailyPortEventFormErrors => {
  const errors: DailyPortEventFormErrors = {};

  if (!data.crrNumber) {
    errors.crrNumber = 'رقم CRR مطلوب';
  }

  if (!data.dateTime) {
    errors.dateTime = 'التاريخ والوقت مطلوب';
  }

  if (!data.type) {
    errors.type = 'نوع الحدث مطلوب';
  }

  if (!data.location) {
    errors.location = 'الموقع مطلوب';
  }

  if (!data.description) {
    errors.description = 'الوصف مطلوب';
  }

  if (!data.responsibleDepartment) {
    errors.responsibleDepartment = 'القسم المسؤول مطلوب';
  }

  if (!data.actionTaken) {
    errors.actionTaken = 'الإجراء المتخذ مطلوب';
  }

  if (!data.responseDate) {
    errors.responseDate = 'تاريخ الرد مطلوب';
  }

  return errors;
};

export const createDailyPortEventFromForm = (formData: DailyPortEventFormData): Omit<DailyPortEvent, 'id'> => {
  return {
    crrNumber: formData.crrNumber,
    dateTime: formData.dateTime,
    attachments: formData.attachments,
    type: formData.type,
    subType: formData.subType,
    location: formData.location,
    description: formData.description,
    responsibleDepartment: formData.responsibleDepartment,
    actionTaken: formData.actionTaken,
    responseDate: formData.responseDate,
    notes: formData.notes
  };
}; 