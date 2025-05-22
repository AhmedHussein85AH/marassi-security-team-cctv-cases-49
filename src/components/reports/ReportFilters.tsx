
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import type { Incident } from "@/types/incident";

interface ReportFiltersProps {
  incidents: Incident[];
  getFilteredReports: () => Incident[];
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ incidents, getFilteredReports }) => {
  const [date, setDate] = useState<Date>();
  const [filterType, setFilterType] = useState('all');
  const [location, setLocation] = useState('');
  const [chaletNumber, setChaletNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<Date>();
  const [selectedYear, setSelectedYear] = useState<Date>();
  const { toast } = useToast();

  // Get available years for selection
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Get available months for selection
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date;
  });

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
                value={selectedMonth ? format(selectedMonth, 'MM') : undefined} 
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
                value={selectedYear ? selectedYear.getFullYear().toString() : undefined} 
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
  );
};

export default ReportFilters;
