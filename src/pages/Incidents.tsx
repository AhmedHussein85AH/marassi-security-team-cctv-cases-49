
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
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IncidentForm from "@/components/incidents/IncidentForm";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";

// Mock incidents data
const mockIncidents = [
  { 
    id: "INC-001", 
    type: "سرقة", 
    location: "فيلا رقم 15", 
    date: "2025-05-15", 
    time: "14:30", 
    status: "قيد المعالجة",
    reporter: "أحمد محمد"
  },
  { 
    id: "INC-002", 
    type: "حادث", 
    location: "مدخل المجمع الرئيسي", 
    date: "2025-05-16", 
    time: "09:45", 
    status: "تم المعالجة",
    reporter: "سارة أحمد"
  },
  { 
    id: "INC-003", 
    type: "تحرش", 
    location: "منطقة الحديقة", 
    date: "2025-05-17", 
    time: "18:15", 
    status: "معلق",
    reporter: "خالد إبراهيم"
  },
];

const Incidents = () => {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredIncidents = incidents.filter(incident => 
    incident.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.reporter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewIncident = (incidentData) => {
    const newIncident = {
      id: `INC-00${incidents.length + 1}`,
      status: "جديد",
      ...incidentData
    };
    
    setIncidents([...incidents, newIncident]);
    toast({
      title: "تم إضافة البلاغ",
      description: `تم إضافة البلاغ رقم ${newIncident.id} بنجاح`,
    });
  };

  const handleViewDetails = (id) => {
    console.log(`View details for incident ${id}`);
    // Will be implemented for detailed view
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="البحث عن البلاغات..." 
                className="h-9 md:w-[200px] lg:w-[300px]"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="ml-auto flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>إضافة بلاغ جديد</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم البلاغ</TableHead>
                      <TableHead>نوع البلاغ</TableHead>
                      <TableHead>الموقع</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الوقت</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{incident.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{incident.location}</TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{incident.time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            incident.status === "تم المعالجة" 
                              ? "bg-green-100 text-green-800" 
                              : incident.status === "قيد المعالجة" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {incident.status}
                          </span>
                        </TableCell>
                        <TableCell>{incident.reporter}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
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
