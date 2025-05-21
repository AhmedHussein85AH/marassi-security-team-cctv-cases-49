import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useIncidentStore from "@/stores/incidents";

const Reports = () => {
  const [date, setDate] = useState<Date>();
  const [filterType, setFilterType] = useState('all');
  const [location, setLocation] = useState('');
  const [chaletNumber, setChaletNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<Date>();
  const [selectedYear, setSelectedYear] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { incidents } = useIncidentStore();

  // Get available years for selection
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Get available months for selection
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date;
  });

  // Filter reports based on selected criteria
  const getFilteredReports = () => {
    let filtered = [...incidents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filters
    if (filterType === 'day' && date) {
      const selectedDate = format(date, 'yyyy-MM-dd');
      filtered = filtered.filter(report => report.date === selectedDate);
    } else if (filterType === 'month' && selectedMonth) {
      const selectedMonthStr = format(selectedMonth, 'MM');
      const selectedYearStr = format(selectedMonth, 'yyyy');
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        return format(reportDate, 'MM') === selectedMonthStr && 
               format(reportDate, 'yyyy') === selectedYearStr;
      });
    } else if (filterType === 'year' && selectedYear) {
      const selectedYearStr = format(selectedYear, 'yyyy');
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        return format(reportDate, 'yyyy') === selectedYearStr;
      });
    }

    // Location filters
    if (location) {
      filtered = filtered.filter(report => 
        report.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (chaletNumber) {
      filtered = filtered.filter(report => 
        report.location.includes(chaletNumber)
      );
    }

    return filtered;
  };

  const exportToExcel = () => {
    try {
      const filteredData = getFilteredReports();
      
      // Prepare data for Excel with all details
      const excelData = filteredData.map(report => ({
        'رقم البلاغ': report.id,
        'تاريخ الإنشاء': format(new Date(), 'yyyy-MM-dd HH:mm', { locale: ar }), // Using current date as createdAt is not in the store
        'تاريخ الحادث': report.date,
        'وقت الحادث': report.time,
        'نوع البلاغ': report.type,
        'الموقع': report.location,
        'حالة البلاغ': report.status,
        'المُبلغ': report.reporter,
        'وصف الحادث': report.description,
        'معلومات العقار': report.propertyInfo,
        'تفاصيل المركبات': report.vehicleInfo || '-',
        'ملاحظات المشغل': report.operatorNotes || '-',
        'عدد التعليقات': report.comments?.length || 0
      }));

      // Create worksheet with RTL support
      const ws = XLSX.utils.json_to_sheet(excelData, {
        header: [
          'رقم البلاغ',
          'تاريخ الإنشاء',
          'تاريخ الحادث',
          'وقت الحادث',
          'نوع البلاغ',
          'الموقع',
          'حالة البلاغ',
          'المُبلغ',
          'وصف الحادث',
          'معلومات العقار',
          'تفاصيل المركبات',
          'ملاحظات المشغل',
          'عدد التعليقات'
        ]
      });

      // Set RTL for the worksheet
      ws['!dir'] = 'rtl';
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'تقرير البلاغات');

      // Generate Excel file
      XLSX.writeFile(wb, `تقرير_البلاغات_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير التقرير إلى ملف Excel",
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setDate(undefined);
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="reports" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <h1 className="text-xl font-bold">التقارير</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-4">
              <p className="text-muted-foreground">متابعة وإدارة بلاغات الأمن والحوادث</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>تصفية وتصدير التقارير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="w-full md:w-auto">
                      <Select value={filterType} onValueChange={handleFilterTypeChange}>
                        <SelectTrigger className="w-[200px] text-right">
                          <SelectValue placeholder="اختر نوع التصفية" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">الكل</SelectItem>
                          <SelectItem value="day">يوم</SelectItem>
                          <SelectItem value="month">شهر</SelectItem>
                          <SelectItem value="year">سنة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {filterType === 'day' && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[200px] justify-start text-right">
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {date ? format(date, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" dir="rtl">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            locale={ar}
                          />
                        </PopoverContent>
                      </Popover>
                    )}

                    {filterType === 'month' && (
                      <Select 
                        value={selectedMonth ? format(selectedMonth, 'MM') : ''} 
                        onValueChange={(value) => {
                          const date = new Date();
                          date.setMonth(parseInt(value) - 1);
                          setSelectedMonth(date);
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="اختر الشهر" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month, index) => (
                            <SelectItem 
                              key={index} 
                              value={(index + 1).toString().padStart(2, '0')}
                            >
                              {format(month, 'MMMM', { locale: ar })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filterType === 'year' && (
                      <Select 
                        value={selectedYear ? selectedYear.getFullYear().toString() : ''} 
                        onValueChange={(value) => {
                          const date = new Date();
                          date.setFullYear(parseInt(value));
                          setSelectedYear(date);
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="اختر السنة" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Input
                      placeholder="الموقع"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-[200px] text-right"
                    />

                    <Input
                      placeholder="رقم الشاليه"
                      value={chaletNumber}
                      onChange={(e) => setChaletNumber(e.target.value)}
                      className="w-[200px] text-right"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={exportToExcel} className="gap-2">
                      <FileSpreadsheet className="ml-2 h-4 w-4" />
                      تصدير إلى Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>قائمة البلاغات</CardTitle>
                <p className="text-sm text-muted-foreground">جميع البلاغات المسجلة في النظام</p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="البحث عن البلاغات..."
                    className="max-w-sm text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] text-right">رقم البلاغ</TableHead>
                      <TableHead className="w-[150px] text-right">نوع البلاغ</TableHead>
                      <TableHead className="w-[200px] text-right">الموقع</TableHead>
                      <TableHead className="w-[120px] text-right">التاريخ</TableHead>
                      <TableHead className="w-[100px] text-right">الوقت</TableHead>
                      <TableHead className="w-[130px] text-right">الحالة</TableHead>
                      <TableHead className="w-[150px] text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredReports().map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="text-right">{report.id}</TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center">
                            <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                            {report.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{report.location}</TableCell>
                        <TableCell className="text-right">{report.date}</TableCell>
                        <TableCell className="text-right">{report.time}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            report.status === 'تم المعالجة' ? 'bg-green-100 text-green-800' :
                            report.status === 'قيد المعالجة' ? 'bg-blue-100 text-blue-800' :
                            report.status === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{report.reporter}</TableCell>
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

export default Reports;
