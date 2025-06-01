import React, { useState } from "react";
import { IncidentFilters } from "./IncidentFilters";
import { IncidentList } from "./IncidentList";
import { useIncidents } from "@/hooks/useIncidents";
import { Incident } from "@/types/incident";

export function IncidentDashboard() {
  const { incidents, loading, error } = useIncidents();
  const [searchTerm, setSearchTerm] = useState("");
  const [incidentType, setIncidentType] = useState<string>("all");
  const [incidentStatus, setIncidentStatus] = useState<string>("all");
  const [date, setDate] = useState<Date>();

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = searchTerm === "" || 
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = incidentType === "all" || incident.type === incidentType;
    const matchesStatus = incidentStatus === "all" || incident.status === incidentStatus;
    const matchesDate = !date || new Date(incident.date).toDateString() === date.toDateString();

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setIncidentType("all");
    setIncidentStatus("all");
    setDate(undefined);
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {error.message}</div>;

  return (
    <div className="space-y-6">
      <IncidentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        incidentType={incidentType}
        onTypeChange={setIncidentType}
        incidentStatus={incidentStatus}
        onStatusChange={setIncidentStatus}
        date={date}
        onDateChange={setDate}
        onReset={handleResetFilters}
        filteredCount={filteredIncidents.length}
        allIncidents={incidents}
      />

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">البلاغات ({filteredIncidents.length})</h2>
        </div>
        <IncidentList incidents={filteredIncidents} />
      </div>
    </div>
  );
} 