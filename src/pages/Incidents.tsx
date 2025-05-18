
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import useIncidentStore from "@/stores/incidentStore";
import type { Incident } from "@/stores/incidentStore";
import IncidentTable from "@/components/incidents/IncidentTable";
import IncidentHeader from "@/components/incidents/IncidentHeader";

const Incidents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addRoleBasedNotification } = useNotifications();
  const { user } = useAuth();
  const { incidents, addIncident } = useIncidentStore();

  const filteredIncidents = incidents.filter(incident => 
    incident.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewIncident = (incidentData: Partial<Incident>) => {
    const newIncident: Incident = {
      id: `INC-00${incidents.length + 1}`,
      status: "جديد",
      comments: [],
      operatorNotes: "",
      description: incidentData.description || "",
      propertyInfo: incidentData.propertyInfo || "",
      vehicleInfo: incidentData.vehicleInfo || "",
      type: incidentData.type || "",
      location: incidentData.location || "",
      date: incidentData.date || "",
      time: incidentData.time || "",
      reporter: incidentData.reporter || ""
    };
    
    addIncident(newIncident);
    
    toast({
      title: "تم إضافة البلاغ",
      description: `تم إضافة البلاغ رقم ${newIncident.id} بنجاح`,
    });

    // إرسال إشعار لمشغلي الكاميرات للعمل على البلاغ
    addRoleBasedNotification(
      {
        title: "بلاغ جديد يحتاج إلى معالجة",
        message: `تم إضافة بلاغ جديد من نوع ${newIncident.type} في ${newIncident.location} ويحتاج إلى معالجة`,
        type: "incident",
        relatedId: newIncident.id,
        sender: user?.name || "النظام"
      },
      ["مشغل كاميرات"]
    );

    // إرسال إشعار للمدير للمعاينة فقط
    addRoleBasedNotification(
      {
        title: "بلاغ جديد للمعاينة",
        message: `تم إضافة بلاغ جديد من نوع ${newIncident.type} في ${newIncident.location}`,
        type: "alert",
        relatedId: newIncident.id,
        sender: user?.name || "النظام"
      },
      ["مدير"]
    );
  };

  const handleViewDetails = (id: string) => {
    navigate(`/incidents/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <IncidentHeader
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onNewIncident={handleNewIncident}
          />
          
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
                  incidents={filteredIncidents} 
                  onViewDetails={handleViewDetails} 
                />
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Incidents;
