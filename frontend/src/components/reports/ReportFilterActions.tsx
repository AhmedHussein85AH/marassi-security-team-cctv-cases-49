
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import type { Incident } from "@/types/incident";

interface ReportFilterActionsProps {
  exportToExcel: (getFilteredReports: () => Incident[]) => void;
  getFilteredReports: () => Incident[];
}

const ReportFilterActions: React.FC<ReportFilterActionsProps> = ({ 
  exportToExcel, 
  getFilteredReports 
}) => {
  return (
    <div className="flex gap-4">
      <Button onClick={() => exportToExcel(getFilteredReports)} className="gap-2">
        <FileSpreadsheet className="ml-2 h-4 w-4" />
        تصدير إلى Excel
      </Button>
    </div>
  );
};

export default ReportFilterActions;
