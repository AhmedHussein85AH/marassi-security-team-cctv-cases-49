
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import IncidentTable from "@/components/incidents/IncidentTable";
import type { Incident } from "@/stores/incidentStore";

interface IncidentsListViewProps {
  incidents: Incident[];
  onViewDetails: (id: string) => void;
}

const IncidentsListView: React.FC<IncidentsListViewProps> = ({ incidents, onViewDetails }) => {
  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">إدارة البلاغات</h1>
        <p className="text-muted-foreground">متابعة وإدارة بلاغات الأمن والحوادث</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة البلاغات</CardTitle>
          <CardDescription>جميع البلاغات المسجلة في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentTable 
            incidents={incidents} 
            onViewDetails={onViewDetails} 
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default IncidentsListView;
