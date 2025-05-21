
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import IncidentComments from "@/components/incidents/IncidentComments";
import IncidentInfo from "@/components/incidents/IncidentInfo";
import IncidentDetails from "@/components/incidents/IncidentDetails";
import OperatorNotes from "@/components/incidents/OperatorNotes";
import IncidentHeader from "@/components/incidents/IncidentHeader";
import { useIncidentDetail } from "@/hooks/useIncidentDetail";

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    loading,
    incident,
    operatorNotes,
    setOperatorNotes,
    images,
    handleSaveNotes,
    handleCompleteIncident,
    handleAddComment,
    handleAddImage,
    handleRemoveImage,
    handleDeleteIncident
  } = useIncidentDetail(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">لم يتم العثور على البلاغ</h2>
          <p className="text-gray-600 mb-4">عذراً، لا يمكن العثور على البلاغ المطلوب</p>
          <Button onClick={() => navigate('/incidents')}>
            العودة لقائمة البلاغات
          </Button>
        </div>
      </div>
    );
  }

  // Transform the comments array to match the expected format for IncidentComments component
  const transformedComments = incident.comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    userName: comment.user, // Map 'user' to 'userName'
    userRole: "أدمن", // Use a default role as a fallback
    timestamp: comment.timestamp
  }));

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <IncidentHeader 
            incidentId={incident.id} 
            status={incident.status} 
            onCompleteIncident={handleCompleteIncident}
            onDeleteIncident={handleDeleteIncident}
          />
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">تفاصيل البلاغ {incident.id}</h1>
              <p className="text-muted-foreground">عرض وإدارة تفاصيل البلاغ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <IncidentInfo incident={incident} />
              <IncidentDetails incident={incident} />
              <OperatorNotes 
                notes={operatorNotes} 
                images={images || []}
                onNotesChange={setOperatorNotes} 
                onSaveNotes={handleSaveNotes}
                onAddImage={handleAddImage}
                onRemoveImage={handleRemoveImage}
              />
              <div className="card">
                <IncidentComments 
                  incidentId={incident.id}
                  comments={transformedComments}
                  onAddComment={handleAddComment}
                />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IncidentDetail;
