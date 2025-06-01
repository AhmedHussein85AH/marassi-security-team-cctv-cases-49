import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyPortEvent } from '@/types/dailyPortEvents';

interface DailyPortEventsStore {
  events: DailyPortEvent[];
  addEvent: (event: DailyPortEvent) => void;
  updateEvent: (event: DailyPortEvent) => void;
  deleteEvent: (id: string) => void;
}

// Mock data
const mockEvents: DailyPortEvent[] = [
  {
    id: '1',
    crrNumber: 'CRR001',
    dateTime: '2024-05-25 08:30',
    attachments: [],
    type: 'Security Incident',
    subType: 'Unauthorized Access',
    location: 'Port Gate A',
    description: 'Unauthorized person attempted to enter restricted area',
    responsibleDepartment: 'Security',
    actionTaken: 'Person was escorted out and incident logged',
    responseDate: '2024-05-25',
    notes: 'Reviewed security protocols'
  },
  {
    id: '2',
    crrNumber: 'CRR002',
    dateTime: '2024-05-25 14:15',
    attachments: [],
    type: 'Equipment Failure',
    subType: 'Crane Malfunction',
    location: 'Berth 3',
    description: 'Main crane experienced hydraulic failure',
    responsibleDepartment: 'Maintenance',
    actionTaken: 'Crane taken offline for repairs',
    responseDate: '2024-05-25',
    notes: 'Backup crane activated'
  }
];

const useDailyPortEventsStore = create<DailyPortEventsStore>()(
  persist(
    (set) => ({
      events: mockEvents,
      addEvent: (event) => {
        // Convert File objects to base64 strings for storage
        const processedEvent = {
          ...event,
          attachments: event.attachments.map(file => {
            if (file instanceof File) {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
              });
            }
            return file;
          })
        };
        set((state) => ({ events: [...state.events, processedEvent] }));
      },
      updateEvent: (event) => {
        // Convert File objects to base64 strings for storage
        const processedEvent = {
          ...event,
          attachments: event.attachments.map(file => {
            if (file instanceof File) {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
              });
            }
            return file;
          })
        };
        set((state) => ({
          events: state.events.map((e) =>
            e.id === event.id ? processedEvent : e
          ),
        }));
      },
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

export default useDailyPortEventsStore;
