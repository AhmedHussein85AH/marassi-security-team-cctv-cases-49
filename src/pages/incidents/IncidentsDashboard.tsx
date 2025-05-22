
import React from "react";
import IncidentHeader from "@/components/incidents/IncidentHeader";
import IncidentsListView from "@/pages/incidents/IncidentsListView";
import useIncidentDashboard from "@/hooks/useIncidentDashboard";

const IncidentsDashboard = () => {
  const {
    searchTerm,
    filteredIncidents,
    handleNewIncident,
    handleViewDetails,
    handleSearchChange
  } = useIncidentDashboard();

  return (
    <>
      <IncidentHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onNewIncident={handleNewIncident}
      />
      
      <IncidentsListView 
        incidents={filteredIncidents}
        onViewDetails={handleViewDetails}
      />
    </>
  );
};

export default IncidentsDashboard;
