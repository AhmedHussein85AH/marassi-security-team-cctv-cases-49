import React, { Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MainSidebar from "@/components/MainSidebar";
import IncidentComments from "@/components/incidents/IncidentComments";
import IncidentInfo from "@/components/incidents/IncidentInfo";
import IncidentDetails from "@/components/incidents/IncidentDetails";
import OperatorNotes from "@/components/incidents/OperatorNotes";
import IncidentHeader from "@/components/incidents/IncidentHeader";
import ExportPDFButton from "@/components/incidents/ExportPDFButton";
import EmailReportDialog from "@/components/incidents/EmailReportDialog";
import { useIncidentDetail } from "@/hooks/useIncidentDetail";
import { useAuth } from "@/contexts/AuthContext";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Error Component
const ErrorComponent = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center max-w-md">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">حدث خطأ</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <Button onClick={onRetry} className="flex items-center gap-2">
        <Loader2 className="h-4 w-4" />
        إعادة المحاولة
      </Button>
    </div>
  </div>
);

// Not Found Component
const NotFoundComponent = ({ onBack }: { onBack: () => void }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center max-w-md">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">لم يتم العثور على البلاغ</h2>
      <p className="text-gray-600 mb-4">عذراً، لا يمكن العثور على البلاغ المطلوب</p>
      <Button onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        العودة لقائمة البلاغات
      </Button>
    </div>
  </div>
);

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const {
    loading,
    error,
    incident,
    operatorNotes,
    setOperatorNotes,
    images,
    handleSaveNotes,
    handleCompleteIncident,
    handleAddComment,
    handleAddImage,
    handleRemoveImage,
    handleDeleteIncident,
    handleRetry
  } = useIncidentDetail(id);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const statusColors = {
      'جديد': 'bg-blue-500',
      'قيد المعالجة': 'bg-yellow-500',
      'مكتمل': 'bg-green-500',
      'ملغي': 'bg-red-500'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
          <MainSidebar activeItem="incidents" />
          <SidebarInset className="overflow-auto">
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
          <MainSidebar activeItem="incidents" />
          <SidebarInset className="overflow-auto">
            <ErrorComponent message={error} onRetry={handleRetry} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!incident) {
    return (
      <SidebarProvider>
        <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
          <MainSidebar activeItem="incidents" />
          <SidebarInset className="overflow-auto">
            <NotFoundComponent onBack={() => navigate('/incidents')} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Transform the comments array to match the expected format for IncidentComments component
  const transformedComments = incident.comments.map(comment => ({
    id: comment.id,
    text: comment.text,
    userName: comment.user,
    userRole: comment.userRole || "مستخدم",
    timestamp: comment.timestamp
  }));

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/incidents")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">تفاصيل البلاغ</h1>
              <Badge className={`${getStatusBadgeColor(incident.status)} text-white`}>
                {incident.status}
              </Badge>
            </div>
          </header>

          <IncidentHeader 
            incidentId={incident.id} 
            status={incident.status} 
            onCompleteIncident={handleCompleteIncident}
            onDeleteIncident={handleDeleteIncident}
          />
          
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">تفاصيل البلاغ {incident.id}</h1>
                <p className="text-muted-foreground">عرض وإدارة تفاصيل البلاغ</p>
              </div>
              
              <div className="flex items-center gap-3">
                <ExportPDFButton incident={incident} />
                <EmailReportDialog incident={incident} />
              </div>
            </div>

            <Suspense fallback={<LoadingSkeleton />}>
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
                  canEdit={currentUser?.permissions?.includes('manage_incidents')}
                />
                <div className="card">
                  <IncidentComments 
                    incidentId={incident.id}
                    comments={transformedComments}
                    onAddComment={handleAddComment}
                    canComment={currentUser?.permissions?.includes('comment_incidents')}
                  />
                </div>
              </div>
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IncidentDetail; 