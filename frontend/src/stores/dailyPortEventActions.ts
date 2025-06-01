import { StateCreator } from 'zustand';
import { DailyPortEvent } from '@/types/dailyPortEvents';

export interface DailyPortEventActions {
  addEvent: (event: DailyPortEvent) => void;
  updateEvent: (id: string, event: Partial<DailyPortEvent>) => void;
  deleteEvent: (id: string) => void;
  clearEvents: () => void;
}

export const createDailyPortEventActions = (
  set: StateCreator<DailyPortEventActions>['setState']
): DailyPortEventActions => ({
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

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

  clearEvents: () =>
    set(() => ({
      events: [],
    })),
}); 