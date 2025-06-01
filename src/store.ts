import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ... existing interfaces ...

export const useWorkPermitsStore = create<WorkPermitsStore>()(
  persist(
    (set) => ({
      permits: [],
      addPermit: (permit) => set((state) => ({ permits: [...state.permits, permit] })),
      updatePermit: (id, updatedPermit) =>
        set((state) => ({
          permits: state.permits.map((permit) =>
            permit.id === id ? { ...permit, ...updatedPermit } : permit
          ),
        })),
      deletePermit: (id) =>
        set((state) => ({
          permits: state.permits.filter((permit) => permit.id !== id),
        })),
      getActivePermits: () => {
        const now = new Date();
        return useWorkPermitsStore.getState().permits.filter(
          (permit) => new Date(permit.endDate) > now
        );
      },
      getExpiredPermits: () => {
        const now = new Date();
        return useWorkPermitsStore.getState().permits.filter(
          (permit) => new Date(permit.endDate) < now
        );
      },
      getOnHoldPermits: () => {
        return useWorkPermitsStore.getState().permits.filter(
          (permit) => permit.status === 'on-hold'
        );
      },
      updatePermitsStatus: () => {
        const now = new Date();
        set((state) => ({
          permits: state.permits.map((permit) => ({
            ...permit,
            status:
              new Date(permit.endDate) < now
                ? 'expired'
                : new Date(permit.startDate) > now
                ? 'pending'
                : 'active',
          })),
        }));
      },
    }),
    {
      name: 'work-permits-storage', // اسم المفتاح في localStorage
    }
  )
);

export const useDailyPortEventsStore = create<DailyPortEventsStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: 'daily-port-events-storage',
    }
  )
);

export const useCallCenterReportsStore = create<CallCenterReportsStore>()(
  persist(
    (set) => ({
      reports: [],
      addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
      updateReport: (id, updatedReport) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, ...updatedReport } : report
          ),
        })),
      deleteReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        })),
    }),
    {
      name: 'call-center-reports-storage',
    }
  )
); 