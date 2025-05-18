import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  Image,
  Car,
  User,
  MessageCircle,
  Clipboard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import IncidentForm from "@/components/incidents/IncidentForm";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useNotifications } from "@/contexts/NotificationContext";
import useIncidentStore from "@/stores/incidentStore";
import type { Incident } from "@/stores/incidentStore";

// Mock current user
const currentUser = {
  name: "أحمد محمد",
  role: "أدمن"
};

const Incidents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
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

    addNotification({
      title: "بلاغ جديد",
      message: `تم إضافة بلاغ جديد من نوع ${newIncident.type} في ${newIncident.location}`,
      type: "incident",
      relatedId: newIncident.id,
      sender: currentUser.name
    });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/incidents/${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "تم المعالجة":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case "قيد المعالجة":
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      case "معلق":
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case "جديد":
        return <Badge className="bg-purple-100 text-purple-800">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="البحث عن البلاغات..." 
                className="h-9 md:w-[200px] lg:w-[300px] text-right"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="mr-auto flex items-center gap-2">
                <NotificationDropdown />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>إضافة بلاغ جديد</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة بلاغ جديد</DialogTitle>
                    </DialogHeader>
                    <IncidentForm onSubmit={handleNewIncident} />
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
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
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right w-[100px]">رقم البلاغ</TableHead>
                      <TableHead className="text-right w-[150px]">نوع البلاغ</TableHead>
                      <TableHead className="text-right w-[200px]">الموقع</TableHead>
                      <TableHead className="text-right w-[120px]">التاريخ</TableHead>
                      <TableHead className="text-right w-[100px]">الوقت</TableHead>
                      <TableHead className="text-right w-[130px]">الحالة</TableHead>
                      <TableHead className="text-right w-[150px]">المبلغ</TableHead>
                      <TableHead className="text-right w-[100px]">التعليقات</TableHead>
                      <TableHead className="text-right w-[150px]">ملاحظات المشغل</TableHead>
                      <TableHead className="text-right w-[100px]">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="text-right">{incident.id}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{incident.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{incident.location}</TableCell>
                        <TableCell className="text-right">{incident.date}</TableCell>
                        <TableCell className="text-right">{incident.time}</TableCell>
                        <TableCell className="text-right">{getStatusBadge(incident.status)}</TableCell>
                        <TableCell className="text-right">{incident.reporter}</TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{incident.comments.length}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-xs">
                                  {incident.comments.length > 0 ? (
                                    incident.comments.map((comment, idx) => (
                                      <div key={idx} className="mb-2">
                                        <div className="text-sm font-bold">{comment.user}</div>
                                        <div className="text-sm">{comment.text}</div>
                                        <div className="text-xs text-gray-500">{comment.timestamp}</div>
                                      </div>
                                    ))
                                  ) : (
                                    <span>لا توجد تعليقات</span>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center gap-1">
                                  <Clipboard className="w-4 h-4" />
                                  {incident.operatorNotes ? (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  ) : null}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-xs">
                                  {incident.operatorNotes || "لا توجد ملاحظات"}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost"
                            size="sm" 
                            onClick={() => handleViewDetails(incident.id)}
                          >
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Incidents;
