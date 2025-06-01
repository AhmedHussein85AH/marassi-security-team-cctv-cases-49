import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLostAndFound } from '@/hooks/useLostAndFound';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { LostAndFoundStats } from '@/components/LostAndFoundStats';

export default function LostAndFound() {
  const {
    items,
    loading,
    error,
    selectedItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItems,
    exportItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
  } = useLostAndFound();

  const [filter, setFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
    image: null as File | null,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    type: '',
    value: '',
    status: '',
  });

  const handleFilterChange = (value: string) => {
    setFilter(value);
    fetchItems(value === 'all' ? undefined : value);
  };

  const handleExport = () => {
    exportItems(filter === 'all' ? undefined : filter);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    try {
      await deleteItems(selectedItems);
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem({
        ...formData,
        status: 'pending',
        date: new Date().toISOString(),
      });
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        type: '',
        value: '',
        image: null,
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await updateItem(editingItem.id, formData);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        type: '',
        value: '',
        image: null,
      });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      type: item.type,
      value: item.value,
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !advancedFilters.type || item.type === advancedFilters.type;
    const matchesValue = !advancedFilters.value || item.value === advancedFilters.value;
    const matchesStatus = !advancedFilters.status || item.status === advancedFilters.status;
    
    const matchesDate = (!dateRange.from || new Date(item.date) >= dateRange.from) &&
                       (!dateRange.to || new Date(item.date) <= dateRange.to);

    return matchesSearch && matchesType && matchesValue && matchesStatus && matchesDate;
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>نظام المعثورات والمفقودات</CardTitle>
        </CardHeader>
        <CardContent>
          <LostAndFoundStats items={items} />
          
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن عنصر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy", { locale: ar })} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ar })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ar })
                      )
                    ) : (
                      "اختر التاريخ"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" onClick={() => {
                setDateRange({ from: undefined, to: undefined });
                setAdvancedFilters({ type: '', value: '', status: '' });
                setSearchQuery('');
              }}>
                إعادة تعيين
              </Button>
            </div>

            <div className="flex gap-4">
              <Select
                value={advancedFilters.type}
                onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="نوع العنصر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="found">معثورات</SelectItem>
                  <SelectItem value="lost">مفقودات</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={advancedFilters.value}
                onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, value: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="القيمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="high">غالي</SelectItem>
                  <SelectItem value="low">رخيص</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={advancedFilters.status}
                onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="delivered">تم التسليم</SelectItem>
                  <SelectItem value="in_storage">في المخزن</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleExport}>تصدير</Button>
              {selectedItems.length > 0 && (
                <Button variant="destructive" onClick={handleDeleteSelected}>
                  حذف المحدد ({selectedItems.length})
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedItems.length === items.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllItems();
                        } else {
                          deselectAllItems();
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>القيمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                      )}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'found' ? 'default' : 'secondary'}>
                        {item.type === 'found' ? 'معثورات' : 'مفقودات'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.value === 'high' ? 'destructive' : 'outline'}>
                        {item.value === 'high' ? 'غالي' : 'رخيص'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'delivered' ? 'success' :
                        item.status === 'in_storage' ? 'warning' : 'secondary'
                      }>
                        {item.status === 'delivered' ? 'تم التسليم' :
                         item.status === 'in_storage' ? 'في المخزن' : 'قيد الانتظار'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(item)}>
                        تعديل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">إضافة عنصر جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة عنصر جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <Label>النوع</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="found">معثورات</SelectItem>
                      <SelectItem value="lost">مفقودات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الاسم</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>القيمة</Label>
                  <Select
                    value={formData.value}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, value: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القيمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">غالي</SelectItem>
                      <SelectItem value="low">رخيص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الصورة</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <Button type="submit">حفظ</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تعديل العنصر</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditItem} className="space-y-4">
                <div>
                  <Label>النوع</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="found">معثورات</SelectItem>
                      <SelectItem value="lost">مفقودات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الاسم</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>القيمة</Label>
                  <Select
                    value={formData.value}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, value: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر القيمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">غالي</SelectItem>
                      <SelectItem value="low">رخيص</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الصورة</Label>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <Button type="submit">حفظ التغييرات</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
} 