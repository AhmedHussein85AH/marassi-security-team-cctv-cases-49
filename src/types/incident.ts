
// Define incident-related types
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
  images?: string[];
  createdAt?: string;
  lastUpdated?: string;
}
