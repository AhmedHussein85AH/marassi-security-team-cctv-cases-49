import { create } from 'zustand';
import { WorkPermit, PermitStatus } from '@/types/workPermits';
import { format } from 'date-fns';

interface WorkPermitsState {
  permits: WorkPermit[];
  addPermit: (permit: Omit<WorkPermit, 'id' | 'sr' | 'status'>) => void;
  updatePermit: (id: string, permit: Partial<WorkPermit>) => void;
  deletePermit: (id: string) => void;
  getPermitById: (id: string) => WorkPermit | undefined;
  getPermitsByStatus: (status: PermitStatus) => WorkPermit[];
  getActivePermits: () => WorkPermit[];
  getExpiredPermits: () => WorkPermit[];
  getOnHoldPermits: () => WorkPermit[];
  updatePermitsStatus: () => void;
}

const generateSR = (permits: WorkPermit[]): string => {
  const today = format(new Date(), 'yyyyMMdd');
  const todayPermits = permits.filter(p => p.sr.startsWith(today));
  const count = todayPermits.length + 1;
  return `${today}-${count.toString().padStart(3, '0')}`;
};

const getPermitStatus = (endDate: string, currentStatus: PermitStatus): PermitStatus => {
  if (currentStatus === 'Hold') return 'Hold';
  const now = new Date();
  const end = new Date(endDate);
  return end < now ? 'Ended' : 'In Progress';
};

const useWorkPermitsStore = create<WorkPermitsState>((set, get) => ({
  permits: [],
  
  addPermit: (permit) => set((state) => {
    const sr = generateSR(state.permits);
    const status = getPermitStatus(permit.endDate, 'In Progress');
    const newPermit: WorkPermit = {
      ...permit,
      id: Date.now().toString(),
      sr,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return { permits: [...state.permits, newPermit] };
  }),
  
  updatePermit: (id, updatedPermit) => set((state) => ({
    permits: state.permits.map((permit) => {
      if (permit.id === id) {
        const status = updatedPermit.endDate 
          ? getPermitStatus(updatedPermit.endDate, updatedPermit.status || permit.status)
          : permit.status;
        return { 
          ...permit, 
          ...updatedPermit,
          status,
          updatedAt: new Date().toISOString()
        };
      }
      return permit;
    })
  })),
  
  deletePermit: (id) => set((state) => ({
    permits: state.permits.filter((permit) => permit.id !== id)
  })),
  
  getPermitById: (id) => {
    const state = get();
    return state.permits.find((permit) => permit.id === id);
  },
  
  getPermitsByStatus: (status) => {
    const state = get();
    return state.permits.filter((permit) => permit.status === status);
  },
  
  getActivePermits: () => {
    const state = get();
    return state.permits.filter((permit) => permit.status === 'In Progress');
  },
  
  getExpiredPermits: () => {
    const state = get();
    return state.permits.filter((permit) => permit.status === 'Ended');
  },
  
  getOnHoldPermits: () => {
    const state = get();
    return state.permits.filter((permit) => permit.status === 'Hold');
  },

  updatePermitsStatus: () => set((state) => ({
    permits: state.permits.map(permit => ({
      ...permit,
      status: getPermitStatus(permit.endDate, permit.status)
    }))
  }))
}));

export default useWorkPermitsStore; 