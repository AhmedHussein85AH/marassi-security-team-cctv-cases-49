
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSpreadsheet } from 'lucide-react';
import type { Incident } from "@/types/incident";
import { useReportFilters } from '@/hooks/useReportFilters';
import DateFilterOptions from './DateFilterOptions';

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

          <div className="flex gap-4">
            <Button onClick={() => exportToExcel(getFilteredReports)} className="gap-2">
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
