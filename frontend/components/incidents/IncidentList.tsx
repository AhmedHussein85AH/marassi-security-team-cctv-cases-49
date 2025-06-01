
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import IncidentTable from "@/components/incidents/IncidentTable";
import { Incident } from "@/types/incident";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة البلاغات</CardTitle>
        <CardDescription>جميع البلاغات المسجلة في النظام</CardDescription>
      </CardHeader>
      <CardContent>
        <IncidentTable 
          incidents={incidents} 
          onViewDetails={onViewDetails}
          onDeleteIncident={onDeleteIncident}
        />
      </CardContent>
    </Card>
  );
};

export default IncidentList;
