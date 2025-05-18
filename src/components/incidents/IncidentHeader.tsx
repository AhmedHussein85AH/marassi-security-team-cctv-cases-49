
import React from "react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import CreateIncidentDialog from "@/components/incidents/CreateIncidentDialog";
import type { Incident } from "@/stores/incidentStore";

interface IncidentHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewIncident: (incidentData: Partial<Incident>) => void;
}

const IncidentHeader: React.FC<IncidentHeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onNewIncident 
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <Input 
          placeholder="البحث عن البلاغات..." 
          className="h-9 md:w-[200px] lg:w-[300px] text-right"
          type="search"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <div className="mr-auto flex items-center gap-2">
          <NotificationDropdown />
          <CreateIncidentDialog onSubmit={onNewIncident} />
        </div>
      </div>
    </header>
  );
};

export default IncidentHeader;
