import React, { useState, useEffect } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileSpreadsheet, FileText, Search, Pencil, Trash2 } from 'lucide-react';
import useWorkPermitsStore from '@/stores/workPermitsStore';
import { WorkPermit, PermitType, CreatedBy, PermitStatus } from '@/types/workPermits';
import * as XLSX from 'xlsx';
import { format, isAfter, isBefore, isEqual } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WorkPermits = () => {
  const { permits, addPermit, updatePermit, deletePermit, getActivePermits, getExpiredPermits, getOnHoldPermits, updatePermitsStatus } = useWorkPermitsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<PermitStatus | 'all'>('all');
  const { toast } = useToast();
  const [editingPermit, setEditingPermit] = useState<WorkPermit | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [permitToDelete, setPermitToDelete] = useState<WorkPermit | null>(null);

  // تحديث حالة التصاريح كل دقيقة
  useEffect(() => {
    updatePermitsStatus();
    const interval = setInterval(updatePermitsStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const [newPermit, setNewPermit] = useState<Partial<WorkPermit>>({
    type: 'Residential',
    village: '',
    unitStore: '',
    createdBy: 'Owner',
    employeeName: '',
    startDate: '',
    endDate: '',
    details: '',
    status: 'In Progress',
    ownerOrDelegatorName: '',
  });

  // Chart data
  const chartData = [
    { name: 'ساري', value: getActivePermits().length, color: '#4CAF50' },
    { name: 'منتهي', value: getExpiredPermits().length, color: '#F44336' },
    { name: 'متوقف', value: getOnHoldPermits().length, color: '#FFC107' }
  ];

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = 
      permit.sr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.unitStore.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.employeeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange = 
      (!startDateFilter || isAfter(new Date(permit.startDate), new Date(startDateFilter)) || 
       isEqual(new Date(permit.startDate), new Date(startDateFilter))) &&
      (!endDateFilter || isBefore(new Date(permit.endDate), new Date(endDateFilter)) || 
       isEqual(new Date(permit.endDate), new Date(endDateFilter)));

    const matchesStatus = statusFilter === 'all' || permit.status === statusFilter;

    return matchesSearch && matchesDateRange && matchesStatus;
  });

  const handleAddPermit = () => {
    if (!newPermit.startDate || !newPermit.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    addPermit({
      type: newPermit.type || 'Residential',
      village: newPermit.village || '',
      unitStore: newPermit.unitStore || '',
      createdBy: newPermit.createdBy || 'Owner',
      employeeName: newPermit.employeeName || '',
      startDate: newPermit.startDate || '',
      endDate: newPermit.endDate || '',
      details: newPermit.details || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerOrDelegatorName: newPermit.ownerOrDelegatorName || '',
    });

    setNewPermit({
      type: 'Residential',
      village: '',
      unitStore: '',
      createdBy: 'Owner',
      employeeName: '',
      startDate: '',
      endDate: '',
      details: '',
      status: 'In Progress',
      ownerOrDelegatorName: '',
    });
    setShowAddForm(false);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: "تم إضافة التصريح الجديد",
    });
  };

  const exportToExcel = (filter: 'all' | 'active' | 'expired' | 'onHold' = 'all') => {
    let dataToExport = permits;
    
    switch (filter) {
      case 'active':
        dataToExport = getActivePermits();
        break;
      case 'expired':
        dataToExport = getExpiredPermits();
        break;
      case 'onHold':
        dataToExport = getOnHoldPermits();
        break;
    }

    const excelData = dataToExport.map((permit, index) => ({
      'م': index + 1,
      'SR': permit.sr,
      'نوع التصريح': permit.type,
      'القرية': permit.village,
      'الوحدة/المتجر': permit.unitStore,
      'أنشئ بواسطة': permit.createdBy,
      'اسم الموظف': permit.employeeName,
      'تاريخ البداية': permit.startDate,
      'تاريخ النهاية': permit.endDate,
      'الحالة': permit.status
    }));

    const ws = XLSX.utils.json_to_sheet(excelData, {
      header: ['م', 'SR', 'نوع التصريح', 'القرية', 'الوحدة/المتجر', 'أنشئ بواسطة', 'اسم الموظف', 'تاريخ البداية', 'تاريخ النهاية', 'الحالة']
    });

    ws['!dir'] = 'rtl';
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تصاريح العمل');
    XLSX.writeFile(wb, `تصاريح_العمل_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير الملف إلى Excel",
    });
  };

  const handleEditPermit = (permit: WorkPermit) => {
    setEditingPermit(permit);
  };

  const handleUpdatePermit = () => {
    if (!editingPermit) return;

    updatePermit(editingPermit.id, {
      type: editingPermit.type,
      village: editingPermit.village,
      unitStore: editingPermit.unitStore,
      createdBy: editingPermit.createdBy,
      employeeName: editingPermit.employeeName,
      startDate: editingPermit.startDate,
      endDate: editingPermit.endDate,
      details: editingPermit.details,
      ownerOrDelegatorName: editingPermit.ownerOrDelegatorName || '',
    });

    setEditingPermit(null);
    toast({
      title: "تم التحديث بنجاح",
      description: "تم تحديث التصريح بنجاح",
    });
  };

  const handleDeleteClick = (permit: WorkPermit) => {
    setPermitToDelete(permit);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!permitToDelete) return;

    deletePermit(permitToDelete.id);
    setShowDeleteDialog(false);
    setPermitToDelete(null);
    
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف التصريح بنجاح",
    });
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="work-permits" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">تصاريح العمل</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-4">
              <p className="text-muted-foreground">إدارة ومتابعة تصاريح العمل</p>
            </div>

            {/* Chart Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>إحصائيات التصاريح</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 mb-6">
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة تصريح جديد
              </Button>
              <Select onValueChange={(value) => exportToExcel(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="تصدير إلى Excel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصاريح</SelectItem>
                  <SelectItem value="active">التصاريح السارية</SelectItem>
                  <SelectItem value="expired">التصاريح المنتهية</SelectItem>
                  <SelectItem value="onHold">التصاريح المتوقفة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>البحث والتصفية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    placeholder="البحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-right"
                  />
                  <Input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    placeholder="تاريخ البداية"
                  />
                  <Input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    placeholder="تاريخ النهاية"
                  />
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة التصريح" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="In Progress">ساري</SelectItem>
                      <SelectItem value="Ended">منتهي</SelectItem>
                      <SelectItem value="Hold">متوقف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {showAddForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>إضافة تصريح جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                      value={newPermit.type}
                      onValueChange={(value) => setNewPermit({...newPermit, type: value as PermitType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="نوع التصريح" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">سكني</SelectItem>
                        <SelectItem value="FM">FM</SelectItem>
                        <SelectItem value="Construction">إنشاءات</SelectItem>
                        <SelectItem value="Commercial">تجاري</SelectItem>
                        <SelectItem value="Delegation">تفويض</SelectItem>
                        <SelectItem value="Hospitality">ضيافة</SelectItem>
                        <SelectItem value="Retail">بيع بالتجزئة</SelectItem>
                        <SelectItem value="Public">عام</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="القرية"
                      value={newPermit.village}
                      onChange={(e) => setNewPermit({...newPermit, village: e.target.value})}
                    />
                    <Input
                      placeholder="الوحدة/المتجر"
                      value={newPermit.unitStore}
                      onChange={(e) => setNewPermit({...newPermit, unitStore: e.target.value})}
                    />
                    <Select
                      value={newPermit.createdBy}
                      onValueChange={(value) => setNewPermit({...newPermit, createdBy: value as CreatedBy})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="أنشئ بواسطة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owner">مالك</SelectItem>
                        <SelectItem value="Company">شركة</SelectItem>
                        <SelectItem value="Delegator">مفوض</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="اسم المفوض أو المالك"
                      value={newPermit.ownerOrDelegatorName || ''}
                      onChange={e => setNewPermit({ ...newPermit, ownerOrDelegatorName: e.target.value })}
                    />
                    <Input
                      placeholder="اسم الموظف"
                      value={newPermit.employeeName}
                      onChange={(e) => setNewPermit({...newPermit, employeeName: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newPermit.startDate}
                      onChange={(e) => setNewPermit({...newPermit, startDate: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={newPermit.endDate}
                      onChange={(e) => setNewPermit({...newPermit, endDate: e.target.value})}
                    />
                    <Textarea
                      placeholder="تفاصيل التصريح"
                      value={newPermit.details}
                      onChange={(e) => setNewPermit({...newPermit, details: e.target.value})}
                      className="col-span-full"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddPermit}>إضافة التصريح</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>إلغاء</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Edit Form Dialog */}
            {editingPermit && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>تعديل التصريح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                      value={editingPermit.type}
                      onValueChange={(value) => setEditingPermit({...editingPermit, type: value as PermitType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="نوع التصريح" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">سكني</SelectItem>
                        <SelectItem value="FM">FM</SelectItem>
                        <SelectItem value="Construction">إنشاءات</SelectItem>
                        <SelectItem value="Commercial">تجاري</SelectItem>
                        <SelectItem value="Delegation">تفويض</SelectItem>
                        <SelectItem value="Hospitality">ضيافة</SelectItem>
                        <SelectItem value="Retail">بيع بالتجزئة</SelectItem>
                        <SelectItem value="Public">عام</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="القرية"
                      value={editingPermit.village}
                      onChange={(e) => setEditingPermit({...editingPermit, village: e.target.value})}
                    />
                    <Input
                      placeholder="الوحدة/المتجر"
                      value={editingPermit.unitStore}
                      onChange={(e) => setEditingPermit({...editingPermit, unitStore: e.target.value})}
                    />
                    <Select
                      value={editingPermit.createdBy}
                      onValueChange={(value) => setEditingPermit({...editingPermit, createdBy: value as CreatedBy})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="أنشئ بواسطة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owner">مالك</SelectItem>
                        <SelectItem value="Company">شركة</SelectItem>
                        <SelectItem value="Delegator">مفوض</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="اسم المفوض أو المالك"
                      value={editingPermit.ownerOrDelegatorName || ''}
                      onChange={e => setEditingPermit({ ...editingPermit, ownerOrDelegatorName: e.target.value })}
                    />
                    <Input
                      placeholder="اسم الموظف"
                      value={editingPermit.employeeName}
                      onChange={(e) => setEditingPermit({...editingPermit, employeeName: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={editingPermit.startDate}
                      onChange={(e) => setEditingPermit({...editingPermit, startDate: e.target.value})}
                    />
                    <Input
                      type="date"
                      value={editingPermit.endDate}
                      onChange={(e) => setEditingPermit({...editingPermit, endDate: e.target.value})}
                    />
                    <Textarea
                      placeholder="تفاصيل التصريح"
                      value={editingPermit.details}
                      onChange={(e) => setEditingPermit({...editingPermit, details: e.target.value})}
                      className="col-span-full"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleUpdatePermit}>حفظ التغييرات</Button>
                    <Button variant="outline" onClick={() => setEditingPermit(null)}>إلغاء</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد من حذف هذا التصريح؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    لا يمكن التراجع عن هذا الإجراء بعد الحذف.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Card>
              <CardHeader>
                <CardTitle>قائمة التصاريح</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">م</TableHead>
                      <TableHead className="text-right">SR</TableHead>
                      <TableHead className="text-right">نوع التصريح</TableHead>
                      <TableHead className="text-right">القرية</TableHead>
                      <TableHead className="text-right">الوحدة/المتجر</TableHead>
                      <TableHead className="text-right">أنشئ بواسطة</TableHead>
                      <TableHead className="text-right">اسم الموظف</TableHead>
                      <TableHead className="text-right">تاريخ البداية</TableHead>
                      <TableHead className="text-right">تاريخ النهاية</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التفاصيل</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermits.map((permit, index) => (
                      <TableRow key={permit.id}>
                        <TableCell className="text-right">{index + 1}</TableCell>
                        <TableCell className="text-right">{permit.sr}</TableCell>
                        <TableCell className="text-right">{permit.type}</TableCell>
                        <TableCell className="text-right">{permit.village}</TableCell>
                        <TableCell className="text-right">{permit.unitStore}</TableCell>
                        <TableCell className="text-right">{permit.createdBy}</TableCell>
                        <TableCell className="text-right">{permit.employeeName}</TableCell>
                        <TableCell className="text-right">{permit.startDate}</TableCell>
                        <TableCell className="text-right">{permit.endDate}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            permit.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                            permit.status === 'Ended' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {permit.status === 'In Progress' ? 'ساري' :
                             permit.status === 'Ended' ? 'منتهي' : 'متوقف'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right max-w-xs truncate" title={permit.details}>
                          {permit.details}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPermit(permit)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(permit)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
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
    </SidebarProvider>
  );
};

export default WorkPermits; 