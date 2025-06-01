
import { create } from 'zustand';
import { CallCenterReport } from '@/types/callCenterReports';

interface CallCenterStore {
  reports: CallCenterReport[];
  addReport: (report: CallCenterReport) => void;
  updateReport: (id: string, report: Partial<CallCenterReport>) => void;
  deleteReport: (id: string) => void;
}

// Mock data
const mockReports: CallCenterReport[] = [
  {
    id: '1',
    timing: '08:30',
    date: '2024-05-25',
    unitNumber: 'A-101',
    sectorName: 'القطاع الشمالي',
    reportReceiver: 'محمد أحمد',
    constructionSupervisor: 'خالد عبدالله'
  },
  {
    id: '2',
    timing: '14:15',
    date: '2024-05-25',
    unitNumber: 'B-205',
    sectorName: 'القطاع الجنوبي',
    reportReceiver: 'سارة محمد',
    constructionSupervisor: 'عمر حسن'
  }
];

const useCallCenterStore = create<CallCenterStore>((set) => ({
  reports: mockReports,
  addReport: (report) =>
    set((state) => ({
      reports: [...state.reports, report],
    })),
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
}));

export default useCallCenterStore;
