
export interface DailyPortEvent {
  id: string;
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

export const EVENT_TYPES = [
  'Security Incident',
  'Safety Issue',
  'Equipment Failure',
  'Environmental',
  'Operational',
  'Emergency',
  'Other'
];

export const DEPARTMENTS = [
  'Security',
  'Operations',
  'Maintenance',
  'Safety',
  'Environmental',
  'Administration'
];
