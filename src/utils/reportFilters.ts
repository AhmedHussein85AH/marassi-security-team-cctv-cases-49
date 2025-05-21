
import { format } from 'date-fns';
import type { Incident } from "@/types/incident";

export const filterReports = (
  incidents: Incident[],
  searchTerm: string,
  filterType: string,
  date: Date | undefined,
  selectedMonth: Date | undefined,
  selectedYear: Date | undefined,
  location: string,
  chaletNumber: string
): Incident[] => {
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
