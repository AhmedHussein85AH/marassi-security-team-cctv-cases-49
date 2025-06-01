
import { Incident } from "@/types/incident";

export interface IncidentSelectors {
  getIncidentById: (id: string) => Incident | undefined;
}

export const createIncidentSelectors = (get: any): IncidentSelectors => ({
  getIncidentById: (id: string) => {
    return get().incidents.find((incident: Incident) => incident.id === id);
  }
});
