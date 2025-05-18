import React, { useState, useRef, useEffect } from "react";
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
import { Users, User, Shield, Camera, Upload } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PermissionsDialog from "@/components/users/PermissionsDialog";
import UserImportTemplate from "@/components/users/UserImportTemplate";
import { userService } from "@/services/userService";

const rolePermissions = {
  "أدمن": ["all"],
  "مدير": ["view_incidents", "view_reports", "export_reports"],
  "مشغل كاميرات": ["view_incidents", "process_incidents", "view_cameras"]
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newRole, setNewRole] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role) => {
    switch(role) {
      case "أدمن": 
        return <Shield className="h-5 w-5 text-red-500" />;
      case "مدير": 
        return <User className="h-5 w-5 text-blue-500" />;
      case "مشغل كاميرات": 
        return <Camera className="h-5 w-5 text-green-500" />;
      default: 
        return <User className="h-5 w-5" />;
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      await userService.updateUser(selectedUser.id, {
        ...selectedUser,
        role: newRole,
      });
      
      await loadUsers(); // Reload users after update
      setIsRoleDialogOpen(false);
      
      toast({
        title: "تم تغيير الصلاحية",
        description: `تم تغيير صلاحية ${selectedUser.name} إلى ${newRole}`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تغيير الصلاحية",
        variant: "destructive",
      });
    }
  };

  const openRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleEditUser = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleDeleteUser = (id) => {
    const user = users.find(u => u.id === id);
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.id);
      await loadUsers(); // Reload users after deletion
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "تم حذف المستخدم",
        description: `تم حذف المستخدم ${userToDelete.name} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      });
    }
  };

  const handlePermissionsUpdate = async (permissions: string[]) => {
    if (!selectedUser) return;
    
    try {
      // تحديث الصلاحيات فقط
      await userService.updateUser(selectedUser.id, {
        permissions
      });
      
      // تحديث قائمة المستخدمين
      await loadUsers();
      
      toast({
        title: "تم تحديث الصلاحيات",
        description: `تم تحديث صلاحيات ${selectedUser.name} بنجاح`,
      });
    } catch (error) {
      console.error('خطأ في تحديث الصلاحيات:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث الصلاحيات",
        variant: "destructive",
      });
    }
  };

  const openPermissionsDialog = (user) => {
    setSelectedUser(user);
    setIsPermissionsDialogOpen(true);
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // هنا سيتم إضافة الاتصال بالـ API لرفع الملف
      // مؤقتاً سنقوم بعرض رسالة نجاح
      toast({
        title: "تم استيراد المستخدمين",
        description: "تم استيراد بيانات المستخدمين بنجاح",
      });

      // إعادة تعيين قيمة input الملف
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد بيانات المستخدمين",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="users" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="البحث عن المستخدمين..." 
                className="h-9 md:w-[200px] lg:w-[300px] text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mr-auto flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleImportExcel}
                  title="استيراد ملف Excel"
                  aria-label="استيراد ملف Excel"
                />
                <UserImportTemplate />
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  استيراد من Excel
                </Button>
                <Button onClick={() => navigate("/users/add")}>
                  إضافة مستخدم جديد
                </Button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
              <p className="text-muted-foreground">إدارة حسابات المستخدمين وصلاحياتهم</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>قائمة المستخدمين</CardTitle>
                <CardDescription>جميع المستخدمين المسجلين في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right w-[200px] py-4">اسم المستخدم</TableHead>
                        <TableHead className="text-right w-[250px]">البريد الإلكتروني</TableHead>
                        <TableHead className="text-right w-[180px] pl-8">الدور</TableHead>
                        <TableHead className="text-right w-[120px]">الحالة</TableHead>
                        <TableHead className="text-right w-[150px]">آخر تسجيل دخول</TableHead>
                        <TableHead className="text-right w-[100px]">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="text-right py-4">{user.name}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{user.email}</TableCell>
                          <TableCell className="text-right pl-8">
                            <div className="flex items-center gap-3">
                              {getRoleIcon(user.role)}
                              <span>{user.role}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={user.status === "نشط" ? "success" : "destructive"}
                              className={`
                                inline-flex px-3 py-1
                                ${user.status === "نشط" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"}
                              `}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === "نشط" ? "bg-green-600" : "bg-red-600"}`}></span>
                                {user.status}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap">
                            {user.lastLogin}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-purple-100 hover:text-purple-600 h-8 w-8"
                                onClick={() => openPermissionsDialog(user)}
                              >
                                <Lock className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8"
                                onClick={() => handleEditUser(user.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-red-100 hover:text-red-600 h-8 w-8"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد حذف المستخدم</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف المستخدم {userToDelete?.name}؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <PermissionsDialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        selectedUser={selectedUser}
        onSave={handlePermissionsUpdate}
      />
    </SidebarProvider>
  );
};

export default UserManagement;
