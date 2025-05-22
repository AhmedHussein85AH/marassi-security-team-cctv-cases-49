
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Incident } from "@/types/incident";

interface IncidentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  incidentType: string | undefined;
  onIncidentTypeChange: (value: string) => void;
  incidentStatus: string | undefined;
  onIncidentStatusChange: (value: string) => void;
  date: Date | undefined;
  onDateChange: (value: Date | undefined) => void;
  onResetFilters: () => void;
  filteredCount: number;
  allIncidents: Incident[];
}

const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  incidentType,
  onIncidentTypeChange,
  incidentStatus,
  onIncidentStatusChange,
  date,
  onDateChange,
  onResetFilters,
  filteredCount,
  allIncidents
}) => {
  // Get unique incident types and statuses
  const uniqueTypes = Array.from(new Set(allIncidents.map(incident => incident.type)));
  const uniqueStatuses = Array.from(new Set(allIncidents.map(incident => incident.status)));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="ml-2 h-5 w-5" />
          <span>تصفية البلاغات</span>
        </CardTitle>
        <CardDescription>استخدم الخيارات أدناه لتصفية قائمة البلاغات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <Input 
              placeholder="بحث..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="min-w-[200px] text-right"
            />
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={incidentType} onValueChange={onIncidentTypeChange}>
              <SelectTrigger className="min-w-[200px] text-right">
                <SelectValue placeholder="نوع البلاغ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={incidentStatus} onValueChange={onIncidentStatusChange}>
              <SelectTrigger className="min-w-[200px] text-right">
                <SelectValue placeholder="حالة البلاغ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "min-w-[200px] justify-start text-right",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ar }) : "تاريخ البلاغ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateChange}
                  locale={ar}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="w-full sm:w-auto"
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mt-2">
          تم العثور على {filteredCount} بلاغ
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentFilters;
