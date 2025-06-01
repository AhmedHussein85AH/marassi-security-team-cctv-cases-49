
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Pencil, Trash } from "lucide-react";
import { roleService } from "@/services/roleService";
import { userService } from "@/services/userService";

interface Role {
  id: number;
  name: string;
  permissions: string[];
  description: string;
  createdAt: string;
}

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

const availablePermissions: Permission[] = [
  { id: "view_dashboard", label: "عرض لوحة التحكم", description: "الوصول إلى الصفحة الرئيسية", category: "عام" },
  { id: "view_incidents", label: "عرض البلاغات", description: "عرض قائمة البلاغات", category: "البلاغات" },
  { id: "manage_incidents", label: "إدارة البلاغات", description: "إضافة وتعديل البلاغات", category: "البلاغات" },
  { id: "process_incidents", label: "معالجة البلاغات", description: "تغيير حالة البلاغات", category: "البلاغات" },
  { id: "view_reports", label: "عرض التقارير", description: "الوصول إلى صفحة التقارير", category: "التقارير" },
  { id: "export_reports", label: "تصدير التقارير", description: "تصدير التقارير كملفات", category: "التقارير" },
  { id: "view_users", label: "عرض المستخدمين", description: "عرض قائمة المستخدمين", category: "المستخدمين" },
  { id: "manage_users", label: "إدارة المستخدمين", description: "إضافة وتعديل المستخدمين", category: "المستخدمين" },
  { id: "view_cameras", label: "عرض الكاميرات", description: "الوصول إلى نظام المراقبة", category: "المراقبة" },
  { id: "manage_cameras", label: "إدارة الكاميرات", description: "التحكم في إعدادات الكاميرات", category: "المراقبة" },
];

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });

  const { toast } = useToast();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const fetchedRoles = await roleService.getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الأدوار",
        variant: "destructive",
      });
    }
  };

  const handleCreateRole = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "خطأ",
        description: "اسم الدور مطلوب",
        variant: "destructive",
      });
      return;
    }

    try {
      await roleService.createRole({
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
        createdAt: new Date().toISOString().split('T')[0]
      });
      
      // إعادة تحميل الأدوار وتحديث صلاحيات المستخدمين
      await loadRoles();
      await userService.syncUserPermissionsWithRoles();
      
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "تم إنشاء الدور",
        description: `تم إنشاء دور ${formData.name} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الدور",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole || !formData.name.trim()) return;

    try {
      await roleService.updateRole(selectedRole.id, {
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      });
      
      // إعادة تحميل الأدوار وتحديث صلاحيات المستخدمين
      await loadRoles();
      await userService.syncUserPermissionsWithRoles();
      
      setIsEditDialogOpen(false);
      resetForm();
      
      toast({
        title: "تم تحديث الدور",
        description: `تم تحديث دور ${formData.name} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الدور",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await roleService.deleteRole(id);
      await loadRoles();
      await userService.syncUserPermissionsWithRoles();
      
      toast({
        title: "تم حذف الدور",
        description: "تم حذف الدور بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الدور",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: []
    });
    setSelectedRole(null);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    availablePermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="settings" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">إدارة الأدوار والصلاحيات</h1>
              <div className="mr-auto">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة دور جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة دور جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="name">اسم الدور</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="أدخل اسم الدور"
                        />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="description">الوصف</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="أدخل وصف الدور"
                        />
                      </div>
                      <div>
                        <Label>الصلاحيات</Label>
                        <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
                          {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="font-medium text-sm">{category}</h4>
                              <div className="space-y-2 mr-4">
                                {permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={permission.id}
                                      checked={formData.permissions.includes(permission.id)}
                                      onCheckedChange={(checked) => 
                                        handlePermissionChange(permission.id, checked as boolean)
                                      }
                                    />
                                    <div className="flex-1">
                                      <label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                                        {permission.label}
                                      </label>
                                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button onClick={handleCreateRole}>
                        إنشاء الدور
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">إدارة الأدوار والصلاحيات</h1>
              <p className="text-muted-foreground">إنشاء وإدارة أدوار المستخدمين وصلاحياتهم - تؤثر التغييرات تلقائياً على المستخدمين</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>قائمة الأدوار</CardTitle>
                <CardDescription>جميع الأدوار المتاحة في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right w-[200px]">اسم الدور</TableHead>
                        <TableHead className="text-right">الوصف</TableHead>
                        <TableHead className="text-right w-[300px]">الصلاحيات</TableHead>
                        <TableHead className="text-right w-[150px]">تاريخ الإنشاء</TableHead>
                        <TableHead className="text-right w-[100px]">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id} className="hover:bg-muted/50">
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{role.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-wrap gap-1">
                              {role.permissions.includes("all") ? (
                                <Badge variant="secondary">جميع الصلاحيات</Badge>
                              ) : (
                                role.permissions.slice(0, 3).map((permission) => {
                                  const perm = availablePermissions.find(p => p.id === permission);
                                  return (
                                    <Badge key={permission} variant="outline" className="text-xs">
                                      {perm?.label || permission}
                                    </Badge>
                                  );
                                })
                              )}
                              {role.permissions.length > 3 && !role.permissions.includes("all") && (
                                <Badge variant="outline" className="text-xs">
                                  +{role.permissions.length - 3} أخرى
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {role.createdAt}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-blue-100 hover:text-blue-600 h-8 w-8"
                                onClick={() => openEditDialog(role)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-red-100 hover:text-red-600 h-8 w-8"
                                onClick={() => handleDeleteRole(role.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل الدور</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="edit-name">اسم الدور</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم الدور"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="edit-description">الوصف</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="أدخل وصف الدور"
              />
            </div>
            <div>
              <Label>الصلاحيات</Label>
              <div className="mt-2 space-y-4 max-h-60 overflow-y-auto">
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm">{category}</h4>
                    <div className="space-y-2 mr-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <label htmlFor={`edit-${permission.id}`} className="text-sm font-medium cursor-pointer">
                              {permission.label}
                            </label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditRole}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default RolesPage;
