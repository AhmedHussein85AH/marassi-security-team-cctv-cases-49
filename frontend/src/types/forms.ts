// User Form Interfaces
export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

// Daily Port Event Form Interfaces
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

// Call Center Report Form Interfaces
export interface CallCenterReportFormData {
  timing: string;
  date: string;
  unitNumber: string;
  sectorName: string;
  reportReceiver: string;
  constructionSupervisor: string;
  status: string;
  notes: string;
  priority: string;
}

export interface CallCenterReportFormErrors {
  timing?: string;
  date?: string;
  unitNumber?: string;
  sectorName?: string;
  reportReceiver?: string;
  constructionSupervisor?: string;
  status?: string;
  priority?: string;
}

// Form Validation Functions
export const validateUserForm = (data: UserFormData): UserFormErrors => {
  const errors: UserFormErrors = {};

  if (!data.name) {
    errors.name = 'الاسم مطلوب';
  }

  if (!data.email) {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }

  if (!data.password) {
    errors.password = 'كلمة المرور مطلوبة';
  } else if (data.password.length < 6) {
    errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'كلمات المرور غير متطابقة';
  }

  if (!data.role) {
    errors.role = 'الدور مطلوب';
  }

  return errors;
};

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

export const validateCallCenterReportForm = (data: CallCenterReportFormData): CallCenterReportFormErrors => {
  const errors: CallCenterReportFormErrors = {};

  if (!data.timing) {
    errors.timing = 'التوقيت مطلوب';
  }

  if (!data.date) {
    errors.date = 'التاريخ مطلوب';
  }

  if (!data.unitNumber) {
    errors.unitNumber = 'رقم الوحدة مطلوب';
  }

  if (!data.sectorName) {
    errors.sectorName = 'اسم القطاع مطلوب';
  }

  if (!data.reportReceiver) {
    errors.reportReceiver = 'مستلم البلاغ مطلوب';
  }

  if (!data.constructionSupervisor) {
    errors.constructionSupervisor = 'مشرف الأعمار مطلوب';
  }

  if (!data.status) {
    errors.status = 'الحالة مطلوبة';
  }

  if (!data.priority) {
    errors.priority = 'الأولوية مطلوبة';
  }

  return errors;
}; 