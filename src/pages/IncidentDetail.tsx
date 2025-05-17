
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
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import { useNotifications } from "@/contexts/NotificationContext";
import IncidentComments from "@/components/incidents/IncidentComments";

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  
  // Mock data - in a real app, this would come from an API
  const [incident, setIncident] = useState({
    id: id,
    type: "سرقة", 
    location: "فيلا رقم 15", 
    date: "2025-05-15", 
    time: "14:30", 
    status: "قيد المعالجة",
    reporter: "أحمد محمد",
    description: "تم ملاحظة محاولة سرقة من الفيلا، شخص مجهول حاول كسر النافذة الخلفية",
    propertyInfo: "فيلا رقم 15، بلوك C",
    vehicleInfo: "",
    images: [],
    operatorNotes: "",
    comments: []
  });

  const [comments, setComments] = useState([
    {
      id: "1",
      text: "تم استلام البلاغ وجاري العمل عليه",
      userName: "سارة خالد",
      userRole: "مشغل كاميرات",
      timestamp: "2025-05-15T15:30:00"
    },
    {
      id: "2",
      text: "تم مراجعة كاميرات المراقبة، وتم رصد شخص مجهول بالقرب من الفيلا في الوقت المذكور",
      userName: "سارة خالد",
      userRole: "مشغل كاميرات",
      timestamp: "2025-05-15T16:15:00"
    }
  ]);

  // Mock current user
  const currentUser = {
    name: "أحمد محمد",
    role: "أدمن"
  };

  useEffect(() => {
    // Simulate marking incident as being processed by camera operator
    if (currentUser.role === "مشغل كاميرات" && incident.status === "جديد") {
      setIncident(prev => ({ ...prev, status: "قيد المعالجة" }));
      
      // Notify admin
      addNotification({
        title: `تم استلام بلاغ #${id}`,
        message: `قام ${currentUser.name} باستلام البلاغ والعمل عليه`,
        type: "status",
        relatedId: id,
        sender: currentUser.name
      });
    }
  }, [id, currentUser]);

  const handleAddComment = (text) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      text,
      userName: currentUser.name,
      userRole: currentUser.role,
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => [...prev, newComment]);
    
    // Notify others about the new comment
    addNotification({
      title: `تعليق جديد على البلاغ #${id}`,
      message: `${currentUser.name}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      type: "comment",
      relatedId: id,
      sender: currentUser.name
    });
  };

  const handleCompleteIncident = () => {
    setIncident(prev => ({ ...prev, status: "تم المعالجة" }));
    
    toast({
      title: "تم تحديث البلاغ",
      description: "تم تغيير حالة البلاغ إلى تم المعالجة",
    });
    
    // Notify admin and manager
    addNotification({
      title: `تم معالجة البلاغ #${id}`,
      message: `قام ${currentUser.name} بإتمام معالجة البلاغ، يرجى مراجعة التفاصيل`,
      type: "status",
      relatedId: id,
      sender: currentUser.name
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "تم المعالجة":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{status}</Badge>;
      case "قيد المعالجة":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{status}</Badge>;
      case "معلق":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{status}</Badge>;
      case "جديد":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950">
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
                <ArrowLeft className="h-4 w-4" />
                عودة للبلاغات
              </Button>
              <div className="ml-auto">
                {incident.status !== "تم المعالجة" && (
                  <Button onClick={handleCompleteIncident} className="gap-1">
                    <Check className="h-4 w-4" />
                    إنهاء البلاغ
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  تفاصيل البلاغ #{id}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>{incident.type}</span>
                  </div>
                  {getStatusBadge(incident.status)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>تفاصيل البلاغ</CardTitle>
                    <CardDescription>معلومات تفصيلية حول البلاغ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">وصف البلاغ</h3>
                      <p className="text-gray-700">{incident.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">الموقع: </span>
                            <span>{incident.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">التاريخ: </span>
                            <span>{incident.date}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">الوقت: </span>
                            <span>{incident.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">المبلغ: </span>
                            <span>{incident.reporter}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <div>
                            <span className="font-medium">العقار: </span>
                            <span>{incident.propertyInfo}</span>
                          </div>
                        </div>
                        
                        {incident.vehicleInfo && (
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="font-medium">بيانات السيارة: </span>
                              <span>{incident.vehicleInfo}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {incident.images.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2 flex items-center gap-1">
                            <Image className="h-4 w-4" />
                            الصور المرفقة
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {incident.images.map((img, idx) => (
                              <div 
                                key={idx} 
                                className="aspect-video bg-gray-100 rounded flex items-center justify-center"
                              >
                                صورة {idx + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <IncidentComments 
                      incidentId={id} 
                      comments={comments}
                      onAddComment={handleAddComment}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>ملاحظات المشغل</CardTitle>
                    <CardDescription>ملاحظات مشغل الكاميرات</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      placeholder="أضف ملاحظات حول ما تم رصده في الكاميرات..."
                      className="resize-none min-h-[200px]"
                      value={incident.operatorNotes}
                      onChange={(e) => setIncident(prev => ({ ...prev, operatorNotes: e.target.value }))}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "تم حفظ الملاحظات",
                          description: "تم حفظ ملاحظات المشغل بنجاح",
                        });
                      }}
                      className="w-full"
                    >
                      حفظ الملاحظات
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IncidentDetail;
