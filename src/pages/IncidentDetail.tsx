import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  Image,
  Car,
  User,
  ArrowLeft,
  Check,
  Calendar,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useNotifications } from "@/contexts/NotificationContext";
import IncidentComments from "@/components/incidents/IncidentComments";
import useIncidentStore from "@/stores/incidentStore";

// Mock current user
const currentUser = {
  name: "أحمد محمد",
  role: "أدمن"
};

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { incidents, getIncidentById, updateIncident } = useIncidentStore();
  
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(id ? getIncidentById(id) : null);
  const [operatorNotes, setOperatorNotes] = useState(incident?.operatorNotes || "");

  useEffect(() => {
    if (id) {
      setLoading(true);
      try {
        const foundIncident = getIncidentById(id);
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
  }, [id, getIncidentById]);

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
      title: `تم تحديث ملاحظات البلاغ #${id}`,
      message: "تم تحديث ملاحظات المشغل",
      type: "update",
      relatedId: id,
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
      title: `تم معالجة البلاغ #${id}`,
      message: `تم إتمام معالجة البلاغ، يرجى مراجعة التفاصيل`,
      type: "status",
      relatedId: id,
      sender: currentUser.name
    });
  };

  const handleAddComment = (text: string) => {
    if (!incident) return;

    const newComment = {
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
      title: `تعليق جديد على البلاغ #${id}`,
      message: `${currentUser.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      type: "comment",
      relatedId: id,
      sender: currentUser.name
    });
  };

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
                size="sm" 
                className="gap-1"
                onClick={() => navigate("/incidents")}
              >
                <ArrowLeft className="h-4 w-4 ml-1" />
                عودة للبلاغات
              </Button>
              <div className="mr-auto">
                {incident.status !== "تم المعالجة" && (
                  <Button onClick={handleCompleteIncident} className="gap-1">
                    <Check className="h-4 w-4 ml-1" />
                    إنهاء البلاغ
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">تفاصيل البلاغ {incident.id}</h1>
              <p className="text-muted-foreground">عرض وإدارة تفاصيل البلاغ</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات البلاغ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <div className="font-medium">نوع البلاغ</div>
                      <div className="text-sm text-muted-foreground">{incident.type}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="font-medium">الموقع</div>
                      <div className="text-sm text-muted-foreground">{incident.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <div>
                      <div className="font-medium">التاريخ</div>
                      <div className="text-sm text-muted-foreground">{incident.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <div>
                      <div className="font-medium">الوقت</div>
                      <div className="text-sm text-muted-foreground">{incident.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <div>
                      <div className="font-medium">المبلغ</div>
                      <div className="text-sm text-muted-foreground">{incident.reporter}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل إضافية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-medium mb-2">وصف الحادث</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
                      {incident.description}
                    </div>
                  </div>

                  {incident.propertyInfo && (
                    <div>
                      <div className="font-medium mb-2">معلومات العقار</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
                        {incident.propertyInfo}
                      </div>
                    </div>
                  )}

                  {incident.vehicleInfo && (
                    <div>
                      <div className="font-medium mb-2">تفاصيل المركبات</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap text-right">
                        {incident.vehicleInfo}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات المشغل</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={operatorNotes}
                    onChange={(e) => setOperatorNotes(e.target.value)}
                    placeholder="أضف ملاحظاتك هنا..."
                    className="min-h-[100px] text-right"
                  />
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotes}>حفظ الملاحظات</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>التعليقات</CardTitle>
                </CardHeader>
                <CardContent>
                  <IncidentComments 
                    comments={incident.comments || []} 
                    onAddComment={handleAddComment}
                  />
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IncidentDetail;
