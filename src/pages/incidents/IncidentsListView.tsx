
import React from "react";
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
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة البلاغات</CardTitle>
          <CardDescription>جميع البلاغات المسجلة في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <IncidentTable 
            incidents={incidents} 
            onViewDetails={onViewDetails}
            onDeleteIncident={handleDeleteIncident}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default IncidentsListView;
