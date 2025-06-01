
import React, { useState, useCallback, useEffect } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import ReportFilters from '@/components/reports/ReportFilters';
import ReportsTable from '@/components/reports/ReportsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Anchor, FileSpreadsheet } from 'lucide-react';
import useIncidentStore from "@/stores/incidents";
import useDailyPortEventsStore from "@/stores/dailyPortEventsStore";
import { filterReports } from '@/utils/reportFilters';
import { useReportFilters } from '@/hooks/useReportFilters';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { incidents } = useIncidentStore();
  const { events } = useDailyPortEventsStore();
  const { toast } = useToast();
  
  const {
    date,
    filterType,
    location,
    chaletNumber,
    selectedMonth,
    selectedYear
  } = useReportFilters();
  
  const getFilteredReports = useCallback(() => {
    return filterReports(
      incidents, 
      searchTerm, 
      filterType,
      date,
      selectedMonth,
      selectedYear,
      location,
      chaletNumber
    );
  }, [
    incidents, 
    searchTerm, 
    filterType, 
    date, 
    selectedMonth, 
    selectedYear, 
    location, 
    chaletNumber
  ]);

  const exportPortEventsToExcel = () => {
    try {
      const excelData = events.map((event, index) => ({
        '#': index + 1,
        'CRR Number': event.crrNumber,
        'Date & Time': event.dateTime,
        'Type': event.type,
        'Sub Type': event.subType,
        'Location': event.location,
        'Description': event.description,
        'Responsible Department': event.responsibleDepartment,
        'Action Taken': event.actionTaken,
        'Response Date': event.responseDate,
        'Notes': event.notes,
        'Attachments Count': event.attachments.length
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Daily Port Events');
      XLSX.writeFile(wb, `Daily_Port_Events_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير تقرير أحداث مراسي اليومية إلى Excel",
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

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>استيراد التقارير الإضافية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={exportPortEventsToExcel} variant="outline" className="gap-2">
                    <Anchor className="h-4 w-4" />
                    <FileSpreadsheet className="h-4 w-4" />
                    استيراد أحداث مراسي اليومية
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  يمكنك استيراد تقارير إضافية من الأقسام الأخرى في النظام
                </p>
              </CardContent>
            </Card>

            <ReportFilters
              incidents={incidents}
              getFilteredReports={getFilteredReports}
            />
            
            <ReportsTable
              reports={getFilteredReports()}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Reports;
