
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MainSidebar from "@/components/MainSidebar";
import IncidentsDashboard from "@/pages/incidents/IncidentsDashboard";

const Incidents = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-slate-50 dark:bg-slate-950" dir="rtl">
        <MainSidebar activeItem="incidents" />
        <SidebarInset className="overflow-auto">
          <IncidentsDashboard />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Incidents;
