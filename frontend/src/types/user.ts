
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  department: string;
  phoneNumber: string;
  status: string;
  lastLogin: string;
  avatarUrl: string;
  createdAt: string;
}

export const defaultUserValues: User = {
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
  permissions: [],
  department: "",
  phoneNumber: "",
  status: "active",
  lastLogin: new Date().toISOString(),
  avatarUrl: "",
  createdAt: new Date().toISOString()
};
