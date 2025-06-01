
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Incident } from "@/types/incident";
import { useReportFilters } from '@/hooks/useReportFilters';
import DateFilterOptions from './DateFilterOptions';
import ReportFilterActions from './ReportFilterActions';

interface ReportFiltersProps {
  incidents: Incident[];
  getFilteredReports: () => Incident[];
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ incidents, getFilteredReports }) => {
  const {
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
  } = useReportFilters();

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
              <Select value={filterType || "all"} onValueChange={handleFilterTypeChange}>
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

            <DateFilterOptions
              filterType={filterType}
              date={date}
              setDate={setDate}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />

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

          <ReportFilterActions 
            exportToExcel={exportToExcel} 
            getFilteredReports={getFilteredReports} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
