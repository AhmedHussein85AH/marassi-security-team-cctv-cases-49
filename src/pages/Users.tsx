
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
import NotificationDropdown from "@/components/NotificationDropdown";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock users data
const mockUsers = [
  { 
    id: 1, 
    name: "أحمد محمد", 
    email: "ahmed@example.com", 
    role: "مدير", 
    status: "نشط",
    lastLogin: "2025-05-16 10:30",
    permissions: ["view_incidents", "view_reports"]
  },
  { 
    id: 2, 
    name: "سارة خالد", 
    email: "sarah@example.com", 
    role: "مشغل كاميرات", 
    status: "نشط",
    lastLogin: "2025-05-17 09:15",
    permissions: ["view_incidents", "process_incidents", "view_cameras"]
  },
  { 
    id: 3, 
    name: "محمد علي", 
    email: "mohamed@example.com", 
    role: "أدمن", 
    status: "نشط",
    lastLogin: "2025-05-17 12:00",
    permissions: ["all"]
  },
  { 
    id: 4, 
    name: "فاطمة أحمد", 
    email: "fatima@example.com", 
    role: "مدير", 
    status: "غير نشط",
    lastLogin: "2025-05-10 11:45",
    permissions: ["view_incidents", "view_reports"]
  },
];

const rolePermissions = {
  "أدمن": ["all"],
  "مدير": ["view_incidents", "view_reports", "export_reports"],
  "مشغل كاميرات": ["view_incidents", "process_incidents", "view_cameras"]
};

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const { toast } = useToast();

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

  const handleRoleChange = () => {
    if (!selectedUser || !newRole) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { 
            ...user, 
            role: newRole, 
            permissions: rolePermissions[newRole] || [] 
          } 
        : user
    );
    
    setUsers(updatedUsers);
    setIsRoleDialogOpen(false);
    
    toast({
      title: "تم تغيير الصلاحية",
      description: `تم تغيير صلاحية ${selectedUser.name} إلى ${newRole}`,
    });
  };

  const openRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
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
              <div className="ml-auto flex items-center gap-2">
                <NotificationDropdown />
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openRoleDialog(user)}
                            >
                              تغيير الصلاحية
                            </Button>
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

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تغيير صلاحية المستخدم</DialogTitle>
            <DialogDescription>
              قم بتحديد الصلاحية الجديدة للمستخدم {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                الصلاحية
              </Label>
              <Select 
                value={newRole} 
                onValueChange={setNewRole}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="أدمن">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span>أدمن</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="مدير">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span>مدير</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="مشغل كاميرات">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-green-500" />
                      <span>مشغل كاميرات</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">الصلاحيات</Label>
              <div className="col-span-3 text-sm">
                {newRole && (
                  <ul className="list-disc list-inside space-y-1">
                    {rolePermissions[newRole]?.includes("all") ? (
                      <li>جميع الصلاحيات</li>
                    ) : (
                      rolePermissions[newRole]?.map((perm, idx) => (
                        <li key={idx}>
                          {perm === "view_incidents" && "عرض البلاغات"}
                          {perm === "process_incidents" && "معالجة البلاغات"}
                          {perm === "view_cameras" && "عرض الكاميرات"}
                          {perm === "view_reports" && "عرض التقارير"}
                          {perm === "export_reports" && "تصدير التقارير"}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRoleDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleRoleChange}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default UserManagement;
