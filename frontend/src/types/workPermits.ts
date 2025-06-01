export type PermitType = 
  | 'Residential'
  | 'FM'
  | 'Construction'
  | 'Commercial'
  | 'Delegation'
  | 'Hospitality'
  | 'Retail'
  | 'Public';

export type CreatedBy = 'Owner' | 'Company' | 'Delegator';

export type PermitStatus = 'In Progress' | 'Ended' | 'Hold';

export interface WorkPermit {
  id: string;
  sr: string;
  type: PermitType;
  village: string;
  unitStore: string;
  createdBy: CreatedBy;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: PermitStatus;
  details: string;
  createdAt: string;
  updatedAt: string;
} 