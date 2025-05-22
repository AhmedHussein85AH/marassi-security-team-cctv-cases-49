
import { useState, useEffect } from "react";
import { Incident } from "@/types/incident";

interface UseIncidentFiltersResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  incidentType: string | undefined;
  setIncidentType: (value: string) => void;
  incidentStatus: string | undefined;
  setIncidentStatus: (value: string) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  filteredIncidents: Incident[];
  resetFilters: () => void;
}

export const useIncidentFilters = (incidents: Incident[]): UseIncidentFiltersResult => {
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentType, setIncidentType] = useState<string | undefined>(undefined);
  const [incidentStatus, setIncidentStatus] = useState<string | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidents);
  
  // Apply filters when any filter value changes
  useEffect(() => {
    let result = [...incidents];
    
    if (searchTerm) {
      result = result.filter(incident => 
        incident.id.includes(searchTerm) || 
        incident.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (incidentType && incidentType !== "all") {
      result = result.filter(incident => incident.type === incidentType);
    }
    
    if (incidentStatus && incidentStatus !== "all") {
      result = result.filter(incident => incident.status === incidentStatus);
    }
    
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      result = result.filter(incident => incident.date === dateString);
    }
    
    setFilteredIncidents(result);
  }, [searchTerm, incidentType, incidentStatus, date, incidents]);

  const resetFilters = () => {
    setSearchTerm("");
    setIncidentType(undefined);
    setIncidentStatus(undefined);
    setDate(undefined);
  };
  
  return {
    searchTerm,
    setSearchTerm,
    incidentType,
    setIncidentType,
    incidentStatus,
    setIncidentStatus,
    date,
    setDate,
    filteredIncidents,
    resetFilters
  };
};

// We need to import format from date-fns
import { format } from "date-fns";
