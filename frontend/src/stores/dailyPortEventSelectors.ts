import { StateCreator } from 'zustand';
import { DailyPortEvent } from "@/types/dailyPortEvents";

export interface DailyPortEventSelectors {
  getEventById: (id: string) => DailyPortEvent | undefined;
  getEventsByType: (type: string) => DailyPortEvent[];
  getEventsByDepartment: (department: string) => DailyPortEvent[];
  getEventsByDateRange: (startDate: Date, endDate: Date) => DailyPortEvent[];
}

export const createDailyPortEventSelectors = (
  get: StateCreator<DailyPortEventSelectors>['getState']
): DailyPortEventSelectors => ({
  getEventById: (id) => {
    const state = get();
    return state.events.find((event) => event.id === id);
  },
  
  getEventsByType: (type) => {
    const state = get();
    return state.events.filter((event) => event.type === type);
  },
  
  getEventsByDepartment: (department) => {
    const state = get();
    return state.events.filter((event) => event.responsibleDepartment === department);
  },
  
  getEventsByDateRange: (startDate, endDate) => {
    const state = get();
    return state.events.filter((event) => {
      const eventDate = new Date(event.dateTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }
}); 