
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import useIncidentStore from "@/stores/incidents";
import { Incident } from "@/types/incident";
import IncidentHeader from "@/components/incidents/IncidentHeader";
import IncidentsListView from "@/pages/incidents/IncidentsListView";

const IncidentsDashboard = () => {
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
    // تأكد من وجود البيانات الضرورية قبل إضافة البلاغ
    if (!incidentData.type || !incidentData.location || !incidentData.reporter) {
      toast({
        title: "خطأ في إضافة البلاغ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    const newIncident: Incident = {
      id: `INC-00${incidents.length + 1}`,
      status: "جديد",
      comments: [],
      operatorNotes: "",
      description: incidentData.description || "",
      propertyInfo: incidentData.propertyId || "",
      vehicleInfo: incidentData.vehicleDetails || "",
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
    <>
      <IncidentHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewIncident={handleNewIncident}
      />
      
      <IncidentsListView 
        incidents={filteredIncidents}
        onViewDetails={handleViewDetails}
      />
    </>
  );
};

export default IncidentsDashboard;
