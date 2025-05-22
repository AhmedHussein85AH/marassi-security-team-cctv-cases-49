
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import IncidentTable from "@/components/incidents/IncidentTable";
import useIncidentStore from "@/stores/incidents";
import { Incident } from "@/types/incident";
import { useNotifications } from "@/contexts/NotificationContext";
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

interface IncidentsListViewProps {
  incidents: Incident[];
  onViewDetails: (id: string) => void;
}

const IncidentsListView: React.FC<IncidentsListViewProps> = ({ incidents, onViewDetails }) => {
  const { toast } = useToast();
  const { deleteIncident } = useIncidentStore();
  const { addNotification } = useNotifications();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [incidentStatus, setIncidentStatus] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidents);
  
  // Current mock user
  const currentUser = {
    name: "أحمد محمد"
  };

  // Get unique incident types and statuses
  const uniqueTypes = Array.from(new Set(incidents.map(incident => incident.type)));
  const uniqueStatuses = Array.from(new Set(incidents.map(incident => incident.status)));

  // Apply filters when any filter value changes
  useEffect(() => {
    let result = [...incidents];
    
    if (searchTerm) {
      result = result.filter(incident => 
        incident.id.includes(searchTerm) || 
        incident.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (incidentType && incidentType !== "all") {
      result = result.filter(incident => incident.type === incidentType);
    }
    
    if (incidentStatus && incidentStatus !== "all") {
      result = result.filter(incident => incident.status === incidentStatus);
    }
    
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      result = result.filter(incident => incident.date === dateString);
    }
    
    setFilteredIncidents(result);
  }, [searchTerm, incidentType, incidentStatus, date, incidents]);

  const resetFilters = () => {
    setSearchTerm("");
    setIncidentType("");
    setIncidentStatus("");
    setDate(undefined);
  };

  const handleDeleteIncident = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا البلاغ؟")) {
      deleteIncident(id);
      
      toast({
        title: "تم حذف البلاغ",
        description: `تم حذف البلاغ رقم ${id} بنجاح`,
      });
      
      addNotification({
        title: `تم حذف البلاغ #${id}`,
        message: `تم حذف البلاغ بواسطة ${currentUser.name}`,
        type: "alert",
        relatedId: id,
        sender: currentUser.name
      });
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">إدارة البلاغات</h1>
        <p className="text-muted-foreground">متابعة وإدارة بلاغات الأمن والحوادث</p>
      </div>
      
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[200px] text-right"
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={incidentType} onValueChange={setIncidentType}>
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
              <Select value={incidentStatus} onValueChange={setIncidentStatus}>
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
                    onSelect={setDate}
                    locale={ar}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="w-full sm:w-auto"
            >
              إعادة تعيين الفلاتر
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2">
            تم العثور على {filteredIncidents.length} بلاغ
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة البلاغات</CardTitle>
          <CardDescription>جميع البلاغات المسجلة في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentTable 
            incidents={filteredIncidents} 
            onViewDetails={onViewDetails}
            onDeleteIncident={handleDeleteIncident}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default IncidentsListView;
