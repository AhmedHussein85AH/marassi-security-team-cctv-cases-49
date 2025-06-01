import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import IncidentTable from "@/components/incidents/IncidentTable";
import { Incident } from "@/types/incident";
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface IncidentListProps {
  incidents: Incident[];
  onViewDetails: (id: string) => void;
  onDeleteIncident: (id: string) => void;
}

const IncidentList: React.FC<IncidentListProps> = ({ 
  incidents, 
  onViewDetails,
  onDeleteIncident 
}) => {
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectIncident = (incidentId: string) => {
    setSelectedIncidents(prev => {
      if (prev.includes(incidentId)) {
        return prev.filter(id => id !== incidentId);
      } else {
        return [...prev, incidentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIncidents.length === incidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(incidents.map(incident => incident.id));
    }
  };

  const exportSelectedToExcel = () => {
    if (selectedIncidents.length === 0) {
      toast({
        title: "تحذير",
        description: "الرجاء اختيار البلاغات المراد تصديرها",
        variant: "destructive",
      });
      return;
    }

    const selectedData = incidents
      .filter(incident => selectedIncidents.includes(incident.id))
      .map((incident, index) => ({
        '#': index + 1,
        'رقم البلاغ': incident.id,
        'نوع البلاغ': incident.type,
        'الموقع': incident.location,
        'التاريخ': incident.date,
        'الوقت': incident.time,
        'الحالة': incident.status,
        'المبلغ': incident.reporter,
        'الوصف': incident.description,
        'معلومات العقار': incident.propertyInfo,
        'معلومات المركبة': incident.vehicleInfo,
        'ملاحظات المشغل': incident.operatorNotes
      }));

    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'البلاغات');
    XLSX.writeFile(wb, `البلاغات_المحددة_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير البلاغات المحددة بنجاح",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>قائمة البلاغات</CardTitle>
            <CardDescription>جميع البلاغات المسجلة في النظام</CardDescription>
          </div>
          <Button 
            onClick={exportSelectedToExcel} 
            variant="outline" 
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            تصدير المحدد إلى Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <IncidentTable 
          incidents={incidents} 
          onViewDetails={onViewDetails}
          onDeleteIncident={onDeleteIncident}
          selectedIncidents={selectedIncidents}
          onSelectIncident={handleSelectIncident}
          onSelectAll={handleSelectAll}
        />
      </CardContent>
    </Card>
  );
};

export default IncidentList;
