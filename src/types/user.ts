
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions: string[];
  department?: string;
  phoneNumber?: string;
  status?: string;
  lastLogin?: string;
  avatarUrl?: string;
  createdAt?: string;
}
