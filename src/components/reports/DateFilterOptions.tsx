
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateFilterOptionsProps {
  filterType: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedMonth: Date | undefined;
  setSelectedMonth: (month: Date | undefined) => void;
  selectedYear: Date | undefined;
  setSelectedYear: (year: Date | undefined) => void;
}

const DateFilterOptions: React.FC<DateFilterOptionsProps> = ({
  filterType,
  date,
  setDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear
}) => {
  // Get available years for selection
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Get available months for selection
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date;
  });

  if (filterType === 'day') {
    return (
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
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    );
  }

  if (filterType === 'month') {
    return (
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
    );
  }

  if (filterType === 'year') {
    return (
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
    );
  }

  return null;
};

export default DateFilterOptions;
