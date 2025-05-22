
import React from "react";
import { useToast } from "@/hooks/use-toast";
import useIncidentStore from "@/stores/incidents";
import { useNotifications } from "@/contexts/NotificationContext";
import { useIncidentFilters } from "@/hooks/useIncidentFilters";
import IncidentFilters from "@/components/incidents/IncidentFilters";
import IncidentList from "@/components/incidents/IncidentList";
import { Incident } from "@/types/incident";

interface IncidentsListViewProps {
  incidents: Incident[];
  onViewDetails: (id: string) => void;
}

const IncidentsListView: React.FC<IncidentsListViewProps> = ({ incidents, onViewDetails }) => {
  const { toast } = useToast();
  const { deleteIncident } = useIncidentStore();
  const { addNotification } = useNotifications();
  
  // Current mock user
  const currentUser = {
    name: "أحمد محمد"
  };

  // Use our custom hook for filtering incidents
  const {
    searchTerm,
    setSearchTerm,
    incidentType,
    setIncidentType,
    incidentStatus,
    setIncidentStatus,
    date,
    setDate,
    filteredIncidents,
    resetFilters
  } = useIncidentFilters(incidents);

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
      
      <IncidentFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        incidentType={incidentType}
        onIncidentTypeChange={setIncidentType}
        incidentStatus={incidentStatus}
        onIncidentStatusChange={setIncidentStatus}
        date={date}
        onDateChange={setDate}
        onResetFilters={resetFilters}
        filteredCount={filteredIncidents.length}
        allIncidents={incidents}
      />
      
      <IncidentList 
        incidents={filteredIncidents}
        onViewDetails={onViewDetails}
        onDeleteIncident={handleDeleteIncident}
      />
    </main>
  );
};

export default IncidentsListView;
