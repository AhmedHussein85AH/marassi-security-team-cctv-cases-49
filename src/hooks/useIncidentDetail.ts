
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import useIncidentStore, { Incident, Comment as StoreComment } from "@/stores/incidentStore";

// Mock current user - this should ideally come from an auth context
const currentUser = {
  name: "أحمد محمد",
  role: "أدمن"
};

export const useIncidentDetail = (incidentId: string | undefined) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { getIncidentById, updateIncident } = useIncidentStore();

  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState<Incident | null>(incidentId ? getIncidentById(incidentId) : null);
  const [operatorNotes, setOperatorNotes] = useState(incident?.operatorNotes || "");

  useEffect(() => {
    if (incidentId) {
      setLoading(true);
      try {
        const foundIncident = getIncidentById(incidentId);
        if (foundIncident) {
          setIncident(foundIncident);
          setOperatorNotes(foundIncident.operatorNotes || "");
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [incidentId, getIncidentById]);

  const handleSaveNotes = () => {
    if (!incident) return;

    const updatedIncident = {
      ...incident,
      operatorNotes
    };

    updateIncident(updatedIncident);
    setIncident(updatedIncident);

    toast({
      title: "تم حفظ الملاحظات",
      description: "تم حفظ ملاحظات المشغل بنجاح",
    });

    addNotification({
      title: `تم تحديث ملاحظات البلاغ #${incidentId}`,
      message: "تم تحديث ملاحظات المشغل",
      type: "status", 
      relatedId: incidentId,
      sender: currentUser.name
    });
  };

  const handleCompleteIncident = () => {
    if (!incident) return;

    const updatedIncident = {
      ...incident,
      status: "تم المعالجة",
      operatorNotes
    };

    updateIncident(updatedIncident);
    setIncident(updatedIncident);
    
    toast({
      title: "تم تحديث البلاغ",
      description: "تم تغيير حالة البلاغ إلى تم المعالجة",
    });
    
    addNotification({
      title: `تم معالجة البلاغ #${incidentId}`,
      message: `تم إتمام معالجة البلاغ، يرجى مراجعة التفاصيل`,
      type: "status",
      relatedId: incidentId,
      sender: currentUser.name
    });
  };

  const handleAddComment = (text: string) => {
    if (!incident) return;

    // Create a new comment with the required id property
    const newComment: StoreComment = {
      id: `com-${Date.now()}`,
      text,
      user: currentUser.name,
      timestamp: new Date().toISOString()
    };
    
    const updatedIncident = {
      ...incident,
      comments: [...(incident.comments || []), newComment]
    };

    updateIncident(updatedIncident);
    setIncident(updatedIncident);
    
    addNotification({
      title: `تعليق جديد على البلاغ #${incidentId}`,
      message: `${currentUser.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      type: "comment",
      relatedId: incidentId,
      sender: currentUser.name
    });
  };

  return {
    loading,
    incident,
    operatorNotes,
    setOperatorNotes,
    handleSaveNotes,
    handleCompleteIncident,
    handleAddComment
  };
};
