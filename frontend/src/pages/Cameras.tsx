import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription, 
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, AlertTriangle } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";

// Mock camera feeds data
const mockCameras = [
  { id: 1, name: "كاميرا المدخل الرئيسي", location: "المدخل الرئيسي", status: "متصل", alerts: 0 },
  { id: 2, name: "كاميرا البوابة الشمالية", location: "البوابة الشمالية", status: "متصل", alerts: 2 },
  { id: 3, name: "كاميرا منطقة الحديقة", location: "الحديقة", status: "متصل", alerts: 0 },
  { id: 4, name: "كاميرا موقف السيارات", location: "موقف السيارات", status: "غير متصل", alerts: 0 },
  { id: 5, name: "كاميرا المسبح", location: "المسبح", status: "متصل", alerts: 1 },
  { id: 6, name: "كاميرا منطقة اللعب", location: "منطقة اللعب", status: "متصل", alerts: 0 },
];

const Cameras = () => {
  const [cameras, setCameras] = useState(mockCameras);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCameras = cameras.filter(camera => 
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    camera.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="cameras" />
        <SidebarInset className="overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex flex-1 items-center gap-4 md:gap-8">
              <Input 
                placeholder="البحث عن الكاميرات..." 
                className="h-9 md:w-[200px] lg:w-[300px] text-right"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>
          
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">مراقبة الكاميرات</h1>
              <p className="text-muted-foreground">عرض ومتابعة كاميرات المراقبة</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCameras.map((camera) => (
                <Card key={camera.id} className={camera.status === "غير متصل" ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{camera.name}</CardTitle>
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full ml-2 ${
                          camera.status === "متصل" ? "bg-green-500" : "bg-red-500"
                        }`}></span>
                        <span className="text-sm text-muted-foreground">{camera.status}</span>
                      </div>
                    </div>
                    <CardDescription className="text-right">{camera.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-md flex items-center justify-center">
                      {camera.status === "متصل" ? (
                        <div className="relative w-full h-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-slate-400" />
                          </div>
                          {camera.alerts > 0 && (
                            <div className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                              <AlertTriangle className="w-3 h-3 ml-1" />
                              <span>{camera.alerts} تنبيهات</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-slate-400 text-right">الكاميرا غير متصلة</div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button variant="outline" size="sm">عرض المباشر</Button>
                      <Button variant="outline" size="sm">سجل الفيديو</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Cameras;
