
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, User, Shield, Camera } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";

// Mock users data
const mockUsers = [
  { 
    id: 1, 
    name: "أحمد محمد", 
    email: "ahmed@example.com", 
    role: "مدير", 
    status: "نشط",
    lastLogin: "2025-05-16 10:30" 
  },
  { 
    id: 2, 
    name: "سارة خالد", 
    email: "sarah@example.com", 
    role: "مشغل كاميرات", 
    status: "نشط",
    lastLogin: "2025-05-17 09:15" 
  },
  { 
    id: 3, 
    name: "محمد علي", 
    email: "mohamed@example.com", 
    role: "أدمن", 
    status: "نشط",
    lastLogin: "2025-05-17 12:00" 
  },
  { 
    id: 4, 
    name: "فاطمة أحمد", 
    email: "fatima@example.com", 
    role: "مدير", 
    status: "غير نشط",
    lastLogin: "2025-05-10 11:45" 
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch(role) {
      case "أدمن": 
        return <Shield className="w-4 h-4 text-red-500" />;
      case "مدير": 
        return <User className="w-4 h-4 text-blue-500" />;
      case "مشغل كاميرات": 
        return <Camera className="w-4 h-4 text-green-500" />;
      default: 
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950">
        <MainSidebar activeItem="users" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="البحث عن المستخدمين..." 
                className="h-9 md:w-[200px] lg:w-[300px]"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="ml-auto">
                <Button>إضافة مستخدم جديد</Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
              <p className="text-muted-foreground">إدارة المستخدمين والصلاحيات</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
                <CardDescription>جميع المستخدمين المسجلين في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الصلاحية</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>آخر تسجيل دخول</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "نشط" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">تعديل</Button>
                            <Button variant="ghost" size="sm">تغيير الصلاحية</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;
