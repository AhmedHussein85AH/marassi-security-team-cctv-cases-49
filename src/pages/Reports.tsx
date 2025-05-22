
import React, { useState, useCallback, useEffect } from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import ReportFilters from '@/components/reports/ReportFilters';
import ReportsTable from '@/components/reports/ReportsTable';
import useIncidentStore from "@/stores/incidents";
import { filterReports } from '@/utils/reportFilters';
import { useReportFilters } from '@/hooks/useReportFilters';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { incidents } = useIncidentStore();
  
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
