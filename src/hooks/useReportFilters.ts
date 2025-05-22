
import { useState } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import type { Incident } from "@/types/incident";

interface UseReportFiltersResult {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  location: string;
  setLocation: (location: string) => void;
  chaletNumber: string;
  setChaletNumber: (number: string) => void;
  selectedMonth: Date | undefined;
  setSelectedMonth: (month: Date | undefined) => void;
  selectedYear: Date | undefined;
  setSelectedYear: (year: Date | undefined) => void;
  resetFilters: () => void;
  exportToExcel: (getFilteredReports: () => Incident[]) => void;
}

export const useReportFilters = (): UseReportFiltersResult => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filterType, setFilterType] = useState<string>('all');
  const [location, setLocation] = useState('');
  const [chaletNumber, setChaletNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const resetFilters = () => {
    setDate(undefined);
    setFilterType('all');
    setLocation('');
    setChaletNumber('');
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
  };

  const exportToExcel = (getFilteredReports: () => Incident[]) => {
    try {
      const filteredData = getFilteredReports();
      
      // Prepare data for Excel with all details
      const excelData = filteredData.map(report => ({
        'رقم البلاغ': report.id,
        'تاريخ الإنشاء': format(new Date(), 'yyyy-MM-dd HH:mm', { locale: ar }),
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

  return {
    date,
    setDate,
    filterType,
    setFilterType,
    location,
    setLocation,
    chaletNumber,
    setChaletNumber,
    selectedMonth, 
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    resetFilters,
    exportToExcel
  };
};

// We need to import format from date-fns
import { ar } from 'date-fns/locale';
