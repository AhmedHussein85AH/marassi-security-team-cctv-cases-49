
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createIncidentActions, IncidentActions } from './incidentActions';
import { createIncidentSelectors, IncidentSelectors } from './incidentSelectors';
import { mockIncidents } from '@/data/mockIncidents';
import { Incident } from '@/types/incident';

interface IncidentState extends IncidentActions, IncidentSelectors {
  incidents: Incident[];
}

const useIncidentStore = create<IncidentState>()(
  persist(
    (set, get) => ({
      incidents: mockIncidents,
      ...createIncidentSelectors(get),
      ...createIncidentActions(set),
    }),
    {
      name: 'incidents-storage',
    }
  )
);

export default useIncidentStore;
